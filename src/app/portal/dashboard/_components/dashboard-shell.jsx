'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const CHUNK_SIZE = 8 * 1024 * 1024;

function flattenFolders(node, map = {}) {
  if (!node) return map;

  map[node.id] = node;

  for (const folder of node.folders || []) {
    flattenFolders(folder, map);
  }

  return map;
}

function parseUploadedRangeHeader(rangeHeader) {
  if (!rangeHeader) return null;

  const match = String(rangeHeader).match(/bytes=\d+-(\d+)/i);
  if (!match) return null;

  const end = Number(match[1]);
  if (!Number.isFinite(end)) return null;

  return end + 1;
}

async function queryUploadOffset(uploadUrl, fileSize) {
  const statusResponse = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Length': '0',
      'Content-Range': `bytes */${fileSize}`,
    },
  });

  if (statusResponse.status === 308) {
    const offset = parseUploadedRangeHeader(statusResponse.headers.get('Range'));
    return offset || 0;
  }

  if (statusResponse.ok) {
    return fileSize;
  }

  return null;
}

async function uploadFileWithResume({ uploadUrl, file, onProgress }) {
  const totalSize = file.size;
  let offset = 0;
  let retries = 0;

  while (offset < totalSize) {
    const endExclusive = Math.min(offset + CHUNK_SIZE, totalSize);
    const chunk = file.slice(offset, endExclusive);

    try {
      const response = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type || 'application/octet-stream',
          'Content-Range': `bytes ${offset}-${endExclusive - 1}/${totalSize}`,
        },
        body: chunk,
      });

      if (response.status === 308) {
        const nextOffset = parseUploadedRangeHeader(response.headers.get('Range'));
        offset = nextOffset ?? endExclusive;
        retries = 0;
        onProgress(Math.round((offset / totalSize) * 100));
        continue;
      }

      if (response.ok) {
        onProgress(100);
        return;
      }

      const detail = await response.text().catch(() => '');
      throw new Error(detail || 'Drive upload failed.');
    } catch (error) {
      if (retries >= 2) throw error;

      const resumedOffset = await queryUploadOffset(uploadUrl, totalSize);
      if (resumedOffset === null) throw error;

      offset = resumedOffset;
      retries += 1;
      onProgress(Math.round((offset / totalSize) * 100));
    }
  }
}

function FolderTreeNode({ node, selectedFolderId, onSelect, depth = 0 }) {
  const isSelected = node.id === selectedFolderId;

  return (
    <div>
      <button
        type="button"
        onClick={() => onSelect(node.id)}
        className={`cursor-pointer w-full rounded-lg px-3 py-2 text-left text-sm transition ${
          isSelected
            ? 'bg-black text-white'
            : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900'
        }`}
        style={{ paddingLeft: `${12 + depth * 12}px` }}
      >
        {node.name}
      </button>

      {(node.folders || []).length > 0 ? (
        <div className="mt-1 space-y-1">
          {node.folders.map((folder) => (
            <FolderTreeNode
              key={folder.id}
              node={folder}
              selectedFolderId={selectedFolderId}
              onSelect={onSelect}
              depth={depth + 1}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function DashboardShell({ user, checkoutState }) {
  const router = useRouter();

  const [driveData, setDriveData] = useState(null);
  const [driveLoading, setDriveLoading] = useState(true);
  const [driveError, setDriveError] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState('');
  const [uploads, setUploads] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  const [requestType, setRequestType] = useState('long_form');
  const [projectName, setProjectName] = useState('');
  const [goal, setGoal] = useState('');
  const [deliverables, setDeliverables] = useState('');
  const [deadline, setDeadline] = useState('');
  const [referenceLinks, setReferenceLinks] = useState('');
  const [assetLinks, setAssetLinks] = useState('');
  const [notes, setNotes] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');

  const foldersById = useMemo(() => flattenFolders(driveData?.tree || null, {}), [driveData]);

  const selectedFolder = useMemo(() => {
    if (!selectedFolderId) return driveData?.tree || null;
    return foldersById[selectedFolderId] || driveData?.tree || null;
  }, [selectedFolderId, driveData, foldersById]);

  async function loadDriveTree() {
    setDriveLoading(true);
    setDriveError('');

    try {
      const response = await fetch('/api/portal/drive/tree', { cache: 'no-store' });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.error || 'Unable to load Drive workspace.');
      }

      setDriveData(payload);
      setSelectedFolderId((previous) => previous || payload.tree?.id || '');
    } catch (error) {
      setDriveError(error.message || 'Unable to load Drive workspace.');
    } finally {
      setDriveLoading(false);
    }
  }

  useEffect(() => {
    loadDriveTree();
  }, []);

  function upsertUpload(uploadId, partial) {
    setUploads((previous) => {
      const exists = previous.some((upload) => upload.id === uploadId);

      if (!exists) {
        return [{ id: uploadId, ...partial }, ...previous];
      }

      return previous.map((upload) =>
        upload.id === uploadId ? { ...upload, ...partial } : upload
      );
    });
  }

  async function uploadSingleFile(file) {
    const uploadId = `${file.name}-${file.size}-${Date.now()}-${Math.random()}`;

    upsertUpload(uploadId, {
      name: file.name,
      progress: 0,
      status: 'starting',
      error: '',
    });

    try {
      const startResponse = await fetch('/api/portal/drive/resumable/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: file.name,
          mimeType: file.type,
          fileSize: file.size,
          parentFolderId: selectedFolder?.id,
        }),
      });

      const startPayload = await startResponse.json().catch(() => ({}));

      if (!startResponse.ok || !startPayload.uploadUrl) {
        throw new Error(startPayload.error || 'Failed to initialize upload.');
      }

      upsertUpload(uploadId, { status: 'uploading', progress: 0 });

      await uploadFileWithResume({
        uploadUrl: startPayload.uploadUrl,
        file,
        onProgress: (progress) => {
          upsertUpload(uploadId, { status: 'uploading', progress });
        },
      });

      upsertUpload(uploadId, { status: 'complete', progress: 100 });
      await loadDriveTree();
    } catch (error) {
      upsertUpload(uploadId, {
        status: 'error',
        error: error.message || 'Upload failed.',
      });
    }
  }

  async function handleFiles(files) {
    if (!files?.length) return;

    for (const file of files) {
      // Upload files sequentially to keep request pressure predictable.
      await uploadSingleFile(file);
    }
  }

  function onFileInputChange(event) {
    const files = Array.from(event.target.files || []);
    handleFiles(files);
    event.target.value = '';
  }

  function onDrop(event) {
    event.preventDefault();
    setDragActive(false);
    const files = Array.from(event.dataTransfer?.files || []);
    handleFiles(files);
  }

  async function handleLogout() {
    await fetch('/api/portal/auth/logout', { method: 'POST' });
    router.push('/portal/login');
    router.refresh();
  }

  async function handleCheckout(event) {
    event.preventDefault();
    setCheckoutError('');
    setCheckoutLoading(true);

    try {
      const response = await fetch('/api/portal/requests/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestType,
          projectName,
          goal,
          deliverables,
          deadline,
          referenceLinks,
          assetLinks,
          notes,
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok || !payload.checkoutUrl) {
        throw new Error(payload.error || 'Unable to start Stripe checkout.');
      }

      window.location.href = payload.checkoutUrl;
    } catch (error) {
      setCheckoutError(error.message || 'Unable to start Stripe checkout.');
      setCheckoutLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-neutral-100 px-5 py-8 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.07)] sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-neutral-500">USATII MEDIA</p>
              <h1 className="mt-3 text-3xl font-black tracking-tight text-neutral-950">Client Dashboard</h1>
              <p className="mt-2 text-sm text-neutral-600">
                {user.displayName || user.email}
                {user.company ? ` • ${user.company}` : ''}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="rounded-lg border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700 transition hover:border-neutral-400 hover:text-neutral-900"
              >
                Main site
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="cursor-pointer rounded-lg bg-black px-3 py-2 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Logout
              </button>
            </div>
          </div>

          {checkoutState === 'cancelled' ? (
            <p className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
              Checkout was canceled. Your request is saved as pending checkout and can be submitted again.
            </p>
          ) : null}
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          <a
            href="#drive"
            className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-[0_16px_48px_rgba(15,23,42,0.07)] transition hover:-translate-y-0.5"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Option 1</p>
            <h2 className="mt-3 text-2xl font-black text-neutral-950">Drive Workspace</h2>
            <p className="mt-2 text-sm text-neutral-600">
              Open your folder tree, drag footage directly into any subfolder, and download files from this dashboard.
            </p>
          </a>

          <a
            href="#video-request"
            className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-[0_16px_48px_rgba(15,23,42,0.07)] transition hover:-translate-y-0.5"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Option 2</p>
            <h2 className="mt-3 text-2xl font-black text-neutral-950">Request Video + Pay</h2>
            <p className="mt-2 text-sm text-neutral-600">
              Submit your long-form or short-form production brief and complete payment through Stripe checkout.
            </p>
          </a>
        </section>

        <section id="drive" className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.07)] sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Drive Manager</p>
              <h2 className="mt-2 text-2xl font-black text-neutral-950">Your Client Folder</h2>
            </div>

            <div className="flex items-center gap-3">
              {driveData?.rootFolderUrl ? (
                <a
                  href={driveData.rootFolderUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700 transition hover:border-neutral-400"
                >
                  Open in Google Drive
                </a>
              ) : null}

              <button
                type="button"
                onClick={loadDriveTree}
                className="cursor-pointer rounded-lg bg-black px-3 py-2 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Refresh
              </button>
            </div>
          </div>

          {driveError ? (
            <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{driveError}</p>
          ) : null}

          <div className="mt-6 grid gap-6 lg:grid-cols-[300px,1fr]">
            <aside className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Folders</p>

              {driveLoading ? (
                <p className="text-sm text-neutral-600">Loading folders...</p>
              ) : driveData?.tree ? (
                <div className="space-y-1">
                  <FolderTreeNode
                    node={driveData.tree}
                    selectedFolderId={selectedFolder?.id}
                    onSelect={setSelectedFolderId}
                  />
                </div>
              ) : (
                <p className="text-sm text-neutral-600">No folder data available.</p>
              )}
            </aside>

            <div className="space-y-5">
              <div
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={onDrop}
                className={`rounded-2xl border-2 border-dashed p-6 text-center transition ${
                  dragActive
                    ? 'border-black bg-neutral-100'
                    : 'border-neutral-300 bg-neutral-50'
                }`}
              >
                <p className="text-sm font-medium text-neutral-800">
                  Drag files here to upload into <span className="font-black">{selectedFolder?.name || 'selected folder'}</span>
                </p>
                <p className="mt-2 text-xs text-neutral-500">Resumable upload is enabled for large footage.</p>

                <label className="mt-4 inline-flex cursor-pointer rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90">
                  Select files
                  <input type="file" multiple className="hidden" onChange={onFileInputChange} />
                </label>
              </div>

              <div className="rounded-2xl border border-neutral-200 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Files in selected folder</p>
                <div className="mt-3 space-y-2">
                  {(selectedFolder?.files || []).length === 0 ? (
                    <p className="text-sm text-neutral-500">No files in this folder yet.</p>
                  ) : (
                    selectedFolder.files.map((file) => (
                      <div
                        key={file.id}
                        className="flex flex-col gap-2 rounded-xl border border-neutral-200 p-3 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div>
                          <p className="text-sm font-medium text-neutral-800">{file.name}</p>
                          <p className="text-xs text-neutral-500">{file.mimeType}</p>
                        </div>
                        <a
                          href={`/api/portal/drive/download?fileId=${encodeURIComponent(file.id)}`}
                          className="inline-flex rounded-lg border border-neutral-300 px-3 py-2 text-xs font-semibold text-neutral-700 transition hover:border-neutral-400"
                        >
                          Download
                        </a>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {uploads.length > 0 ? (
                <div className="rounded-2xl border border-neutral-200 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Upload activity</p>
                  <div className="mt-3 space-y-3">
                    {uploads.map((upload) => (
                      <div key={upload.id} className="rounded-xl border border-neutral-200 p-3">
                        <div className="flex items-center justify-between gap-3">
                          <p className="truncate text-sm font-medium text-neutral-800">{upload.name}</p>
                          <p className="text-xs uppercase tracking-wide text-neutral-500">{upload.status}</p>
                        </div>
                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-200">
                          <div
                            className={`h-full transition-all ${
                              upload.status === 'error' ? 'bg-rose-500' : 'bg-black'
                            }`}
                            style={{ width: `${Math.max(2, Number(upload.progress || 0))}%` }}
                          />
                        </div>
                        {upload.error ? (
                          <p className="mt-2 text-xs text-rose-600">{upload.error}</p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <section
          id="video-request"
          className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.07)] sm:p-8"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Video Request</p>
          <h2 className="mt-2 text-2xl font-black text-neutral-950">Proposal Form + Stripe Checkout</h2>

          <form onSubmit={handleCheckout} className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-neutral-700">Request type</label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setRequestType('long_form')}
                  className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold transition ${
                    requestType === 'long_form'
                      ? 'bg-black text-white'
                      : 'border border-neutral-300 text-neutral-700'
                  }`}
                >
                  Long-form
                </button>
                <button
                  type="button"
                  onClick={() => setRequestType('short_form')}
                  className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold transition ${
                    requestType === 'short_form'
                      ? 'bg-black text-white'
                      : 'border border-neutral-300 text-neutral-700'
                  }`}
                >
                  Short-form
                </button>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-700">Project name</label>
              <input
                value={projectName}
                onChange={(event) => setProjectName(event.target.value)}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-black"
                placeholder="April product launch clips"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-700">Preferred deadline</label>
              <input
                type="date"
                value={deadline}
                onChange={(event) => setDeadline(event.target.value)}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-black"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-neutral-700">Goal</label>
              <textarea
                value={goal}
                onChange={(event) => setGoal(event.target.value)}
                className="min-h-[96px] w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-black"
                placeholder="Describe the target outcome for this video request."
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-neutral-700">Deliverables</label>
              <textarea
                value={deliverables}
                onChange={(event) => setDeliverables(event.target.value)}
                className="min-h-[90px] w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-black"
                placeholder="What assets should be delivered?"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-700">Reference links</label>
              <textarea
                value={referenceLinks}
                onChange={(event) => setReferenceLinks(event.target.value)}
                className="min-h-[90px] w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-black"
                placeholder="Inspiration links, examples, competitor references"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-700">Asset links</label>
              <textarea
                value={assetLinks}
                onChange={(event) => setAssetLinks(event.target.value)}
                className="min-h-[90px] w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-black"
                placeholder="Links to Drive folders, docs, or raw clips"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-neutral-700">Additional notes</label>
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                className="min-h-[110px] w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-black"
                placeholder="Anything else Vlad should know before editing starts"
              />
            </div>

            {checkoutError ? (
              <p className="md:col-span-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {checkoutError}
              </p>
            ) : null}

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={checkoutLoading}
                className="cursor-pointer w-full rounded-lg bg-black px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {checkoutLoading ? 'Redirecting to Stripe...' : 'Continue to Stripe Checkout'}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}

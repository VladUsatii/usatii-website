'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ClientEducationPane from '@/app/portal/dashboard/_components/client-education-pane';

const CHUNK_SIZE = 8 * 1024 * 1024;

const CLIENT_NAV_ITEMS = [
  { id: 'workspace', label: 'Workspace' },
  { id: 'request', label: 'Request' },
  { id: 'invoices', label: 'Invoices' },
  { id: 'progress', label: 'Progress' },
  { id: 'education', label: 'Education' },
];

function flattenFolders(node, map = {}) {
  if (!node) return map;

  map[node.id] = node;

  for (const folder of node.folders || []) {
    flattenFolders(folder, map);
  }

  return map;
}

function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

function formatMoneyFromCents(value, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format((Number(value) || 0) / 100);
}

function ownerNameFromEmail(email) {
  const normalized = String(email || '').trim();
  if (!normalized) return 'Account';

  const [handle] = normalized.split('@');
  const cleaned = String(handle || '')
    .replace(/[._-]+/g, ' ')
    .trim();

  if (!cleaned) return 'Account';

  return cleaned
    .split(/\s+/)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
}

function invoiceTone(state) {
  if (state === 'fully_paid') return 'green';
  if (state === 'semi_paid') return 'blue';
  if (state === 'active') return 'yellow';
  return 'gray';
}

function stepTone(stepStatus) {
  if (stepStatus === 'completed') return 'green';
  if (stepStatus === 'quality_assurance') return 'blue';
  if (stepStatus === 'in_progress') return 'yellow';
  return 'gray';
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
        className={`cursor-pointer w-full rounded-md px-3 py-2 text-left text-sm transition ${
          isSelected
            ? 'bg-neutral-900 text-white'
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

function StatusPill({ tone = 'gray', children }) {
  const tones = {
    green: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    yellow: 'bg-amber-50 border-amber-200 text-amber-700',
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    gray: 'bg-neutral-100 border-neutral-200 text-neutral-700',
  };

  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}

function MetricCard({ label, value, helper, tone = 'gray' }) {
  const borderTone = {
    green: 'border-emerald-200',
    yellow: 'border-amber-200',
    blue: 'border-blue-200',
    gray: 'border-neutral-200',
  };

  return (
    <div className={`rounded-xl border bg-white p-4 ${borderTone[tone]}`}>
      <p className="text-[11px] uppercase tracking-[0.12em] text-neutral-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">{value}</p>
      {helper ? <p className="mt-1 text-xs text-neutral-600">{helper}</p> : null}
    </div>
  );
}

function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-6 text-center">
      <p className="text-sm font-semibold text-neutral-900">{title}</p>
      <p className="mt-1 text-xs text-neutral-600">{description}</p>
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="cursor-pointer mt-4 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs font-semibold text-neutral-700 transition hover:border-neutral-400"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}

export default function DashboardShell({ user, checkoutState }) {
  const router = useRouter();

  const [activeNav, setActiveNav] = useState(checkoutState === 'cancelled' ? 'request' : 'workspace');

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

  const [invoicesData, setInvoicesData] = useState(null);
  const [invoicesLoading, setInvoicesLoading] = useState(true);
  const [invoicesError, setInvoicesError] = useState('');
  const [progressData, setProgressData] = useState(null);
  const [progressLoading, setProgressLoading] = useState(true);
  const [progressError, setProgressError] = useState('');

  const foldersById = useMemo(() => flattenFolders(driveData?.tree || null, {}), [driveData]);

  const selectedFolder = useMemo(() => {
    if (!selectedFolderId) return driveData?.tree || null;
    return foldersById[selectedFolderId] || driveData?.tree || null;
  }, [selectedFolderId, driveData, foldersById]);

  const activeLabel = CLIENT_NAV_ITEMS.find((item) => item.id === activeNav)?.label || 'Workspace';
  const accountLabel = ownerNameFromEmail(user.email);

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

  async function loadInvoices() {
    setInvoicesLoading(true);
    setInvoicesError('');

    try {
      const response = await fetch('/api/portal/invoices', { cache: 'no-store' });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.error || 'Unable to load invoices.');
      }

      setInvoicesData(payload);
    } catch (error) {
      setInvoicesError(error.message || 'Unable to load invoices.');
    } finally {
      setInvoicesLoading(false);
    }
  }

  async function loadProgress() {
    setProgressLoading(true);
    setProgressError('');

    try {
      const response = await fetch('/api/portal/progress', { cache: 'no-store' });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.error || 'Unable to load progress.');
      }

      setProgressData(payload);
    } catch (error) {
      setProgressError(error.message || 'Unable to load progress.');
    } finally {
      setProgressLoading(false);
    }
  }

  useEffect(() => {
    loadDriveTree();
    loadInvoices();
    loadProgress();
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
      await uploadSingleFile(file);
    }
  }

  function onFileInputChange(event) {
    const files = Array.from(event.target.files || []);
    void handleFiles(files);
    event.target.value = '';
  }

  function onDrop(event) {
    event.preventDefault();
    setDragActive(false);
    const files = Array.from(event.dataTransfer?.files || []);
    void handleFiles(files);
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

  function renderWorkspaceSection() {
    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-neutral-200 bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-neutral-500">Drive Workspace</p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight text-neutral-950">Client Folder</h2>
            </div>

            <div className="flex items-center gap-2">
              {driveData?.rootFolderUrl ? (
                <a
                  href={driveData.rootFolderUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-md border border-neutral-300 px-3 py-2 text-sm font-semibold text-neutral-700 transition hover:border-neutral-400"
                >
                  Open in Drive
                </a>
              ) : null}

              <button
                type="button"
                onClick={loadDriveTree}
                className="cursor-pointer rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-semibold text-neutral-800 transition hover:border-neutral-400"
              >
                Refresh
              </button>
            </div>
          </div>

          {driveError ? (
            <p className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{driveError}</p>
          ) : null}
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-4">
          <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
            <aside className="rounded-lg border border-neutral-200 p-3">
              <p className="mb-2 text-xs uppercase tracking-[0.12em] text-neutral-500">Folders</p>

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
                <p className="text-sm text-neutral-500">No workspace is configured for this account yet.</p>
              )}
            </aside>

            <div className="space-y-4">
              <div
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={onDrop}
                className={`rounded-lg border-2 border-dashed p-5 text-center transition ${
                  dragActive
                    ? 'border-neutral-900 bg-neutral-100'
                    : 'border-neutral-300 bg-neutral-50'
                }`}
              >
                <p className="text-sm font-medium text-neutral-900">
                  Drag files into <span className="font-black">{selectedFolder?.name || 'your selected folder'}</span>
                </p>
                <p className="mt-1 text-xs text-neutral-500">Resumable upload is enabled for large footage.</p>

                <label className="mt-3 inline-flex cursor-pointer rounded-md bg-neutral-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-black">
                  Select files
                  <input type="file" multiple className="hidden" onChange={onFileInputChange} />
                </label>
              </div>

              <div className="rounded-lg border border-neutral-200 p-3">
                <p className="text-xs uppercase tracking-[0.12em] text-neutral-500">Files in selected folder</p>
                <div className="mt-2 space-y-2">
                  {(selectedFolder?.files || []).length === 0 ? (
                    <p className="text-sm text-neutral-500">No files in this folder yet.</p>
                  ) : (
                    selectedFolder.files.map((file) => (
                      <div
                        key={file.id}
                        className="flex flex-col gap-2 rounded-lg border border-neutral-200 p-3 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div>
                          <p className="text-sm font-medium text-neutral-800">{file.name}</p>
                          <p className="text-xs text-neutral-500">{file.mimeType}</p>
                        </div>
                        <a
                          href={`/api/portal/drive/download?fileId=${encodeURIComponent(file.id)}`}
                          className="inline-flex rounded-md border border-neutral-300 px-3 py-2 text-xs font-semibold text-neutral-700 transition hover:border-neutral-400"
                        >
                          Download
                        </a>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {uploads.length > 0 ? (
                <div className="rounded-lg border border-neutral-200 p-3">
                  <p className="text-xs uppercase tracking-[0.12em] text-neutral-500">Upload activity</p>
                  <div className="mt-2 space-y-3">
                    {uploads.map((upload) => (
                      <div key={upload.id} className="rounded-lg border border-neutral-200 p-3">
                        <div className="flex items-center justify-between gap-3">
                          <p className="truncate text-sm font-medium text-neutral-800">{upload.name}</p>
                          <p className="text-xs uppercase tracking-wide text-neutral-500">{upload.status}</p>
                        </div>
                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-200">
                          <div
                            className={`h-full transition-all ${upload.status === 'error' ? 'bg-rose-500' : 'bg-black'}`}
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
        </div>
      </div>
    );
  }

  function renderRequestSection() {
    return (
      <div className="space-y-4">
        {checkoutState === 'cancelled' ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            Checkout was canceled. Your request is still saved and can be submitted again.
          </div>
        ) : null}

        <div className="rounded-xl border border-neutral-200 bg-white p-4">
          <p className="text-xs uppercase tracking-[0.12em] text-neutral-500">Video Request</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-neutral-950">Proposal + Stripe Checkout</h2>

          <form onSubmit={handleCheckout} className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-neutral-700">Request type</label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setRequestType('long_form')}
                  className={`cursor-pointer rounded-md px-4 py-2 text-sm font-semibold transition ${
                    requestType === 'long_form'
                      ? 'bg-neutral-900 text-white'
                      : 'border border-neutral-300 text-neutral-700'
                  }`}
                >
                  Long-form
                </button>
                <button
                  type="button"
                  onClick={() => setRequestType('short_form')}
                  className={`cursor-pointer rounded-md px-4 py-2 text-sm font-semibold transition ${
                    requestType === 'short_form'
                      ? 'bg-neutral-900 text-white'
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
                className="cursor-pointer w-full rounded-lg bg-neutral-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
              >
                {checkoutLoading ? 'Redirecting to Stripe...' : 'Continue to Stripe Checkout'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  function renderInvoicesSection() {
    const summary = invoicesData?.summary || {
      totalCount: 0,
      activeCount: 0,
      semiPaidCount: 0,
      fullyPaidCount: 0,
      otherCount: 0,
      totalCents: 0,
      currency: 'USD',
    };

    if (invoicesLoading && !invoicesData) {
      return (
        <EmptyState
          title="Loading invoices"
          description="Pulling your invoice history now."
        />
      );
    }

    if (invoicesError) {
      return (
        <EmptyState
          title="Invoices unavailable"
          description={invoicesError}
          actionLabel="Retry"
          onAction={loadInvoices}
        />
      );
    }

    if (invoicesData?.configured === false) {
      return (
        <EmptyState
          title="Invoicing not connected"
          description={invoicesData?.message || 'PayPal invoicing is not configured right now.'}
          actionLabel="Retry"
          onAction={loadInvoices}
        />
      );
    }

    return (
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Active"
            value={String(summary.activeCount)}
            tone={summary.activeCount > 0 ? 'yellow' : 'gray'}
          />
          <MetricCard
            label="Semi-Paid"
            value={String(summary.semiPaidCount)}
            tone={summary.semiPaidCount > 0 ? 'blue' : 'gray'}
          />
          <MetricCard
            label="Fully Paid"
            value={String(summary.fullyPaidCount)}
            tone={summary.fullyPaidCount > 0 ? 'green' : 'gray'}
          />
          <MetricCard
            label="Invoice Volume"
            value={formatMoneyFromCents(summary.totalCents, summary.currency)}
            helper={`${summary.totalCount} total invoices`}
            tone="gray"
          />
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="text-xs uppercase tracking-[0.12em] text-neutral-500">Your Invoices</p>
            <button
              type="button"
              onClick={loadInvoices}
              disabled={invoicesLoading}
              className="cursor-pointer rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-xs font-semibold text-neutral-800 transition hover:border-neutral-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {invoicesLoading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>

          {(invoicesData?.invoices || []).length === 0 ? (
            <EmptyState
              title="No invoices found"
              description="No PayPal invoices were found for your account email yet."
            />
          ) : (
            <div className="overflow-x-auto rounded-lg border border-neutral-200">
              <table className="min-w-full text-sm">
                <thead className="bg-neutral-50 text-xs uppercase tracking-[0.12em] text-neutral-500">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold">Invoice</th>
                    <th className="px-3 py-2 text-left font-semibold">Status</th>
                    <th className="px-3 py-2 text-left font-semibold">Amount</th>
                    <th className="px-3 py-2 text-left font-semibold">Created</th>
                    <th className="px-3 py-2 text-left font-semibold">Due</th>
                  </tr>
                </thead>
                <tbody>
                  {invoicesData.invoices.map((invoice) => (
                    <tr key={invoice.id || invoice.invoiceNumber} className="border-t border-neutral-100">
                      <td className="px-3 py-2 font-medium text-neutral-900">{invoice.invoiceNumber || invoice.id}</td>
                      <td className="px-3 py-2">
                        <StatusPill tone={invoiceTone(invoice.purchaseState)}>
                          {invoice.purchaseStateLabel || 'Other'}
                        </StatusPill>
                      </td>
                      <td className="px-3 py-2 text-neutral-700">
                        {formatMoneyFromCents(invoice.totalCents, invoice.currency || summary.currency)}
                      </td>
                      <td className="px-3 py-2 text-neutral-700">{formatDate(invoice.createdAt)}</td>
                      <td className="px-3 py-2 text-neutral-700">{formatDate(invoice.dueDate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }

  function renderProgressSection() {
    const summary = progressData?.summary || {
      invoiceCount: 0,
      packCount: 0,
      totalItems: 0,
      completedItems: 0,
    };

    if (progressLoading && !progressData) {
      return (
        <EmptyState
          title="Loading progress"
          description="Fetching your deliverables status now."
        />
      );
    }

    if (progressError) {
      return (
        <EmptyState
          title="Progress unavailable"
          description={progressError}
          actionLabel="Retry"
          onAction={loadProgress}
        />
      );
    }

    if (progressData?.configured === false) {
      return (
        <EmptyState
          title="Progress not connected"
          description={progressData?.message || 'Billing sync is not configured right now.'}
          actionLabel="Retry"
          onAction={loadProgress}
        />
      );
    }

    return (
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Invoices" value={String(summary.invoiceCount)} tone="gray" />
          <MetricCard label="Packs" value={String(summary.packCount)} tone="blue" />
          <MetricCard label="Deliverables" value={String(summary.totalItems)} tone="gray" />
          <MetricCard
            label="Completed"
            value={String(summary.completedItems)}
            helper={summary.totalItems > 0 ? `${Math.round((summary.completedItems / summary.totalItems) * 100)}% done` : '0% done'}
            tone={summary.completedItems > 0 ? 'green' : 'gray'}
          />
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="text-xs uppercase tracking-[0.12em] text-neutral-500">Deliverables Progress</p>
            <button
              type="button"
              onClick={loadProgress}
              disabled={progressLoading}
              className="cursor-pointer rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-xs font-semibold text-neutral-800 transition hover:border-neutral-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {progressLoading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>

          {(progressData?.invoices || []).length === 0 ? (
            <EmptyState
              title="No tracked progress yet"
              description="Progress appears here once a partially paid or fully paid invoice has deliverables."
            />
          ) : (
            <div className="space-y-3">
              {progressData.invoices.map((invoice) => (
                <div
                  key={invoice.invoiceId}
                  className="rounded-xl border border-neutral-200 bg-[linear-gradient(135deg,#ffffff,#f8fafc_55%,#f0f9ff)] p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-neutral-900">
                        {invoice.invoiceNumber || invoice.invoiceId}
                      </p>
                      <p className="text-xs text-neutral-600">
                        {formatDate(invoice.createdAt)} • Due {formatDate(invoice.dueDate)}
                      </p>
                    </div>
                    <StatusPill tone={invoiceTone(invoice.purchaseState)}>
                      {invoice.purchaseStateLabel || 'Other'}
                    </StatusPill>
                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-neutral-200">
                    <div
                      className="h-full bg-neutral-900 transition-all"
                      style={{ width: `${invoice.progressPercent || 0}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-neutral-600">
                    {invoice.completedItems}/{invoice.totalItems} completed
                  </p>

                  <div className="mt-3 space-y-3">
                    {(invoice.packs || []).map((pack) => (
                      <div key={pack.id} className="rounded-lg border border-neutral-200 bg-white p-3">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-semibold text-neutral-900">
                            {pack.packTypeLabel} • {pack.sourceLineLabel || pack.sourceLineKey}
                          </p>
                          <p className="text-[11px] text-neutral-500">
                            {pack.completedCount}/{pack.quantity}
                          </p>
                        </div>

                        <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                          {(pack.items || []).map((item) => (
                            <div key={item.id} className="rounded-md border border-neutral-200 px-2 py-2">
                              <p className="text-[11px] font-semibold text-neutral-800">Deliverable {item.itemIndex}</p>
                              <div className="mt-1">
                                <StatusPill tone={stepTone(item.stepStatus)}>
                                  {item.stepLabel}
                                </StatusPill>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  function renderEducationSection() {
    return <ClientEducationPane />;
  }

  function renderMainPanel() {
    if (activeNav === 'workspace') return renderWorkspaceSection();
    if (activeNav === 'request') return renderRequestSection();
    if (activeNav === 'invoices') return renderInvoicesSection();
    if (activeNav === 'progress') return renderProgressSection();
    if (activeNav === 'education') return renderEducationSection();
    return renderWorkspaceSection();
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/95 backdrop-blur">
        <div className="flex flex-wrap items-center gap-3 px-4 py-3">
          <div className="min-w-[140px]">
            <span className="text-sm font-black tracking-tight sm:text-base">USATII MEDIA</span>
          </div>

          <p className="text-sm text-neutral-500">
            {user.displayName || user.email}
            {user.company ? ` • ${user.company}` : ''}
          </p>

          <div className="ml-auto flex items-center gap-2">
            <Link
              href="/"
              className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-semibold text-neutral-800 transition hover:border-neutral-400"
            >
              Main site
            </Link>

            <details className="relative">
              <summary className="cursor-pointer list-none rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-semibold text-neutral-800 transition hover:border-neutral-400 [&::-webkit-details-marker]:hidden">
                <span className="inline-flex items-center gap-2">
                  {accountLabel}
                  <span className="text-[10px] text-neutral-500">▼</span>
                </span>
              </summary>

              <div className="absolute right-0 z-50 mt-2 w-56 rounded-md border border-neutral-200 bg-white p-1 shadow-lg">
                <p className="truncate px-3 py-2 text-xs text-neutral-500">{user.email}</p>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="cursor-pointer w-full rounded-md px-3 py-2 text-left text-sm font-semibold text-neutral-800 transition hover:bg-neutral-100"
                >
                  Sign out
                </button>
              </div>
            </details>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr]">
        <aside className="border-b border-neutral-200 bg-white lg:sticky lg:top-[61px] lg:h-[calc(100vh-61px)] lg:overflow-y-auto lg:border-b-0 lg:border-r">
          <nav className="space-y-1 p-3">
            {CLIENT_NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveNav(item.id)}
                className={`cursor-pointer w-full rounded-md px-3 py-2 text-left text-sm font-medium transition ${
                  activeNav === item.id
                    ? 'bg-neutral-900 text-white'
                    : 'text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="space-y-5 px-4 py-5 sm:px-6 lg:px-8">
          <div>
            <p className="text-sm text-neutral-500">Client / {activeLabel}</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-950">{activeLabel}</h1>
          </div>

          {renderMainPanel()}
        </main>
      </div>
    </div>
  );
}

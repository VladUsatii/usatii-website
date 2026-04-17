import { NextResponse } from 'next/server';
import { requirePortalSession } from '@/lib/portal/auth';
import { getDriveAccessToken, validateUploadParentFolder } from '@/lib/portal/drive';

export const runtime = 'nodejs';

function trimValue(value, maxLength = 255) {
  return String(value || '').trim().slice(0, maxLength);
}

export async function POST(request) {
  const { session, error } = await requirePortalSession('client');
  if (error) return error;

  let body;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 });
  }

  const fileName = trimValue(body.fileName || body.name, 240);
  const mimeType = trimValue(body.mimeType, 120) || 'application/octet-stream';
  const fileSize = Number(body.fileSize || 0);
  const parentFolderId = trimValue(body.parentFolderId, 255) || session.profile.driveFolderId;

  if (!fileName) {
    return NextResponse.json({ error: 'fileName is required.' }, { status: 400 });
  }

  if (!session.profile.driveFolderId) {
    return NextResponse.json(
      { error: 'No Drive folder is configured for this account.' },
      { status: 400 }
    );
  }

  try {
    const resolvedParentId = await validateUploadParentFolder(
      parentFolderId,
      session.profile.driveFolderId
    );

    const accessToken = await getDriveAccessToken();

    const headers = {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json; charset=UTF-8',
      'X-Upload-Content-Type': mimeType,
    };

    if (Number.isFinite(fileSize) && fileSize > 0) {
      headers['X-Upload-Content-Length'] = String(fileSize);
    }

    const response = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&supportsAllDrives=true',
      {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: fileName,
          parents: [resolvedParentId],
          mimeType,
        }),
      }
    );

    if (!response.ok) {
      const detail = await response.text();
      console.error('Failed to start Drive resumable upload session', detail);

      return NextResponse.json(
        { error: 'Unable to start upload session with Google Drive.' },
        { status: 502 }
      );
    }

    const uploadUrl = response.headers.get('location');
    if (!uploadUrl) {
      return NextResponse.json(
        { error: 'Drive upload session URL was not returned.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ uploadUrl }, { status: 200 });
  } catch (err) {
    if (err?.message) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }

    console.error('Failed to initialize resumable upload', err);
    return NextResponse.json(
      { error: 'Unable to initialize upload right now.' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { requirePortalSession } from '@/lib/portal/auth';
import { getDriveAccessToken, getDriveClient, isItemWithinRoot } from '@/lib/portal/drive';

export const runtime = 'nodejs';

export async function GET(request) {
  const { session, error } = await requirePortalSession('client');
  if (error) return error;

  const fileId = new URL(request.url).searchParams.get('fileId')?.trim();

  if (!fileId) {
    return NextResponse.json({ error: 'fileId is required.' }, { status: 400 });
  }

  if (!session.profile.driveFolderId) {
    return NextResponse.json(
      { error: 'No Drive folder is configured for this account.' },
      { status: 400 }
    );
  }

  try {
    const allowed = await isItemWithinRoot(fileId, session.profile.driveFolderId);

    if (!allowed) {
      return NextResponse.json({ error: 'This file is outside your workspace.' }, { status: 403 });
    }

    const drive = getDriveClient();
    const metadataResponse = await drive.files.get({
      fileId,
      fields: 'id, name, mimeType',
      includeItemsFromAllDrives: true,
      supportsAllDrives: true,
    });

    const fileName = metadataResponse.data.name || `download-${fileId}`;
    const mimeType = metadataResponse.data.mimeType || 'application/octet-stream';

    const accessToken = await getDriveAccessToken();
    const downloadResponse = await fetch(
      `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}?alt=media&supportsAllDrives=true`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!downloadResponse.ok || !downloadResponse.body) {
      const detail = await downloadResponse.text().catch(() => '');
      console.error('Drive download failed', detail);
      return NextResponse.json(
        { error: 'Unable to download this file from Google Drive.' },
        { status: 502 }
      );
    }

    return new NextResponse(downloadResponse.body, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(fileName)}`,
        'Cache-Control': 'private, no-store',
      },
    });
  } catch (err) {
    if (err?.code === 404 || err?.response?.status === 404) {
      return NextResponse.json({ error: 'File not found.' }, { status: 404 });
    }

    console.error('Failed to handle Drive download', err);
    return NextResponse.json({ error: 'Unable to download file right now.' }, { status: 500 });
  }
}

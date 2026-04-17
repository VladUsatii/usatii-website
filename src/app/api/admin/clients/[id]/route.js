import { NextResponse } from 'next/server';
import { requirePortalSession } from '@/lib/portal/auth';
import { ensurePortalTables } from '@/lib/portal/schema';
import { FOLDER_MIME_TYPE, getDriveClient } from '@/lib/portal/drive';
import {
  getPortalDatabaseConfigPublicMessage,
  isPortalDatabaseConfigError,
  portalSql,
} from '@/lib/portal/database';
import { getAdminClientById } from '@/lib/portal/admin-data';

export const runtime = 'nodejs';

function trimValue(value, maxLength = 255) {
  return String(value || '').trim().slice(0, maxLength);
}

export async function GET(_request, { params }) {
  const { error } = await requirePortalSession('admin');
  if (error) return error;

  const idValue = String(params?.id || '').trim();
  if (!/^\d+$/.test(idValue)) {
    return NextResponse.json({ error: 'Client id must be numeric.' }, { status: 400 });
  }

  const clientUserId = Number(idValue);

  try {
    const result = await getAdminClientById(clientUserId);

    if (!result) {
      return NextResponse.json({ error: 'Client not found.' }, { status: 404 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    if (isPortalDatabaseConfigError(error)) {
      return NextResponse.json(
        {
          error: getPortalDatabaseConfigPublicMessage(),
          code: 'portal_db_not_configured',
        },
        { status: 503 }
      );
    }

    console.error('Failed to load admin client detail', error);
    return NextResponse.json({ error: 'Unable to load client detail right now.' }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  const { error } = await requirePortalSession('admin');
  if (error) return error;

  const idValue = String(params?.id || '').trim();
  if (!/^\d+$/.test(idValue)) {
    return NextResponse.json({ error: 'Client id must be numeric.' }, { status: 400 });
  }

  let body;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 });
  }

  if (typeof body?.driveFolderId !== 'string') {
    return NextResponse.json(
      { error: 'driveFolderId must be provided as a string (use empty string to clear it).' },
      { status: 400 }
    );
  }

  const clientUserId = Number(idValue);
  const driveFolderId = trimValue(body.driveFolderId, 255) || null;
  const driveFolderUrlInput =
    typeof body.driveFolderUrl === 'string' ? trimValue(body.driveFolderUrl, 500) || null : null;

  if (!driveFolderId && driveFolderUrlInput) {
    return NextResponse.json(
      { error: 'Drive folder URL requires a Drive folder ID.' },
      { status: 400 }
    );
  }

  try {
    let resolvedDriveFolderUrl = null;

    if (driveFolderId) {
      const drive = getDriveClient();
      const folderMetaResponse = await drive.files.get({
        fileId: driveFolderId,
        fields: 'id, mimeType, webViewLink',
        includeItemsFromAllDrives: true,
        supportsAllDrives: true,
      });

      if (folderMetaResponse.data.mimeType !== FOLDER_MIME_TYPE) {
        return NextResponse.json(
          { error: 'Drive folder ID must point to a Google Drive folder.' },
          { status: 400 }
        );
      }

      resolvedDriveFolderUrl =
        driveFolderUrlInput ||
        folderMetaResponse.data.webViewLink ||
        `https://drive.google.com/drive/folders/${driveFolderId}`;
    }

    await ensurePortalTables();

    const updateResult = await portalSql`
      UPDATE client_profiles cp
      SET
        drive_folder_id = ${driveFolderId},
        drive_folder_url = ${resolvedDriveFolderUrl},
        updated_at = NOW()
      FROM portal_users u
      WHERE cp.user_id = u.id
        AND cp.user_id = ${clientUserId}
        AND u.role = 'client'
      RETURNING cp.user_id
    `;

    if (updateResult.rowCount === 0) {
      return NextResponse.json({ error: 'Client not found.' }, { status: 404 });
    }

    const result = await getAdminClientById(clientUserId);
    if (!result) {
      return NextResponse.json({ error: 'Client not found.' }, { status: 404 });
    }

    return NextResponse.json(
      {
        success: true,
        client: result.client,
      },
      { status: 200 }
    );
  } catch (patchError) {
    if (isPortalDatabaseConfigError(patchError)) {
      return NextResponse.json(
        {
          error: getPortalDatabaseConfigPublicMessage(),
          code: 'portal_db_not_configured',
        },
        { status: 503 }
      );
    }

    if (patchError?.code === '23505') {
      return NextResponse.json(
        { error: 'Drive folder ID is already assigned to another client.' },
        { status: 409 }
      );
    }

    if (patchError?.code === 404 || patchError?.response?.status === 404) {
      return NextResponse.json(
        { error: 'Drive folder not found or not shared with the configured service account.' },
        { status: 400 }
      );
    }

    console.error('Failed to update admin client settings', patchError);
    return NextResponse.json(
      { error: 'Unable to update this client right now.' },
      { status: 500 }
    );
  }
}

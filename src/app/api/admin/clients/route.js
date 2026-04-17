import { NextResponse } from 'next/server';
import { requirePortalSession } from '@/lib/portal/auth';
import { ensurePortalTables } from '@/lib/portal/schema';
import {
  hashPassword,
  normalizeEmail,
  validateStrongPassword,
} from '@/lib/portal/passwords';
import { FOLDER_MIME_TYPE, getDriveClient } from '@/lib/portal/drive';
import {
  getPortalDatabaseConfigPublicMessage,
  isPortalDatabaseConfigError,
  portalSql,
} from '@/lib/portal/database';
import { listAdminClients } from '@/lib/portal/admin-data';

export const runtime = 'nodejs';

function trimValue(value, maxLength = 255) {
  return String(value || '').trim().slice(0, maxLength);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function parseClientUserId(value) {
  const trimmed = String(value || '').trim();
  if (!trimmed || trimmed === 'all') return null;
  if (!/^\d+$/.test(trimmed)) return NaN;
  return Number(trimmed);
}

export async function GET(request) {
  const { error } = await requirePortalSession('admin');
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const query = String(searchParams.get('q') || '').trim();
  const parsedClientUserId = parseClientUserId(searchParams.get('clientId'));

  if (Number.isNaN(parsedClientUserId)) {
    return NextResponse.json({ error: 'clientId must be numeric or "all".' }, { status: 400 });
  }

  try {
    const clients = await listAdminClients({
      clientUserId: parsedClientUserId,
      query,
    });

    return NextResponse.json(
      {
        clients,
      },
      { status: 200 }
    );
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

    console.error('Failed to list admin clients', error);
    return NextResponse.json({ error: 'Unable to load clients right now.' }, { status: 500 });
  }
}

export async function POST(request) {
  const { session, error } = await requirePortalSession('admin');
  if (error) return error;

  let body;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 });
  }

  const email = normalizeEmail(body.email);
  const password = String(body.password || '');
  const displayName = trimValue(body.displayName, 120);
  const company = trimValue(body.company, 160) || null;
  const driveFolderId = trimValue(body.driveFolderId, 255);
  const driveFolderUrlInput = trimValue(body.driveFolderUrl, 500) || null;

  if (!email || !password || !displayName || !driveFolderId) {
    return NextResponse.json(
      { error: 'Email, password, display name, and Drive folder ID are required.' },
      { status: 400 }
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 });
  }

  const passwordError = validateStrongPassword(password);
  if (passwordError) {
    return NextResponse.json({ error: passwordError }, { status: 400 });
  }

  try {
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

    await ensurePortalTables();

    const passwordHash = await hashPassword(password);

    const createdUser = await portalSql`
      INSERT INTO portal_users (
        email,
        password_hash,
        role,
        is_active
      ) VALUES (
        ${email},
        ${passwordHash},
        'client',
        TRUE
      )
      RETURNING id, email
    `;

    const userId = createdUser.rows[0].id;

    try {
      await portalSql`
        INSERT INTO client_profiles (
          user_id,
          display_name,
          company,
          drive_folder_id,
          drive_folder_url
        ) VALUES (
          ${userId},
          ${displayName},
          ${company},
          ${driveFolderId},
          ${driveFolderUrlInput || folderMetaResponse.data.webViewLink || `https://drive.google.com/drive/folders/${driveFolderId}`}
        )
      `;
    } catch (profileInsertError) {
      await portalSql`DELETE FROM portal_users WHERE id = ${userId}`;
      throw profileInsertError;
    }

    return NextResponse.json(
      {
        success: true,
        createdBy: session.email,
        client: {
          id: Number(userId),
          email: createdUser.rows[0].email,
          displayName,
          company,
          driveFolderId,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    if (isPortalDatabaseConfigError(err)) {
      return NextResponse.json(
        {
          error: getPortalDatabaseConfigPublicMessage(),
          code: 'portal_db_not_configured',
        },
        { status: 503 }
      );
    }

    if (err?.code === '23505') {
      return NextResponse.json(
        { error: 'Email or Drive folder ID already exists in the client portal.' },
        { status: 409 }
      );
    }

    if (err?.code === 404 || err?.response?.status === 404) {
      return NextResponse.json(
        { error: 'Drive folder not found or not shared with the configured service account.' },
        { status: 400 }
      );
    }

    console.error('Failed to create client account', err);

    return NextResponse.json(
      { error: 'Unable to create client account right now.' },
      { status: 500 }
    );
  }
}

import { createHash, randomBytes } from 'node:crypto';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import {
  PORTAL_SESSION_COOKIE,
  PORTAL_SESSION_TTL_DAYS,
  getPortalAuthSecret,
} from '@/lib/portal/constants';
import {
  createSignedSessionValue,
  verifySignedSessionValue,
} from '@/lib/portal/session-cookie';
import { ensurePortalTables } from '@/lib/portal/schema';
import {
  getPortalDatabaseConfigPublicMessage,
  isPortalDatabaseConfigError,
  portalSql,
} from '@/lib/portal/database';

function hashSessionToken(token) {
  return createHash('sha256').update(String(token || '')).digest('hex');
}

function getSessionMaxAgeSeconds() {
  return Math.max(1, Math.floor(PORTAL_SESSION_TTL_DAYS * 24 * 60 * 60));
}

function toUnixSeconds(date) {
  return Math.floor(date.getTime() / 1000);
}

export async function createPortalSession({ userId, role }) {
  await ensurePortalTables();

  const sessionToken = randomBytes(32).toString('hex');
  const sessionTokenHash = hashSessionToken(sessionToken);
  const maxAgeSeconds = getSessionMaxAgeSeconds();
  const expiresAt = new Date(Date.now() + maxAgeSeconds * 1000);

  await portalSql`
    INSERT INTO portal_sessions (
      user_id,
      session_token_hash,
      expires_at
    ) VALUES (
      ${userId},
      ${sessionTokenHash},
      ${expiresAt.toISOString()}
    )
  `;

  const payload = {
    sid: sessionToken,
    uid: String(userId),
    role: String(role || ''),
    exp: toUnixSeconds(expiresAt),
  };

  const cookieValue = await createSignedSessionValue(payload, getPortalAuthSecret());

  return { cookieValue, expiresAt, maxAgeSeconds };
}

export function attachPortalSessionCookie(response, { cookieValue, expiresAt, maxAgeSeconds }) {
  response.cookies.set(PORTAL_SESSION_COOKIE, cookieValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
    maxAge: maxAgeSeconds,
  });
}

export function clearPortalSessionCookie(response) {
  response.cookies.set(PORTAL_SESSION_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: new Date(0),
    maxAge: 0,
  });
}

async function getSessionPayloadFromCookieValue(cookieValue) {
  const payload = await verifySignedSessionValue(cookieValue, getPortalAuthSecret());

  if (!payload || typeof payload !== 'object') return null;
  if (!payload.sid || !payload.uid || !payload.role || !payload.exp) return null;
  if (!/^\d+$/.test(String(payload.uid))) return null;
  if (!['admin', 'client'].includes(String(payload.role))) return null;

  const nowUnix = Math.floor(Date.now() / 1000);
  if (Number(payload.exp) <= nowUnix) return null;

  return payload;
}

async function resolvePortalSessionFromPayload(payload) {
  await ensurePortalTables();

  const tokenHash = hashSessionToken(payload.sid);

  const result = await portalSql`
    SELECT
      s.id AS session_id,
      s.expires_at,
      u.id AS user_id,
      u.email,
      u.role,
      u.is_active,
      c.display_name,
      c.company,
      c.drive_folder_id,
      c.drive_folder_url
    FROM portal_sessions s
    INNER JOIN portal_users u ON u.id = s.user_id
    LEFT JOIN client_profiles c ON c.user_id = u.id
    WHERE s.session_token_hash = ${tokenHash}
      AND s.user_id = ${payload.uid}
      AND s.revoked_at IS NULL
    LIMIT 1
  `;

  if (result.rowCount === 0) return null;

  const row = result.rows[0];
  const now = Date.now();
  const expiresAt = new Date(row.expires_at);

  if (Number.isNaN(expiresAt.getTime()) || expiresAt.getTime() <= now) {
    await portalSql`
      UPDATE portal_sessions
      SET revoked_at = NOW()
      WHERE id = ${row.session_id}
    `;
    return null;
  }

  if (!row.is_active) return null;
  if (row.role !== payload.role) return null;

  return {
    userId: Number(row.user_id),
    email: row.email,
    role: row.role,
    profile: {
      displayName: row.display_name || null,
      company: row.company || null,
      driveFolderId: row.drive_folder_id || null,
      driveFolderUrl: row.drive_folder_url || null,
    },
    expiresAt: expiresAt.toISOString(),
    sessionId: Number(row.session_id),
    sessionToken: payload.sid,
  };
}

export async function getPortalSessionFromCookieValue(cookieValue) {
  if (!cookieValue) return null;

  const payload = await getSessionPayloadFromCookieValue(cookieValue);
  if (!payload) return null;

  return resolvePortalSessionFromPayload(payload);
}

async function resolveCurrentPortalSession() {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(PORTAL_SESSION_COOKIE)?.value;
  return getPortalSessionFromCookieValue(cookieValue);
}

export async function getCurrentPortalSession() {
  try {
    return await resolveCurrentPortalSession();
  } catch (error) {
    if (isPortalDatabaseConfigError(error)) {
      return null;
    }

    throw error;
  }
}

export async function requirePortalSession(requiredRole) {
  let session;

  try {
    session = await resolveCurrentPortalSession();
  } catch (error) {
    if (isPortalDatabaseConfigError(error)) {
      return {
        error: NextResponse.json(
          {
            error: getPortalDatabaseConfigPublicMessage(),
            code: 'portal_db_not_configured',
          },
          { status: 503 }
        ),
      };
    }

    throw error;
  }

  if (!session) {
    return {
      error: NextResponse.json(
        {
          error: 'Unauthorized',
          code: 'portal_unauthorized',
        },
        { status: 401 }
      ),
    };
  }

  if (requiredRole && session.role !== requiredRole) {
    return {
      error: NextResponse.json(
        {
          error: 'Forbidden',
          code: 'portal_forbidden',
          requiredRole,
          currentRole: session.role,
        },
        { status: 403 }
      ),
    };
  }

  return { session };
}

export async function revokeSessionByCookieValue(cookieValue) {
  const payload = await getSessionPayloadFromCookieValue(cookieValue);
  if (!payload) return;

  await ensurePortalTables();

  await portalSql`
    UPDATE portal_sessions
    SET revoked_at = NOW()
    WHERE session_token_hash = ${hashSessionToken(payload.sid)}
  `;
}

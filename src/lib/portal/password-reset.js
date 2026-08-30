import { createHash, randomBytes } from 'node:crypto';
import { ensurePortalTables } from '@/lib/portal/schema';
import { portalSql } from '@/lib/portal/database';
import { hashPassword, normalizeEmail, validateStrongPassword } from '@/lib/portal/passwords';

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;
const RESET_REQUEST_COOLDOWN_MS = 60 * 1000;

function hashResetToken(token) {
  return createHash('sha256').update(String(token || '')).digest('hex');
}

export async function createPasswordResetToken(emailValue) {
  const email = normalizeEmail(emailValue);
  if (!email) return null;

  await ensurePortalTables();

  const userResult = await portalSql`
    SELECT id, email, role
    FROM portal_users
    WHERE email = ${email}
      AND is_active = TRUE
    LIMIT 1
  `;

  if (userResult.rowCount === 0) return null;

  const user = userResult.rows[0];
  const cooldownThreshold = new Date(Date.now() - RESET_REQUEST_COOLDOWN_MS).toISOString();
  const recentResult = await portalSql`
    SELECT id
    FROM portal_password_reset_tokens
    WHERE user_id = ${user.id}
      AND created_at > ${cooldownThreshold}
    LIMIT 1
  `;

  if (recentResult.rowCount > 0) return null;

  await portalSql`
    UPDATE portal_password_reset_tokens
    SET used_at = NOW()
    WHERE user_id = ${user.id}
      AND used_at IS NULL
  `;

  const token = randomBytes(32).toString('hex');
  const tokenHash = hashResetToken(token);
  const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);

  await portalSql`
    INSERT INTO portal_password_reset_tokens (
      user_id,
      token_hash,
      expires_at
    ) VALUES (
      ${user.id},
      ${tokenHash},
      ${expiresAt.toISOString()}
    )
  `;

  return {
    token,
    email: user.email,
    role: user.role,
    expiresAt,
  };
}

export async function resetPasswordWithToken(tokenValue, passwordValue) {
  const token = String(tokenValue || '').trim();
  const password = String(passwordValue || '');
  const passwordError = validateStrongPassword(password);

  if (!/^[a-f0-9]{64}$/i.test(token)) {
    return { error: 'This password reset link is invalid or has expired.' };
  }

  if (passwordError) return { error: passwordError };

  await ensurePortalTables();
  const passwordHash = await hashPassword(password);
  const tokenHash = hashResetToken(token);

  const result = await portalSql`
    WITH claimed_token AS (
      UPDATE portal_password_reset_tokens
      SET used_at = NOW()
      WHERE token_hash = ${tokenHash}
        AND used_at IS NULL
        AND expires_at > NOW()
      RETURNING user_id
    )
    UPDATE portal_users
    SET password_hash = ${passwordHash}, updated_at = NOW()
    WHERE id = (SELECT user_id FROM claimed_token)
      AND is_active = TRUE
    RETURNING id, email, role
  `;

  if (result.rowCount === 0) {
    return { error: 'This password reset link is invalid or has expired.' };
  }

  const user = result.rows[0];

  await portalSql`
    UPDATE portal_sessions
    SET revoked_at = NOW()
    WHERE user_id = ${user.id}
      AND revoked_at IS NULL
  `;

  await portalSql`
    UPDATE portal_password_reset_tokens
    SET used_at = NOW()
    WHERE user_id = ${user.id}
      AND used_at IS NULL
  `;

  return {
    success: true,
    role: user.role,
    email: user.email,
  };
}

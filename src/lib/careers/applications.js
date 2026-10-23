import { createHash } from 'node:crypto';
import { portalSql } from '@/lib/portal/database';
import { roles } from './roles.js';
import { ApplicationError } from './application-validation.js';

export const CAREER_ROLE_CATALOG = Object.fromEntries(roles.map(role => [role.slug, { title: role.title, location: role.location }]));
let tableInitPromise;

export function toTrimmedString(value, maxLength) {
  return String(value || '').trim().slice(0, maxLength);
}

export async function ensureCareerApplicationsTable() {
  if (!tableInitPromise) {
    tableInitPromise = (async () => {
      try {
        await portalSql`
          CREATE TABLE IF NOT EXISTS career_applications (
            id BIGSERIAL PRIMARY KEY,
            ip_address VARCHAR(64) NOT NULL,
            full_name VARCHAR(120) NOT NULL,
            email VARCHAR(255) NOT NULL,
            role_id VARCHAR(80) NOT NULL,
            role_title VARCHAR(120) NOT NULL,
            location VARCHAR(120) NOT NULL,
            linkedin VARCHAR(500),
            notes TEXT,
            resume_name VARCHAR(255),
            submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          )
        `;
        // Additive migration preserves previous applications. Shared networks can
        // submit multiple candidates; duplicate protection is per email and role.
        await portalSql`ALTER TABLE career_applications DROP CONSTRAINT IF EXISTS career_applications_ip_address_key`;
        await portalSql`
          ALTER TABLE career_applications
            ADD COLUMN IF NOT EXISTS application_key VARCHAR(64),
            ADD COLUMN IF NOT EXISTS answers JSONB NOT NULL DEFAULT '{}'::jsonb,
            ADD COLUMN IF NOT EXISTS resume_data BYTEA,
            ADD COLUMN IF NOT EXISTS resume_type VARCHAR(120),
            ADD COLUMN IF NOT EXISTS resume_size INTEGER
        `;
        await portalSql`CREATE UNIQUE INDEX IF NOT EXISTS idx_career_application_key ON career_applications (application_key)`;
        await portalSql`CREATE INDEX IF NOT EXISTS idx_career_applications_submitted_at ON career_applications (submitted_at DESC)`;
        await portalSql`
          CREATE TABLE IF NOT EXISTS career_application_used_challenges (
            challenge_id VARCHAR(128) PRIMARY KEY,
            expires_at TIMESTAMPTZ NOT NULL
          )
        `;
        await portalSql`CREATE INDEX IF NOT EXISTS idx_career_challenge_expiry ON career_application_used_challenges (expires_at)`;
        await portalSql`
          CREATE TABLE IF NOT EXISTS career_application_demographics (
            application_id BIGINT PRIMARY KEY REFERENCES career_applications(id) ON DELETE CASCADE,
            responses JSONB NOT NULL,
            submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          )
        `;
        await portalSql`
          CREATE TABLE IF NOT EXISTS career_application_notifications (
            application_id BIGINT PRIMARY KEY REFERENCES career_applications(id) ON DELETE CASCADE,
            sent_at TIMESTAMPTZ,
            attempts INTEGER NOT NULL DEFAULT 0,
            next_attempt_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            locked_until TIMESTAMPTZ,
            last_error VARCHAR(120)
          )
        `;
        await portalSql`
          CREATE TABLE IF NOT EXISTS career_application_rate_limits (
            rate_key VARCHAR(64) PRIMARY KEY,
            request_count INTEGER NOT NULL DEFAULT 1,
            expires_at TIMESTAMPTZ NOT NULL
          )
        `;
      } catch (error) {
        tableInitPromise = undefined;
        throw error;
      }
    })();
  }
  await tableInitPromise;
}

export async function saveCareerApplication({ role, answers, demographics, resume, verification, ipAddress }) {
  await ensureCareerApplicationsTable();
  const bucket = Math.floor(Date.now() / 3600000);
  const rateKey = createHash('sha256').update(`${ipAddress}:${bucket}`).digest('hex');
  const expiresAt = new Date((bucket + 2) * 3600000).toISOString();
  const rate = await portalSql`
    INSERT INTO career_application_rate_limits (rate_key, expires_at)
    VALUES (${rateKey}, ${expiresAt})
    ON CONFLICT (rate_key) DO UPDATE
      SET request_count = career_application_rate_limits.request_count + 1
    RETURNING request_count
  `;
  if (Number(rate.rows[0].request_count) > 20) throw new ApplicationError('Too many applications from this network. Please try again in an hour.', 429);
  await portalSql`DELETE FROM career_application_rate_limits WHERE expires_at < NOW()`;
  await portalSql`DELETE FROM career_application_used_challenges WHERE expires_at < NOW()`;
  const applicationKey = createHash('sha256').update(`${answers.email}:${role.slug}`).digest('hex');
  const hasDemographics = Object.keys(demographics).length > 0;
  // Both writes succeed together; voluntary responses are never selected by
  // the recruiting inbox, resume endpoint, or ordinary application API.
  const result = await portalSql`
    WITH proof AS (
      INSERT INTO career_application_used_challenges (challenge_id, expires_at)
      SELECT ${verification.challengeId}, ${verification.expiresAt}::timestamptz
      WHERE ${verification.expiresAt}::timestamptz > NOW()
      ON CONFLICT (challenge_id) DO NOTHING
      RETURNING challenge_id
    ), application AS (
      INSERT INTO career_applications (
        application_key, ip_address, full_name, email, role_id, role_title,
        location, linkedin, notes, resume_name, answers, resume_data, resume_type, resume_size
      ) SELECT
        ${applicationKey}, ${ipAddress}, ${answers.fullName}, ${answers.email},
        ${role.slug}, ${role.title}, ${role.location}, ${answers.linkedin || null},
        ${answers.motivation || answers.additionalInformation || null}, ${resume.name},
        ${JSON.stringify(answers)}::jsonb, decode(${resume.bytes.toString('base64')}, 'base64'),
        ${resume.mime}, ${resume.size}
      FROM proof RETURNING id
    ), notification AS (
      INSERT INTO career_application_notifications (application_id)
      SELECT id FROM application RETURNING application_id
    ), survey AS (
      INSERT INTO career_application_demographics (application_id, responses)
      SELECT id, ${JSON.stringify(demographics)}::jsonb FROM application WHERE ${hasDemographics}
      RETURNING application_id
    )
    SELECT id FROM application
  `;
  if (!result.rows.length) throw new ApplicationError('This human check has already been used or expired. Please submit again to repeat it.', 400, 'humanVerification');
  return String(result.rows[0].id);
}

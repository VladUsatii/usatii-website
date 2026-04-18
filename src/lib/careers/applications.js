import { portalSql } from '@/lib/portal/database';

export const CAREER_ROLE_CATALOG = {
  'content-editor': {
    title: 'Content Editor',
    location: 'Fully remote',
  },
  'platform-marketing-lead': {
    title: 'Platform Marketing Lead',
    location: 'Fully remote',
  },
};

let tableInitPromise;

export function toTrimmedString(value, maxLength) {
  const result = String(value || '').trim();
  return result.slice(0, maxLength);
}

export async function ensureCareerApplicationsTable() {
  if (!tableInitPromise) {
    tableInitPromise = (async () => {
      try {
        await portalSql`
          CREATE TABLE IF NOT EXISTS career_applications (
            id BIGSERIAL PRIMARY KEY,
            ip_address VARCHAR(64) NOT NULL UNIQUE,
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

        await portalSql`
          CREATE INDEX IF NOT EXISTS idx_career_applications_submitted_at
          ON career_applications (submitted_at DESC)
        `;
      } catch (error) {
        tableInitPromise = undefined;
        throw error;
      }
    })();
  }

  await tableInitPromise;
}

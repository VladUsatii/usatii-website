import { portalSql } from '@/lib/portal/database';
import { ensurePortalTables } from '@/lib/portal/schema';

let tableInitPromise;

function clean(value, maxLength) {
  return String(value || '').trim().slice(0, maxLength);
}

export async function ensureQrLeadTable() {
  if (!tableInitPromise) {
    tableInitPromise = (async () => {
      try {
        await ensurePortalTables();
        await portalSql`
          CREATE TABLE IF NOT EXISTS qr_leads (
            id BIGSERIAL PRIMARY KEY,
            full_name VARCHAR(120) NOT NULL,
            phone VARCHAR(40) NOT NULL,
            destination_path VARCHAR(255) NOT NULL DEFAULT '/software',
            campaign VARCHAR(120) NOT NULL DEFAULT 'software-qr',
            status VARCHAR(24) NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted')),
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          )
        `;
        await portalSql`
          CREATE INDEX IF NOT EXISTS idx_qr_leads_created_at
          ON qr_leads (created_at DESC)
        `;
      } catch (error) {
        tableInitPromise = undefined;
        throw error;
      }
    })();
  }
  await tableInitPromise;
}

function toQrLead(row) {
  return {
    id: Number(row.id),
    fullName: clean(row.full_name, 120),
    phone: clean(row.phone, 40),
    destinationPath: clean(row.destination_path, 255),
    campaign: clean(row.campaign, 120),
    status: clean(row.status, 24),
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : null,
  };
}

export async function createQrLead({ fullName, phone, destinationPath = '/software', campaign = 'software-qr' }) {
  await ensureQrLeadTable();
  const result = await portalSql`
    INSERT INTO qr_leads (full_name, phone, destination_path, campaign)
    VALUES (
      ${clean(fullName, 120)},
      ${clean(phone, 40)},
      ${clean(destinationPath, 255) || '/software'},
      ${clean(campaign, 120) || 'software-qr'}
    )
    RETURNING *
  `;
  return toQrLead(result.rows[0]);
}

export async function listQrLeads({ limit = 500 } = {}) {
  await ensureQrLeadTable();
  const safeLimit = Math.min(Math.max(Number(limit) || 500, 1), 1000);
  const result = await portalSql`
    SELECT * FROM qr_leads
    ORDER BY created_at DESC
    LIMIT ${safeLimit}
  `;
  return result.rows.map(toQrLead);
}


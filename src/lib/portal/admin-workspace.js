import { portalSql } from '@/lib/portal/database';

export const ADMIN_WORKSPACE_TYPES = new Set(['team', 'access', 'recruiting', 'media', 'content']);

let tablePromise;

export async function ensureAdminWorkspaceTable() {
  if (!tablePromise) {
    tablePromise = (async () => {
      try {
        await portalSql`
          CREATE TABLE IF NOT EXISTS admin_workspace_items (
            id BIGSERIAL PRIMARY KEY,
            item_type VARCHAR(40) NOT NULL,
            title VARCHAR(180) NOT NULL,
            subtitle VARCHAR(255),
            status VARCHAR(60) NOT NULL DEFAULT 'active',
            details TEXT,
            resource_url VARCHAR(1000),
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          )
        `;
        await portalSql`
          CREATE INDEX IF NOT EXISTS idx_admin_workspace_type_updated
          ON admin_workspace_items (item_type, updated_at DESC)
        `;
      } catch (error) {
        tablePromise = undefined;
        throw error;
      }
    })();
  }
  await tablePromise;
}

function clean(value, maxLength = 255) {
  return String(value || '').trim().slice(0, maxLength);
}

function cleanUrl(value) {
  const url = clean(value, 1000);
  if (!url) return '';
  if (!/^https?:\/\//i.test(url)) {
    throw Object.assign(new Error('Resource URLs must begin with http:// or https://.'), { code: 'invalid_url' });
  }
  return url;
}

function toItem(row) {
  return {
    id: Number(row.id),
    type: String(row.item_type || ''),
    title: String(row.title || ''),
    subtitle: String(row.subtitle || ''),
    status: String(row.status || 'active'),
    details: String(row.details || ''),
    url: String(row.resource_url || ''),
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : null,
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : null,
  };
}

export async function listAdminWorkspaceItems() {
  await ensureAdminWorkspaceTable();
  const result = await portalSql`
    SELECT id, item_type, title, subtitle, status, details, resource_url, created_at, updated_at
    FROM admin_workspace_items
    ORDER BY updated_at DESC, id DESC
    LIMIT 1000
  `;
  return result.rows.map(toItem);
}

export async function createAdminWorkspaceItem(input) {
  await ensureAdminWorkspaceTable();
  const type = clean(input.type, 40);
  const title = clean(input.title, 180);
  if (!ADMIN_WORKSPACE_TYPES.has(type)) throw Object.assign(new Error('Invalid workspace item type.'), { code: 'invalid_type' });
  if (!title) throw Object.assign(new Error('A title is required.'), { code: 'invalid_title' });

  const result = await portalSql`
    INSERT INTO admin_workspace_items (item_type, title, subtitle, status, details, resource_url)
    VALUES (
      ${type}, ${title}, ${clean(input.subtitle, 255) || null},
      ${clean(input.status, 60) || 'active'}, ${clean(input.details, 5000) || null},
      ${cleanUrl(input.url) || null}
    )
    RETURNING id, item_type, title, subtitle, status, details, resource_url, created_at, updated_at
  `;
  return toItem(result.rows[0]);
}

export async function updateAdminWorkspaceItem(id, input) {
  await ensureAdminWorkspaceTable();
  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId < 1) throw Object.assign(new Error('Invalid item id.'), { code: 'invalid_id' });
  const resourceUrl = input.url === undefined ? null : cleanUrl(input.url);
  const result = await portalSql`
    UPDATE admin_workspace_items
    SET
      title = COALESCE(${clean(input.title, 180) || null}, title),
      subtitle = COALESCE(${input.subtitle === undefined ? null : clean(input.subtitle, 255)}, subtitle),
      status = COALESCE(${clean(input.status, 60) || null}, status),
      details = COALESCE(${input.details === undefined ? null : clean(input.details, 5000)}, details),
      resource_url = COALESCE(${resourceUrl}, resource_url),
      updated_at = NOW()
    WHERE id = ${numericId}
    RETURNING id, item_type, title, subtitle, status, details, resource_url, created_at, updated_at
  `;
  if (!result.rows[0]) throw Object.assign(new Error('Workspace item not found.'), { code: 'not_found' });
  return toItem(result.rows[0]);
}

export async function deleteAdminWorkspaceItem(id) {
  await ensureAdminWorkspaceTable();
  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId < 1) throw Object.assign(new Error('Invalid item id.'), { code: 'invalid_id' });
  const result = await portalSql`DELETE FROM admin_workspace_items WHERE id = ${numericId} RETURNING id`;
  if (!result.rows[0]) throw Object.assign(new Error('Workspace item not found.'), { code: 'not_found' });
}

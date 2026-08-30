import { portalSql } from '@/lib/portal/database';

const RECORD_TYPES = new Set(['catalog', 'calendar', 'academy-course']);
let schemaPromise;

export async function ensureDashboardRecordsSchema() {
  if (!schemaPromise) {
    schemaPromise = (async () => {
      try {
        await portalSql`
          CREATE TABLE IF NOT EXISTS dashboard_records (
            id BIGSERIAL PRIMARY KEY,
            record_type VARCHAR(40) NOT NULL,
            title VARCHAR(255) NOT NULL,
            payload JSONB NOT NULL DEFAULT '{}'::jsonb,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          )
        `;
        await portalSql`CREATE INDEX IF NOT EXISTS idx_dashboard_records_type_updated ON dashboard_records (record_type, updated_at DESC)`;
        await portalSql`
          CREATE TABLE IF NOT EXISTS dashboard_library_folders (
            id BIGSERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          )
        `;
        await portalSql`
          CREATE TABLE IF NOT EXISTS dashboard_library_files (
            id BIGSERIAL PRIMARY KEY,
            folder_id BIGINT REFERENCES dashboard_library_folders(id) ON DELETE SET NULL,
            name VARCHAR(255) NOT NULL,
            mime_type VARCHAR(160) NOT NULL DEFAULT 'application/octet-stream',
            size_bytes BIGINT NOT NULL DEFAULT 0,
            file_data BYTEA NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          )
        `;
        await portalSql`
          CREATE TABLE IF NOT EXISTS dashboard_customer_workspaces (
            client_user_id BIGINT PRIMARY KEY REFERENCES portal_users(id) ON DELETE CASCADE,
            payload JSONB NOT NULL DEFAULT '{}'::jsonb,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          )
        `;
      } catch (error) {
        schemaPromise = undefined;
        throw error;
      }
    })();
  }
  await schemaPromise;
}

function clean(value, limit = 255) { return String(value || '').trim().slice(0, limit); }
function validType(type) {
  const normalized = clean(type, 40);
  if (!RECORD_TYPES.has(normalized)) throw Object.assign(new Error('Invalid dashboard record type.'), { code: 'invalid_type' });
  return normalized;
}
function toRecord(row) {
  return { id: Number(row.id), type: row.record_type, title: row.title, payload: row.payload || {}, createdAt: row.created_at, updatedAt: row.updated_at };
}

export async function listDashboardRecords(type) {
  await ensureDashboardRecordsSchema();
  const recordType = validType(type);
  const result = await portalSql`SELECT * FROM dashboard_records WHERE record_type = ${recordType} ORDER BY updated_at DESC, id DESC`;
  return result.rows.map(toRecord);
}

export async function createDashboardRecord({ type, title, payload }) {
  await ensureDashboardRecordsSchema();
  const recordType = validType(type);
  const recordTitle = clean(title);
  if (!recordTitle) throw Object.assign(new Error('A title is required.'), { code: 'invalid_title' });
  const body = payload && typeof payload === 'object' && !Array.isArray(payload) ? payload : {};
  const result = await portalSql`INSERT INTO dashboard_records (record_type, title, payload) VALUES (${recordType}, ${recordTitle}, ${JSON.stringify(body)}::jsonb) RETURNING *`;
  return toRecord(result.rows[0]);
}

export async function updateDashboardRecord({ id, title, payload }) {
  await ensureDashboardRecordsSchema();
  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId < 1) throw Object.assign(new Error('Invalid record id.'), { code: 'invalid_id' });
  const recordTitle = clean(title);
  if (!recordTitle) throw Object.assign(new Error('A title is required.'), { code: 'invalid_title' });
  const body = payload && typeof payload === 'object' && !Array.isArray(payload) ? payload : {};
  const result = await portalSql`UPDATE dashboard_records SET title = ${recordTitle}, payload = ${JSON.stringify(body)}::jsonb, updated_at = NOW() WHERE id = ${numericId} RETURNING *`;
  if (!result.rows[0]) throw Object.assign(new Error('Record not found.'), { code: 'not_found' });
  return toRecord(result.rows[0]);
}

export async function deleteDashboardRecord(id) {
  await ensureDashboardRecordsSchema();
  const numericId = Number(id);
  const result = await portalSql`DELETE FROM dashboard_records WHERE id = ${numericId} RETURNING id`;
  if (!result.rows[0]) throw Object.assign(new Error('Record not found.'), { code: 'not_found' });
}

function toFolder(row) { return { id: Number(row.id), name: row.name, createdAt: row.created_at, updatedAt: row.updated_at }; }
function toFile(row) { return { id: Number(row.id), folderId: row.folder_id ? Number(row.folder_id) : null, name: row.name, mimeType: row.mime_type, sizeBytes: Number(row.size_bytes), createdAt: row.created_at, updatedAt: row.updated_at }; }

export async function listLibrary() {
  await ensureDashboardRecordsSchema();
  const [folders, files] = await Promise.all([
    portalSql`SELECT * FROM dashboard_library_folders ORDER BY name ASC`,
    portalSql`SELECT id, folder_id, name, mime_type, size_bytes, created_at, updated_at FROM dashboard_library_files ORDER BY updated_at DESC`,
  ]);
  return { folders: folders.rows.map(toFolder), files: files.rows.map(toFile) };
}

export async function createLibraryFolder(name) {
  await ensureDashboardRecordsSchema();
  const folderName = clean(name);
  if (!folderName) throw Object.assign(new Error('Folder name is required.'), { code: 'invalid_name' });
  const result = await portalSql`INSERT INTO dashboard_library_folders (name) VALUES (${folderName}) RETURNING *`;
  return toFolder(result.rows[0]);
}

export async function renameLibraryFolder(id, name) {
  await ensureDashboardRecordsSchema();
  const result = await portalSql`UPDATE dashboard_library_folders SET name = ${clean(name)}, updated_at = NOW() WHERE id = ${Number(id)} RETURNING *`;
  if (!result.rows[0]) throw Object.assign(new Error('Folder not found.'), { code: 'not_found' });
  return toFolder(result.rows[0]);
}

export async function deleteLibraryFolder(id) {
  await ensureDashboardRecordsSchema();
  await portalSql`DELETE FROM dashboard_library_folders WHERE id = ${Number(id)}`;
}

export async function createLibraryFile({ folderId, name, mimeType, bytes }) {
  await ensureDashboardRecordsSchema();
  const result = await portalSql`INSERT INTO dashboard_library_files (folder_id, name, mime_type, size_bytes, file_data) VALUES (${folderId ? Number(folderId) : null}, ${clean(name)}, ${clean(mimeType, 160) || 'application/octet-stream'}, ${bytes.length}, ${bytes}) RETURNING id, folder_id, name, mime_type, size_bytes, created_at, updated_at`;
  return toFile(result.rows[0]);
}

export async function moveLibraryFile(id, folderId) {
  await ensureDashboardRecordsSchema();
  const result = await portalSql`UPDATE dashboard_library_files SET folder_id = ${folderId ? Number(folderId) : null}, updated_at = NOW() WHERE id = ${Number(id)} RETURNING id, folder_id, name, mime_type, size_bytes, created_at, updated_at`;
  if (!result.rows[0]) throw Object.assign(new Error('File not found.'), { code: 'not_found' });
  return toFile(result.rows[0]);
}

export async function renameLibraryFile(id, name) {
  await ensureDashboardRecordsSchema();
  const fileName = clean(name);
  if (!fileName) throw Object.assign(new Error('File name is required.'), { code: 'invalid_name' });
  const result = await portalSql`UPDATE dashboard_library_files SET name = ${fileName}, updated_at = NOW() WHERE id = ${Number(id)} RETURNING id, folder_id, name, mime_type, size_bytes, created_at, updated_at`;
  if (!result.rows[0]) throw Object.assign(new Error('File not found.'), { code: 'not_found' });
  return toFile(result.rows[0]);
}

export async function deleteLibraryFile(id) { await ensureDashboardRecordsSchema(); await portalSql`DELETE FROM dashboard_library_files WHERE id = ${Number(id)}`; }
export async function getLibraryFile(id) { await ensureDashboardRecordsSchema(); const result = await portalSql`SELECT * FROM dashboard_library_files WHERE id = ${Number(id)}`; return result.rows[0] || null; }

function normalizeClientUserId(value) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) throw Object.assign(new Error('Invalid customer id.'), { code: 'invalid_customer_id' });
  return parsed;
}

export async function getCustomerWorkspace(clientUserId) {
  await ensureDashboardRecordsSchema();
  const id = normalizeClientUserId(clientUserId);
  const result = await portalSql`
    SELECT payload, created_at, updated_at
    FROM dashboard_customer_workspaces
    WHERE client_user_id = ${id}
    LIMIT 1
  `;
  const row = result.rows[0];
  return {
    clientUserId: id,
    payload: row?.payload || {},
    createdAt: row?.created_at || null,
    updatedAt: row?.updated_at || null,
  };
}

export async function saveCustomerWorkspace(clientUserId, payload) {
  await ensureDashboardRecordsSchema();
  const id = normalizeClientUserId(clientUserId);
  const body = payload && typeof payload === 'object' && !Array.isArray(payload) ? payload : {};
  const result = await portalSql`
    INSERT INTO dashboard_customer_workspaces (client_user_id, payload)
    VALUES (${id}, ${JSON.stringify(body)}::jsonb)
    ON CONFLICT (client_user_id)
    DO UPDATE SET payload = EXCLUDED.payload, updated_at = NOW()
    RETURNING payload, created_at, updated_at
  `;
  const row = result.rows[0];
  return { clientUserId: id, payload: row.payload || {}, createdAt: row.created_at, updatedAt: row.updated_at };
}

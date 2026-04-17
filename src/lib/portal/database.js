import { createPool, sql as vercelSql } from '@vercel/postgres';

const ENV_KEY_PRIORITY = [
  'POSTGRES_URL',
  'POSTGRES_PRISMA_URL',
  'POSTGRES_URL_NON_POOLING',
  'DATABASE_URL',
];

let cachedSqlTag;

export class PortalDatabaseConfigError extends Error {
  constructor(message = 'Portal database is not configured.') {
    super(message);
    this.name = 'PortalDatabaseConfigError';
    this.code = 'portal_db_not_configured';
  }
}

function readEnvConnectionString() {
  for (const key of ENV_KEY_PRIORITY) {
    const value = process.env[key]?.trim();
    if (value) return { key, value };
  }

  return null;
}

function getSqlTag() {
  if (cachedSqlTag) return cachedSqlTag;

  const connection = readEnvConnectionString();
  if (!connection) {
    throw new PortalDatabaseConfigError(
      "Missing database connection string. Add POSTGRES_URL (recommended) or DATABASE_URL to your environment."
    );
  }

  if (connection.key === 'POSTGRES_URL') {
    cachedSqlTag = vercelSql;
    return cachedSqlTag;
  }

  const pool = createPool({ connectionString: connection.value });
  cachedSqlTag = pool.sql;
  return cachedSqlTag;
}

export function portalSql(strings, ...values) {
  return getSqlTag()(strings, ...values);
}

export function isPortalDatabaseConfigError(error) {
  return (
    error instanceof PortalDatabaseConfigError ||
    error?.code === 'portal_db_not_configured' ||
    error?.code === 'missing_connection_string'
  );
}

export function getPortalDatabaseConfigPublicMessage() {
  return (
    'Portal database is not configured. Add POSTGRES_URL (recommended) or DATABASE_URL to .env.local and restart the server.'
  );
}

import { NextResponse } from 'next/server';
import { requirePortalSession } from '@/lib/portal/auth';
import { ensureCareerApplicationsTable } from '@/lib/careers/applications';
import {
  getPortalDatabaseConfigPublicMessage,
  isPortalDatabaseConfigError,
  portalSql,
} from '@/lib/portal/database';

export const runtime = 'nodejs';

const DEFAULT_LIMIT = 120;
const MAX_LIMIT = 400;

function parseLimit(value) {
  const raw = String(value || '').trim();
  if (!raw) return DEFAULT_LIMIT;
  if (!/^\d+$/.test(raw)) return NaN;

  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed < 1) return NaN;
  return Math.min(parsed, MAX_LIMIT);
}

function toIso(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

function cleanMultilineText(value) {
  return String(value || '').trim();
}

function toPreview(value, maxLength = 170) {
  const normalized = cleanMultilineText(value).replace(/\s+/g, ' ');
  if (!normalized) return 'No fit statement provided.';
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength).trimEnd()}...`;
}

function toApplication(row) {
  return {
    id: Number(row.id),
    fullName: String(row.full_name || ''),
    email: String(row.email || ''),
    roleId: String(row.role_id || ''),
    roleTitle: String(row.role_title || ''),
    location: String(row.location || ''),
    linkedin: String(row.linkedin || '').trim(),
    notes: cleanMultilineText(row.notes),
    notesPreview: toPreview(row.notes),
    resumeName: String(row.resume_name || '').trim(),
    ipAddress: String(row.ip_address || '').trim(),
    submittedAt: toIso(row.submitted_at),
  };
}

function buildSummary(applications) {
  const roleBreakdownMap = new Map();

  for (const application of applications) {
    const roleKey = application.roleId || application.roleTitle || 'unknown';
    const current = roleBreakdownMap.get(roleKey) || {
      roleId: application.roleId || '',
      roleTitle: application.roleTitle || 'Unknown',
      count: 0,
    };

    current.count += 1;
    roleBreakdownMap.set(roleKey, current);
  }

  const roleBreakdown = Array.from(roleBreakdownMap.values()).sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count;
    return a.roleTitle.localeCompare(b.roleTitle);
  });

  return {
    total: applications.length,
    withResume: applications.filter((application) => Boolean(application.resumeName)).length,
    withPortfolioLink: applications.filter((application) => Boolean(application.linkedin)).length,
    latestSubmittedAt: applications[0]?.submittedAt || null,
    roleBreakdown,
  };
}

async function listApplications({ query, limit }) {
  if (!query) {
    const result = await portalSql`
      SELECT
        id,
        full_name,
        email,
        role_id,
        role_title,
        location,
        linkedin,
        notes,
        resume_name,
        ip_address,
        submitted_at
      FROM career_applications
      ORDER BY submitted_at DESC, id DESC
      LIMIT ${limit}
    `;

    return result.rows.map(toApplication);
  }

  const pattern = `%${query}%`;

  const result = await portalSql`
    SELECT
      id,
      full_name,
      email,
      role_id,
      role_title,
      location,
      linkedin,
      notes,
      resume_name,
      ip_address,
      submitted_at
    FROM career_applications
    WHERE (
      full_name ILIKE ${pattern}
      OR email ILIKE ${pattern}
      OR role_id ILIKE ${pattern}
      OR role_title ILIKE ${pattern}
      OR COALESCE(linkedin, '') ILIKE ${pattern}
      OR COALESCE(notes, '') ILIKE ${pattern}
      OR COALESCE(resume_name, '') ILIKE ${pattern}
    )
    ORDER BY submitted_at DESC, id DESC
    LIMIT ${limit}
  `;

  return result.rows.map(toApplication);
}

export async function GET(request) {
  const { error } = await requirePortalSession('admin');
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const query = String(searchParams.get('q') || '').trim().slice(0, 200);
  const limit = parseLimit(searchParams.get('limit'));

  if (Number.isNaN(limit)) {
    return NextResponse.json(
      { error: `limit must be a positive number up to ${MAX_LIMIT}.` },
      { status: 400 }
    );
  }

  try {
    await ensureCareerApplicationsTable();
    const applications = await listApplications({ query, limit });

    return NextResponse.json(
      {
        applications,
        summary: buildSummary(applications),
      },
      { status: 200 }
    );
  } catch (caughtError) {
    if (isPortalDatabaseConfigError(caughtError)) {
      return NextResponse.json(
        {
          error: getPortalDatabaseConfigPublicMessage(),
          code: 'portal_db_not_configured',
        },
        { status: 503 }
      );
    }

    console.error('Failed to list careers applications for admin', caughtError);
    return NextResponse.json(
      { error: 'Unable to load applications right now.' },
      { status: 500 }
    );
  }
}

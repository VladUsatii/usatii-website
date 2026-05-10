import { NextResponse } from 'next/server'
import { portalSql } from '@/lib/portal/database'
import {
  CAREER_ROLE_CATALOG,
  ensureCareerApplicationsTable,
  toTrimmedString,
} from '@/lib/careers/applications'
import { recordTelemetryApiRequest } from '@/lib/portal/telemetry';

function getClientIp(request) {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    const firstHop = forwardedFor.split(',')[0]?.trim()
    if (firstHop) return firstHop
  }

  const realIp = request.headers.get('x-real-ip')
  if (realIp?.trim()) return realIp.trim()

  if (process.env.NODE_ENV === 'development') return '127.0.0.1'

  return null
}

export async function POST(request) {
  const startedAt = Date.now();
  let statusCode = 201;
  let errorMessage = null;
  let body

  try {
    body = await request.json()
  } catch {
    statusCode = 400;
    errorMessage = 'Invalid JSON payload.';
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    )
  }

  const fullName = toTrimmedString(body.fullName, 120)
  const email = toTrimmedString(body.email, 255).toLowerCase()
  const roleId = toTrimmedString(body.roleId, 80)
  const linkedin = toTrimmedString(body.linkedin, 500) || null
  const notes = toTrimmedString(body.notes, 5000) || null
  const resumeName = toTrimmedString(body.resumeName, 255) || null
  const ipAddress = toTrimmedString(getClientIp(request), 64)
  const roleConfig = CAREER_ROLE_CATALOG[roleId]

  if (!fullName || !email || !roleId) {
    statusCode = 400;
    errorMessage = 'Full name, email, and role are required.';
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    )
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    statusCode = 400;
    errorMessage = 'Please enter a valid email.';
    return NextResponse.json({ error: errorMessage }, { status: statusCode })
  }

  if (!roleConfig) {
    statusCode = 400;
    errorMessage = 'Invalid role selection.';
    return NextResponse.json({ error: errorMessage }, { status: statusCode })
  }

  if (!ipAddress) {
    statusCode = 400;
    errorMessage = 'Unable to determine IP address for this request.';
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    )
  }

  try {
    await ensureCareerApplicationsTable()

    await portalSql`
      INSERT INTO career_applications (
        ip_address,
        full_name,
        email,
        role_id,
        role_title,
        location,
        linkedin,
        notes,
        resume_name
      ) VALUES (
        ${ipAddress},
        ${fullName},
        ${email},
        ${roleId},
        ${roleConfig.title},
        ${roleConfig.location},
        ${linkedin},
        ${notes},
        ${resumeName}
      )
    `

    return NextResponse.json({ success: true }, { status: statusCode })
  } catch (error) {
    if (error?.code === '23505') {
      statusCode = 409;
      errorMessage = 'Only one application is allowed per IP address.';
      return NextResponse.json(
        { error: errorMessage },
        { status: statusCode }
      )
    }

    console.error('Failed to store career application', error)

    statusCode = 500;
    errorMessage = 'Unable to store application right now.';
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    )
  } finally {
    await recordTelemetryApiRequest({
      routeKey: '/api/careers',
      method: 'POST',
      statusCode,
      latencyMs: Date.now() - startedAt,
      errorMessage,
    });
  }
}

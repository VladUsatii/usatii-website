import { NextResponse } from 'next/server'
import { portalSql } from '@/lib/portal/database'
import {
  CAREER_ROLE_CATALOG,
  ensureCareerApplicationsTable,
  toTrimmedString,
} from '@/lib/careers/applications'

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
  let body

  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON payload.' },
      { status: 400 }
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
    return NextResponse.json(
      { error: 'Full name, email, and role are required.' },
      { status: 400 }
    )
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email.' }, { status: 400 })
  }

  if (!roleConfig) {
    return NextResponse.json({ error: 'Invalid role selection.' }, { status: 400 })
  }

  if (!ipAddress) {
    return NextResponse.json(
      { error: 'Unable to determine IP address for this request.' },
      { status: 400 }
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

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    if (error?.code === '23505') {
      return NextResponse.json(
        { error: 'Only one application is allowed per IP address.' },
        { status: 409 }
      )
    }

    console.error('Failed to store career application', error)

    return NextResponse.json(
      { error: 'Unable to store application right now.' },
      { status: 500 }
    )
  }
}

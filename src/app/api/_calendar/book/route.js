// src/app/api/calendar/book/route.jsx
import { NextResponse } from 'next/server';
import { getCalendar } from '@/lib/google';
import { v4 as uuid } from 'uuid';
import { DateTime } from 'luxon';

export async function POST(req) {
  const { date, time, duration, details } = await req.json();

  // build start/end
  const tz = process.env.BOOKING_TIMEZONE || 'America/New_York';

  const dateStr = date.split('T')[0];          // strip anything after the first T/Z
  const start   = DateTime.fromISO(`${dateStr}T${time}`, { zone: tz });
  if (!start.isValid) {
    return NextResponse.json({ error: 'Invalid date/time' }, { status: 400 });
  }

  const end   = start.plus({ minutes: duration });
  const startISO = start.toISO();   // 2025‑07‑28T10:00:00‑04:00
  const endISO   = end.toISO();     // 2025‑07‑28T10:30:00‑04:00

  const calendar = await getCalendar();

  // double-check freebusy to prevent double-book
  const fb = await calendar.freebusy.query({
    requestBody: {
      timeMin: startISO,
      timeMax: endISO,
      timeZone: tz,
      items: [{ id: process.env.CALENDAR_ID }]
    }
  });

  const busy = fb.data.calendars[process.env.CALENDAR_ID].busy;
  const clash = busy.some(b =>
    DateTime.fromISO(b.start) < end && DateTime.fromISO(b.end) > start
  );
  if (clash) return NextResponse.json({ error: 'Slot already taken' }, { status: 409 });

  // insert event + Meet link
  const ev = await calendar.events.insert({
    calendarId: process.env.CALENDAR_ID,
    conferenceDataVersion: 1,
    requestBody: {
      summary: `Consultation with ${details.name}`,
      description: details.notes || '',
      start: { dateTime: startISO, timeZone: tz },
      end: { dateTime: endISO, timeZone: tz },
      attendees: [{ email: details.email }],
      conferenceData: {
        createRequest: {
          requestId: uuid(),
          conferenceSolutionKey: { type: 'hangoutsMeet' }
        }
      }
    }
  });

  const entryPoints = ev.data.conferenceData?.entryPoints || [];
  const meetEntry = entryPoints.find(ep => ep.entryPointType === 'video');
  const meetLink = meetEntry ? meetEntry.uri : '';

  // 4. craft a minimal ICS file
  const fmt = (dt) => DateTime.fromISO(dt).toUTC().toFormat("yyyyMMdd'T'HHmmss'Z'");
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//USATII MEDIA//Booking//EN',
    'BEGIN:VEVENT',
    `UID:${ev.data.id}`,
    `DTSTAMP:${fmt(new Date().toISOString())}`,
    `DTSTART:${fmt(startISO)}`,
    `DTEND:${fmt(endISO)}`,
    `SUMMARY:Consultation with ${details.name}`,
    `DESCRIPTION:Join Google Meet: ${meetLink}`,
    `LOCATION:${meetLink}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  return NextResponse.json({ meetLink, ics });
}

import { getCalendar } from '@/lib/google';
import { addMinutes, format } from 'date-fns';
import { DateTime } from 'luxon';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');
  if (!date) return new Response('date required', { status: 400 });

  const tz        = process.env.BOOKING_TIMEZONE || 'UTC';
  const day       = DateTime.fromISO(date, { zone: tz });
  const timeMin   = day.startOf('day').toUTC().toISO();
  const timeMax   = day.endOf('day').toUTC().toISO();

  const calendar  = await getCalendar();
  const busyResp  = await calendar.freebusy.query({
    requestBody: {
      timeMin,                                         
      timeMax,                                         
      timeZone: tz,                                    
      items: [{ id: process.env.CALENDAR_ID }]         
    }
  });

  const busy      = busyResp.data.calendars[process.env.CALENDAR_ID].busy;

  const openings = [];
  const workStart = 9; // 9am local
  const workEnd = 17;  // 5pm local
  let cursor = new Date(`${date}T${String(workStart).padStart(2,'0')}:00:00`);
  while (cursor.getHours() < workEnd) {
    const next = addMinutes(cursor, 30);
    const overlap = busy.some(b => new Date(b.start) < next && new Date(b.end) > cursor);
    if (!overlap) openings.push(format(cursor, 'HH:mm'));
    cursor = next;
  }
  return new Response(JSON.stringify(openings), { status: 200 });
}
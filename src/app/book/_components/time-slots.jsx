'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { addMinutes, format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useBooking } from './booking-context';
import TZNotice from './tz-notice';
import clsx from 'clsx';

export function TimeSlots() {
  const { date, time, setTime } = useBooking();
  const [slots, setSlots] = useState([]);

  /* ──────────────────────────────────────────────────────────────
     1. Fetch server availability whenever the selected *date* changes
  ────────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!date) return;
    (async () => {
      const day = date.toISOString().split('T')[0];
      const res = await fetch(`/api/calendar/availability?date=${day}`);
      if (res.ok) setSlots(await res.json());
    })();
  }, [date]);

  if (!date) return <p>Please select a date first.</p>;

  /* ──────────────────────────────────────────────────────────────
     2. Pre-compute every 30-min slot from 09:00 → 17:00 for UI
  ────────────────────────────────────────────────────────────── */
  const allSlots = useMemo(() => {
    const arr = [];
    let cursor = new Date(date);
    cursor.setHours(9, 0, 0, 0);
    const end = new Date(cursor);
    end.setHours(17, 0, 0, 0);

    while (cursor < end) {
      arr.push(format(cursor, 'HH:mm'));
      cursor = addMinutes(cursor, 30);
    }
    return arr;
  }, [date]);

  /* ──────────────────────────────────────────────────────────────
     3. Two-hour buffer logic
  ────────────────────────────────────────────────────────────── */
  const cutoff = useMemo(() => {
    if (!date) return null;
    const now = new Date();
    // Only enforce the buffer on *today*
    if (date.toDateString() !== now.toDateString()) return null;
    return addMinutes(now, 120); // now + 2 hours
  }, [date]);

  return (
    <div>
      {!slots.length ? (
        /* Skeleton while we fetch availability */
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 animate-pulse">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-10 rounded-md bg-muted" />
          ))}
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-black italic tracking-tight text-center">SELECT TIME ⏰</h2>
          <TZNotice />

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {allSlots.map((slot) => {
              /* Convert slot string ("HH:mm") to a Date on the chosen day */
              const slotDate = new Date(date);
              const [h, m] = slot.split(':').map(Number);
              slotDate.setHours(h, m, 0, 0);

              const tooSoon = cutoff && slotDate <= cutoff;
              const available = slots.includes(slot) && !tooSoon;
              const isSelected = slot === time;

              return (
                <Button
                  key={slot}
                  variant={isSelected ? 'default' : 'outline'}
                  onClick={() => available && setTime(slot)}
                  disabled={!available}
                  aria-disabled={!available}
                  title={
                    !available
                      ? tooSoon
                        ? 'Too soon to book'
                        : 'Already booked'
                      : ''
                  }
                  className={`font-semibold text-lg cursor-pointer ${clsx(!available && 'opacity-50 cursor-not-allowed')}`}
                >
                  {slot}
                </Button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

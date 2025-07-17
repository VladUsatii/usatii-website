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

  // 1. fetch availability whenever date changes
  useEffect(() => {
    if (!date) return;
    (async () => {
      const day = date.toISOString().split('T')[0];
      const res = await fetch(`/api/calendar/availability?date=${day}`);
      if (res.ok) {
        setSlots(await res.json());
      }
    })();
  }, [date]);

  if (!date) {
    return <p>Please select a date first.</p>;
  }

//   if (!slots.length) {
//     return <p className="text-center">Loading available times…</p>;
//   }

  // 2. build every 30‑min slot from 9:00 to 17:00
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

  return (
    <div>
        {!slots.length
        ? <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 animate-pulse">
            {Array.from({ length: 6 }).map((_,i) => (
                <div key={i} className="h-10 rounded-md bg-muted" />
            ))}
            </div>
        :
        <div>
      <h2 className="text-xl font-semibold mb-4 text-center">Select a Time</h2>
      <TZNotice />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {allSlots.map((slot) => {
          const available = slots.includes(slot);
          const isSelected = slot === time;

          return (
            <Button
                key={slot}
                variant={isSelected ? 'default' : 'outline'}
                onClick={() => available && setTime(slot)}
                disabled={!available}
                aria-disabled={!available}
                title={available ? '' : 'Already booked'}
                className={clsx(!available && 'opacity-50 cursor-not-allowed')}
            >{slot}</Button>
          );
        })}
      </div>
      </div>
       }
    </div>
  );
}

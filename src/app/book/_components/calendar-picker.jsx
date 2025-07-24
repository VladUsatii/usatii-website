'use client';
import React from 'react';
import { Calendar } from '@/components/ui/calendar'; // shadcn + react-day-picker
import { useBooking } from './booking-context';

export function CalendarPicker() {
    const { date, setDate, setTime } = useBooking();
  
    // “today” at 00:00 in the browser
    const today = React.useMemo(() => {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      return d;
    }, []);               // compute once per mount, but in the client
  
    return (
      <div className="flex flex-col items-center">
        <h2 className="text-xl font-black tracking-tight italic">CHOOSE DATE 📆</h2>
        <p className='text-sm text-neutral-500 mb-4'>Pick a day to consult with me and my team.</p>
        <Calendar
          mode="single"
          selected={date}
          onSelect={(d) => { setDate(d); setTime(null); }}
          disabled={{ before: today }}
          className="rounded-lg border w-full"
        />
      </div>
    );
  }
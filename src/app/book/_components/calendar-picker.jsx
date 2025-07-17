'use client';
import React from 'react';
import { Calendar } from '@/components/ui/calendar'; // shadcn + react-day-picker
import { useBooking } from './booking-context';

export function CalendarPicker() {
  const { date, setDate, setTime } = useBooking();
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-black mb-4 tracking-tight italic">CHOOSE DATE</h2>
      <Calendar
        mode="single"
        selected={date}
        onSelect={(d) => { setDate(d); setTime(null); }}   // reset time if day changes
        disabled={{ before: new Date().setHours(0,0,0,0) }}  // ⟵ key line
        className="rounded-lg border w-full"
      />
    </div>
  );
}
'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, CheckCircle } from 'lucide-react';
import { useBooking } from './booking-context';

export function ReviewConfirm() {
  const { date, time, duration, details, price, setStep } = useBooking();
  const [loading, setLoading] = useState(false);
  const [icsUrl, setIcsUrl] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleBook = async () => {
    setLoading(true);
    // const payload = { date, time, duration, details };
    const payload = {
        date: date.toISOString().split('T')[0],   // "2025‑07‑28"
        time, duration, details
    };
    const res = await fetch('/api/calendar/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    setLoading(false);
    if (res.ok) {
        const { ics } = await res.json();
        const url = URL.createObjectURL(
          new Blob([ics], { type: 'text/calendar;charset=utf-8' })
        );
        setIcsUrl(url);      // store in state
        setSuccess(true);
    } else {
        alert("Something went wrong. Try again later.");
    }
  };

  if (success) return (
    <div className="text-center py-12 space-y-4">
      <Check className="mx-auto h-12 w-12 text-green-600" />
      <h2 className="text-2xl font-black italic tracking-tight">BOOKED!</h2>
      <p className='text-sm font-semibold'>You will receive a confirmation email shortly.</p>
      {icsUrl && (
        <a href={icsUrl}
            download={`booking-${date.toISOString().slice(0,10)}.ics`}
            className="text-sm underline text-purple-600 hover:text-purple-800"
        >Add to Calendar</a>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-black tracking-tight italic text-center ">REVIEW YOUR BOOKING</h2>
      <ul className="space-y-3 text-sm border-[2px] border-neutral-200 p-2 rounded-md divide-y divide-neutral-200 ">
        <li className='pb-2'><strong>Date:</strong> {date.toLocaleDateString()}</li>
        <li className='pb-2'><strong>Time:</strong> {time}</li>
        <li className='pb-2'><strong>Duration:</strong> {duration} minutes</li>
        <li className='pb-2'><strong>Name:</strong> {details.name}</li>
        <li className='pb-2'><strong>Email:</strong> {details.email}</li>
        <li><strong>Total:</strong> {price} will be billed after the call, adjusted for actual call minutes.</li>
      </ul>
      <Button className="w-full cursor-pointer h-16 bg-white text-purple-500 font-bold border-[2px] border-purple-500 hover:shadow-sm hover:shadow-purple-500/30 hover:bg-white" onClick={handleBook} disabled={loading}>{loading ? 'Booking…' : 'Confirm & Pay Later'}</Button>
    </div>
  );
}
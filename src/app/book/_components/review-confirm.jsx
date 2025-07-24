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
    <div className="">
      <h2 className="text-xl font-black tracking-tight italic text-center ">REVIEW YOUR BOOKING</h2>
      <p className='text-sm text-neutral-500 text-center mb-4'>{price} will be billed after the call unless waived by Vlad in writing.</p>
      <ul className="space-y-3 mb-4 text-sm border-[2px] border-neutral-200 p-2 rounded-md divide-y divide-neutral-200 ">
        <li className='pb-2'><strong>Date:</strong> {date.toLocaleDateString()}</li>
        <li className='pb-2'><strong>Time:</strong> {time}</li>
        <li className='pb-2'><strong>Duration:</strong> {duration} minutes</li>
        <li className='pb-2'><strong>Name:</strong> {details.name}</li>
        <li className='pb-2'><strong>Email:</strong> {details.email}</li>
        <li className="flex items-center gap-2 text-lg pb-1">
            <strong>Total:</strong>

            {/* original price, slashed */}
            <span className="line-through text-neutral-500">{price}</span>

            {/* new price = $0, loud and proud */}
            <span className="text-green-600 font-black text-xl">$0</span>

            {/* eye‑catching badge */}
            <span className="bg-green-100 text-green-700 text-[11px] font-semibold px-2 py-0.5 rounded uppercase tracking-wide">
            Free&nbsp;with Retainer
            </span>
        </li>
        </ul>
      <Button
  className="w-full tracking-tight italic cursor-pointer h-16 bg-white text-purple-500 font-black border-[2px] border-purple-500 hover:shadow-sm hover:shadow-purple-500/30 hover:bg-white animate-[breathe_2.5s_ease-in-out_infinite] [@keyframes_breathe]{0%,100%{transform:scale(1);opacity:1;}50%{transform:scale(1.03);opacity:0.85;}}"
  onClick={handleBook}
  disabled={loading}
>
  {loading ? 'BOOKING...' : 'CONFIRM'}
</Button>    </div>
  );
}
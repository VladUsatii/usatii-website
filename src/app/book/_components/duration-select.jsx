'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { useBooking } from './booking-context';

const options = [15, 30, 45, 60];

export function DurationSelect() {
  const { duration, setDuration, price } = useBooking();

  return (
    <div className="max-w-md mx-auto text-center space-y-4">
      <h2 className="text-xl font-black tracking-tight italic">SELECT CALL LENGTH</h2>
      <div className="flex flex-wrap justify-center gap-3">
        {options.map((o) => (
          <Button
            key={o}
            variant={o === duration ? 'default' : 'outline'}
            onClick={() => setDuration(o)}
            aria-pressed={o === duration}
          >
            {o} min
          </Button>
        ))}
      </div>
      <p className="text-md font-semibold pt-2">
        Estimated charge: <span className="text-purple-600">{price}</span>
      </p>
      <p className="text-sm text-gray-500">
        You will only be billed for the actual time allotted, rounded up to the nearest minute. If your call ends ±5 minutes from your scheduled end time, you will be billed the full rate.
      </p>
    </div>
  );
}

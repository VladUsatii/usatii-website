'use client';
import React from 'react';
import { Input } from '@/components/ui/input';
import { useBooking } from './booking-context';

export function DetailsForm() {
  const { details, setDetails } = useBooking();

  const handleChange = (e) => setDetails({ ...details, [e.target.name]: e.target.value });

  return (
    <form className="space-y-3 max-w-sm mx-auto">
        <div>
        <h2 className='font-black tracking-tight text-lg italic'>ENTER DETAILS</h2>
        <p className='text-sm'>We will send a personalized invite to your email within the next minute.</p>
        </div>
      <Input required name="name" placeholder="Your name" value={details.name} onChange={handleChange} />
      <Input required name="email" type="email" placeholder="Email for confirmation" value={details.email} onChange={handleChange} />
    </form>
  );
}

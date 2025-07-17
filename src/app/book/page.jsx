'use client';
import React from 'react';
import { BookingProvider } from './_components/booking-context';
import BookingShell from './_components/booking-shell';
import Link from 'next/link';

export default function BookPage() {
  return (
    <div className="max-w-[800px] w-full mx-auto px-8 py-12">
      {/* Brand */}
      <Link href="/">
        <h1 className="font-black text-center text-md text-indigo-600 hover:text-indigo-800 transition-colors">
          USATII MEDIA
        </h1>
      </Link>
    <BookingProvider>
      <BookingShell />
    </BookingProvider>

    <p className='text-xs text-center text-neutral-500 mt-10'>Built by USATII OS.</p>
    </div>
  );
}
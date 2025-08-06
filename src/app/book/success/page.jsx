'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  CalendarClock,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

/**
 * Booking Success: light‑mode variant to match Usatii.com's clean white aesthetic.
 */
export default function BookingSuccess() {
  const params = useSearchParams();
  const fullName = params.get('name') || 'guest';
  const email = params.get('email');
  const firstName = fullName.split(' ')[0];

  return (
    <div className="py-10 relative min-h-screen w-full bg-white text-neutral-800">
      {/* brand nav */}
      <Link href="/">
        <h1 className="font-black text-center text-md text-indigo-600 hover:text-indigo-800 transition-colors">
          USATII MEDIA
        </h1>
      </Link>

      {/* animated card */}
      <main className="flex w-full grow items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full max-w-xl"
        >
          <Card className="border border-neutral-200 bg-white shadow-xl md:rounded-3xl">
            <CardHeader className="flex flex-col items-center gap-4 pb-0 pt-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 160, damping: 12, delay: 0.1 }}
              >
                <CheckCircle className="h-16 w-16 text-green-500 md:h-20 md:w-20" />
              </motion.div>
              <CardTitle className="text-center tracking-tight text-3xl font-bold md:text-4xl">
                Booking confirmed,{' '}
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {firstName}
                </span>
                !
              </CardTitle>
            </CardHeader>

            <CardContent className="px-8 pb-8 pt-6 md:px-12 md:pt-8">
              {email && (
                <p className="text-center text-lg leading-relaxed text-neutral-700">
                  A calendar invite and Google&nbsp;Meet link are on their way to{' '}
                  <span className="font-medium text-neutral-900">{email}</span>.
                </p>
              )}

              <p className="text-center tracking-tight text-sm text-neutral-500 md:text-base">
                {/* Let's go over some basics on how to plan for the meeting. */}
                
              </p>
            </CardContent>

            <CardFooter className="flex flex-col items-center gap-3 pb-10 md:flex-row md:justify-center md:gap-5">
              <Button asChild size="lg" variant="secondary" className="w-full md:w-auto">
                <a href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to home
                </a>
              </Button>

              <Button asChild size="lg" className="cursor-pointer w-full md:w-auto">
                <a>
                  <CalendarClock className="mr-2 h-4 w-4" /> View details
                </a>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}

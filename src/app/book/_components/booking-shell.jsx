'use client';
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import clsx from 'clsx';
import { useBooking } from './booking-context';
import { CalendarPicker } from './calendar-picker';
import { TimeSlots } from './time-slots';
import { DurationSelect } from './duration-select';
import { DetailsForm } from './details-form';
import { ReviewConfirm } from './review-confirm';

export default function BookingShell() {
  const { step, setStep, date, time, details } = useBooking();
  const ready = [
    !!date,
    !!time,
    true,
    details.name && details.email,
    true
  ];
  const steps = [
    { label: 'Pick a date' },
    { label: 'Pick a time' },
    { label: 'Call length' },
    { label: 'Your details' },
    { label: 'Review & pay' }
  ];

  return (
    <div className="mx-auto max-w-3xl p-4 sm:p-8">
      {/* Stepper */}
      <ol className="flex justify-between mb-8 text-sm font-medium text-muted-foreground">
        {steps.map((s, i) => (
          <li key={i} className="flex-1 flex flex-col items-center">
            <span className={clsx('w-8 h-8 rounded-full flex items-center justify-center mb-1',
              i === step ? 'bg-purple-500 text-white' : 'bg-muted text-muted-foreground')}>{i + 1}</span>
            {s.label}
          </li>
        ))}
      </ol>

      <Card className="shadow-xl">
        <CardContent className="p-6 space-y-6">
          {step === 0 && <CalendarPicker />}
          {step === 1 && <TimeSlots />}
          {step === 2 && <DurationSelect />}
          {step === 3 && <DetailsForm />}
          {step === 4 && <ReviewConfirm />}

          {/* Navigation buttons */}
          <div className="flex justify-between pt-4">
            <Button className="cursor-pointer" variant="ghost" disabled={step === 0} onClick={() => setStep(step - 1)}>
              <ChevronLeft className="mr-1 h-4 w-4" /> Back
            </Button>
            {step < 4 && (
              <Button  className="cursor-pointer" onClick={() => setStep(step + 1)} disabled={!ready[step]}>
                Next <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
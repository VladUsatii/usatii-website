'use client';
import React, { createContext, useContext, useState, useMemo } from 'react';

const BookingContext = createContext(null);
export function useBooking() { return useContext(BookingContext); }

export function BookingProvider({ children }) {
  const [step, setStep] = useState(0);            // 0‑4
  const [date, setDate] = useState(null);         // JS Date (local)
  const [time, setTime] = useState(null);         // string "HH:MM"
  const [duration, setDuration] = useState(30);   // minutes
  const [details, setDetails] = useState({ name: '', email: '' });
  const rate = parseFloat(250);

  const price = useMemo(() => {
    const raw = (duration / 60) * rate;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(raw);
  }, [duration, rate]);
  
  const value = { step, setStep, date, setDate, time, setTime, duration, setDuration, details, setDetails, price };
  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}
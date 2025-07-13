// app/_components/metric.jsx
'use client';

import { useEffect, useState } from 'react';
import { BarChart3 } from 'lucide-react';
import { animate } from 'framer-motion';

export default function Metric({ label, value, unit }) {
  // this state will hold the formatted string we show
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    // animate a number from 0 → value over 1.2s
    const controls = animate(0, value, {
      duration: 1.2,
      ease: 'easeOut',
      onUpdate(latest) {
        // round or 2-dec place, then format with commas, etc.
        const raw = unit === '$' 
          ? latest.toFixed(2) 
          : Math.round(latest);
        setDisplay(Intl.NumberFormat().format(raw));
      }
    });
    // clean up if the component unmounts mid-animation
    return () => controls.stop();
  }, [value, unit]);

  return (
    <div className="rounded-2xl bg-white/5 p-6 text-center ring-1 ring-white/10 backdrop-blur-md">
      <BarChart3 className="mx-auto mb-3 h-7 w-7 text-fuchsia-300" />
      <p className="text-3xl font-bold tracking-tight">
        {display}
        {unit && <span className="ml-1 text-lg font-semibold">{unit}</span>}
      </p>
      <p className="mt-1 text-sm text-neutral-300">{label}</p>
    </div>
  );
}

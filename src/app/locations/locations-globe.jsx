"use client";

import Image from "next/image";
import { useState } from "react";

const locations = [
  {
    id: "north-dakota",
    name: "North Dakota",
    label: "Northern presence",
    description: "Operator perspective and long-term company roots.",
    left: "44%",
    top: "14.65%",
    side: "left",
  },
  {
    id: "new-york",
    name: "New York",
    label: "Client delivery",
    description: "Product development and operating partnerships.",
    left: "57.48%",
    top: "17.33%",
    side: "right",
  },
];

export default function LocationsGlobe() {
  const [activeLocation, setActiveLocation] = useState(null);

  return (
    <div className="relative mt-7 w-full flex-1 min-h-[390px] sm:mt-5 sm:min-h-[470px]">
      <div className="absolute left-1/2 top-1/2 aspect-square w-[min(72vh,680px,92vw)] -translate-x-1/2 -translate-y-1/2">
        <Image
          src="/locations/globe_ny_nd.svg"
          alt="Wireframe globe marking USATII locations in North Dakota and New York"
          fill
          priority
          className="select-none object-contain"
          sizes="(max-width: 768px) 92vw, 680px"
        />

        {locations.map((location) => {
          const isActive = activeLocation === location.id;
          return (
            <div
              key={location.id}
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
              style={{ left: location.left, top: location.top }}
            >
              <button
                type="button"
                aria-label={`View ${location.name} location details`}
                aria-expanded={isActive}
                aria-describedby={isActive ? `${location.id}-tooltip` : undefined}
                onMouseEnter={() => setActiveLocation(location.id)}
                onMouseLeave={() => setActiveLocation(null)}
                onFocus={() => setActiveLocation(location.id)}
                onBlur={() => setActiveLocation(null)}
                onClick={() => setActiveLocation(location.id)}
                className="group flex h-8 w-8 items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-4"
              >
                <span className="h-2.5 w-2.5 rounded-full bg-neutral-950 ring-4 ring-white/80 transition-transform duration-200 group-hover:scale-125" />
              </button>

              <div
                id={`${location.id}-tooltip`}
                role="tooltip"
                aria-hidden={!isActive}
                className={[
                  "pointer-events-none absolute left-1/2 top-10 w-52 -translate-x-1/2 rounded-sm border border-neutral-200 bg-white/95 p-4 text-left shadow-[0_14px_40px_rgba(0,0,0,0.08)] backdrop-blur-sm transition duration-200 sm:left-auto sm:top-1/2 sm:-translate-x-0 sm:-translate-y-1/2",
                  location.side === "left" ? "sm:right-10" : "sm:left-10",
                  isActive ? "opacity-100" : "translate-y-1 opacity-0 sm:translate-y-0",
                ].join(" ")}
              >
                <p className="text-[10px] font-medium tracking-[0.08em] text-neutral-400 uppercase">
                  {location.label}
                </p>
                <p className="mt-1.5 text-sm font-medium text-neutral-950">{location.name}</p>
                <p className="mt-2 text-xs leading-5 text-neutral-600">{location.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

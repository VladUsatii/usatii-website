"use client";

import { useMemo, useRef, useState } from "react";
import { geoDistance, geoGraticule10, geoOrthographic, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import world from "world-atlas/countries-110m.json";

const locations = [
  {
    id: "north-dakota",
    name: "North Dakota",
    kind: "Founded here",
    description: "Where USATII was founded and where we serve our Midwestern clients.",
    coordinates: [-100.5, 47.5],
    primary: true,
  },
  {
    id: "new-york",
    name: "New York",
    kind: "International office",
    description: "Where we help our international clients and government agencies.",
    coordinates: [-75, 43],
    primary: true,
  },
  {
    id: "sacramento",
    name: "Sacramento",
    kind: "Client location",
    description: "Where we have helped a client.",
    coordinates: [-121.4944, 38.5816],
  },
  {
    id: "orlando",
    name: "Orlando",
    kind: "Client location",
    description: "Where we have helped a client.",
    coordinates: [-81.3792, 28.5383],
  },
  {
    id: "jakarta",
    name: "Jakarta",
    kind: "Client location",
    description: "Where we have helped a client.",
    coordinates: [106.8456, -6.2088],
  },
  {
    id: "texas",
    name: "Texas",
    kind: "Client location",
    description: "Where we have helped a client.",
    coordinates: [-97.7431, 30.2672],
  },
  {
    id: "canada",
    name: "Canada",
    kind: "Client location",
    description: "Where we have helped a client.",
    coordinates: [-106.3468, 56.1304],
  },
  {
    id: "puerto-rico",
    name: "Puerto Rico",
    kind: "Client location",
    description: "Where we have helped a client.",
    coordinates: [-66.5901, 18.2208],
  },
  {
    id: "london",
    name: "London",
    kind: "Client location",
    description: "Where we have helped a client.",
    coordinates: [-0.1276, 51.5072],
  },
  {
    id: "miami",
    name: "Miami",
    kind: "Client location",
    description: "Where we have helped a client.",
    coordinates: [-80.1918, 25.7617],
  },
  {
    id: "singapore",
    name: "Singapore",
    kind: "Client location",
    description: "Where we have helped a client.",
    coordinates: [103.8198, 1.3521],
  },
  {
    id: "india",
    name: "India",
    kind: "Client location",
    description: "Where we have helped a client.",
    coordinates: [78.9629, 20.5937],
  },
  {
    id: "paris",
    name: "Paris",
    kind: "Client location",
    description: "Where we have helped a client.",
    coordinates: [2.3522, 48.8566],
  },
  {
    id: "new-orleans",
    name: "New Orleans",
    kind: "Client location",
    description: "Where we have helped a client.",
    coordinates: [-90.0715, 29.9511],
  },
  {
    id: "chicago",
    name: "Chicago",
    kind: "Client location",
    description: "Where we have helped a client.",
    coordinates: [-87.6298, 41.8781],
  },
  {
    id: "australia",
    name: "Australia",
    kind: "Client location",
    description: "Where we have helped a client.",
    coordinates: [133.7751, -25.2744],
  },
];

const countries = feature(world, world.objects.countries);
const graticule = geoGraticule10();
const INITIAL_ROTATION = [90, -24, 0];

export default function LocationsGlobe() {
  const [rotation, setRotation] = useState(INITIAL_ROTATION);
  const [activeLocation, setActiveLocation] = useState(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const drag = useRef(null);

  const projection = useMemo(
    () =>
      geoOrthographic()
        .translate([300, 300])
        .scale(282)
        .clipAngle(90)
        .precision(0.25)
        .rotate(rotation),
    [rotation],
  );
  const path = useMemo(() => geoPath(projection), [projection]);
  const visibleLocations = useMemo(() => {
    const center = [-rotation[0], -rotation[1]];
    return locations
      .filter((location) => geoDistance(location.coordinates, center) < Math.PI / 2)
      .map((location) => ({ ...location, point: projection(location.coordinates) }));
  }, [projection, rotation]);
  const activeVisibleLocation = visibleLocations.find((location) => location.id === activeLocation);
  const activeCallout = useMemo(() => {
    if (!activeVisibleLocation) return null;
    const [x, y] = activeVisibleLocation.point;
    return {
      location: activeVisibleLocation,
      card: [
        Math.max(155, Math.min(445, x + (x < 300 ? -128 : 128))),
        Math.max(125, Math.min(475, y + (y < 300 ? -72 : 72))),
      ],
    };
  }, [activeVisibleLocation]);

  const rotateBy = (deltaLongitude, deltaLatitude) => {
    setHasInteracted(true);
    setRotation(([longitude, latitude]) => [
      longitude + deltaLongitude,
      Math.max(-75, Math.min(75, latitude + deltaLatitude)),
      0,
    ]);
    setActiveLocation(null);
  };

  const handlePointerDown = (event) => {
    setHasInteracted(true);
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { x: event.clientX, y: event.clientY, rotation };
  };

  const handlePointerMove = (event) => {
    if (!drag.current) return;
    const dx = event.clientX - drag.current.x;
    const dy = event.clientY - drag.current.y;
    setRotation([
      drag.current.rotation[0] + dx * 0.35,
      Math.max(-75, Math.min(75, drag.current.rotation[1] - dy * 0.35)),
      0,
    ]);
    setActiveLocation(null);
  };

  const handlePointerUp = (event) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    drag.current = null;
  };

  return (
    <div className="relative mt-5 w-full flex-1 min-h-[410px] sm:min-h-[500px]">
      <div
        className="absolute left-1/2 top-1/2 aspect-square w-[min(72vh,680px,92vw)] -translate-x-1/2 -translate-y-1/2 touch-none select-none cursor-grab rounded-full outline-none active:cursor-grabbing focus-visible:ring-1 focus-visible:ring-neutral-300 focus-visible:ring-offset-4"
        role="application"
        tabIndex={0}
        aria-label="Interactive globe showing USATII operating and client locations. Drag to rotate. Use arrow keys when focused."
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onKeyDown={(event) => {
          if (event.key.startsWith("Arrow")) event.preventDefault();
          if (event.key === "ArrowLeft") rotateBy(-8, 0);
          if (event.key === "ArrowRight") rotateBy(8, 0);
          if (event.key === "ArrowUp") rotateBy(0, 8);
          if (event.key === "ArrowDown") rotateBy(0, -8);
        }}
      >
        <svg viewBox="0 0 600 600" className="h-full w-full overflow-visible" aria-hidden="true">
          <defs>
            <path id="globe-instruction-arc" d="M 120 60 A 300 300 0 0 1 480 60" />
          </defs>
          <circle cx="300" cy="300" r="282" fill="#fff" stroke="#171717" strokeWidth="1.1" />
          <path d={path(graticule)} fill="none" stroke="#171717" strokeWidth="0.55" opacity="0.2" />
          <path
            d={path(countries)}
            fill="#fafafa"
            stroke="#171717"
            strokeWidth="0.7"
            strokeLinejoin="round"
            opacity="0.78"
          />
          <circle cx="300" cy="300" r="282" fill="none" stroke="#171717" strokeWidth="1.2" />
          <text
            className="transition-opacity duration-300"
            fill="#737373"
            fontSize="10"
            fontWeight="500"
            letterSpacing="1.7"
            stroke="#fff"
            strokeWidth="3"
            paintOrder="stroke"
            opacity={hasInteracted ? 0 : 1}
          >
            <textPath href="#globe-instruction-arc" startOffset="50%" textAnchor="middle">
              DRAG TO ROTATE • HOVER OR FOCUS A LOCATION
            </textPath>
          </text>
        </svg>

        {visibleLocations.map((location) => {
          const [x, y] = location.point;
          const isActive = activeLocation === location.id;
          return (
            <div
              key={location.id}
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${((x / 600) * 100).toFixed(4)}%`,
                top: `${((y / 600) * 100).toFixed(4)}%`,
              }}
            >
              <button
                type="button"
                aria-label={`View ${location.name} details`}
                aria-expanded={isActive}
                aria-describedby={isActive ? `${location.id}-tooltip` : undefined}
                onPointerDown={(event) => event.stopPropagation()}
                onMouseEnter={() => {
                  setHasInteracted(true);
                  setActiveLocation(location.id);
                }}
                onMouseLeave={() => setActiveLocation(null)}
                onFocus={() => {
                  setHasInteracted(true);
                  setActiveLocation(location.id);
                }}
                onBlur={() => setActiveLocation(null)}
                onClick={() => setActiveLocation(location.id)}
                className="group flex h-8 w-8 cursor-pointer items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-4"
              >
                <span
                  className={[
                    "relative flex items-center justify-center rounded-full ring-4 ring-white/90 transition-transform duration-200 group-hover:scale-125",
                    location.primary ? "h-3 w-3 bg-[#6d4dff]" : "h-2.5 w-2.5 bg-[#c4b5fd]",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "absolute inset-0 rounded-full motion-safe:animate-ping",
                      location.primary ? "bg-[#6d4dff]/45" : "bg-[#c4b5fd]/45",
                    ].join(" ")}
                  />
                </span>
              </button>
            </div>
          );
        })}

        {activeCallout ? (
          <div
            id={`${activeCallout.location.id}-tooltip`}
            role="tooltip"
            className="pointer-events-none absolute z-20 w-44 -translate-x-1/2 -translate-y-1/2 scale-100 rounded-sm border border-[#c4b5fd] bg-white/96 p-4 text-left shadow-[0_16px_42px_rgba(76,29,149,0.12)] backdrop-blur-sm transition duration-150 sm:w-52"
            style={{
              left: `${((activeCallout.card[0] / 600) * 100).toFixed(4)}%`,
              top: `${((activeCallout.card[1] / 600) * 100).toFixed(4)}%`,
            }}
          >
            <LocationCalloutContent location={activeCallout.location} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function LocationCalloutContent({ location }) {
  return (
    <>
      <p className="text-sm font-medium text-neutral-950">{location.name}</p>
      <p className="mt-2 text-xs leading-5 text-neutral-600">{location.description}</p>
    </>
  );
}

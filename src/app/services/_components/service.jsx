"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  SERVICE_SLUGS,
  SERVICES,
  buildServicePath,
} from "@/lib/services-seo";

const SERVICE_TONES = [
  "from-purple-500 to-violet-300",
  "from-fuchsia-500 to-purple-300",
  "from-violet-500 to-indigo-300",
  "from-purple-400 to-neutral-200",
  "from-indigo-500 to-purple-200",
  "from-fuchsia-400 to-violet-200",
  "from-neutral-900 to-purple-300",
];

const ORBIT_CONFIG = [
  { rotateX: 72, rotateY: 0, rotateZ: 0, width: 500, height: 500 },
  { rotateX: 68, rotateY: 54, rotateZ: -18, width: 560, height: 360 },
  { rotateX: 75, rotateY: -46, rotateZ: 24, width: 560, height: 360 },
];

export default function ServicesJourney() {
  const prefersReducedMotion = useReducedMotion();
  const [activeSlug, setActiveSlug] = useState(SERVICE_SLUGS[0]);
  const [isDragging, setIsDragging] = useState(false);

  const rotateX = useMotionValue(-16);
  const rotateY = useMotionValue(0);

  const smoothRotateX = useSpring(rotateX, {
    stiffness: 100,
    damping: 20,
    mass: 0.6,
  });

  const smoothRotateY = useSpring(rotateY, {
    stiffness: 100,
    damping: 20,
    mass: 0.6,
  });

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const gridX = useTransform(pointerX, [-1, 1], [-16, 16]);
  const gridY = useTransform(pointerY, [-1, 1], [-16, 16]);
  const glowX = useTransform(pointerX, [-1, 1], ["42%", "58%"]);
  const glowY = useTransform(pointerY, [-1, 1], ["38%", "54%"]);

  const services = useMemo(
    () =>
      SERVICE_SLUGS.map((slug, index) => {
        const service = SERVICES[slug];

        return {
          slug,
          index,
          name: service.name,
          promise: service.heroPromise,
          whoFor: service.whoFor,
          deliverables: service.deliverables,
          href: buildServicePath(slug),
          tone: SERVICE_TONES[index % SERVICE_TONES.length],
        };
      }),
    [],
  );

  const activeService =
    services.find((service) => service.slug === activeSlug) ?? services[0];

  useAnimationFrame((_, delta) => {
    if (prefersReducedMotion || isDragging) return;

    rotateY.set(rotateY.get() + delta * 0.005);
    rotateX.set(-16 + Math.sin(Date.now() / 2400) * 3);
  });

  function handlePointerMove(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    pointerX.set((x - 0.5) * 2);
    pointerY.set((y - 0.5) * 2);
  }

  return (
    <main
      onPointerMove={handlePointerMove}
      className="relative min-h-[calc(100svh-76px)] overflow-hidden bg-white text-neutral-950"
    >
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.55]"
        style={{ x: gridX, y: gridY }}
      >
        <div className="absolute inset-[-80px] bg-[linear-gradient(to_right,rgba(20,20,20,0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(20,20,20,0.055)_1px,transparent_1px)] bg-[size:54px_54px]" />
      </motion.div>

      <motion.div
        aria-hidden="true"
        className="absolute h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-200/35 blur-3xl"
        style={{ left: glowX, top: glowY }}
      />

      <section className="relative z-10 grid min-h-[calc(100svh-76px)] grid-rows-[auto_1fr_auto] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-purple-700">
              USATII Services
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-[-0.055em] text-neutral-950 sm:text-5xl">
              Services, orbiting one system.
            </h1>
          </div>

          <Link
            href={activeService.href}
            className="hidden rounded-full bg-neutral-950 px-5 py-3 text-sm font-black text-white shadow-[0_14px_40px_-22px_rgba(0,0,0,0.85)] transition hover:bg-purple-700 sm:inline-flex"
          >
            View selected
          </Link>
        </div>

        <div className="mx-auto grid w-full max-w-7xl items-center gap-8 lg:grid-cols-[0.76fr_1.24fr_0.76fr]">
          <ServiceReadout service={activeService} side="left" />

          <div className="relative grid min-h-[520px] place-items-center">
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.13),transparent_64%)]" />

            <motion.div
              className="relative h-[34rem] w-[34rem] cursor-grab active:cursor-grabbing"
              drag
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              dragElastic={0.08}
              dragMomentum={false}
              onDragStart={() => setIsDragging(true)}
              onDrag={(_, info) => {
                rotateY.set(rotateY.get() + info.delta.x * 0.7);
                rotateX.set(rotateX.get() - info.delta.y * 0.45);
              }}
              onDragEnd={() => setIsDragging(false)}
              style={{
                perspective: 1200,
                transformStyle: "preserve-3d",
              }}
            >
              <motion.div
                className="absolute inset-0"
                style={{
                  rotateX: smoothRotateX,
                  rotateY: smoothRotateY,
                  transformStyle: "preserve-3d",
                }}
              >
                {ORBIT_CONFIG.map((orbit, index) => (
                  <div
                    key={index}
                    className="absolute left-1/2 top-1/2 rounded-full border border-neutral-300/70"
                    style={{
                      width: orbit.width,
                      height: orbit.height,
                      marginLeft: -orbit.width / 2,
                      marginTop: -orbit.height / 2,
                      transform: `rotateX(${orbit.rotateX}deg) rotateY(${orbit.rotateY}deg) rotateZ(${orbit.rotateZ}deg)`,
                      transformStyle: "preserve-3d",
                    }}
                  />
                ))}

                <motion.div
                  className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neutral-950 shadow-[0_0_80px_rgba(126,34,206,0.32)]"
                  animate={
                    prefersReducedMotion
                      ? undefined
                      : {
                          scale: [1, 1.045, 1],
                          boxShadow: [
                            "0 0 70px rgba(126,34,206,0.25)",
                            "0 0 110px rgba(126,34,206,0.38)",
                            "0 0 70px rgba(126,34,206,0.25)",
                          ],
                        }
                  }
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <div className="grid h-full w-full place-items-center rounded-full bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.32),transparent_28%),linear-gradient(135deg,#111,#2e1065)] text-xs font-black uppercase tracking-[0.24em] text-white">
                    USATII
                  </div>
                </motion.div>

                {services.map((service) => (
                  <Particle
                    key={service.slug}
                    service={service}
                    total={services.length}
                    active={service.slug === activeSlug}
                    onActivate={() => setActiveSlug(service.slug)}
                    prefersReducedMotion={prefersReducedMotion}
                  />
                ))}
              </motion.div>
            </motion.div>

            <p className="absolute bottom-3 left-1/2 w-full max-w-sm -translate-x-1/2 text-center text-xs font-semibold uppercase tracking-[0.22em] text-neutral-400">
              Drag the system / hover a particle / click to enter
            </p>
          </div>

          <ServiceReadout service={activeService} side="right" />
        </div>

        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 border-t border-neutral-200/80 pt-5 sm:flex-row">
          <p className="max-w-2xl text-sm leading-6 text-neutral-500">
            A compact service map for content, websites, advertising,
            automation, and analytics — presented as one connected operating
            system.
          </p>

          <div className="flex flex-wrap justify-center gap-2 sm:justify-end">
            {services.map((service) => (
              <button
                key={service.slug}
                type="button"
                onMouseEnter={() => setActiveSlug(service.slug)}
                onFocus={() => setActiveSlug(service.slug)}
                onClick={() => setActiveSlug(service.slug)}
                className={`rounded-full px-3 py-1.5 text-xs font-black transition ${
                  service.slug === activeSlug
                    ? "bg-neutral-950 text-white"
                    : "bg-neutral-100 text-neutral-500 hover:bg-purple-50 hover:text-purple-800"
                }`}
              >
                {String(service.index + 1).padStart(2, "0")}
              </button>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function Particle({
  service,
  total,
  active,
  onActivate,
  prefersReducedMotion,
}) {
  const angle = (360 / total) * service.index;
  const ringTilt = service.index % 3 === 0 ? 0 : service.index % 3 === 1 ? 58 : -58;
  const radius = service.index % 2 === 0 ? 226 : 185;
  const size = active ? 82 : 66;

  return (
    <div
      className="absolute left-1/2 top-1/2"
      style={{
        transform: `rotateY(${angle}deg) rotateX(${ringTilt}deg) translateZ(${radius}px)`,
        transformStyle: "preserve-3d",
      }}
    >
      <motion.div
        className="relative -translate-x-1/2 -translate-y-1/2"
        animate={
          prefersReducedMotion
            ? undefined
            : {
                y: [0, service.index % 2 === 0 ? -12 : 12, 0],
              }
        }
        transition={{
          duration: 3.8 + service.index * 0.18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        <Link
          href={service.href}
          onMouseEnter={onActivate}
          onFocus={onActivate}
          onClick={onActivate}
          aria-label={`View ${service.name}`}
          className="group block rounded-full outline-none"
          style={{
            transform: `rotateX(${-ringTilt}deg) rotateY(${-angle}deg)`,
            transformStyle: "preserve-3d",
          }}
        >
          <motion.span
            className={`grid place-items-center rounded-full bg-gradient-to-br ${service.tone} text-center text-[10px] font-black uppercase leading-tight tracking-[0.08em] text-white shadow-[0_18px_50px_-24px_rgba(88,28,135,0.95)] ring-1 ring-white/70 transition`}
            animate={{
              width: size,
              height: size,
              scale: active ? 1.08 : 1,
            }}
            whileHover={{ scale: 1.14 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
          >
            <span className="max-w-[58px]">
              {service.name
                .replace("Social Media", "Social")
                .replace("Marketing", "Mktg")
                .replace("Creation", "")
                .replace("Advertising", "Ads")}
            </span>
          </motion.span>

          <span className="pointer-events-none absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-400/0 blur-2xl transition group-hover:bg-purple-400/25" />
        </Link>
      </motion.div>
    </div>
  );
}

function ServiceReadout({ service, side }) {
  const isLeft = side === "left";

  return (
    <motion.div
      key={`${side}-${service.slug}`}
      initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className={`hidden lg:block ${isLeft ? "text-left" : "text-right"}`}
    >
      <div className="border-0 bg-white/70 p-0 shadow-none backdrop-blur">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-purple-700">
          {isLeft ? "Selected particle" : "Deliverables"}
        </p>

        {isLeft ? (
          <>
            <h2 className="mt-4 text-4xl font-black tracking-[-0.055em] text-neutral-950">
              {service.name}
            </h2>
            <p className="mt-5 text-sm leading-7 text-neutral-600">
              {service.promise}
            </p>
            <p className="mt-5 text-sm leading-7 text-neutral-500">
              {service.whoFor}
            </p>
            <Link
              href={service.href}
              className="mt-7 inline-flex rounded-full bg-neutral-950 px-5 py-3 text-sm font-black text-white transition hover:bg-purple-700"
            >
              View service
            </Link>
          </>
        ) : (
          <div className="mt-5 space-y-4">
            {service.deliverables.slice(0, 4).map((deliverable, index) => (
              <div key={deliverable}>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-neutral-400">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <p className="mt-1 text-sm font-semibold leading-6 text-neutral-700">
                  {deliverable}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import AvatarGroup from "./avatar-group";

function Polygon({
  sides = 6,
  radius = 100,
  rotation = 0,
  cx = 400,
  cy = 400,
  ...props
}) {
  const points = Array.from({ length: sides }, (_, i) => {
    const angle = ((Math.PI * 2) / sides) * i - Math.PI / 2 + rotation;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    return `${x},${y}`;
  }).join(" ");

  return <polygon points={points} {...props} />;
}

function RadialLines({
  count = 24,
  inner = 40,
  outer = 280,
  cx = 400,
  cy = 400,
  ...props
}) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const angle = ((Math.PI * 2) / count) * i - Math.PI / 2;
        const x1 = cx + Math.cos(angle) * inner;
        const y1 = cy + Math.sin(angle) * inner;
        const x2 = cx + Math.cos(angle) * outer;
        const y2 = cy + Math.sin(angle) * outer;

        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} {...props} />;
      })}
    </>
  );
}

function GeoRosette({ className = "" }) {
  return (
    <svg
      viewBox="0 0 800 800"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="geo-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.18" />
          <stop offset="35%" stopColor="#8b5cf6" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="geo-stroke-a" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#111827" stopOpacity="0.18" />
          <stop offset="50%" stopColor="#4f46e5" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#111827" stopOpacity="0.12" />
        </linearGradient>

        <linearGradient id="geo-stroke-b" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.18" />
          <stop offset="50%" stopColor="#0f172a" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.14" />
        </linearGradient>
      </defs>

      <circle cx="400" cy="400" r="320" fill="url(#geo-glow)" />

      <g stroke="url(#geo-stroke-a)" strokeWidth="1">
        <circle cx="400" cy="400" r="72" />
        <circle cx="400" cy="400" r="120" />
        <circle cx="400" cy="400" r="176" />
        <circle cx="400" cy="400" r="236" />
        <circle cx="400" cy="400" r="300" />
      </g>

      <g stroke="url(#geo-stroke-b)" strokeWidth="1">
        <RadialLines count={12} inner={44} outer={295} opacity="0.32" />
        <RadialLines count={24} inner={90} outer={260} opacity="0.18" />
        <RadialLines count={48} inner={152} outer={220} opacity="0.12" />
      </g>

      <g stroke="url(#geo-stroke-a)" strokeWidth="1.2">
        <Polygon sides={3} radius={84} rotation={0} opacity="0.16" />
        <Polygon sides={3} radius={84} rotation={Math.PI / 3} opacity="0.16" />
        <Polygon sides={4} radius={116} rotation={Math.PI / 4} opacity="0.18" />
        <Polygon sides={6} radius={158} rotation={0} opacity="0.2" />
        <Polygon sides={6} radius={158} rotation={Math.PI / 6} opacity="0.12" />
        <Polygon sides={8} radius={210} rotation={Math.PI / 8} opacity="0.14" />
        <Polygon sides={12} radius={264} rotation={0} opacity="0.1" />
      </g>

      <g stroke="url(#geo-stroke-b)" strokeWidth="0.9" strokeDasharray="4 8">
        <Polygon sides={5} radius={138} rotation={Math.PI / 10} opacity="0.14" />
        <Polygon sides={7} radius={194} rotation={Math.PI / 14} opacity="0.14" />
        <Polygon sides={9} radius={248} rotation={Math.PI / 18} opacity="0.1" />
      </g>

      <g fill="#4f46e5">
        {Array.from({ length: 12 }, (_, i) => {
          const angle = ((Math.PI * 2) / 12) * i - Math.PI / 2;
          const x = 400 + Math.cos(angle) * 176;
          const y = 400 + Math.sin(angle) * 176;
          return <circle key={i} cx={x} cy={y} r="2.25" opacity="0.22" />;
        })}
        {Array.from({ length: 24 }, (_, i) => {
          const angle = ((Math.PI * 2) / 24) * i - Math.PI / 2;
          const x = 400 + Math.cos(angle) * 236;
          const y = 400 + Math.sin(angle) * 236;
          return <circle key={`outer-${i}`} cx={x} cy={y} r="1.75" opacity="0.14" />;
        })}
      </g>
    </svg>
  );
}

function buildGeoGraph() {
  const rings = [
    { radius: 118, count: 8, phase: Math.PI / 8 },
    { radius: 176, count: 12, phase: 0 },
    { radius: 236, count: 16, phase: Math.PI / 16 },
    { radius: 302, count: 20, phase: 0 },
  ];

  const labels = [
    "Attribution mesh",
    "Signal resolution",
    "Pipeline coherence",
    "Ops compression",
    "Funnel sync",
    "Velocity spread",
    "Conversion lattice",
    "Automation density",
  ];

  const nodes = [];
  let id = 0;

  rings.forEach((ring, ringIndex) => {
    for (let i = 0; i < ring.count; i += 1) {
      const angle = ((Math.PI * 2) / ring.count) * i - Math.PI / 2 + ring.phase;
      const x = 400 + Math.cos(angle) * ring.radius;
      const y = 400 + Math.sin(angle) * ring.radius;

      const signalLift = (9.8 + ((i * 17 + ringIndex * 11) % 160) / 10).toFixed(1);
      const opsDelta = 18 + ((i * 7 + ringIndex * 13) % 31);
      const syncScore = 91 + ((i * 5 + ringIndex * 3) % 9);
      const flowRate = (1.3 + ((i * 9 + ringIndex * 4) % 21) / 10).toFixed(1);

      nodes.push({
        id,
        ringIndex,
        indexInRing: i,
        angle,
        x,
        y,
        label: labels[(i + ringIndex) % labels.length],
        signalLift,
        opsDelta,
        syncScore,
        flowRate,
      });

      id += 1;
    }
  });

  const connections = [];
  const byRing = rings.map((_, ringIndex) => nodes.filter((node) => node.ringIndex === ringIndex));

  byRing.forEach((ringNodes, ringIndex) => {
    ringNodes.forEach((node, idx) => {
      const next = ringNodes[(idx + 1) % ringNodes.length];
      connections.push({ a: node.id, b: next.id, kind: "ring" });

      if (ringIndex > 0) {
        const prevRing = byRing[ringIndex - 1];
        const mapped = prevRing[Math.floor((idx / ringNodes.length) * prevRing.length) % prevRing.length];
        connections.push({ a: node.id, b: mapped.id, kind: "radial" });
      }
    });
  });

  return { nodes, connections };
}

function DataCard({ node }) {
  const side = node.x > 470 ? "right" : "left";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.96 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className="pointer-events-none absolute z-30"
      style={{
        left: `${(node.x / 800) * 100}%`,
        top: `${(node.y / 800) * 100}%`,
        transform:
          side === "right"
            ? "translate(calc(-100% - 28px), -50%)"
            : "translate(28px, -50%)",
      }}
    >
      <div className="min-w-[220px] rounded-[22px] border border-indigo-200/60 bg-white/80 p-4 shadow-[0_12px_55px_rgba(79,70,229,0.18)] backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-indigo-500 shadow-[0_0_18px_rgba(99,102,241,0.7)]" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-neutral-500">
            Active node {String(node.id + 1).padStart(2, "0")}
          </span>
        </div>

        <div className="mt-2 text-sm font-semibold tracking-tight text-neutral-950">
          {node.label}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
          <div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-neutral-400">
              Signal lift
            </div>
            <div className="font-semibold text-neutral-950">+{node.signalLift}%</div>
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-neutral-400">
              Ops saved
            </div>
            <div className="font-semibold text-neutral-950">{node.opsDelta} hrs/mo</div>
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-neutral-400">
              Sync score
            </div>
            <div className="font-semibold text-neutral-950">{node.syncScore}/100</div>
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-neutral-400">
              Flow rate
            </div>
            <div className="font-semibold text-neutral-950">{node.flowRate}x</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function InteractiveGeoField() {
  const reduceMotion = useReducedMotion();
  const svgRef = useRef(null);
  const [{ nodes, connections }] = useState(() => buildGeoGraph());
  const [activeNodeId, setActiveNodeId] = useState(null);

  const nodeMap = useMemo(() => {
    return Object.fromEntries(nodes.map((node) => [node.id, node]));
  }, [nodes]);

  const activeNode = activeNodeId != null ? nodeMap[activeNodeId] : null;

  const connectedIds = useMemo(() => {
    if (activeNodeId == null) return new Set();

    const ids = new Set([activeNodeId]);
    connections.forEach((connection) => {
      if (connection.a === activeNodeId) ids.add(connection.b);
      if (connection.b === activeNodeId) ids.add(connection.a);
    });
    return ids;
  }, [activeNodeId, connections]);

  const handleMove = useCallback(
    (event) => {
      if (!svgRef.current) return;

      const rect = svgRef.current.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 800;
      const y = ((event.clientY - rect.top) / rect.height) * 800;

      let bestNode = null;
      let bestDistance = Infinity;

      for (const node of nodes) {
        const dx = node.x - x;
        const dy = node.y - y;
        const distance = dx * dx + dy * dy;

        if (distance < bestDistance) {
          bestDistance = distance;
          bestNode = node;
        }
      }

      if (bestNode && bestDistance < 44 * 44) {
        setActiveNodeId(bestNode.id);
      } else {
        setActiveNodeId(null);
      }
    },
    [nodes]
  );

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative h-[68rem] w-[68rem] sm:h-[76rem] sm:w-[76rem] md:h-[88rem] md:w-[88rem] lg:h-[96rem] lg:w-[96rem]">
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-95"
          animate={
            reduceMotion
              ? { opacity: 0.9 }
              : {
                  rotate: [0, 360],
                  scale: [1, 1.05, 0.985, 1],
                  opacity: [0.82, 0.98, 0.88, 0.82],
                }
          }
          transition={
            reduceMotion
              ? undefined
              : {
                  duration: 42,
                  repeat: Infinity,
                  ease: "linear",
                }
          }
        >
          <GeoRosette className="h-full w-full blur-[0.35px]" />
        </motion.div>

        <motion.div
          className="pointer-events-none absolute inset-0 mix-blend-multiply opacity-60"
          animate={
            reduceMotion
              ? { opacity: 0.55 }
              : {
                  rotate: [360, 0],
                  scale: [1.045, 0.965, 1.045],
                  x: [0, 14, -12, 0],
                  y: [0, -10, 10, 0],
                }
          }
          transition={
            reduceMotion
              ? undefined
              : {
                  duration: 30,
                  repeat: Infinity,
                  ease: [0.65, 0, 0.35, 1],
                }
          }
        >
          <GeoRosette className="h-full w-full blur-[10px]" />
        </motion.div>

        <motion.div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[conic-gradient(from_0deg,rgba(99,102,241,0.10),rgba(168,85,247,0.08),rgba(255,255,255,0),rgba(99,102,241,0.10))] blur-3xl"
          animate={
            reduceMotion
              ? { opacity: 0.5 }
              : {
                  rotate: [0, -360],
                  scale: [0.92, 1.11, 0.96, 0.92],
                }
          }
          transition={
            reduceMotion
              ? undefined
              : {
                  duration: 24,
                  repeat: Infinity,
                  ease: "linear",
                }
          }
        />

        <svg
          ref={svgRef}
          viewBox="0 0 800 800"
          className="absolute inset-0 h-full w-full"
          onMouseMove={handleMove}
          onMouseLeave={() => setActiveNodeId(null)}
        >
          <defs>
            <linearGradient id="interactive-line" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.24" />
              <stop offset="100%" stopColor="#111827" stopOpacity="0.08" />
            </linearGradient>

            <linearGradient id="interactive-hot" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#4f46e5" />
            </linearGradient>

            <filter id="node-glow" x="-120%" y="-120%" width="340%" height="340%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g>
            {connections.map((connection, index) => {
              const a = nodeMap[connection.a];
              const b = nodeMap[connection.b];
              const highlighted =
                activeNodeId != null &&
                (connection.a === activeNodeId || connection.b === activeNodeId);

              const softlyRelated =
                activeNodeId != null &&
                !highlighted &&
                (connectedIds.has(connection.a) || connectedIds.has(connection.b));

              return (
                <motion.line
                  key={`${connection.a}-${connection.b}-${index}`}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke={highlighted ? "url(#interactive-hot)" : "url(#interactive-line)"}
                  strokeWidth={highlighted ? 1.8 : softlyRelated ? 1.2 : 0.9}
                  opacity={highlighted ? 0.95 : softlyRelated ? 0.4 : 0.12}
                  animate={
                    highlighted && !reduceMotion
                      ? { opacity: [0.45, 1, 0.45] }
                      : undefined
                  }
                  transition={
                    highlighted && !reduceMotion
                      ? { duration: 1.4, repeat: Infinity, ease: "easeInOut" }
                      : undefined
                  }
                />
              );
            })}
          </g>

          <g>
            {nodes.map((node) => {
              const isActive = node.id === activeNodeId;
              const isConnected = connectedIds.has(node.id) && !isActive;

              return (
                <g key={node.id}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="18"
                    fill="transparent"
                  />

                  {(isActive || isConnected) && (
                    <motion.circle
                      cx={node.x}
                      cy={node.y}
                      r={isActive ? 10 : 7}
                      fill="rgba(99,102,241,0.14)"
                      filter="url(#node-glow)"
                      animate={
                        reduceMotion
                          ? undefined
                          : { r: isActive ? [8, 12, 8] : [6, 8.5, 6], opacity: [0.4, 0.9, 0.4] }
                      }
                      transition={
                        reduceMotion
                          ? undefined
                          : { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
                      }
                    />
                  )}

                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isActive ? 4.8 : isConnected ? 3.4 : 1.9}
                    fill={isActive || isConnected ? "url(#interactive-hot)" : "#4f46e5"}
                    opacity={isActive ? 1 : isConnected ? 0.82 : 0.22}
                  />
                </g>
              );
            })}
          </g>
        </svg>

        {activeNode ? <DataCard node={activeNode} /> : null}
      </div>
    </div>
  );
}

function TrippyGeoBackground() {
  return (
    <div className="absolute inset-0 z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08),transparent_26%),radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.06),transparent_28%),radial-gradient(circle_at_80%_35%,rgba(168,85,247,0.08),transparent_30%),linear-gradient(to_bottom,rgba(255,255,255,0.96),rgba(255,255,255,1))]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(circle_at_center,black,transparent_82%)]" />
      <InteractiveGeoField />
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-white">
      <TrippyGeoBackground />

      <div className="pointer-events-none relative z-20 mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center justify-center gap-y-6 py-24 text-center md:py-32">
          <h1 className="max-w-4xl text-5xl font-bold tracking-tight text-neutral-950 md:text-7xl">
            We build marketing <span className="text-indigo-600">systems</span> that power{" "}
            <u>operations</u>.
          </h1>

          <h3 className="mx-3 text-xl font-medium tracking-tight text-neutral-700 md:text-2xl">
            Clients save 30 hrs/week on content and $10K/yr on software.
          </h3>

          <div className="pointer-events-auto flex flex-row gap-x-3">
            <Link id="book" href="https://cal.com/usatii/onboarding" target="_blank">
              <Button className="cursor-pointer rounded-[25px] border-2 border-black px-6 py-5 text-lg font-bold transition hover:scale-105">
                Book a call ☕️
              </Button>
            </Link>

            <Link id="casestudies" href="/case-studies" target="_blank">
              <Button className="cursor-pointer rounded-[25px] border-2 border-black bg-white px-6 py-5 text-lg font-bold text-black transition hover:scale-105 hover:bg-white">
                Read case studies
              </Button>
            </Link>
          </div>

          <div className="mt-4 flex flex-col items-center justify-center gap-y-3 p-5 text-sm sm:text-md">
            <AvatarGroup count={5} size={42} />
            <p className="text-neutral-700">
              We&apos;ve helped 1,000+ other founders achieve their
              <br />
              business goals through robust systems.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
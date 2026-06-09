"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  Download,
  ExternalLink,
  PanelRightOpen,
  RotateCcw,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  ADVERTISING_PATH,
  COMPLETION_NOTES,
  COURSE_DURATION,
  COURSE_SUBTITLE,
  COURSE_TITLE,
  GLOSSARY,
  KICKOFF_CALL_URL,
  LESSONS,
  REFERRAL_LINK_PATH,
  RELATED_LINKS,
  REWARD_TERMS,
} from "./advertising-course-data";

const SESSION_KEY = "usatii_telemetry_session_id";

function ensureSessionId() {
  if (typeof window === "undefined") return null;

  const existing = window.sessionStorage.getItem(SESSION_KEY);
  if (existing) return existing;

  const nextId =
    typeof window.crypto?.randomUUID === "function"
      ? window.crypto.randomUUID()
      : `session_${Date.now()}_${Math.round(Math.random() * 1e8)}`;

  window.sessionStorage.setItem(SESSION_KEY, nextId);
  return nextId;
}

async function sendCourseEvent(eventType, metadata = {}) {
  if (typeof window === "undefined") return;

  try {
    await fetch("/api/telemetry/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventType,
        sessionId: ensureSessionId(),
        path: `${window.location.pathname}${window.location.search}`,
        source: "advertising-course",
        referrer: document.referrer || "",
        metadata,
      }),
      keepalive: true,
    });
  } catch {
    // Best-effort telemetry.
  }
}

function createInitialLessonStates() {
  return Object.fromEntries(LESSONS.map((lesson) => [lesson.id, {}]));
}

function getVisibleTerms(currentIndex) {
  const seen = new Set();
  const collected = [];
  const lastLessonIndex = currentIndex >= LESSONS.length ? LESSONS.length - 1 : currentIndex;

  for (let index = 0; index <= lastLessonIndex; index += 1) {
    const lesson = LESSONS[index];
    lesson.terms.forEach((term) => {
      if (!seen.has(term)) {
        seen.add(term);
        collected.push(term);
      }
    });
  }

  return collected;
}

function isLessonInteractionComplete(lesson, state = {}) {
  const interaction = lesson.interaction;

  switch (interaction.type) {
    case "lane-reveal":
      return interaction.items.every((item) => state.revealed?.[item.id]);
    case "bucket-sort":
      return interaction.items.every((item) => state.assignments?.[item.id] === item.correctBucket);
    case "business-selector":
      return Boolean(state.selectedBusiness);
    case "calculator":
      return Boolean(state.showCpc && state.showCpa && state.showCtrHint);
    case "hotspots":
      return interaction.spots.every((spot) => state.found?.[spot.id]);
    case "conversion-selector":
      return Array.isArray(state.selectedOptions) && state.selectedOptions.length > 0;
    case "creative-choice": {
      const strongestOption = interaction.options.find((option) => option.strong);
      return strongestOption?.id === state.selectedCreative;
    }
    case "weekly-plan":
      return Array.isArray(state.selectedTopics) && state.selectedTopics.length === interaction.minSelections;
    case "timeline-placement":
      return interaction.items.every((item) => state.placements?.[item.id] === item.correctSlot);
    default:
      return false;
  }
}

function StatusChip({ done, label }) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm",
        done
          ? "border-[#b6dfc4] bg-[#eef8f1] text-[#165b2f]"
          : "border-[#d9dfe9] bg-white text-[#5f6b82]",
      )}
    >
      <span
        className={cn(
          "flex h-5 w-5 items-center justify-center rounded-full border text-[11px]",
          done
            ? "border-[#79c296] bg-[#dff2e6] text-[#165b2f]"
            : "border-[#d9dfe9] bg-[#f5f7fb] text-[#7b879d]",
        )}
      >
        {done ? <Check className="h-3.5 w-3.5" /> : null}
      </span>
      <span>{label}</span>
    </div>
  );
}

function BrandMark() {
  return (
    <Link href="/" className="inline-flex items-center gap-3">
      <div className="grid h-10 w-10 grid-cols-2 gap-1 rounded-lg border border-white/15 bg-white/[0.06] p-1">
        <span className="rounded-sm bg-white" />
        <span className="rounded-sm bg-[#7dd3fc]" />
        <span className="rounded-sm bg-[#cbd5e1]" />
        <span className="rounded-sm bg-white" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55">USATII</p>
        <p className="truncate text-sm font-semibold text-white sm:text-base">USATII MEDIA</p>
      </div>
    </Link>
  );
}

function GlossaryPanel({ visibleTerms, selectedTerm, onSelectTerm, currentLessonTerms, isCompleted }) {
  const selectedEntry = selectedTerm ? GLOSSARY[selectedTerm] : null;

  return (
    <div className="flex h-full flex-col rounded-lg border border-white/10 bg-[#0f1624] text-white">
      <div className="border-b border-white/10 px-4 py-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">Glossary</p>
        <h2 className="mt-1 text-lg font-semibold">Terms introduced so far</h2>
        <p className="mt-1 text-sm leading-6 text-white/60">
          The drawer grows as the course introduces more vocabulary.
        </p>
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <div className="space-y-5 px-4 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">Visible now</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {visibleTerms.map((termId) => (
                <button
                  key={termId}
                  type="button"
                  onClick={() => onSelectTerm(termId)}
                  className={cn(
                    "rounded-md border px-2.5 py-1.5 text-left text-xs font-medium transition",
                    selectedTerm === termId
                      ? "border-[#7dd3fc] bg-[#13263c] text-white"
                      : "border-white/10 bg-white/[0.04] text-white/75 hover:border-white/20 hover:bg-white/[0.08]",
                  )}
                >
                  {GLOSSARY[termId].label}
                </button>
              ))}
            </div>
          </div>

          {selectedEntry ? (
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7dd3fc]">Selected term</p>
              <h3 className="mt-1 text-lg font-semibold">{selectedEntry.label}</h3>
              <p className="mt-2 text-sm leading-6 text-white/75">{selectedEntry.definition}</p>
              <div className="mt-3 rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white/70">
                <span className="font-medium text-white">Example:</span> {selectedEntry.example}
              </div>
            </div>
          ) : null}

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
              {isCompleted ? "Core terms" : "Current lesson terms"}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {currentLessonTerms.map((termId) => (
                <button
                  key={termId}
                  type="button"
                  onClick={() => onSelectTerm(termId)}
                  className="rounded-md border border-[#1d3956] bg-[#12243a] px-2.5 py-1.5 text-xs font-medium text-[#d6ecff] transition hover:border-[#315780]"
                >
                  {GLOSSARY[termId].label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">Continue to</p>
            <div className="mt-3 grid gap-2">
              {RELATED_LINKS.map((link) => (
                <Link
                  key={`${link.label}-${link.href}`}
                  href={link.href}
                  className="rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white/80 transition hover:border-white/20 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

function LessonDiagram({ variant }) {
  const stroke = "#7dd3fc";
  const muted = "#cbd5e1";
  const dark = "#0f172a";
  const accent = "#1d4ed8";

  return (
    <div className="overflow-hidden rounded-lg border border-[#d6dde9] bg-[#f8fbff]">
      <svg viewBox="0 0 320 200" className="h-auto w-full">
        <rect x="0" y="0" width="320" height="200" fill="#f8fbff" />
        {variant === "roads" ? (
          <>
            <path d="M32 52C92 52 108 80 160 100" stroke={muted} strokeWidth="6" strokeLinecap="round" fill="none" />
            <path d="M32 100H160" stroke={muted} strokeWidth="6" strokeLinecap="round" fill="none" />
            <path d="M32 148C92 148 108 120 160 100" stroke={muted} strokeWidth="6" strokeLinecap="round" fill="none" />
            <path d="M160 100H256" stroke={stroke} strokeWidth="8" strokeLinecap="round" fill="none" />
            <circle cx="280" cy="100" r="18" fill={dark} />
            <text x="280" y="105" textAnchor="middle" fontSize="10" fill="white">
              LEAD
            </text>
            {[52, 100, 148].map((y, index) => (
              <motion.circle
                key={y}
                cx="44"
                cy={y}
                r="5"
                fill={accent}
                animate={{ cx: [44, 152, 254] }}
                transition={{ duration: 2.4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: index * 0.3 }}
              />
            ))}
          </>
        ) : null}

        {variant === "machines" ? (
          <>
            <rect x="32" y="44" width="108" height="112" rx="12" fill="#111827" />
            <rect x="180" y="44" width="108" height="112" rx="12" fill="#e5eef8" stroke="#bfd3e8" />
            <text x="86" y="78" textAnchor="middle" fontSize="15" fill="white">
              Google Ads
            </text>
            <text x="234" y="78" textAnchor="middle" fontSize="15" fill="#111827">
              AdSense
            </text>
            <motion.rect
              x="56"
              y="100"
              width="60"
              height="12"
              rx="6"
              fill={stroke}
              animate={{ width: [60, 76, 60] }}
              transition={{ duration: 2.2, repeat: Number.POSITIVE_INFINITY }}
            />
            <motion.rect
              x="204"
              y="100"
              width="60"
              height="12"
              rx="6"
              fill="#9ca3af"
              animate={{ width: [60, 48, 60] }}
              transition={{ duration: 2.2, repeat: Number.POSITIVE_INFINITY, delay: 0.35 }}
            />
            <path d="M140 100H180" stroke="#94a3b8" strokeWidth="4" strokeDasharray="5 5" />
          </>
        ) : null}

        {variant === "lanes" ? (
          <>
            {[56, 100, 144].map((y, index) => (
              <g key={y}>
                <path d={`M32 ${y}H286`} stroke="#d0d9e6" strokeWidth="8" strokeLinecap="round" />
                <motion.rect
                  x="52"
                  y={y - 9}
                  width="34"
                  height="18"
                  rx="9"
                  fill={index === 0 ? accent : index === 1 ? "#64748b" : stroke}
                  animate={{ x: [52, 228, 52] }}
                  transition={{ duration: 3.1, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: index * 0.25 }}
                />
              </g>
            ))}
            <circle cx="292" cy="100" r="12" fill={dark} />
          </>
        ) : null}

        {variant === "search" ? (
          <>
            <rect x="34" y="42" width="252" height="34" rx="17" fill="white" stroke="#d5dce8" />
            <motion.rect
              x="62"
              y="53"
              width="132"
              height="12"
              rx="6"
              fill="#dbeafe"
              animate={{ width: [108, 146, 132] }}
              transition={{ duration: 2.4, repeat: Number.POSITIVE_INFINITY }}
            />
            <rect x="42" y="92" width="236" height="76" rx="14" fill="#ffffff" stroke="#d5dce8" />
            <rect x="56" y="110" width="180" height="18" rx="9" fill={dark} />
            <rect x="56" y="136" width="142" height="10" rx="5" fill="#cbd5e1" />
            <motion.circle
              cx="250"
              cy="118"
              r="6"
              fill={stroke}
              animate={{ opacity: [0.35, 1, 0.35] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            />
          </>
        ) : null}

        {variant === "auction" ? (
          <>
            <rect x="52" y="54" width="216" height="96" rx="18" fill="#ffffff" stroke="#d6dde9" />
            {[92, 148, 204].map((x, index) => (
              <motion.g
                key={x}
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2.1, repeat: Number.POSITIVE_INFINITY, delay: index * 0.25 }}
              >
                <rect x={x} y="82" width="32" height="48" rx="10" fill={index === 1 ? dark : "#cbd5e1"} />
                <circle cx={x + 16} cy="72" r="10" fill={index === 1 ? stroke : "#94a3b8"} />
              </motion.g>
            ))}
            <path d="M52 150C90 120 230 120 268 150" stroke={stroke} strokeWidth="4" fill="none" />
          </>
        ) : null}

        {variant === "funnel" ? (
          <>
            <path d="M44 44H276L220 110H100L44 44Z" fill="#ffffff" stroke="#d6dde9" />
            <path d="M116 110H204V164H116Z" fill="#0f172a" />
            <motion.circle
              cx="88"
              cy="64"
              r="6"
              fill={stroke}
              animate={{ cx: [88, 140, 160], cy: [64, 102, 144] }}
              transition={{ duration: 2.3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            />
            <motion.circle
              cx="162"
              cy="64"
              r="6"
              fill="#94a3b8"
              animate={{ cx: [162, 162, 162], cy: [64, 102, 144] }}
              transition={{ duration: 2.3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.3 }}
            />
            <motion.circle
              cx="236"
              cy="64"
              r="6"
              fill={accent}
              animate={{ cx: [236, 184, 162], cy: [64, 102, 144] }}
              transition={{ duration: 2.3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.6 }}
            />
          </>
        ) : null}

        {variant === "tracking" ? (
          <>
            <circle cx="60" cy="100" r="22" fill="#0f172a" />
            <circle cx="160" cy="64" r="22" fill="#dbeafe" />
            <circle cx="160" cy="136" r="22" fill="#dbeafe" />
            <circle cx="260" cy="100" r="22" fill="#0f172a" />
            <path d="M82 100H138" stroke={stroke} strokeWidth="5" strokeLinecap="round" />
            <path d="M182 64H238" stroke={stroke} strokeWidth="5" strokeLinecap="round" />
            <path d="M182 136H238" stroke={stroke} strokeWidth="5" strokeLinecap="round" />
            <path d="M160 86V114" stroke="#94a3b8" strokeWidth="4" strokeDasharray="5 5" />
            <motion.circle
              cx="92"
              cy="100"
              r="5"
              fill="white"
              animate={{ cx: [92, 136, 182, 238] }}
              transition={{ duration: 2.3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            />
          </>
        ) : null}

        {variant === "feed" ? (
          <>
            <rect x="108" y="26" width="104" height="148" rx="18" fill="#0f172a" />
            <rect x="118" y="42" width="84" height="28" rx="10" fill="#1e293b" />
            {[80, 116, 152].map((y, index) => (
              <motion.rect
                key={y}
                x="118"
                y={y}
                width="84"
                height="26"
                rx="10"
                fill={index === 1 ? stroke : "#dbeafe"}
                animate={{ y: [y + 6, y - 6, y + 6] }}
                transition={{ duration: 2.4, repeat: Number.POSITIVE_INFINITY, delay: index * 0.2 }}
              />
            ))}
            <motion.circle
              cx="84"
              cy="100"
              r="10"
              fill="#94a3b8"
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 1.7, repeat: Number.POSITIVE_INFINITY }}
            />
          </>
        ) : null}

        {variant === "flywheel" ? (
          <>
            <circle cx="160" cy="100" r="52" fill="#ffffff" stroke="#d6dde9" />
            <motion.circle
              cx="160"
              cy="100"
              r="70"
              fill="none"
              stroke={stroke}
              strokeWidth="8"
              strokeDasharray="110 40"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              style={{ transformOrigin: "160px 100px" }}
            />
            <text x="160" y="95" textAnchor="middle" fontSize="12" fill="#0f172a">
              Trust
            </text>
            <text x="160" y="112" textAnchor="middle" fontSize="12" fill="#64748b">
              Flywheel
            </text>
          </>
        ) : null}

        {variant === "timeline" ? (
          <>
            <path d="M42 100H278" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" />
            {[62, 118, 174, 230, 278].map((x, index) => (
              <motion.g key={x}>
                <circle
                  cx={x}
                  cy="100"
                  r="14"
                  fill={index < 3 ? "#0f172a" : "#dbeafe"}
                  stroke={index < 3 ? stroke : "#bfd3e8"}
                  strokeWidth="3"
                />
                <motion.circle
                  cx={x}
                  cy="100"
                  r="22"
                  fill="none"
                  stroke={stroke}
                  strokeWidth="2"
                  animate={{ opacity: [0.15, 0.65, 0.15], scale: [1, 1.08, 1] }}
                  transition={{ duration: 2.2, repeat: Number.POSITIVE_INFINITY, delay: index * 0.25 }}
                />
              </motion.g>
            ))}
          </>
        ) : null}
      </svg>
    </div>
  );
}

function LaneRevealInteraction({ lesson, state, updateState }) {
  const revealed = state.revealed || {};

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {lesson.interaction.items.map((item) => {
        const isRevealed = Boolean(revealed[item.id]);

        return (
          <button
            key={item.id}
            type="button"
            onClick={() =>
              updateState((current) => ({
                ...current,
                revealed: {
                  ...(current.revealed || {}),
                  [item.id]: true,
                },
              }))
            }
            className={cn(
              "rounded-lg border p-4 text-left transition",
              isRevealed
                ? "border-[#b9d8f3] bg-[#f6fbff]"
                : "border-[#d9dfe9] bg-white hover:border-[#b9d8f3] hover:bg-[#f8fbff]",
            )}
          >
            <p className="text-sm font-semibold text-[#111827]">{item.label}</p>
            <p className="mt-2 text-sm leading-6 text-[#627089]">
              {isRevealed ? item.reveal : "Tap to reveal"}
            </p>
          </button>
        );
      })}
    </div>
  );
}

function AssignmentBoard({ lesson, state, updateState, timeline = false }) {
  const assignments = state.assignments || state.placements || {};
  const selectedItemId = state.selectedItemId || null;
  const items = lesson.interaction.items;
  const buckets = timeline ? lesson.interaction.slots : lesson.interaction.buckets;
  const unassignedItems = items.filter((item) => !assignments[item.id]);
  const completeCount = items.filter((item) => assignments[item.id] === item.correctBucket || assignments[item.id] === item.correctSlot).length;

  function patchAssignments(nextAssignments, nextSelected = null) {
    updateState((current) => ({
      ...current,
      ...(timeline ? { placements: nextAssignments } : { assignments: nextAssignments }),
      selectedItemId: nextSelected,
    }));
  }

  function assignItem(itemId, bucketId) {
    patchAssignments({ ...assignments, [itemId]: bucketId });
  }

  function handleItemClick(itemId) {
    updateState((current) => ({
      ...current,
      selectedItemId: current.selectedItemId === itemId ? null : itemId,
    }));
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-dashed border-[#c5d3e3] bg-[#f8fbff] p-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#69819e]">
            {timeline ? "Unplaced tiles" : "Drag or tap to assign"}
          </p>
          <button
            type="button"
            onClick={() => patchAssignments({}, null)}
            className="text-xs font-medium text-[#315780] transition hover:text-[#17304e]"
          >
            Reset
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {unassignedItems.length ? (
            unassignedItems.map((item) => (
              <button
                key={item.id}
                type="button"
                draggable
                onDragStart={(event) => event.dataTransfer.setData("text/plain", item.id)}
                onClick={() => handleItemClick(item.id)}
                className={cn(
                  "rounded-md border px-3 py-2 text-sm transition",
                  selectedItemId === item.id
                    ? "border-[#7dd3fc] bg-[#13263c] text-white"
                    : "border-[#d5dde8] bg-white text-[#172033] hover:border-[#b9d8f3]",
                )}
              >
                {item.label}
              </button>
            ))
          ) : (
            <p className="text-sm text-[#627089]">Everything is placed. Move any tile by selecting it and clicking a new bucket.</p>
          )}
        </div>
      </div>

      <div className={cn("grid gap-3", timeline ? "lg:grid-cols-5" : "sm:grid-cols-2")}>
        {buckets.map((bucket) => {
          const bucketItems = items.filter((item) => assignments[item.id] === bucket.id);

          return (
            <div
              key={bucket.id}
              role="button"
              tabIndex={0}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                const itemId = event.dataTransfer.getData("text/plain");
                if (itemId) assignItem(itemId, bucket.id);
              }}
              onClick={() => {
                if (selectedItemId) assignItem(selectedItemId, bucket.id);
              }}
              onKeyDown={(event) => {
                if ((event.key === "Enter" || event.key === " ") && selectedItemId) {
                  event.preventDefault();
                  assignItem(selectedItemId, bucket.id);
                }
              }}
              className="min-h-[150px] rounded-lg border border-[#d9dfe9] bg-white p-3 text-left transition hover:border-[#b9d8f3]"
            >
              <p className="text-sm font-semibold text-[#111827]">{bucket.label}</p>
              {"detail" in bucket ? (
                <p className="mt-1 text-xs leading-5 text-[#6a7489]">{bucket.detail}</p>
              ) : null}

              <div className="mt-3 flex flex-wrap gap-2">
                {items
                  .filter((item) => assignments[item.id] === bucket.id)
                  .map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      draggable
                      onDragStart={(event) => event.dataTransfer.setData("text/plain", item.id)}
                      onClick={(event) => {
                        event.stopPropagation();
                        handleItemClick(item.id);
                      }}
                      className={cn(
                        "rounded-md border px-3 py-2 text-sm transition",
                        selectedItemId === item.id
                          ? "border-[#7dd3fc] bg-[#13263c] text-white"
                          : "border-[#b9d8f3] bg-[#f6fbff] text-[#17304e]",
                      )}
                    >
                      {item.label}
                    </button>
                  ))}
              </div>

              {!bucketItems.length && !items.some((item) => assignments[item.id] === bucket.id) ? (
                <p className="mt-4 text-xs text-[#7a859b]">
                  {selectedItemId ? "Tap to place the selected item here." : "Drop or select an item and tap here."}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>

      <p className="text-sm text-[#627089]">
        Correct matches: <span className="font-semibold text-[#111827]">{completeCount}</span> / {items.length}
      </p>
    </div>
  );
}

function CalculatorInteraction({ lesson, state, updateState }) {
  const { spend, clicks, leads } = lesson.interaction;
  const showCpc = Boolean(state.showCpc);
  const showCpa = Boolean(state.showCpa);
  const showCtrHint = Boolean(state.showCtrHint);

  function reveal(key) {
    updateState((current) => ({ ...current, [key]: true }));
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-[#d9dfe9] bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6a7489]">Spend</p>
          <p className="mt-2 text-2xl font-semibold text-[#111827]">${spend}</p>
        </div>
        <div className="rounded-lg border border-[#d9dfe9] bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6a7489]">Clicks</p>
          <p className="mt-2 text-2xl font-semibold text-[#111827]">{clicks}</p>
        </div>
        <div className="rounded-lg border border-[#d9dfe9] bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6a7489]">Leads</p>
          <p className="mt-2 text-2xl font-semibold text-[#111827]">{leads}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" onClick={() => reveal("showCpc")}>
          Calculate CPC
        </Button>
        <Button type="button" variant="outline" onClick={() => reveal("showCpa")}>
          Calculate CPA
        </Button>
        <Button type="button" variant="outline" onClick={() => reveal("showCtrHint")}>
          Ask about CTR
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-[#d9dfe9] bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6a7489]">CPC</p>
          <p className="mt-2 text-lg font-semibold text-[#111827]">
            {showCpc ? `$${(spend / clicks).toFixed(2)}` : "Tap to reveal"}
          </p>
        </div>
        <div className="rounded-lg border border-[#d9dfe9] bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6a7489]">CPA</p>
          <p className="mt-2 text-lg font-semibold text-[#111827]">
            {showCpa ? `$${(spend / leads).toFixed(2)}` : "Tap to reveal"}
          </p>
        </div>
        <div className="rounded-lg border border-[#d9dfe9] bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6a7489]">CTR</p>
          <p className="mt-2 text-sm leading-6 text-[#111827]">
            {showCtrHint ? "CTR needs impression count before it can be calculated." : "Tap to reveal"}
          </p>
        </div>
      </div>
    </div>
  );
}

function HotspotInteraction({ lesson, state, updateState }) {
  const found = state.found || {};
  const foundCount = lesson.interaction.spots.filter((spot) => found[spot.id]).length;

  return (
    <div className="space-y-4">
      <div className="relative min-h-[280px] rounded-lg border border-[#d9dfe9] bg-white p-5">
        <div className="rounded-md border border-[#e5eaf1] bg-[#f8fbff] p-4">
          <div className="h-6 w-2/3 rounded bg-[#d8e1ee]" />
          <div className="mt-3 h-4 w-1/2 rounded bg-[#e4ebf5]" />
          <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_140px]">
            <div className="space-y-3">
              <div className="h-24 rounded bg-[#eef4fb]" />
              <div className="h-16 rounded bg-[#eef4fb]" />
              <div className="h-10 rounded bg-[#eef4fb]" />
            </div>
            <div className="h-full rounded bg-[#eef4fb]" />
          </div>
        </div>

        {lesson.interaction.spots.map((spot) => {
          const isFound = Boolean(found[spot.id]);

          return (
            <button
              key={spot.id}
              type="button"
              onClick={() =>
                updateState((current) => ({
                  ...current,
                  found: {
                    ...(current.found || {}),
                    [spot.id]: true,
                  },
                }))
              }
              className={cn(
                "absolute flex h-8 min-w-8 items-center justify-center rounded-full border text-xs font-semibold transition",
                isFound
                  ? "border-[#7dd3fc] bg-[#13263c] px-3 text-white"
                  : "border-[#9bb9d7] bg-white px-2 text-[#17304e] shadow-sm",
              )}
              style={{ top: spot.top, left: spot.left }}
            >
              {isFound ? spot.label : "Tap"}
            </button>
          );
        })}
      </div>

      <p className="text-sm text-[#627089]">
        Weak spots found: <span className="font-semibold text-[#111827]">{foundCount}</span> / {lesson.interaction.spots.length}
      </p>
    </div>
  );
}

function ConversionSelector({ lesson, state, updateState }) {
  const selectedOptions = state.selectedOptions || [];

  function toggleOption(option) {
    updateState((current) => {
      const currentOptions = current.selectedOptions || [];
      const nextOptions = currentOptions.includes(option)
        ? currentOptions.filter((item) => item !== option)
        : [...currentOptions, option];

      return {
        ...current,
        selectedOptions: nextOptions,
      };
    });
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        {lesson.interaction.options.map((option) => {
          const checked = selectedOptions.includes(option);

          return (
            <label
              key={option}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition",
                checked
                  ? "border-[#b9d8f3] bg-[#f6fbff]"
                  : "border-[#d9dfe9] bg-white hover:border-[#b9d8f3]",
              )}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggleOption(option)}
                className="h-4 w-4 rounded border-[#b8c4d5]"
              />
              <span className="text-sm font-medium text-[#111827]">{option}</span>
            </label>
          );
        })}
      </div>

      {selectedOptions.length ? (
        <div className="rounded-lg border border-[#b9d8f3] bg-[#f6fbff] px-4 py-3 text-sm leading-6 text-[#17304e]">
          Good. These are the actions your campaigns should optimize toward.
        </div>
      ) : null}
    </div>
  );
}

function CreativeChoice({ lesson, state, updateState }) {
  const selectedCreative = state.selectedCreative || null;
  const strongestOption = lesson.interaction.options.find((option) => option.strong);

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {lesson.interaction.options.map((option) => {
        const selected = selectedCreative === option.id;
        const correct = selected && option.id === strongestOption?.id;
        const incorrect = selected && option.id !== strongestOption?.id;

        return (
          <button
            key={option.id}
            type="button"
            onClick={() =>
              updateState((current) => ({
                ...current,
                selectedCreative: option.id,
              }))
            }
            className={cn(
              "rounded-lg border p-4 text-left transition",
              correct && "border-[#9fd4b1] bg-[#eff9f1]",
              incorrect && "border-[#efc0c0] bg-[#fff5f5]",
              !selected && "border-[#d9dfe9] bg-white hover:border-[#b9d8f3]",
            )}
          >
            <div
              className={cn(
                "mb-4 h-24 rounded-md border",
                option.id === "logo" && "border-[#d9dfe9] bg-[#111827]",
                option.id === "before-after" && "border-[#b9d8f3] bg-[linear-gradient(135deg,#111827_0%,#111827_48%,#7dd3fc_48%,#e0f2fe_100%)]",
                option.id === "stock-photo" && "border-[#d9dfe9] bg-[linear-gradient(135deg,#dbeafe,#f1f5f9)]",
              )}
            />
            <p className="text-sm font-semibold text-[#111827]">{option.label}</p>
            <p className="mt-2 text-sm leading-6 text-[#627089]">{option.detail}</p>
          </button>
        );
      })}
    </div>
  );
}

function WeeklyPlan({ lesson, state, updateState }) {
  const selectedTopics = state.selectedTopics || [];

  function toggleTopic(topic) {
    updateState((current) => {
      const currentTopics = current.selectedTopics || [];
      const exists = currentTopics.includes(topic);
      let nextTopics = currentTopics;

      if (exists) {
        nextTopics = currentTopics.filter((item) => item !== topic);
      } else if (currentTopics.length < lesson.interaction.minSelections) {
        nextTopics = [...currentTopics, topic];
      }

      return {
        ...current,
        selectedTopics: nextTopics,
      };
    });
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        {lesson.interaction.options.map((topic) => {
          const selected = selectedTopics.includes(topic);
          const atLimit = selectedTopics.length >= lesson.interaction.minSelections && !selected;

          return (
            <button
              key={topic}
              type="button"
              onClick={() => toggleTopic(topic)}
              className={cn(
                "rounded-lg border px-4 py-3 text-left text-sm font-medium transition",
                selected
                  ? "border-[#b9d8f3] bg-[#f6fbff] text-[#17304e]"
                  : "border-[#d9dfe9] bg-white text-[#111827] hover:border-[#b9d8f3]",
                atLimit && "opacity-60",
              )}
            >
              {topic}
            </button>
          );
        })}
      </div>

      <p className="text-sm text-[#627089]">
        Picked: <span className="font-semibold text-[#111827]">{selectedTopics.length}</span> / {lesson.interaction.minSelections}
      </p>
    </div>
  );
}

function BusinessSelector({ lesson, state, updateState }) {
  const selectedBusinessId = state.selectedBusiness || lesson.interaction.businesses[0].id;
  const activeBusiness =
    lesson.interaction.businesses.find((business) => business.id === selectedBusinessId) ||
    lesson.interaction.businesses[0];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {lesson.interaction.businesses.map((business) => {
          const active = business.id === selectedBusinessId;

          return (
            <button
              key={business.id}
              type="button"
              onClick={() =>
                updateState((current) => ({
                  ...current,
                  selectedBusiness: business.id,
                }))
              }
              className={cn(
                "rounded-md border px-3 py-2 text-sm font-medium transition",
                active
                  ? "border-[#7dd3fc] bg-[#13263c] text-white"
                  : "border-[#d9dfe9] bg-white text-[#111827] hover:border-[#b9d8f3]",
              )}
            >
              {business.label}
            </button>
          );
        })}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-[#d9dfe9] bg-white p-4 text-sm leading-6 text-[#111827]">
          {activeBusiness.search}
        </div>
        <div className="rounded-lg border border-[#d9dfe9] bg-white p-4 text-sm leading-6 text-[#111827]">
          {activeBusiness.meta}
        </div>
        <div className="rounded-lg border border-[#d9dfe9] bg-white p-4 text-sm leading-6 text-[#111827]">
          {activeBusiness.organic}
        </div>
      </div>
    </div>
  );
}

function LessonInteraction({ lesson, state, updateState }) {
  switch (lesson.interaction.type) {
    case "lane-reveal":
      return <LaneRevealInteraction lesson={lesson} state={state} updateState={updateState} />;
    case "bucket-sort":
      return <AssignmentBoard lesson={lesson} state={state} updateState={updateState} />;
    case "business-selector":
      return <BusinessSelector lesson={lesson} state={state} updateState={updateState} />;
    case "calculator":
      return <CalculatorInteraction lesson={lesson} state={state} updateState={updateState} />;
    case "hotspots":
      return <HotspotInteraction lesson={lesson} state={state} updateState={updateState} />;
    case "conversion-selector":
      return <ConversionSelector lesson={lesson} state={state} updateState={updateState} />;
    case "creative-choice":
      return <CreativeChoice lesson={lesson} state={state} updateState={updateState} />;
    case "weekly-plan":
      return <WeeklyPlan lesson={lesson} state={state} updateState={updateState} />;
    case "timeline-placement":
      return <AssignmentBoard lesson={lesson} state={state} updateState={updateState} timeline />;
    default:
      return null;
  }
}

function Checkpoint({ lesson, state, updateState }) {
  const selectedAnswer = typeof state.selectedAnswer === "number" ? state.selectedAnswer : null;

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-[#111827]">{lesson.checkpoint.question}</p>
      <div className="grid gap-3">
        {lesson.checkpoint.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = isSelected && index === lesson.checkpoint.correct;
          const isIncorrect = isSelected && index !== lesson.checkpoint.correct;

          return (
            <button
              key={option}
              type="button"
              onClick={() =>
                updateState((current) => ({
                  ...current,
                  selectedAnswer: index,
                }))
              }
              className={cn(
                "rounded-lg border px-4 py-3 text-left text-sm transition",
                isCorrect && "border-[#9fd4b1] bg-[#eff9f1] text-[#165b2f]",
                isIncorrect && "border-[#efc0c0] bg-[#fff5f5] text-[#8f2323]",
                !isSelected && "border-[#d9dfe9] bg-white text-[#111827] hover:border-[#b9d8f3]",
              )}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function RewardSticker() {
  return (
    <div className="relative flex min-h-[320px] items-center justify-center overflow-hidden rounded-lg border border-[#1a273b] bg-[radial-gradient(circle_at_top,#18304e,transparent_45%),linear-gradient(180deg,#0f1624,#070b12)] p-6">
      {Array.from({ length: 10 }).map((_, index) => (
        <motion.span
          key={index}
          className="absolute h-2 w-2 rounded-full bg-[#7dd3fc]"
          style={{
            left: `${10 + index * 8}%`,
            top: `${12 + (index % 4) * 18}%`,
          }}
          animate={{ y: [0, -10, 0], opacity: [0.2, 0.9, 0.2] }}
          transition={{ duration: 2 + index * 0.1, repeat: Number.POSITIVE_INFINITY, delay: index * 0.08 }}
        />
      ))}

      <motion.div
        animate={{ scale: [0.98, 1.02, 0.98] }}
        transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        className="relative w-full max-w-[280px] rounded-[28px] border border-[#5678a0] bg-[linear-gradient(180deg,rgba(255,255,255,0.2),rgba(255,255,255,0.03))] px-6 py-8 text-center shadow-[0_18px_70px_rgba(0,0,0,0.4)]"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#dbeafe]">Referral Reward Unlocked</p>
        <p className="mt-6 text-5xl font-semibold tracking-tight text-white">$500 OFF</p>
        <p className="mt-3 text-sm leading-6 text-white/75">When you refer a paying client</p>
      </motion.div>
    </div>
  );
}

function buildStickerMarkup() {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 540">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#18304e"/>
          <stop offset="100%" stop-color="#070b12"/>
        </linearGradient>
        <linearGradient id="card" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.28"/>
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0.08"/>
        </linearGradient>
      </defs>
      <rect width="540" height="540" rx="42" fill="url(#bg)"/>
      <rect x="92" y="112" width="356" height="316" rx="36" fill="url(#card)" stroke="#5678a0" stroke-width="4"/>
      <text x="270" y="180" text-anchor="middle" font-size="24" font-family="Arial, sans-serif" fill="#dbeafe" letter-spacing="3">REFERRAL REWARD UNLOCKED</text>
      <text x="270" y="286" text-anchor="middle" font-size="84" font-weight="700" font-family="Arial, sans-serif" fill="#ffffff">$500 OFF</text>
      <text x="270" y="342" text-anchor="middle" font-size="26" font-family="Arial, sans-serif" fill="rgba(255,255,255,0.78)">When you refer a paying client</text>
    </svg>
  `;
}

export default function AdvertisingCourse({ initialCompleted = false }) {
  const router = useRouter();
  const pathname = usePathname();
  const [currentIndex, setCurrentIndex] = useState(initialCompleted ? LESSONS.length : 0);
  const [maxVisitedIndex, setMaxVisitedIndex] = useState(initialCompleted ? LESSONS.length : 0);
  const [lessonStates, setLessonStates] = useState(createInitialLessonStates);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [copied, setCopied] = useState(false);
  const startedRef = useRef(false);
  const completionTrackedRef = useRef(false);
  const copyTimeoutRef = useRef(null);

  const isCompleted = currentIndex >= LESSONS.length;
  const currentLesson = isCompleted ? null : LESSONS[currentIndex];
  const currentState = currentLesson ? lessonStates[currentLesson.id] || {} : {};
  const visibleTerms = useMemo(() => getVisibleTerms(currentIndex), [currentIndex]);
  const currentLessonTerms = isCompleted ? visibleTerms : currentLesson.terms;
  const progressValue = isCompleted ? 100 : currentLesson.progress;
  const interactionComplete = currentLesson ? isLessonInteractionComplete(currentLesson, currentState) : true;
  const checkpointCorrect = currentLesson ? currentState.selectedAnswer === currentLesson.checkpoint.correct : true;
  const understands = currentLesson ? Boolean(currentState.understood) : true;
  const canAdvance = interactionComplete && checkpointCorrect && understands;

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    void sendCourseEvent("advertising_course_started", {
      initialCompleted,
      path: pathname || ADVERTISING_PATH,
    });
  }, [initialCompleted, pathname]);

  useEffect(() => {
    if (!visibleTerms.length) return;
    if (!selectedTerm || !visibleTerms.includes(selectedTerm)) {
      setSelectedTerm(visibleTerms[visibleTerms.length - 1]);
    }
  }, [selectedTerm, visibleTerms]);

  useEffect(() => {
    if (!isCompleted || completionTrackedRef.current) return;
    completionTrackedRef.current = true;
    void sendCourseEvent("course_completed", {
      lessonsCompleted: LESSONS.length,
    });
    void sendCourseEvent("referral_reward_unlocked", {
      reward: "$500 off next invoice",
    });
  }, [isCompleted]);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        window.clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  function updateLessonState(lessonId, updater) {
    setLessonStates((current) => {
      const previousState = current[lessonId] || {};
      const nextState = typeof updater === "function" ? updater(previousState) : { ...previousState, ...updater };
      return {
        ...current,
        [lessonId]: nextState,
      };
    });
  }

  function handleAdvance() {
    if (!currentLesson || !canAdvance) return;

    void sendCourseEvent("lesson_completed", {
      lessonId: currentLesson.id,
      lessonTitle: currentLesson.title,
      lessonNumber: currentIndex + 1,
    });

    const nextIndex = currentIndex + 1;

    if (nextIndex >= LESSONS.length) {
      setCurrentIndex(LESSONS.length);
      setMaxVisitedIndex(LESSONS.length);
      router.replace(`${ADVERTISING_PATH}?completed=true`, { scroll: false });
      return;
    }

    setCurrentIndex(nextIndex);
    setMaxVisitedIndex((current) => Math.max(current, nextIndex));
  }

  function handleBack() {
    if (isCompleted) {
      setCurrentIndex(LESSONS.length - 1);
      router.replace(ADVERTISING_PATH, { scroll: false });
      return;
    }

    if (currentIndex === 0) return;
    setCurrentIndex(currentIndex - 1);
  }

  function jumpTo(index) {
    if (index > maxVisitedIndex) return;
    setCurrentIndex(index);
    if (index < LESSONS.length) {
      router.replace(ADVERTISING_PATH, { scroll: false });
    }
  }

  function handleReplay() {
    setLessonStates(createInitialLessonStates());
    setCurrentIndex(0);
    setMaxVisitedIndex(0);
    setSelectedTerm(null);
    completionTrackedRef.current = false;
    router.replace(ADVERTISING_PATH, { scroll: false });
  }

  async function handleCopyReferralLink() {
    if (typeof window === "undefined") return;
    const referralUrl = `${window.location.origin}${REFERRAL_LINK_PATH}`;

    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      void sendCourseEvent("referral_link_copied", { referralUrl });
      if (copyTimeoutRef.current) {
        window.clearTimeout(copyTimeoutRef.current);
      }
      copyTimeoutRef.current = window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  }

  function handleDownloadSticker() {
    if (typeof window === "undefined") return;

    const blob = new Blob([buildStickerMarkup()], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "usatii-referral-reward.svg";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function handleKickoffClick() {
    void sendCourseEvent("kickoff_call_clicked", {
      destination: KICKOFF_CALL_URL,
    });
    if (typeof window !== "undefined") {
      window.open(KICKOFF_CALL_URL, "_blank", "noopener,noreferrer");
    }
  }

  async function handleShareToFriend() {
    if (typeof window === "undefined") return;

    const shareUrl = `${window.location.origin}${REFERRAL_LINK_PATH}`;
    const shareText = "I finished USATII's Advertising 101 course. This is a clean walkthrough of Search, Meta, organic social, SEO, and tracking.";

    if (navigator.share) {
      try {
        await navigator.share({
          title: "USATII Advertising 101",
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch {
        // fall through to mailto
      }
    }

    window.location.href = `mailto:?subject=${encodeURIComponent("USATII Advertising 101")}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`;
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[#0b0f16] text-white">
      <div className="mx-auto flex h-screen max-w-[1600px] flex-col px-3 py-3 sm:px-4 sm:py-4">
        <header className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-4">
          <div className="flex items-start justify-between gap-4">
            <BrandMark />

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">
                <span>{COURSE_DURATION}</span>
                <span className="h-1 w-1 rounded-full bg-white/25" />
                <span>Client onboarding course</span>
              </div>
              <h1 className="mt-1 text-base font-semibold text-white sm:text-lg">{COURSE_TITLE}</h1>
              <p className="mt-1 hidden max-w-4xl text-sm leading-6 text-white/60 lg:block">{COURSE_SUBTITLE}</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden text-right lg:block">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
                  {isCompleted ? "Course complete" : `Lesson ${currentIndex + 1} of ${LESSONS.length}`}
                </p>
                <p className="mt-1 text-sm text-white/70">{progressValue}% complete</p>
              </div>

              <div className="lg:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="border-white/15 bg-white/[0.06] text-white hover:bg-white/[0.1] hover:text-white">
                      <PanelRightOpen className="h-4 w-4" />
                      Glossary
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[90vw] max-w-sm border-white/10 bg-[#0b0f16] p-0 text-white">
                    <SheetHeader className="border-b border-white/10 px-4 py-4">
                      <SheetTitle className="text-white">Glossary</SheetTitle>
                      <SheetDescription className="text-white/60">
                        Terms appear as the course introduces them.
                      </SheetDescription>
                    </SheetHeader>
                    <div className="h-[calc(100%-81px)] p-4">
                      <GlossaryPanel
                        visibleTerms={visibleTerms}
                        selectedTerm={selectedTerm}
                        onSelectTerm={setSelectedTerm}
                        currentLessonTerms={currentLessonTerms}
                        isCompleted={isCompleted}
                      />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="h-1 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-[linear-gradient(90deg,#7dd3fc,#ffffff,#60a5fa)]"
                animate={{ width: `${progressValue}%` }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-white/55">
              <span>{isCompleted ? "Reward screen" : `Lesson ${currentIndex + 1} of ${LESSONS.length}`}</span>
              <span>{progressValue}%</span>
            </div>
          </div>
        </header>

        <div className="mt-3 grid min-h-0 flex-1 gap-3 lg:grid-cols-[minmax(0,1fr)_320px]">
          <main className="min-h-0 overflow-hidden rounded-lg border border-white/10 bg-[#f4f6fb] text-[#111827]">
            <AnimatePresence mode="wait">
              {isCompleted ? (
                <motion.div
                  key="completion"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.18 }}
                  className="flex h-full flex-col"
                >
                  <ScrollArea className="min-h-0 flex-1">
                    <div className="grid gap-6 p-5 xl:grid-cols-[minmax(0,1fr)_360px]">
                      <div className="space-y-5">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6d7991]">Completed</p>
                          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#101828] sm:text-4xl">
                            You now understand the basics.
                          </h2>
                          <p className="mt-3 max-w-3xl text-base leading-8 text-[#58657d]">
                            You do not need to be a marketer. You need a working model: Google captures demand, Meta creates or retargets demand, organic social builds trust, the website converts attention into leads, and tracking tells us what is working.
                          </p>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                          {[
                            "Google captures demand",
                            "Meta creates and retargets demand",
                            "Organic social builds trust",
                            "Tracking proves what worked",
                          ].map((item) => (
                            <div key={item} className="rounded-lg border border-[#d9dfe9] bg-white px-4 py-3 text-sm font-medium text-[#111827]">
                              {item}
                            </div>
                          ))}
                        </div>

                        <div className="rounded-lg border border-[#d9dfe9] bg-white p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6a7489]">What to expect next</p>
                          <div className="mt-3 grid gap-3">
                            {COMPLETION_NOTES.map((note) => (
                              <div key={note} className="rounded-md border border-[#edf1f6] bg-[#f8fbff] px-4 py-3 text-sm leading-6 text-[#425067]">
                                {note}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="rounded-lg border border-[#d9dfe9] bg-white p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6a7489]">Reward terms</p>
                          <p className="mt-2 text-sm leading-7 text-[#425067]">{REWARD_TERMS}</p>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                          <Button type="button" onClick={handleCopyReferralLink} className="justify-start gap-2 bg-[#111827] text-white hover:bg-[#0f172a]">
                            <Copy className="h-4 w-4" />
                            {copied ? "Copied" : "Copy referral link"}
                          </Button>
                          <Button type="button" variant="outline" onClick={handleDownloadSticker} className="justify-start gap-2">
                            <Download className="h-4 w-4" />
                            Download sticker
                          </Button>
                          <Button type="button" variant="outline" onClick={handleKickoffClick} className="justify-start gap-2">
                            <ExternalLink className="h-4 w-4" />
                            Book kickoff call
                          </Button>
                          <Button type="button" variant="outline" onClick={handleShareToFriend} className="justify-start gap-2">
                            <Share2 className="h-4 w-4" />
                            Send this to a friend
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <RewardSticker />
                        <div className="rounded-lg border border-[#d9dfe9] bg-white p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6a7489]">Client confidence check</p>
                          <div className="mt-3 grid gap-2">
                            {[
                              "You can follow kickoff call priorities.",
                              "You can read invoice line items more clearly.",
                              "You know why channel order changes over time.",
                            ].map((item) => (
                              <div key={item} className="flex items-center gap-2 text-sm text-[#111827]">
                                <CheckCircle2 className="h-4 w-4 text-[#0f766e]" />
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </motion.div>
              ) : (
                <motion.div
                  key={currentLesson.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.18 }}
                  className="flex h-full flex-col"
                >
                  <ScrollArea className="min-h-0 flex-1">
                    <div className="grid gap-6 p-5 xl:grid-cols-[minmax(0,1fr)_280px]">
                      <div className="space-y-5">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6d7991]">Lesson {currentIndex + 1}</p>
                          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#101828] sm:text-4xl">
                            {currentLesson.title}
                          </h2>
                        </div>

                        <div className="space-y-4 text-base leading-8 text-[#425067]">
                          {currentLesson.body.map((paragraph) => (
                            <p key={paragraph}>{paragraph}</p>
                          ))}
                        </div>

                        <div className="rounded-lg border border-[#d9dfe9] bg-white p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6a7489]">Example</p>
                          <p className="mt-2 text-sm leading-7 text-[#425067]">{currentLesson.example}</p>
                        </div>

                        <div className="rounded-lg border border-[#d9dfe9] bg-[#f8fbff] p-4">
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6a7489]">Interaction</p>
                              <p className="mt-1 text-sm text-[#425067]">{currentLesson.interaction.prompt}</p>
                            </div>
                            <StatusChip done={interactionComplete} label="Activity complete" />
                          </div>
                          <div className="mt-4">
                            <LessonInteraction
                              lesson={currentLesson}
                              state={currentState}
                              updateState={(updater) => updateLessonState(currentLesson.id, updater)}
                            />
                          </div>
                        </div>

                        <div className="rounded-lg border border-[#d9dfe9] bg-white p-4">
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6a7489]">Checkpoint</p>
                              <p className="mt-1 text-sm text-[#425067]">Pick the answer that best matches the lesson.</p>
                            </div>
                            <StatusChip done={checkpointCorrect} label="Answer correct" />
                          </div>
                          <div className="mt-4">
                            <Checkpoint
                              lesson={currentLesson}
                              state={currentState}
                              updateState={(updater) => updateLessonState(currentLesson.id, updater)}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <LessonDiagram variant={currentLesson.diagram} />

                        <div className="rounded-lg border border-[#d9dfe9] bg-white p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6a7489]">Move-on checklist</p>
                          <div className="mt-3 grid gap-2">
                            <StatusChip done={interactionComplete} label="Interaction completed" />
                            <StatusChip done={checkpointCorrect} label="Checkpoint answered" />
                            <StatusChip done={understands} label="I understand confirmed" />
                          </div>
                        </div>

                        <div className="rounded-lg border border-[#d9dfe9] bg-white p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6a7489]">Why this lesson matters</p>
                          <p className="mt-2 text-sm leading-7 text-[#425067]">
                            This step makes the later kickoff, invoice, and budget conversations easier because it explains the role each channel or metric plays in the system.
                          </p>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          <aside className="hidden min-h-0 lg:block">
            <GlossaryPanel
              visibleTerms={visibleTerms}
              selectedTerm={selectedTerm}
              onSelectTerm={setSelectedTerm}
              currentLessonTerms={currentLessonTerms}
              isCompleted={isCompleted}
            />
          </aside>
        </div>

        <footer className="mt-3 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={!isCompleted && currentIndex === 0}
                className="border-white/15 bg-white/[0.06] text-white hover:bg-white/[0.1] hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>

              {isCompleted ? (
                <Button type="button" onClick={handleReplay} className="bg-white text-[#111827] hover:bg-white/90">
                  <RotateCcw className="h-4 w-4" />
                  Replay course
                </Button>
              ) : (
                <Button type="button" onClick={handleAdvance} disabled={!canAdvance} className="bg-white text-[#111827] hover:bg-white/90">
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>

            {!isCompleted ? (
              <label className="flex items-center gap-3 rounded-lg border border-white/10 bg-black/20 px-4 py-2.5 text-sm text-white/85">
                <input
                  type="checkbox"
                  checked={understands}
                  onChange={(event) =>
                    updateLessonState(currentLesson.id, (current) => ({
                      ...current,
                      understood: event.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded border-white/25 bg-transparent"
                />
                <span>I understand</span>
              </label>
            ) : (
              <div className="rounded-lg border border-white/10 bg-black/20 px-4 py-2.5 text-sm text-white/75">
                Reward actions unlocked
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2">
              {LESSONS.map((lesson, index) => {
                const isActive = !isCompleted && index === currentIndex;
                const isAvailable = isCompleted || index <= maxVisitedIndex;
                const isDone = isCompleted || index < currentIndex;

                return (
                  <button
                    key={lesson.id}
                    type="button"
                    onClick={() => jumpTo(index)}
                    disabled={!isAvailable}
                    className={cn(
                      "h-2.5 w-2.5 rounded-full transition",
                      isActive && "w-7 bg-white",
                      !isActive && isDone && "bg-[#7dd3fc]",
                      !isActive && !isDone && isAvailable && "bg-white/35",
                      !isAvailable && "bg-white/15",
                    )}
                    aria-label={`Go to lesson ${index + 1}`}
                  />
                );
              })}
            </div>
          </div>

          {!isCompleted && !canAdvance ? (
            <p className="mt-3 text-xs text-white/55">
              Complete the activity, answer the checkpoint, and confirm understanding before moving on.
            </p>
          ) : null}
        </footer>
      </div>
    </div>
  );
}

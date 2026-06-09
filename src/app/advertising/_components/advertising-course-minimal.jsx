"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Copy,
  ExternalLink,
  FileText,
  Lightbulb,
  RotateCcw,
  Tags,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  ADVERTISING_PATH,
  COMPLETION_NOTES,
  GLOSSARY,
  KICKOFF_CALL_URL,
  LESSONS,
  REFERRAL_REWARD_CODE,
} from "./advertising-course-data";

const SESSION_KEY = "usatii_telemetry_session_id";
const SUPPORT_GUIDE_KEY = "usatii_advertising_support_intro_seen_v3";
const SUPPORT_GUIDE_STEPS = [
  {
    id: "textbook",
    label: "Textbook",
    sentence: "Use this to reopen the lesson text.",
  },
  {
    id: "example",
    label: "Example",
    sentence: "Use this to see one quick example.",
  },
  {
    id: "terms",
    label: "Terms",
    sentence: "Use this to define a word fast.",
  },
  {
    id: "hint",
    label: "Hint",
    sentence: "Use this when you need a small nudge.",
  },
];
const PRIMARY_ACTION_BUTTON_CLASS =
  "h-auto rounded-full bg-[#111827] px-7 py-4 text-base font-semibold text-white shadow-[0_12px_30px_rgba(15,23,42,0.08)] transition hover:bg-[#1f2937] hover:shadow-[0_16px_36px_rgba(15,23,42,0.12)]";
const LESSON_ILLUSTRATION_MARKUP = {
  "what-is-advertising": `<svg viewBox="0 0 640 360" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
      <path d="M1 1L9 5L1 9V1Z" fill="#334155"/>
    </marker>

    <linearGradient id="blue" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#60A5FA"/>
      <stop offset="1" stop-color="#2563EB"/>
    </linearGradient>

    <linearGradient id="purple" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#A78BFA"/>
      <stop offset="1" stop-color="#7C3AED"/>
    </linearGradient>

    <linearGradient id="amber" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#FBBF24"/>
      <stop offset="1" stop-color="#F97316"/>
    </linearGradient>

    <linearGradient id="green" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#34D399"/>
      <stop offset="1" stop-color="#16A34A"/>
    </linearGradient>
  </defs>

  <rect width="640" height="360" rx="28" fill="transparent"/>
  <circle cx="86" cy="92" r="38" fill="url(#blue)"/>
  <circle cx="78" cy="84" r="13" stroke="white" stroke-width="5"/>
  <path d="M89 95L103 109" stroke="white" stroke-width="5" stroke-linecap="round"/>
  <circle cx="86" cy="180" r="38" fill="url(#purple)"/>
  <rect x="69" y="153" width="34" height="54" rx="8" stroke="white" stroke-width="5"/>
  <path d="M80 169H92" stroke="white" stroke-width="4" stroke-linecap="round"/>
  <path d="M80 181H92" stroke="white" stroke-width="4" stroke-linecap="round"/>
  <path d="M80 193H88" stroke="white" stroke-width="4" stroke-linecap="round"/>
  <circle cx="86" cy="268" r="38" fill="url(#amber)"/>
  <path d="M86 239L110 249V268C110 285 99 295 86 300C73 295 62 285 62 268V249L86 239Z" stroke="white" stroke-width="5" stroke-linejoin="round"/>
  <path d="M74 270L83 279L100 258" stroke="white" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M132 92C188 92 206 136 249 154" stroke="#334155" stroke-width="3" stroke-linecap="round" marker-end="url(#arrow)"/>
  <path d="M132 180H249" stroke="#334155" stroke-width="3" stroke-linecap="round" marker-end="url(#arrow)"/>
  <path d="M132 268C188 268 206 224 249 206" stroke="#334155" stroke-width="3" stroke-linecap="round" marker-end="url(#arrow)"/>
  <circle cx="320" cy="180" r="72" fill="#0F172A"/>
  <circle cx="320" cy="180" r="50" fill="#1E293B" stroke="#38BDF8" stroke-width="3"/>
  <circle cx="320" cy="180" r="18" fill="#38BDF8"/>
  <path d="M320 109V137" stroke="#94A3B8" stroke-width="3" stroke-linecap="round"/>
  <path d="M320 223V251" stroke="#94A3B8" stroke-width="3" stroke-linecap="round"/>
  <path d="M249 180H277" stroke="#94A3B8" stroke-width="3" stroke-linecap="round"/>
  <path d="M363 180H391" stroke="#94A3B8" stroke-width="3" stroke-linecap="round"/>
  <circle cx="276" cy="136" r="18" fill="#DBEAFE"/>
  <path d="M267 136H285" stroke="#2563EB" stroke-width="4" stroke-linecap="round"/>
  <path d="M276 127V145" stroke="#2563EB" stroke-width="4" stroke-linecap="round"/>
  <circle cx="364" cy="136" r="18" fill="#DCFCE7"/>
  <path d="M364 130C370 130 375 135 375 141" stroke="#16A34A" stroke-width="4" stroke-linecap="round"/>
  <path d="M353 141C353 135 358 130 364 130" stroke="#16A34A" stroke-width="4" stroke-linecap="round"/>
  <circle cx="364" cy="143" r="5" fill="#16A34A"/>
  <circle cx="320" cy="248" r="18" fill="#FEF3C7"/>
  <circle cx="320" cy="248" r="9" stroke="#F59E0B" stroke-width="4"/>
  <path d="M320 242V248L325 253" stroke="#F59E0B" stroke-width="3" stroke-linecap="round"/>
  <path d="M397 180H471" stroke="#334155" stroke-width="3" stroke-linecap="round" marker-end="url(#arrow)"/>
  <circle cx="538" cy="180" r="58" fill="url(#green)"/>
  <path d="M512 181L529 198L565 160" stroke="white" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="494" cy="95" r="24" fill="#E0F2FE" stroke="#BAE6FD"/>
  <path d="M485 91V83H503V91" stroke="#0284C7" stroke-width="3" stroke-linecap="round"/>
  <rect x="482" y="91" width="24" height="17" rx="4" stroke="#0284C7" stroke-width="3"/>
  <circle cx="582" cy="95" r="24" fill="#ECFDF5" stroke="#BBF7D0"/>
  <path d="M572 87H592" stroke="#16A34A" stroke-width="3" stroke-linecap="round"/>
  <path d="M572 96H592" stroke="#16A34A" stroke-width="3" stroke-linecap="round"/>
  <path d="M572 105H584" stroke="#16A34A" stroke-width="3" stroke-linecap="round"/>
  <circle cx="494" cy="265" r="24" fill="#FFF7ED" stroke="#FED7AA"/>
  <path d="M481 255H507V274H491L483 282V274H481V255Z" stroke="#EA580C" stroke-width="3" stroke-linejoin="round"/>
  <circle cx="582" cy="265" r="24" fill="#FDF2F8" stroke="#FBCFE8"/>
  <path d="M570 258H594L591 274H574L570 258Z" stroke="#DB2777" stroke-width="3" stroke-linejoin="round"/>
  <path d="M574 258L577 251H587L590 258" stroke="#DB2777" stroke-width="3" stroke-linecap="round"/>
</svg>`,
  "what-google-ads-does": `<svg viewBox="0 0 640 360" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="sys-bg" x1="0" y1="0" x2="640" y2="360" gradientUnits="userSpaceOnUse">
      <stop stop-color="#F8FAFC"/>
      <stop offset="1" stop-color="#EEF2FF"/>
    </linearGradient>
    <linearGradient id="sys-blue" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#60A5FA"/>
      <stop offset="1" stop-color="#2563EB"/>
    </linearGradient>
    <linearGradient id="sys-amber" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#FBBF24"/>
      <stop offset="1" stop-color="#F97316"/>
    </linearGradient>
    <linearGradient id="sys-green" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#34D399"/>
      <stop offset="1" stop-color="#16A34A"/>
    </linearGradient>
    <linearGradient id="sys-purple" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#A78BFA"/>
      <stop offset="1" stop-color="#7C3AED"/>
    </linearGradient>
    <filter id="sys-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="9" stdDeviation="10" flood-color="#0F172A" flood-opacity="0.13"/>
    </filter>
  </defs>

  <rect width="640" height="360" rx="28" fill="url(#sys-bg)"/>

  <g stroke="#94A3B8" stroke-width="3" stroke-linecap="round" opacity="0.75">
    <path d="M112 180H124"/>
    <path d="M124 174L134 180L124 186Z" fill="#94A3B8" stroke="none"/>
    <path d="M214 180H226"/>
    <path d="M226 174L236 180L226 186Z" fill="#94A3B8" stroke="none"/>
    <path d="M316 180H328"/>
    <path d="M328 174L338 180L328 186Z" fill="#94A3B8" stroke="none"/>
    <path d="M418 180H430"/>
    <path d="M430 174L440 180L430 186Z" fill="#94A3B8" stroke="none"/>
    <path d="M520 180H532"/>
    <path d="M532 174L542 180L532 186Z" fill="#94A3B8" stroke="none"/>
  </g>

  <g filter="url(#sys-shadow)">
    <rect x="34" y="126" width="76" height="108" rx="24" fill="#FFFFFF" stroke="#DBEAFE"/>
    <rect x="136" y="126" width="76" height="108" rx="24" fill="#FFFFFF" stroke="#FEF3C7"/>
    <rect x="238" y="126" width="76" height="108" rx="24" fill="#FFFFFF" stroke="#DCFCE7"/>
    <rect x="340" y="126" width="76" height="108" rx="24" fill="#FFFFFF" stroke="#EDE9FE"/>
    <rect x="442" y="126" width="76" height="108" rx="24" fill="#FFFFFF" stroke="#E0F2FE"/>
    <rect x="544" y="126" width="76" height="108" rx="24" fill="#FFFFFF" stroke="#BBF7D0"/>
  </g>

  <circle cx="72" cy="180" r="32" fill="#DBEAFE"/>
  <circle cx="72" cy="180" r="22" stroke="#2563EB" stroke-width="5"/>
  <circle cx="72" cy="180" r="11" stroke="#2563EB" stroke-width="4" opacity="0.8"/>
  <circle cx="72" cy="180" r="4" fill="#2563EB"/>
  <path d="M87 165L98 154" stroke="#2563EB" stroke-width="4" stroke-linecap="round"/>
  <path d="M98 154V165H87" stroke="#2563EB" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>

  <circle cx="174" cy="180" r="32" fill="#FEF3C7"/>
  <ellipse cx="174" cy="161" rx="19" ry="8" fill="url(#sys-amber)"/>
  <path d="M155 161V176C155 180.5 163.5 184 174 184C184.5 184 193 180.5 193 176V161" fill="#FDBA74"/>
  <ellipse cx="174" cy="176" rx="19" ry="8" fill="#F59E0B"/>
  <path d="M155 176V192C155 196.5 163.5 200 174 200C184.5 200 193 196.5 193 192V176" fill="#FDBA74"/>
  <ellipse cx="174" cy="192" rx="19" ry="8" fill="url(#sys-amber)"/>
  <path d="M156 163C162 166 186 166 192 163" stroke="#FFFBEB" stroke-width="3" stroke-linecap="round" opacity="0.7"/>

  <circle cx="276" cy="180" r="32" fill="#DCFCE7"/>
  <rect x="251" y="156" width="36" height="17" rx="8.5" fill="url(#sys-green)"/>
  <rect x="263" y="180" width="37" height="17" rx="8.5" fill="#86EFAC"/>
  <rect x="249" y="201" width="27" height="13" rx="6.5" fill="#BBF7D0"/>
  <circle cx="293" cy="164" r="10" stroke="#166534" stroke-width="4"/>
  <path d="M300 171L309 180" stroke="#166534" stroke-width="4" stroke-linecap="round"/>
  <circle cx="260" cy="164.5" r="3" fill="#FFFFFF"/>
  <circle cx="272" cy="188.5" r="3" fill="#166534"/>

  <circle cx="378" cy="180" r="32" fill="#EDE9FE"/>
  <path d="M356 183H367L388 169V195L367 183" fill="url(#sys-purple)" stroke="#6D28D9" stroke-width="3" stroke-linejoin="round"/>
  <path d="M360 184L365 203H376L370 184" fill="#DDD6FE" stroke="#6D28D9" stroke-width="3" stroke-linejoin="round"/>
  <path d="M394 168C400 174 400 190 394 196" stroke="#7C3AED" stroke-width="4" stroke-linecap="round"/>

  <circle cx="480" cy="180" r="32" fill="#E0F2FE"/>
  <rect x="456" y="156" width="48" height="48" rx="8" fill="#FFFFFF" stroke="#0284C7" stroke-width="4"/>
  <path d="M456 169H504" stroke="#0284C7" stroke-width="4"/>
  <circle cx="466" cy="162.5" r="3" fill="#38BDF8"/>
  <circle cx="477" cy="162.5" r="3" fill="#38BDF8"/>
  <rect x="466" y="180" width="28" height="7" rx="3.5" fill="#BAE6FD"/>
  <rect x="466" y="193" width="19" height="7" rx="3.5" fill="#38BDF8"/>

  <circle cx="582" cy="180" r="32" fill="#DCFCE7"/>
  <path d="M565 154L594 183H580L589 202L579 207L570 188L560 199L565 154Z" fill="#FFFFFF" stroke="#166534" stroke-width="4" stroke-linejoin="round"/>
  <circle cx="599" cy="154" r="12" fill="url(#sys-green)"/>
  <path d="M594 154L597 158L604 150" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M559 220C567 213 597 213 605 220" stroke="#16A34A" stroke-width="5" stroke-linecap="round"/>
</svg>`,
  "three-traffic-lanes": `<svg viewBox="0 0 640 360" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="lanes-bg" x1="0" y1="0" x2="640" y2="360" gradientUnits="userSpaceOnUse">
      <stop stop-color="#F8FAFC"/>
      <stop offset="1" stop-color="#F1F5F9"/>
    </linearGradient>
    <linearGradient id="lanes-blue" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#60A5FA"/>
      <stop offset="1" stop-color="#2563EB"/>
    </linearGradient>
    <linearGradient id="lanes-purple" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#A78BFA"/>
      <stop offset="1" stop-color="#7C3AED"/>
    </linearGradient>
    <linearGradient id="lanes-amber" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#FBBF24"/>
      <stop offset="1" stop-color="#F97316"/>
    </linearGradient>
    <linearGradient id="lanes-green" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#34D399"/>
      <stop offset="1" stop-color="#16A34A"/>
    </linearGradient>
    <filter id="lanes-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="9" stdDeviation="10" flood-color="#0F172A" flood-opacity="0.14"/>
    </filter>
  </defs>

  <rect width="640" height="360" rx="28" fill="url(#lanes-bg)"/>

  <path d="M58 96C178 60 312 70 398 108C440 126 462 140 492 140" stroke="#E2E8F0" stroke-width="50" stroke-linecap="round"/>
  <path d="M58 180H492" stroke="#E2E8F0" stroke-width="50" stroke-linecap="round"/>
  <path d="M58 264C178 300 312 290 398 252C440 234 462 220 492 220" stroke="#E2E8F0" stroke-width="50" stroke-linecap="round"/>

  <path d="M58 96C178 60 312 70 398 108C440 126 462 140 492 140" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-dasharray="12 16" opacity="0.55"/>
  <path d="M58 180H492" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-dasharray="12 16" opacity="0.55"/>
  <path d="M58 264C178 300 312 290 398 252C440 234 462 220 492 220" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-dasharray="12 16" opacity="0.55"/>

  <path d="M70 96C185 64 312 74 392 110C432 128 456 140 484 140" stroke="#2563EB" stroke-width="8" stroke-linecap="round"/>
  <path d="M484 132L498 140L484 148Z" fill="#2563EB"/>

  <path d="M70 180H484" stroke="#7C3AED" stroke-width="8" stroke-linecap="round"/>
  <path d="M484 172L498 180L484 188Z" fill="#7C3AED"/>

  <path d="M70 264C185 296 312 286 392 250C432 232 456 220 484 220" stroke="#F97316" stroke-width="8" stroke-linecap="round"/>
  <path d="M484 212L498 220L484 228Z" fill="#F97316"/>

  <g opacity="0.45" stroke-linecap="round">
    <path d="M334 122H286" stroke="#2563EB" stroke-width="5"/>
    <path d="M334 136H260" stroke="#2563EB" stroke-width="5"/>
    <path d="M270 168H226" stroke="#7C3AED" stroke-width="5"/>
    <path d="M270 192H210" stroke="#7C3AED" stroke-width="5"/>
    <path d="M190 250H158" stroke="#F97316" stroke-width="5"/>
  </g>

  <g filter="url(#lanes-shadow)">
    <circle cx="372" cy="126" r="31" fill="url(#lanes-blue)"/>
    <circle cx="364" cy="118" r="12" stroke="#FFFFFF" stroke-width="5"/>
    <path d="M374 128L386 140" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round"/>

    <circle cx="318" cy="180" r="31" fill="url(#lanes-purple)"/>
    <rect x="303" y="157" width="30" height="46" rx="8" stroke="#FFFFFF" stroke-width="5"/>
    <path d="M313 171H324" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/>
    <path d="M313 183H324" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/>
    <path d="M313 195H319" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/>

    <circle cx="230" cy="250" r="31" fill="url(#lanes-amber)"/>
    <path d="M230 225L251 234V251C251 266 242 275 230 279C218 275 209 266 209 251V234L230 225Z" stroke="#FFFFFF" stroke-width="5" stroke-linejoin="round"/>
    <path d="M219 251L227 259L242 241" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  </g>

  <g filter="url(#lanes-shadow)">
    <circle cx="558" cy="180" r="59" fill="#FFFFFF" stroke="#BBF7D0" stroke-width="3"/>
    <circle cx="558" cy="180" r="42" fill="#DCFCE7"/>
    <circle cx="558" cy="180" r="25" fill="url(#lanes-green)"/>
    <path d="M544 180L555 191L574 168" stroke="#FFFFFF" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M558 121V101" stroke="#16A34A" stroke-width="5" stroke-linecap="round"/>
    <path d="M558 101H595L584 116L595 131H558Z" fill="#BBF7D0" stroke="#16A34A" stroke-width="4" stroke-linejoin="round"/>
  </g>
</svg>`,
  "why-search-first": `<svg viewBox="0 0 640 360" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="intent-bg" x1="0" y1="0" x2="640" y2="360" gradientUnits="userSpaceOnUse">
      <stop stop-color="#F8FAFC"/>
      <stop offset="1" stop-color="#ECFDF5"/>
    </linearGradient>
    <linearGradient id="intent-green" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#34D399"/>
      <stop offset="1" stop-color="#16A34A"/>
    </linearGradient>
    <filter id="intent-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="9" stdDeviation="10" flood-color="#0F172A" flood-opacity="0.13"/>
    </filter>
  </defs>

  <rect width="640" height="360" rx="28" fill="url(#intent-bg)"/>

  <g filter="url(#intent-shadow)">
    <rect x="52" y="52" width="536" height="76" rx="28" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
    <circle cx="91" cy="90" r="13" stroke="#2563EB" stroke-width="5"/>
    <path d="M101 100L116 115" stroke="#2563EB" stroke-width="5" stroke-linecap="round"/>

    <rect x="142" y="73" width="74" height="18" rx="9" fill="#DCFCE7"/>
    <circle cx="157" cy="82" r="6" fill="#22C55E"/>
    <path d="M154 82L157 85L162 79" stroke="#FFFFFF" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/>

    <rect x="230" y="73" width="88" height="18" rx="9" fill="#DCFCE7"/>
    <circle cx="245" cy="82" r="6" fill="#22C55E"/>
    <path d="M242 82L245 85L250 79" stroke="#FFFFFF" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/>

    <rect x="332" y="73" width="76" height="18" rx="9" fill="#E2E8F0"/>
    <circle cx="347" cy="82" r="6" fill="#94A3B8"/>
    <path d="M344 79L350 85" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
    <path d="M350 79L344 85" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>

    <rect x="422" y="73" width="88" height="18" rx="9" fill="#E2E8F0"/>
    <circle cx="437" cy="82" r="6" fill="#94A3B8"/>
    <path d="M434 79L440 85" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
    <path d="M440 79L434 85" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>

    <rect x="142" y="103" width="124" height="12" rx="6" fill="#BBF7D0"/>
    <rect x="282" y="103" width="84" height="12" rx="6" fill="#CBD5E1"/>
    <rect x="382" y="103" width="122" height="12" rx="6" fill="#CBD5E1"/>
  </g>

  <path d="M178 128C198 150 226 160 268 168" stroke="#16A34A" stroke-width="5" stroke-linecap="round"/>
  <path d="M266 162L279 170L264 174Z" fill="#16A34A"/>
  <path d="M274 128C286 150 306 157 321 171" stroke="#16A34A" stroke-width="5" stroke-linecap="round"/>
  <path d="M320 164L332 178L315 175Z" fill="#16A34A"/>

  <path d="M370 128C350 178 288 248 230 288" stroke="#94A3B8" stroke-width="4" stroke-linecap="round" stroke-dasharray="7 9"/>
  <path d="M230 278L223 295L240 287Z" fill="#94A3B8"/>
  <path d="M466 128C476 174 458 245 416 288" stroke="#94A3B8" stroke-width="4" stroke-linecap="round" stroke-dasharray="7 9"/>
  <path d="M418 278L407 294L426 290Z" fill="#94A3B8"/>

  <g filter="url(#intent-shadow)">
    <path d="M244 158H396L354 226V247L320 268L286 247V226L244 158Z" fill="#FFFFFF" stroke="#38BDF8" stroke-width="4" stroke-linejoin="round"/>
    <path d="M265 176H375L342 226V237L320 251L298 237V226L265 176Z" fill="#E0F2FE"/>
    <path d="M277 184H363" stroke="#38BDF8" stroke-width="5" stroke-linecap="round"/>
    <path d="M293 215H347" stroke="#38BDF8" stroke-width="5" stroke-linecap="round"/>
  </g>

  <g opacity="0.7">
    <circle cx="208" cy="305" r="18" fill="#CBD5E1"/>
    <path d="M200 297L216 313" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/>
    <path d="M216 297L200 313" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/>

    <circle cx="416" cy="305" r="18" fill="#CBD5E1"/>
    <path d="M408 297L424 313" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/>
    <path d="M424 297L408 313" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/>
  </g>

  <path d="M354 230C392 230 421 222 454 222" stroke="#16A34A" stroke-width="6" stroke-linecap="round"/>
  <path d="M452 214L466 222L452 230Z" fill="#16A34A"/>

  <g filter="url(#intent-shadow)">
    <rect x="466" y="182" width="122" height="114" rx="28" fill="#FFFFFF" stroke="#BBF7D0" stroke-width="2"/>
    <circle cx="504" cy="226" r="30" fill="url(#intent-green)"/>
    <path d="M489 211C493 229 505 242 524 247L532 238L521 228L514 235C506 231 501 225 498 216L505 209L496 198L488 205C488 207 488.5 209 489 211Z" fill="#FFFFFF"/>

    <rect x="526" y="203" width="36" height="45" rx="7" fill="#E0F2FE" stroke="#0284C7" stroke-width="4"/>
    <path d="M535 216H553" stroke="#0284C7" stroke-width="3" stroke-linecap="round"/>
    <path d="M535 227H553" stroke="#0284C7" stroke-width="3" stroke-linecap="round"/>
    <path d="M535 238H546" stroke="#0284C7" stroke-width="3" stroke-linecap="round"/>

    <circle cx="503" cy="270" r="17" fill="#DCFCE7"/>
    <path d="M494 270L500 276L512 263" stroke="#16A34A" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>

    <circle cx="546" cy="270" r="17" fill="#DCFCE7"/>
    <path d="M537 270L543 276L555 263" stroke="#16A34A" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
</svg>`,
  "how-payments-work": `<svg viewBox="0 0 640 360" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="pay-bg" x1="0" y1="0" x2="640" y2="360" gradientUnits="userSpaceOnUse">
      <stop stop-color="#F8FAFC"/>
      <stop offset="1" stop-color="#EEF2FF"/>
    </linearGradient>
    <linearGradient id="pay-green" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#34D399"/>
      <stop offset="1" stop-color="#16A34A"/>
    </linearGradient>
    <linearGradient id="pay-blue" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#60A5FA"/>
      <stop offset="1" stop-color="#2563EB"/>
    </linearGradient>
    <linearGradient id="pay-purple" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#A78BFA"/>
      <stop offset="1" stop-color="#7C3AED"/>
    </linearGradient>
    <linearGradient id="pay-amber" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#FBBF24"/>
      <stop offset="1" stop-color="#F97316"/>
    </linearGradient>
    <filter id="pay-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="9" stdDeviation="10" flood-color="#0F172A" flood-opacity="0.13"/>
    </filter>
  </defs>

  <rect width="640" height="360" rx="28" fill="url(#pay-bg)"/>

  <g opacity="0.5" stroke="#94A3B8" stroke-width="3" stroke-linecap="round">
    <path d="M140 180H218"/>
    <path d="M218 173L231 180L218 187Z" fill="#94A3B8" stroke="none"/>
    <path d="M250 116L288 146"/>
    <path d="M390 116L352 146"/>
    <path d="M250 244L288 214"/>
    <path d="M390 244L352 214"/>
    <path d="M381 180H474"/>
    <path d="M474 173L487 180L474 187Z" fill="#94A3B8" stroke="none"/>
  </g>

  <g filter="url(#pay-shadow)">
    <rect x="40" y="126" width="100" height="108" rx="26" fill="#FFFFFF" stroke="#BBF7D0"/>
    <circle cx="250" cy="96" r="36" fill="#FFFFFF" stroke="#DBEAFE"/>
    <circle cx="390" cy="96" r="36" fill="#FFFFFF" stroke="#EDE9FE"/>
    <circle cx="250" cy="264" r="36" fill="#FFFFFF" stroke="#FEF3C7"/>
    <circle cx="390" cy="264" r="36" fill="#FFFFFF" stroke="#DCFCE7"/>
    <circle cx="320" cy="180" r="64" fill="#FFFFFF" stroke="#CBD5E1"/>
    <rect x="490" y="116" width="110" height="128" rx="28" fill="#FFFFFF" stroke="#BBF7D0"/>
  </g>

  <ellipse cx="90" cy="154" rx="24" ry="10" fill="url(#pay-green)"/>
  <path d="M66 154V171C66 176.5 76.5 181 90 181C103.5 181 114 176.5 114 171V154" fill="#86EFAC"/>
  <ellipse cx="90" cy="171" rx="24" ry="10" fill="#22C55E"/>
  <path d="M66 171V188C66 193.5 76.5 198 90 198C103.5 198 114 193.5 114 188V171" fill="#86EFAC"/>
  <ellipse cx="90" cy="188" rx="24" ry="10" fill="url(#pay-green)"/>
  <path d="M67 154C76 160 104 160 113 154" stroke="#ECFDF5" stroke-width="3" stroke-linecap="round" opacity="0.8"/>
  <path d="M68 188C77 194 103 194 112 188" stroke="#166534" stroke-width="3" stroke-linecap="round" opacity="0.25"/>

  <path d="M230 96C235 85 243 80 250 80C257 80 265 85 270 96C265 107 257 112 250 112C243 112 235 107 230 96Z" fill="#DBEAFE" stroke="#2563EB" stroke-width="4" stroke-linejoin="round"/>
  <circle cx="250" cy="96" r="7" fill="#2563EB"/>

  <path d="M374 75L402 103H388L397 123L387 128L378 108L368 119L374 75Z" fill="#EDE9FE" stroke="#7C3AED" stroke-width="4" stroke-linejoin="round"/>
  <circle cx="409" cy="82" r="9" fill="url(#pay-purple)"/>
  <circle cx="410" cy="82" r="3" fill="#FFFFFF"/>

  <circle cx="237" cy="254" r="8" stroke="#F97316" stroke-width="4"/>
  <circle cx="263" cy="274" r="8" stroke="#F97316" stroke-width="4"/>
  <path d="M269 246L231 282" stroke="#F97316" stroke-width="5" stroke-linecap="round"/>
  <path d="M241 242H259" stroke="#FBBF24" stroke-width="4" stroke-linecap="round"/>
  <path d="M241 290H259" stroke="#FBBF24" stroke-width="4" stroke-linecap="round"/>

  <circle cx="390" cy="250" r="12" fill="#DCFCE7" stroke="#16A34A" stroke-width="4"/>
  <path d="M366 284C370 268 410 268 414 284" stroke="#16A34A" stroke-width="5" stroke-linecap="round"/>
  <circle cx="410" cy="240" r="10" fill="url(#pay-green)"/>
  <path d="M405 240L409 244L416 236" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>

  <path d="M320 133V218" stroke="#334155" stroke-width="5" stroke-linecap="round"/>
  <path d="M283 158H357" stroke="#334155" stroke-width="5" stroke-linecap="round"/>
  <path d="M320 218H294" stroke="#334155" stroke-width="5" stroke-linecap="round"/>
  <path d="M320 218H346" stroke="#334155" stroke-width="5" stroke-linecap="round"/>
  <path d="M283 158L269 190H299L283 158Z" fill="#DBEAFE" stroke="#2563EB" stroke-width="4" stroke-linejoin="round"/>
  <path d="M357 158L343 190H373L357 158Z" fill="#FEF3C7" stroke="#F97316" stroke-width="4" stroke-linejoin="round"/>
  <ellipse cx="284" cy="190" rx="24" ry="7" fill="#2563EB" opacity="0.9"/>
  <ellipse cx="358" cy="190" rx="24" ry="7" fill="#F97316" opacity="0.9"/>
  <ellipse cx="284" cy="181" rx="12" ry="5" fill="#BFDBFE"/>
  <path d="M358 171L363 181L374 182L366 190L368 201L358 195L348 201L350 190L342 182L353 181L358 171Z" fill="#FBBF24"/>

  <rect x="514" y="144" width="52" height="62" rx="10" fill="#E0F2FE" stroke="#0284C7" stroke-width="4"/>
  <path d="M514 162H566" stroke="#0284C7" stroke-width="4"/>
  <circle cx="526" cy="153" r="3" fill="#38BDF8"/>
  <circle cx="537" cy="153" r="3" fill="#38BDF8"/>
  <rect x="526" y="174" width="28" height="7" rx="3.5" fill="#38BDF8"/>
  <rect x="526" y="188" width="19" height="7" rx="3.5" fill="#BAE6FD"/>
  <circle cx="570" cy="134" r="18" fill="url(#pay-green)"/>
  <path d="M561 134L567 140L579 127" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
  "website-foundation": `<svg viewBox="0 0 640 360" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="leak-bg" x1="0" y1="0" x2="640" y2="360" gradientUnits="userSpaceOnUse">
      <stop stop-color="#F8FAFC"/>
      <stop offset="1" stop-color="#FFF7ED"/>
    </linearGradient>
    <linearGradient id="leak-blue" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#60A5FA"/>
      <stop offset="1" stop-color="#2563EB"/>
    </linearGradient>
    <linearGradient id="leak-green" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#34D399"/>
      <stop offset="1" stop-color="#16A34A"/>
    </linearGradient>
    <linearGradient id="leak-red" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#FB7185"/>
      <stop offset="1" stop-color="#E11D48"/>
    </linearGradient>
    <filter id="leak-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="9" stdDeviation="10" flood-color="#0F172A" flood-opacity="0.13"/>
    </filter>
  </defs>

  <rect width="640" height="360" rx="28" fill="url(#leak-bg)"/>

  <g filter="url(#leak-shadow)">
    <rect x="44" y="96" width="108" height="104" rx="26" fill="#FFFFFF" stroke="#DBEAFE"/>
    <rect x="244" y="44" width="172" height="244" rx="28" fill="#FFFFFF" stroke="#CBD5E1"/>
    <rect x="488" y="132" width="104" height="104" rx="28" fill="#FFFFFF" stroke="#BBF7D0"/>
  </g>

  <path d="M72 146H85L108 132V168L85 154H72V146Z" fill="url(#leak-blue)" stroke="#1D4ED8" stroke-width="4" stroke-linejoin="round"/>
  <path d="M111 133C120 143 120 157 111 167" stroke="#60A5FA" stroke-width="4" stroke-linecap="round"/>
  <circle cx="130" cy="118" r="12" fill="#DBEAFE"/>
  <path d="M125 118L129 122L136 114" stroke="#2563EB" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>

  <path d="M153 148H218" stroke="#334155" stroke-width="5" stroke-linecap="round"/>
  <path d="M218 140L232 148L218 156Z" fill="#334155"/>
  <path d="M196 116L225 145H211L220 164L210 169L201 150L191 161L196 116Z" fill="#FFFFFF" stroke="#0F172A" stroke-width="4" stroke-linejoin="round"/>
  <circle cx="222" cy="124" r="8" fill="#BFDBFE"/>

  <path d="M244 82H416" stroke="#CBD5E1" stroke-width="4"/>
  <circle cx="268" cy="63" r="4" fill="#CBD5E1"/>
  <circle cx="282" cy="63" r="4" fill="#CBD5E1"/>
  <circle cx="296" cy="63" r="4" fill="#CBD5E1"/>

  <path d="M270 112H390L358 212V242L330 260L302 242V212L270 112Z" fill="#E0F2FE" stroke="#0284C7" stroke-width="4" stroke-linejoin="round"/>
  <path d="M288 128H372L346 211V229L330 240L314 229V211L288 128Z" fill="#F8FAFC"/>

  <path d="M295 158C271 174 245 192 222 210" stroke="#E11D48" stroke-width="4" stroke-linecap="round"/>
  <path d="M222 210C212 222 215 237 228 242C241 237 243 222 222 210Z" fill="url(#leak-red)"/>
  <path d="M313 207C287 230 270 253 256 278" stroke="#E11D48" stroke-width="4" stroke-linecap="round"/>
  <path d="M256 278C246 290 249 305 262 310C275 305 277 290 256 278Z" fill="url(#leak-red)"/>
  <path d="M347 207C374 230 392 253 406 278" stroke="#E11D48" stroke-width="4" stroke-linecap="round"/>
  <path d="M406 278C396 290 399 305 412 310C425 305 427 290 406 278Z" fill="url(#leak-red)"/>
  <path d="M365 158C388 174 414 192 438 210" stroke="#E11D48" stroke-width="4" stroke-linecap="round"/>
  <path d="M438 210C428 222 431 237 444 242C457 237 459 222 438 210Z" fill="url(#leak-red)"/>

  <rect x="190" y="258" width="46" height="24" rx="12" fill="#FFE4E6" stroke="#FB7185" stroke-width="3"/>
  <path d="M202 270H224" stroke="#E11D48" stroke-width="4" stroke-linecap="round"/>
  <path d="M224 258L202 282" stroke="#E11D48" stroke-width="3" stroke-linecap="round"/>

  <path d="M263 277L269 289L283 291L273 300L276 314L263 307L250 314L253 300L243 291L257 289L263 277Z" fill="#FFE4E6" stroke="#FB7185" stroke-width="3"/>
  <path d="M249 314L277 286" stroke="#E11D48" stroke-width="3" stroke-linecap="round"/>

  <rect x="388" y="278" width="48" height="30" rx="10" fill="#FFE4E6" stroke="#FB7185" stroke-width="3"/>
  <path d="M399 288H425" stroke="#E11D48" stroke-width="3" stroke-linecap="round"/>
  <path d="M399 298H416" stroke="#E11D48" stroke-width="3" stroke-linecap="round"/>
  <path d="M427 278L397 308" stroke="#E11D48" stroke-width="3" stroke-linecap="round"/>

  <circle cx="452" cy="264" r="17" fill="#FFE4E6" stroke="#FB7185" stroke-width="3"/>
  <circle cx="452" cy="264" r="7" stroke="#E11D48" stroke-width="3"/>
  <path d="M452 247V241" stroke="#E11D48" stroke-width="3" stroke-linecap="round"/>
  <path d="M469 264H475" stroke="#E11D48" stroke-width="3" stroke-linecap="round"/>
  <path d="M466 250L438 278" stroke="#E11D48" stroke-width="3" stroke-linecap="round"/>

  <path d="M358 236H464" stroke="#16A34A" stroke-width="6" stroke-linecap="round"/>
  <path d="M464 228L478 236L464 244Z" fill="#16A34A"/>

  <circle cx="540" cy="184" r="34" fill="url(#leak-green)"/>
  <path d="M524 184L536 196L558 171" stroke="#FFFFFF" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="540" cy="184" r="50" stroke="#DCFCE7" stroke-width="8" opacity="0.9"/>
</svg>`,
  tracking: `<svg viewBox="0 0 640 360" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="track-bg" x1="0" y1="0" x2="640" y2="360" gradientUnits="userSpaceOnUse">
      <stop stop-color="#F8FAFC"/>
      <stop offset="1" stop-color="#ECFEFF"/>
    </linearGradient>
    <linearGradient id="track-blue" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#60A5FA"/>
      <stop offset="1" stop-color="#2563EB"/>
    </linearGradient>
    <linearGradient id="track-green" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#34D399"/>
      <stop offset="1" stop-color="#16A34A"/>
    </linearGradient>
    <linearGradient id="track-purple" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#A78BFA"/>
      <stop offset="1" stop-color="#7C3AED"/>
    </linearGradient>
    <filter id="track-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="9" stdDeviation="10" flood-color="#0F172A" flood-opacity="0.13"/>
    </filter>
    <filter id="track-glow" x="-45%" y="-45%" width="190%" height="190%">
      <feGaussianBlur stdDeviation="6" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <rect width="640" height="360" rx="28" fill="url(#track-bg)"/>

  <g filter="url(#track-shadow)">
    <rect x="44" y="126" width="104" height="96" rx="26" fill="#FFFFFF" stroke="#DBEAFE"/>
    <rect x="232" y="84" width="144" height="192" rx="28" fill="#FFFFFF" stroke="#CBD5E1"/>
    <circle cx="454" cy="94" r="38" fill="#FFFFFF" stroke="#BBF7D0"/>
    <circle cx="548" cy="94" r="38" fill="#FFFFFF" stroke="#BBF7D0"/>
    <circle cx="454" cy="266" r="38" fill="#FFFFFF" stroke="#BBF7D0"/>
    <circle cx="548" cy="266" r="38" fill="#FFFFFF" stroke="#BBF7D0"/>
  </g>

  <path d="M72 170H85L108 156V192L85 178H72V170Z" fill="url(#track-blue)" stroke="#1D4ED8" stroke-width="4" stroke-linejoin="round"/>
  <path d="M111 157C119 167 119 181 111 191" stroke="#60A5FA" stroke-width="4" stroke-linecap="round"/>
  <path d="M121 150L151 180H136L145 199L135 204L126 185L116 196L121 150Z" fill="#FFFFFF" stroke="#0F172A" stroke-width="4" stroke-linejoin="round"/>
  <circle cx="144" cy="158" r="8" fill="#BFDBFE"/>

  <path d="M151 180H212" stroke="#334155" stroke-width="5" stroke-linecap="round"/>
  <path d="M212 172L226 180L212 188Z" fill="#334155"/>

  <path d="M232 122H376" stroke="#CBD5E1" stroke-width="4"/>
  <circle cx="254" cy="104" r="4" fill="#CBD5E1"/>
  <circle cx="268" cy="104" r="4" fill="#CBD5E1"/>
  <circle cx="282" cy="104" r="4" fill="#CBD5E1"/>

  <rect x="256" y="146" width="96" height="54" rx="16" fill="#E0F2FE" stroke="#0284C7" stroke-width="4"/>
  <rect x="266" y="218" width="76" height="16" rx="8" fill="#DCFCE7"/>
  <circle cx="304" cy="218" r="52" stroke="#BAE6FD" stroke-width="5" opacity="0.75"/>
  <circle cx="304" cy="218" r="18" fill="url(#track-purple)"/>
  <path d="M304 200V188" stroke="#7C3AED" stroke-width="4" stroke-linecap="round"/>
  <path d="M322 218H334" stroke="#7C3AED" stroke-width="4" stroke-linecap="round"/>
  <path d="M304 236V248" stroke="#7C3AED" stroke-width="4" stroke-linecap="round"/>
  <path d="M286 218H274" stroke="#7C3AED" stroke-width="4" stroke-linecap="round"/>

  <path d="M376 180H407" stroke="#16A34A" stroke-width="6" stroke-linecap="round"/>
  <path d="M407 172L421 180L407 188Z" fill="#16A34A"/>
  <circle cx="422" cy="180" r="15" fill="url(#track-green)" filter="url(#track-glow)"/>
  <path d="M416 180L421 185L429 176" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>

  <path d="M422 180H454V132" stroke="#16A34A" stroke-width="5" stroke-linecap="round" opacity="0.8"/>
  <path d="M422 180H548V132" stroke="#16A34A" stroke-width="5" stroke-linecap="round" opacity="0.8"/>
  <path d="M422 180H454V228" stroke="#16A34A" stroke-width="5" stroke-linecap="round" opacity="0.8"/>
  <path d="M422 180H548V228" stroke="#16A34A" stroke-width="5" stroke-linecap="round" opacity="0.8"/>

  <circle cx="454" cy="94" r="28" fill="#DCFCE7" filter="url(#track-glow)"/>
  <path d="M439 79C443 97 455 110 474 115L482 106L471 96L464 103C456 99 451 93 448 84L455 77L446 66L438 73C438 75 438.5 77 439 79Z" fill="#16A34A"/>
  <circle cx="482" cy="66" r="10" fill="url(#track-green)"/>
  <path d="M477 66L481 70L488 62" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>

  <circle cx="548" cy="94" r="28" fill="#DCFCE7" filter="url(#track-glow)"/>
  <rect x="533" y="76" width="30" height="36" rx="6" fill="#FFFFFF" stroke="#16A34A" stroke-width="4"/>
  <path d="M540 88H556" stroke="#16A34A" stroke-width="3" stroke-linecap="round"/>
  <path d="M540 99H556" stroke="#16A34A" stroke-width="3" stroke-linecap="round"/>
  <circle cx="570" cy="66" r="10" fill="url(#track-green)"/>
  <path d="M565 66L569 70L576 62" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>

  <circle cx="454" cy="266" r="28" fill="#DCFCE7" filter="url(#track-glow)"/>
  <rect x="438" y="249" width="32" height="30" rx="6" fill="#FFFFFF" stroke="#16A34A" stroke-width="4"/>
  <path d="M438 260H470" stroke="#16A34A" stroke-width="4"/>
  <path d="M447 243V254" stroke="#16A34A" stroke-width="4" stroke-linecap="round"/>
  <path d="M461 243V254" stroke="#16A34A" stroke-width="4" stroke-linecap="round"/>
  <circle cx="482" cy="238" r="10" fill="url(#track-green)"/>
  <path d="M477 238L481 242L488 234" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>

  <circle cx="548" cy="266" r="28" fill="#DCFCE7" filter="url(#track-glow)"/>
  <path d="M533 258H563L559 276H539L533 258Z" fill="#FFFFFF" stroke="#16A34A" stroke-width="4" stroke-linejoin="round"/>
  <path d="M539 258L543 248H553L557 258" stroke="#16A34A" stroke-width="4" stroke-linecap="round"/>
  <circle cx="570" cy="238" r="10" fill="url(#track-green)"/>
  <path d="M565 238L569 242L576 234" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
  "meta-ads": `<svg viewBox="0 0 640 360" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="meta-bg" x1="0" y1="0" x2="640" y2="360" gradientUnits="userSpaceOnUse">
      <stop stop-color="#F8FAFC"/>
      <stop offset="1" stop-color="#F5F3FF"/>
    </linearGradient>
    <linearGradient id="meta-purple" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#A78BFA"/>
      <stop offset="1" stop-color="#7C3AED"/>
    </linearGradient>
    <linearGradient id="meta-green" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#34D399"/>
      <stop offset="1" stop-color="#16A34A"/>
    </linearGradient>
    <filter id="meta-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#0F172A" flood-opacity="0.14"/>
    </filter>
  </defs>

  <rect width="640" height="360" rx="28" fill="url(#meta-bg)"/>

  <g filter="url(#meta-shadow)">
    <rect x="78" y="34" width="212" height="292" rx="34" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
    <rect x="99" y="55" width="170" height="250" rx="22" fill="#F8FAFC" stroke="#E2E8F0"/>
    <circle cx="184" cy="313" r="5" fill="#CBD5E1"/>
  </g>

  <g opacity="0.78">
    <rect x="116" y="74" width="136" height="52" rx="14" fill="#E2E8F0" stroke="#CBD5E1"/>
    <circle cx="135" cy="93" r="8" fill="#CBD5E1"/>
    <path d="M126 113L151 96L166 108L179 99L220 124H126Z" fill="#CBD5E1"/>
    <path d="M232 83L246 69" stroke="#94A3B8" stroke-width="4" stroke-linecap="round"/>
    <path d="M246 69V83H232" stroke="#94A3B8" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
  </g>

  <g filter="url(#meta-shadow)">
    <rect x="104" y="146" width="160" height="92" rx="18" fill="#FFFFFF" stroke="#22C55E" stroke-width="4"/>
    <rect x="118" y="160" width="61" height="64" rx="10" fill="#F1F5F9"/>
    <path d="M132 204L145 188L155 199L166 181" stroke="#94A3B8" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="137" cy="176" r="7" fill="#CBD5E1"/>
    <rect x="189" y="160" width="61" height="64" rx="10" fill="#DCFCE7"/>
    <path d="M199 197L213 183L224 191L238 172" stroke="#16A34A" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="234" cy="177" r="8" fill="#22C55E"/>
    <path d="M230 177L233 181L240 173" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M184 160V224" stroke="#CBD5E1" stroke-width="2"/>
  </g>

  <circle cx="269" cy="153" r="22" fill="#DCFCE7" stroke="#86EFAC" stroke-width="2"/>
  <path d="M258 153L266 161L281 143" stroke="#16A34A" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>

  <g opacity="0.85">
    <rect x="116" y="258" width="136" height="30" rx="15" fill="#EDE9FE" stroke="#DDD6FE"/>
    <circle cx="136" cy="273" r="8" fill="url(#meta-purple)"/>
    <path d="M132 273C134 268 138 268 140 273C138 278 134 278 132 273Z" fill="#FFFFFF"/>
    <path d="M157 273H223" stroke="#A78BFA" stroke-width="6" stroke-linecap="round"/>
  </g>

  <path d="M264 192C313 192 352 191 397 190" stroke="#16A34A" stroke-width="6" stroke-linecap="round"/>
  <path d="M395 182L410 190L395 198Z" fill="#16A34A"/>

  <g filter="url(#meta-shadow)">
    <rect x="410" y="117" width="152" height="146" rx="28" fill="#FFFFFF" stroke="#BFDBFE" stroke-width="2"/>
    <rect x="432" y="139" width="108" height="82" rx="13" fill="#EFF6FF" stroke="#93C5FD" stroke-width="3"/>
    <path d="M432 158H540" stroke="#93C5FD" stroke-width="3"/>
    <circle cx="445" cy="148" r="4" fill="#60A5FA"/>
    <circle cx="459" cy="148" r="4" fill="#60A5FA"/>
    <rect x="450" y="174" width="72" height="9" rx="4.5" fill="#BFDBFE"/>
    <rect x="450" y="191" width="48" height="9" rx="4.5" fill="#60A5FA"/>
    <circle cx="522" cy="236" r="19" fill="url(#meta-green)"/>
    <path d="M513 236L520 243L532 229" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
  </g>

  <path d="M493 263C435 310 338 313 253 281" stroke="#7C3AED" stroke-width="4" stroke-linecap="round" stroke-dasharray="8 10" opacity="0.72"/>
  <path d="M257 273L242 276L253 289Z" fill="#7C3AED" opacity="0.72"/>
</svg>`,
  "organic-social": `<svg viewBox="0 0 640 360" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="org-bg" x1="0" y1="0" x2="640" y2="360" gradientUnits="userSpaceOnUse">
      <stop stop-color="#F8FAFC"/>
      <stop offset="1" stop-color="#FFF7ED"/>
    </linearGradient>
    <linearGradient id="org-blue" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#60A5FA"/>
      <stop offset="1" stop-color="#2563EB"/>
    </linearGradient>
    <linearGradient id="org-green" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#34D399"/>
      <stop offset="1" stop-color="#16A34A"/>
    </linearGradient>
    <linearGradient id="org-amber" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#FBBF24"/>
      <stop offset="1" stop-color="#F97316"/>
    </linearGradient>
    <linearGradient id="org-purple" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#A78BFA"/>
      <stop offset="1" stop-color="#7C3AED"/>
    </linearGradient>
    <filter id="org-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#0F172A" flood-opacity="0.14"/>
    </filter>
  </defs>

  <rect width="640" height="360" rx="28" fill="url(#org-bg)"/>

  <g fill="none" stroke-linecap="round">
    <path d="M352 82C399 94 431 126 438 166" stroke="#CBD5E1" stroke-width="9"/>
    <path d="M431 158L441 177L449 157Z" fill="#CBD5E1" stroke="none"/>
    <path d="M432 194C419 235 384 260 342 265" stroke="#CBD5E1" stroke-width="9"/>
    <path d="M351 256L329 266L352 275Z" fill="#CBD5E1" stroke="none"/>
    <path d="M288 264C244 253 213 220 207 181" stroke="#CBD5E1" stroke-width="9"/>
    <path d="M214 190L205 169L196 191Z" fill="#CBD5E1" stroke="none"/>
    <path d="M210 146C222 106 258 82 299 77" stroke="#CBD5E1" stroke-width="9"/>
    <path d="M290 86L312 76L289 67Z" fill="#CBD5E1" stroke="none"/>
  </g>

  <g filter="url(#org-shadow)">
    <circle cx="320" cy="72" r="42" fill="#FFFFFF" stroke="#BFDBFE" stroke-width="2"/>
    <circle cx="320" cy="72" r="30" fill="url(#org-blue)"/>
    <rect x="306" y="55" width="28" height="34" rx="6" fill="#FFFFFF"/>
    <path d="M313 66H327" stroke="#2563EB" stroke-width="3" stroke-linecap="round"/>
    <path d="M313 76H327" stroke="#2563EB" stroke-width="3" stroke-linecap="round"/>
    <path d="M313 86H322" stroke="#2563EB" stroke-width="3" stroke-linecap="round"/>

    <circle cx="442" cy="180" r="42" fill="#FFFFFF" stroke="#BBF7D0" stroke-width="2"/>
    <circle cx="442" cy="180" r="30" fill="url(#org-green)"/>
    <path d="M424 181L437 194L461 166" stroke="#FFFFFF" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="455" y="154" width="24" height="20" rx="6" fill="#DCFCE7" stroke="#16A34A" stroke-width="3"/>

    <circle cx="320" cy="266" r="42" fill="#FFFFFF" stroke="#FED7AA" stroke-width="2"/>
    <circle cx="320" cy="266" r="30" fill="url(#org-amber)"/>
    <path d="M320 240L342 249V266C342 281 332 290 320 294C308 290 298 281 298 266V249L320 240Z" stroke="#FFFFFF" stroke-width="5" stroke-linejoin="round"/>
    <path d="M310 267L318 275L333 257" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>

    <circle cx="198" cy="180" r="42" fill="#FFFFFF" stroke="#DDD6FE" stroke-width="2"/>
    <circle cx="198" cy="180" r="30" fill="url(#org-purple)"/>
    <path d="M184 182C184 172 192 164 202 164H208" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round"/>
    <path d="M206 155L217 164L206 173" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M212 178C212 188 204 196 194 196H188" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round"/>
    <path d="M190 205L179 196L190 187" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  </g>

  <g opacity="0.95">
    <path d="M104 319H536" stroke="#CBD5E1" stroke-width="6" stroke-linecap="round"/>
    <circle cx="126" cy="319" r="13" fill="#E2E8F0"/>
    <circle cx="126" cy="313" r="5" fill="#94A3B8"/>
    <path d="M116 328C119 321 133 321 136 328" stroke="#94A3B8" stroke-width="4" stroke-linecap="round"/>
    <circle cx="224" cy="319" r="15" fill="#DBEAFE"/>
    <circle cx="224" cy="312" r="6" fill="#60A5FA"/>
    <path d="M212 330C216 321 232 321 236 330" stroke="#60A5FA" stroke-width="4" stroke-linecap="round"/>
    <circle cx="322" cy="319" r="17" fill="#DCFCE7"/>
    <circle cx="322" cy="311" r="7" fill="#22C55E"/>
    <path d="M309 331C313 321 331 321 335 331" stroke="#22C55E" stroke-width="4" stroke-linecap="round"/>
    <circle cx="420" cy="319" r="19" fill="#FEF3C7"/>
    <circle cx="420" cy="310" r="8" fill="#F59E0B"/>
    <path d="M405 333C410 321 430 321 435 333" stroke="#F59E0B" stroke-width="4" stroke-linecap="round"/>
    <circle cx="518" cy="319" r="21" fill="#EDE9FE"/>
    <circle cx="518" cy="309" r="9" fill="#8B5CF6"/>
    <path d="M502 334C507 321 529 321 534 334" stroke="#8B5CF6" stroke-width="4" stroke-linecap="round"/>
  </g>
</svg>`,
  timeline: `<svg viewBox="0 0 640 360" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="roadmap-bg" x1="0" y1="0" x2="640" y2="360" gradientUnits="userSpaceOnUse">
      <stop stop-color="#F8FAFC"/>
      <stop offset="1" stop-color="#EFF6FF"/>
    </linearGradient>
    <linearGradient id="roadmap-slate" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#94A3B8"/>
      <stop offset="1" stop-color="#475569"/>
    </linearGradient>
    <linearGradient id="roadmap-blue" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#60A5FA"/>
      <stop offset="1" stop-color="#2563EB"/>
    </linearGradient>
    <linearGradient id="roadmap-purple" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#A78BFA"/>
      <stop offset="1" stop-color="#7C3AED"/>
    </linearGradient>
    <linearGradient id="roadmap-amber" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#FBBF24"/>
      <stop offset="1" stop-color="#F97316"/>
    </linearGradient>
    <filter id="roadmap-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="9" stdDeviation="10" flood-color="#0F172A" flood-opacity="0.12"/>
    </filter>
  </defs>

  <rect width="640" height="360" rx="28" fill="url(#roadmap-bg)"/>

  <g opacity="0.42">
    <path d="M80 48V312" stroke="#CBD5E1" stroke-width="2"/>
    <path d="M240 48V312" stroke="#CBD5E1" stroke-width="2"/>
    <path d="M400 48V312" stroke="#CBD5E1" stroke-width="2"/>
    <path d="M560 48V312" stroke="#CBD5E1" stroke-width="2"/>
    <circle cx="80" cy="48" r="5" fill="#CBD5E1"/>
    <circle cx="240" cy="48" r="5" fill="#CBD5E1"/>
    <circle cx="400" cy="48" r="5" fill="#CBD5E1"/>
    <circle cx="560" cy="48" r="5" fill="#CBD5E1"/>
  </g>

  <g filter="url(#roadmap-shadow)">
    <rect x="80" y="78" width="162" height="48" rx="24" fill="url(#roadmap-slate)"/>
    <path d="M228 78L258 102L228 126Z" fill="#475569"/>
    <rect x="104" y="91" width="33" height="22" rx="5" fill="#E2E8F0"/>
    <path d="M104 102H137" stroke="#64748B" stroke-width="3"/>
    <path d="M120.5 91V113" stroke="#64748B" stroke-width="3"/>
    <path d="M151 110L166 95" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round"/>
    <path d="M166 95L177 106" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round"/>

    <rect x="220" y="140" width="222" height="48" rx="24" fill="url(#roadmap-blue)"/>
    <path d="M428 140L458 164L428 188Z" fill="#2563EB"/>
    <circle cx="255" cy="164" r="12" stroke="#FFFFFF" stroke-width="5"/>
    <path d="M265 174L279 188" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round"/>
    <path d="M300 164H392" stroke="#DBEAFE" stroke-width="8" stroke-linecap="round" opacity="0.72"/>

    <rect x="356" y="202" width="174" height="48" rx="24" fill="url(#roadmap-purple)"/>
    <path d="M516 202L546 226L516 250Z" fill="#7C3AED"/>
    <rect x="384" y="211" width="30" height="30" rx="8" stroke="#FFFFFF" stroke-width="5"/>
    <path d="M394 222H405" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/>
    <path d="M394 232H401" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/>
    <circle cx="438" cy="226" r="12" fill="#FFFFFF" opacity="0.9"/>
    <path d="M432 226L437 231L445 221" stroke="#7C3AED" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>

    <rect x="80" y="270" width="450" height="48" rx="24" fill="url(#roadmap-amber)"/>
    <path d="M516 270L546 294L516 318Z" fill="#F97316"/>
    <rect x="107" y="282" width="28" height="24" rx="6" fill="#FFFFFF" opacity="0.92"/>
    <path d="M113 291H129" stroke="#F97316" stroke-width="3" stroke-linecap="round"/>
    <path d="M113 299H123" stroke="#F97316" stroke-width="3" stroke-linecap="round"/>
    <path d="M160 294C160 286 166 280 174 280H180" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round"/>
    <path d="M178 272L188 280L178 288" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M192 294C192 302 186 308 178 308H172" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round"/>
    <path d="M174 316L164 308L174 300" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  </g>

  <g opacity="0.88">
    <path d="M80 336H560" stroke="#CBD5E1" stroke-width="6" stroke-linecap="round"/>
    <circle cx="80" cy="336" r="8" fill="#64748B"/>
    <circle cx="240" cy="336" r="8" fill="#2563EB"/>
    <circle cx="400" cy="336" r="8" fill="#7C3AED"/>
    <circle cx="560" cy="336" r="8" fill="#F97316"/>
  </g>
</svg>`,
};

const LESSON_HINTS = {
  "what-is-advertising":
    "Think in outcomes, not exposure. If a person sees the ad but never calls, submits, or books, the attention did not become useful.",
  "what-google-ads-does":
    "Focus on the core pieces: Google Ads needs a goal, budget, targeting, ad, and landing page before it can produce a lead.",
  "three-traffic-lanes":
    "Search captures existing demand, Meta introduces ideas while people scroll, and organic keeps trust growing in the background.",
  "why-search-first":
    "The more urgent and specific the phrase sounds, the more likely it belongs in the high-intent bucket.",
  "how-payments-work":
    "Use the numbers you already have first. CPC needs spend and clicks. CPA needs spend and leads. CTR cannot be calculated without impressions.",
  "website-foundation":
    "Look for the basic conversion pieces first: clear offer, trust, contact path, and proof that the business serves the searcher's area.",
  tracking:
    "A campaign only becomes measurable when the business defines which actions count as success and sends those events back to the platform.",
  "meta-ads":
    "Discovery channels need creative that makes someone stop. Proof usually beats generic branding.",
  "organic-social":
    "Pick the four content types that would make a skeptical buyer trust the business faster.",
  timeline:
    "Foundation comes before scale. Organic runs the whole time. Optimization continues after launch instead of ending at launch.",
};

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

function getCourseProgress(currentIndex, currentLessonState, isCompleted) {
  if (isCompleted) return 100;
  return Math.round(((currentIndex + (currentLessonState?.validated ? 1 : 0)) / LESSONS.length) * 100);
}

function getExerciseIncompleteFeedback(lesson) {
  switch (lesson.interaction.type) {
    case "lane-reveal":
      return "Open all three lanes first.";
    case "bucket-sort":
    case "timeline-placement":
      return "Place every item first.";
    case "business-selector":
      return "Pick a business type first.";
    case "calculator":
      return "Reveal each metric first.";
    case "hotspots":
      return "Find each weak spot first.";
    case "conversion-selector":
      return "Choose at least one conversion first.";
    case "creative-choice":
      return "Pick the strongest creative first.";
    case "weekly-plan":
      return "Choose four content types first.";
    default:
      return "Complete this exercise first.";
  }
}

function SupportDialogButton({
  icon: Icon,
  label,
  title,
  description,
  children,
  emphasized = false,
  iconOnly = false,
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <motion.button
          type="button"
          aria-label={label}
          title={label}
          animate={
            emphasized
              ? {
                  y: [0, -2, 0],
                  boxShadow: [
                    "0 1px 0 rgba(17,24,39,0.04)",
                    "0 10px 30px rgba(184,144,255,0.18)",
                    "0 1px 0 rgba(17,24,39,0.04)",
                  ],
                }
              : undefined
          }
          transition={emphasized ? { duration: 1.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" } : undefined}
          className={cn(
            iconOnly
              ? "inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#1f2937]/15 bg-white text-[#111827] shadow-[0_1px_0_rgba(17,24,39,0.04)] transition hover:border-[#111827]/25 hover:bg-[#fcfcfd]"
              : "inline-flex items-center gap-2 rounded-full border border-[#1f2937]/15 bg-white px-4 py-2 text-sm font-medium text-[#111827] shadow-[0_1px_0_rgba(17,24,39,0.04)] transition hover:border-[#111827]/25 hover:bg-[#fcfcfd]",
            emphasized && "border-[#d7c4ff] bg-[#fffaff]",
          )}
        >
          <Icon className="h-4 w-4" />
          {iconOnly ? <span className="sr-only">{label}</span> : label}
        </motion.button>
      </DialogTrigger>
      <DialogContent className="max-w-xl rounded-[24px] border-[#e8e7eb] bg-[#fffdfb] p-0 text-left shadow-[0_24px_80px_rgba(15,23,42,0.14)]">
        <div className="px-6 py-6 sm:px-7">
          <DialogHeader className="text-left">
            <DialogTitle className="text-xl font-semibold text-[#111827]">{title}</DialogTitle>
            {description ? (
              <DialogDescription className="mt-1 text-sm leading-6 text-[#626b7f]">
                {description}
              </DialogDescription>
            ) : null}
          </DialogHeader>
          <div className="mt-5 space-y-4 text-sm leading-7 text-[#374151]">{children}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function LessonSupport({ lesson, visibleTerms, activeGuideStepId = null }) {
  const lessonTerms = lesson.terms.map((termId) => ({
    id: termId,
    ...GLOSSARY[termId],
  }));
  const earlierTerms = visibleTerms
    .filter((termId) => !lesson.terms.includes(termId))
    .map((termId) => ({ id: termId, ...GLOSSARY[termId] }));

  return (
    <div className="flex items-center justify-center gap-2">
      <SupportDialogButton
        icon={BookOpen}
        label="Textbook"
        title={lesson.title}
        description="Core explanation for this lesson."
        emphasized={activeGuideStepId === "textbook"}
        iconOnly
      >
        {lesson.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </SupportDialogButton>

      <SupportDialogButton
        icon={FileText}
        label="Example"
        title="Concrete example"
        description="One practical way to think about the lesson."
        emphasized={activeGuideStepId === "example"}
        iconOnly
      >
        <p>{lesson.example}</p>
      </SupportDialogButton>

      <SupportDialogButton
        icon={Tags}
        label="Terms"
        title="Key terms"
        description="Definitions introduced up to this point."
        emphasized={activeGuideStepId === "terms"}
        iconOnly
      >
        <div className="space-y-3">
          {lessonTerms.map((term) => (
            <div key={term.id} className="rounded-2xl border border-[#eceaf0] bg-white px-4 py-3">
              <p className="font-semibold text-[#111827]">{term.label}</p>
              <p className="mt-1 text-[#4b5563]">{term.definition}</p>
              <p className="mt-2 text-xs leading-6 text-[#6b7280]">Example: {term.example}</p>
            </div>
          ))}
        </div>

        {earlierTerms.length ? (
          <div>
            <p className="text-sm font-medium text-[#7c8392]">
              Earlier terms
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {earlierTerms.map((term) => (
                <span
                  key={term.id}
                  className="rounded-full border border-[#eceaf0] bg-white px-3 py-1.5 text-xs text-[#5b6475]"
                >
                  {term.label}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </SupportDialogButton>

      <SupportDialogButton
        icon={Lightbulb}
        label="Hint"
        title="Hint"
        description="A small nudge, written out."
        emphasized={activeGuideStepId === "hint"}
        iconOnly
      >
        <p>{LESSON_HINTS[lesson.id]}</p>
      </SupportDialogButton>
    </div>
  );
}

function SupportGuide({ step, stepIndex, totalSteps, onNext, onDismiss }) {
  const anchorLeft = 20 + stepIndex * 48;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.22 }}
      style={{ left: `${anchorLeft}px` }}
      className="absolute top-[calc(100%+12px)] z-30 w-[220px] -translate-x-1/2 rounded-[24px] border border-[#eadffb] bg-white px-4 py-4 text-left shadow-[0_18px_50px_rgba(15,23,42,0.12)] sm:w-[240px]"
    >
      <div className="absolute left-1/2 top-[-9px] h-4 w-4 -translate-x-1/2 rotate-45 border-l border-t border-[#eadffb] bg-white" />
      <div className="flex items-start justify-between gap-3">
        <p className="flex-1 pr-1 text-sm leading-6 text-[#465063]">{step.sentence}</p>
        <button
          type="button"
          onClick={onDismiss}
          className="rounded-full p-1 text-[#98a0af] transition hover:bg-[#f5f5f8] hover:text-[#111827]"
          aria-label="Dismiss support guide"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {SUPPORT_GUIDE_STEPS.map((guideStep, index) => (
            <span
              key={guideStep.id}
              className={cn(
                "h-2 w-2 rounded-full transition",
                index === stepIndex ? "bg-[#b890ff]" : "bg-[#e4def1]",
              )}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={onNext}
          className="rounded-full border border-[#d7c4ff] bg-[#fffaff] px-4 py-2 text-sm font-medium text-[#6f56a4] transition hover:border-[#b890ff] hover:bg-[#fcf7ff]"
        >
          {stepIndex === totalSteps - 1 ? "Done" : "Next"}
        </button>
      </div>
    </motion.div>
  );
}

function PillButton({ active, children, className, ...props }) {
  return (
    <button
      type="button"
      className={cn(
        "rounded-full border px-4 py-2 text-sm font-medium transition",
        active
          ? "border-[#111827] bg-[#111827] text-white"
          : "border-[#d8d7dc] bg-white text-[#111827] hover:border-[#9ca3af]",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

function CursorHint() {
  return (
    <svg viewBox="0 0 64 64" className="h-14 w-14">
      <path
        d="M10 6L29 46L35 32L49 46L55 40L41 26L55 22L10 6Z"
        fill="white"
        stroke="#111827"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BlurPlaceholder({ lines = 2, className }) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "h-3 rounded-full bg-[#e8edf4] blur-[2px]",
            index === lines - 1 ? "w-2/3" : "w-full",
          )}
        />
      ))}
    </div>
  );
}

function RevealSurface({ title, revealed, children, lines = 2, className }) {
  return (
    <div
      className={cn(
        "min-h-[112px] rounded-[24px] border border-[#eceaf0] bg-white px-4 py-4 text-left transition-all duration-300",
        revealed ? "shadow-[0_10px_30px_rgba(15,23,42,0.04)]" : "bg-[#fbfbfd]",
        className,
      )}
    >
      <p className={cn("text-sm font-semibold transition-colors", revealed ? "text-[#111827]" : "text-[#9aa3b2]")}>
        {title}
      </p>
      <div className="mt-3">
        {revealed ? (
          children
        ) : (
          <div className="opacity-90">
            <BlurPlaceholder lines={lines} />
          </div>
        )}
      </div>
    </div>
  );
}

function LaneRevealInteraction({ lesson, state, updateState }) {
  const revealed = state.revealed || {};
  const showPointerHint = lesson.id === "what-is-advertising" && Object.keys(revealed).length === 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-center gap-3">
        {lesson.interaction.items.map((item, index) => (
          <div key={item.id} className="relative">
            {showPointerHint && index === 0 ? (
              <div className="pointer-events-none absolute -right-9 -bottom-8 z-10 animate-pulse drop-shadow-[0_12px_24px_rgba(15,23,42,0.16)]">
                <CursorHint />
              </div>
            ) : null}

            <PillButton
              active={Boolean(revealed[item.id])}
              className={showPointerHint && index === 0 ? "ring-4 ring-[#f0c4ff]/70 ring-offset-2" : undefined}
              onClick={() =>
                updateState((current) => ({
                  ...current,
                  revealed: {
                    ...(current.revealed || {}),
                    [item.id]: true,
                  },
                }))
              }
            >
              {item.label}
            </PillButton>
          </div>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {lesson.interaction.items.map((item) => (
          <RevealSurface key={item.id} title={item.label} revealed={Boolean(revealed[item.id])}>
            <p className="text-sm leading-7 text-[#5b6475]">{item.reveal}</p>
          </RevealSurface>
        ))}
      </div>
    </div>
  );
}

function ClassifierInteraction({ lesson, state, updateState, mode = "bucket" }) {
  const isTimeline = mode === "timeline";
  const assignments = isTimeline ? state.placements || {} : state.assignments || {};
  const choices = isTimeline ? lesson.interaction.slots : lesson.interaction.buckets;
  const currentItem = lesson.interaction.items.find((item) => !assignments[item.id]);

  function handleChoice(choiceId) {
    updateState((current) => {
      const nextAssignments = {
        ...(isTimeline ? current.placements || {} : current.assignments || {}),
        [currentItem.id]: choiceId,
      };

      return {
        ...current,
        ...(isTimeline ? { placements: nextAssignments } : { assignments: nextAssignments }),
      };
    });
  }

  function resetChoices() {
    updateState((current) => ({
      ...current,
      ...(isTimeline ? { placements: {} } : { assignments: {} }),
    }));
  }

  if (!currentItem) {
    return (
      <div className="space-y-4">
        <div className="rounded-[28px] border border-[#d9eedf] bg-[#f4fcf6] px-6 py-6">
          <p className="text-sm font-semibold text-[#166534]">Done.</p>
          <p className="mt-2 text-sm leading-7 text-[#3f4a5b]">
            All items have been placed. You can reset the exercise if you want another pass.
          </p>
        </div>
        <button
          type="button"
          onClick={resetChoices}
          className="text-sm font-medium text-[#6b7280] underline-offset-4 transition hover:text-[#111827] hover:underline"
        >
          Reset exercise
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[32px] border border-[#eceaf0] bg-white px-6 py-8 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
        <p className="text-2xl font-semibold tracking-tight text-[#111827] sm:text-3xl">
          {currentItem.label}
        </p>
      </div>

      <div className={cn("grid gap-3", isTimeline ? "sm:grid-cols-2 lg:grid-cols-5" : "sm:grid-cols-2")}>
        {choices.map((choice) => (
          <button
            key={choice.id}
            type="button"
            onClick={() => handleChoice(choice.id)}
            className="rounded-[26px] border border-[#d8d7dc] bg-white px-4 py-4 text-center transition hover:border-[#111827]/25 hover:shadow-[0_8px_24px_rgba(15,23,42,0.05)]"
          >
            <p className="text-sm font-semibold text-[#111827]">{choice.label}</p>
            {"detail" in choice ? (
              <p className="mt-2 text-xs leading-6 text-[#6b7280]">{choice.detail}</p>
            ) : null}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={resetChoices}
        className="text-sm font-medium text-[#6b7280] underline-offset-4 transition hover:text-[#111827] hover:underline"
      >
        Reset exercise
      </button>
    </div>
  );
}

function BusinessSelector({ lesson, state, updateState }) {
  const selectedBusinessId = state.selectedBusiness || null;
  const activeBusiness =
    lesson.interaction.businesses.find((business) => business.id === selectedBusinessId) ||
    null;

  const businessCards = [
    { title: "Google Search", text: activeBusiness?.search || null },
    { title: "Meta Ads", text: activeBusiness?.meta || null },
    { title: "Organic Social", text: activeBusiness?.organic || null },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap justify-center gap-2">
        {lesson.interaction.businesses.map((business) => (
          <PillButton
            key={business.id}
            active={business.id === selectedBusinessId}
            onClick={() =>
              updateState((current) => ({
                ...current,
                selectedBusiness: business.id,
              }))
            }
          >
            {business.label}
          </PillButton>
        ))}
      </div>

      <div className="grid gap-3 text-left sm:grid-cols-3">
        {businessCards.map((card) => (
          <RevealSurface key={card.title} title={card.title} revealed={Boolean(card.text)} lines={3}>
            <p className="text-sm leading-7 text-[#465063]">{card.text}</p>
          </RevealSurface>
        ))}
      </div>
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
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: "Spend", value: `$${spend}` },
          { label: "Clicks", value: clicks },
          { label: "Leads", value: leads },
        ].map((item) => (
          <div key={item.label} className="rounded-[24px] border border-[#eceaf0] bg-white px-4 py-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8a90a0]">
              {item.label}
            </p>
            <p className="mt-2 text-2xl font-semibold text-[#111827]">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        <PillButton active={showCpc} onClick={() => reveal("showCpc")}>
          Reveal CPC
        </PillButton>
        <PillButton active={showCpa} onClick={() => reveal("showCpa")}>
          Reveal CPA
        </PillButton>
        <PillButton active={showCtrHint} onClick={() => reveal("showCtrHint")}>
          Ask about CTR
        </PillButton>
      </div>

      <div className="grid gap-3 text-left sm:grid-cols-3">
        <RevealSurface title="CPC" revealed={showCpc}>
          <p className="text-sm leading-7 text-[#5b6475]">${(spend / clicks).toFixed(2)}</p>
        </RevealSurface>
        <RevealSurface title="CPA" revealed={showCpa}>
          <p className="text-sm leading-7 text-[#5b6475]">${(spend / leads).toFixed(2)}</p>
        </RevealSurface>
        <RevealSurface title="CTR" revealed={showCtrHint} lines={3}>
          <p className="text-sm leading-7 text-[#5b6475]">
            CTR still needs impression count before you can calculate it.
          </p>
        </RevealSurface>
      </div>
    </div>
  );
}

function HotspotInteraction({ lesson, state, updateState }) {
  const found = state.found || {};

  return (
    <div className="space-y-4">
      <div className="relative mx-auto min-h-[340px] max-w-[720px] rounded-[32px] border border-[#eceaf0] bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
        <div className="rounded-[24px] border border-[#eef1f5] bg-[#fafbfc] p-5 text-left">
          <div className="h-7 w-2/3 rounded-full bg-[#e8edf4]" />
          <div className="mt-4 h-4 w-1/2 rounded-full bg-[#eef2f8]" />
          <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_180px]">
            <div className="space-y-4">
              <div className="h-24 rounded-[18px] bg-[#f1f5f9]" />
              <div className="h-20 rounded-[18px] bg-[#f1f5f9]" />
              <div className="h-11 rounded-[18px] bg-[#f1f5f9]" />
            </div>
            <div className="h-full rounded-[18px] bg-[#f1f5f9]" />
          </div>
        </div>

        {lesson.interaction.spots.map((spot) => {
          const active = Boolean(found[spot.id]);

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
                "absolute rounded-full border px-3 py-2 text-xs font-medium transition",
                active
                  ? "border-[#111827] bg-[#111827] text-white"
                  : "border-[#d8d7dc] bg-white text-[#111827] shadow-sm hover:border-[#9ca3af]",
              )}
              style={{ top: spot.top, left: spot.left }}
            >
              {active ? spot.label : "Find"}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {lesson.interaction.spots
          .filter((spot) => found[spot.id])
          .map((spot) => (
            <span
              key={spot.id}
              className="rounded-full border border-[#111827]/10 bg-white px-3 py-1.5 text-xs text-[#4b5563]"
            >
              {spot.label}
            </span>
          ))}
      </div>
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
    <div className="flex flex-wrap justify-center gap-3">
      {lesson.interaction.options.map((option) => {
        const active = selectedOptions.includes(option);

        return (
          <PillButton key={option} active={active} onClick={() => toggleOption(option)}>
            {option}
          </PillButton>
        );
      })}
    </div>
  );
}

function CreativeChoice({ lesson, state, updateState }) {
  const selectedCreative = state.selectedCreative || null;

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {lesson.interaction.options.map((option) => {
        const active = selectedCreative === option.id;

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
              "rounded-[28px] border px-4 py-4 text-left transition",
              active
                ? "border-[#111827] bg-[#fffdfb] shadow-[0_10px_30px_rgba(15,23,42,0.06)]"
                : "border-[#eceaf0] bg-white hover:border-[#9ca3af]",
            )}
          >
            <div
              className={cn(
                "mb-4 h-28 rounded-[20px] border",
                option.id === "logo" && "border-[#eceaf0] bg-[#111827]",
                option.id === "before-after" &&
                  "border-[#d7e7f5] bg-[linear-gradient(135deg,#111827_0%,#111827_46%,#7dd3fc_46%,#f2fbff_100%)]",
                option.id === "stock-photo" && "border-[#eceaf0] bg-[linear-gradient(135deg,#eef4ff,#f8fafc)]",
              )}
            />
            <p className="text-sm font-semibold text-[#111827]">{option.label}</p>
            <p className="mt-2 text-sm leading-7 text-[#5b6475]">{option.detail}</p>
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
      <div className="flex flex-wrap justify-center gap-3">
        {lesson.interaction.options.map((topic) => {
          const active = selectedTopics.includes(topic);
          const blocked = selectedTopics.length >= lesson.interaction.minSelections && !active;

          return (
            <PillButton
              key={topic}
              active={active}
              onClick={() => toggleTopic(topic)}
              disabled={blocked}
            >
              {topic}
            </PillButton>
          );
        })}
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {selectedTopics.map((topic) => (
          <span
            key={topic}
            className="rounded-full border border-[#eceaf0] bg-white px-3 py-1.5 text-xs text-[#4b5563]"
          >
            {topic}
          </span>
        ))}
      </div>
    </div>
  );
}

function QuickCheck({ lesson, state, updateState }) {
  const selectedAnswer = typeof state.selectedAnswer === "number" ? state.selectedAnswer : null;

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-[#6b7280]">{lesson.checkpoint.question}</p>
      <div className="flex flex-wrap justify-center gap-3">
        {lesson.checkpoint.options.map((option, index) => (
          <PillButton
            key={option}
            active={selectedAnswer === index}
            onClick={() =>
              updateState((current) => ({
                ...current,
                selectedAnswer: index,
                feedback: null,
                validated: false,
              }))
            }
          >
            {option}
          </PillButton>
        ))}
      </div>
    </div>
  );
}

function LessonConfirmation({ feedback }) {
  return (
    <div className="mx-auto max-w-[620px] rounded-[32px] border border-[#d9eedf] bg-[#f6fcf7] px-8 py-10 text-center shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#c8e6d1] bg-white">
        <CheckCircle2 className="h-7 w-7 text-[#166534]" />
      </div>
      <p className="mt-5 text-2xl font-semibold tracking-tight text-[#111827]">Lesson complete.</p>
      <p className="mt-3 text-sm leading-7 text-[#5b6475]">
        {feedback || "Correct. You can move to the next lesson."}
      </p>
    </div>
  );
}

function LessonIllustration({ lesson }) {
  const illustrationMarkup = LESSON_ILLUSTRATION_MARKUP[lesson.id];

  if (illustrationMarkup) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="mx-auto w-full max-w-[560px]"
      >
        <div
          className="[&_svg]:block [&_svg]:h-auto [&_svg]:w-full"
          dangerouslySetInnerHTML={{ __html: illustrationMarkup }}
        />
      </motion.div>
    );
  }

  return (
    <div className="py-10 text-center">
      <div className="mx-auto max-w-[340px]">
        <p className="text-sm font-medium text-[#6b7280]">SVG animation placeholder</p>
        <p className="mt-3 text-sm leading-7 text-[#8a93a4]">
          Drop the section illustration for <span className="font-medium text-[#5b6475]">{lesson.title}</span> here.
        </p>
      </div>
    </div>
  );
}

function LessonTextbookCard({ lesson }) {
  return (
    <div className="mx-auto w-full max-w-[860px] px-6 py-7 text-left sm:px-8">
      <div className="space-y-6">
        <LessonIllustration lesson={lesson} />
      </div>

      <div className="mt-6 space-y-4 text-base leading-8 text-[#4b5563]">
        {lesson.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}

function LessonInteraction({ lesson, state, updateState }) {
  switch (lesson.interaction.type) {
    case "lane-reveal":
      return <LaneRevealInteraction lesson={lesson} state={state} updateState={updateState} />;
    case "bucket-sort":
      return <ClassifierInteraction lesson={lesson} state={state} updateState={updateState} mode="bucket" />;
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
      return <ClassifierInteraction lesson={lesson} state={state} updateState={updateState} mode="timeline" />;
    default:
      return null;
  }
}

function CompletionScreen({
  copied,
  onCopyReferralCode,
  onKickoffClick,
  onReplay,
}) {
  return (
    <div className="mx-auto flex w-full max-w-[840px] flex-col items-center text-center">
      <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-[#111827] sm:text-5xl">
        You now understand the system.
      </h1>

      <div className="mt-10 w-full max-w-[380px] rounded-[36px] border border-[#dbe4f0] bg-[linear-gradient(180deg,#ffffff,#f6fbff)] px-6 py-10 shadow-[0_18px_50px_rgba(15,23,42,0.09)]">
        <p className="text-sm font-medium text-[#7c8392]">
          Referral reward unlocked
        </p>
        <p className="mt-5 text-5xl font-semibold tracking-tight text-[#111827]">$500 OFF</p>
        <p className="mt-3 text-sm leading-7 text-[#5b6475]">When you refer a paying client.</p>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-2">
        <SupportDialogButton
          icon={BookOpen}
          label="What you learned"
          title="Course summary"
          description="The short version."
        >
          <div className="space-y-3">
            {COMPLETION_NOTES.map((note) => (
              <div key={note} className="rounded-2xl border border-[#eceaf0] bg-white px-4 py-3">
              <p>{note}</p>
            </div>
          ))}
        </div>
        </SupportDialogButton>
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Button
          type="button"
          onClick={onCopyReferralCode}
          className={PRIMARY_ACTION_BUTTON_CLASS}
        >
          <Copy className="mr-2 h-4 w-4" />
          {copied ? "Code copied" : "Copy referral code"}
        </Button>
      </div>

      <div className="mt-6 flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={onReplay}
          className="inline-flex items-center gap-2 text-sm font-medium text-[#6b7280] underline-offset-4 transition hover:text-[#111827] hover:underline"
        >
          <RotateCcw className="h-4 w-4" />
          Replay course
        </button>

        <button
          type="button"
          onClick={onKickoffClick}
          className="inline-flex items-center gap-2 text-sm font-medium text-[#6b7280] underline-offset-4 transition hover:text-[#111827] hover:underline"
        >
          <ExternalLink className="h-4 w-4" />
          Book kickoff call
        </button>
      </div>
    </div>
  );
}

export default function AdvertisingCourseMinimal({ initialCompleted = false }) {
  const router = useRouter();
  const pathname = usePathname();
  const [currentIndex, setCurrentIndex] = useState(initialCompleted ? LESSONS.length : 0);
  const [lessonStates, setLessonStates] = useState(createInitialLessonStates);
  const [copied, setCopied] = useState(false);
  const [supportGuideStepIndex, setSupportGuideStepIndex] = useState(null);
  const startedRef = useRef(false);
  const completionTrackedRef = useRef(false);
  const copyTimeoutRef = useRef(null);

  const isCompleted = currentIndex >= LESSONS.length;
  const currentLesson = isCompleted ? null : LESSONS[currentIndex];
  const currentState = currentLesson ? lessonStates[currentLesson.id] || {} : {};
  const visibleTerms = useMemo(() => getVisibleTerms(currentIndex), [currentIndex]);
  const interactionComplete = currentLesson ? isLessonInteractionComplete(currentLesson, currentState) : true;
  const lessonStage = isCompleted
    ? "completion"
    : currentState.validated
      ? "confirmed"
      : currentState.exerciseChecked
        ? "check"
        : currentState.textbookSeen
          ? "exercise"
          : "read";
  const canCheckAnswer = Boolean(
    currentLesson && lessonStage === "check" && typeof currentState.selectedAnswer === "number",
  );
  const progressValue = getCourseProgress(currentIndex, currentState, isCompleted);
  const activeSupportGuideStep =
    typeof supportGuideStepIndex === "number" ? SUPPORT_GUIDE_STEPS[supportGuideStepIndex] : null;
  const showInteractionPrompt =
    Boolean(currentLesson?.interaction.prompt) && lessonStage === "exercise";

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    void sendCourseEvent("advertising_course_started", {
      initialCompleted,
      path: pathname || ADVERTISING_PATH,
    });
  }, [initialCompleted, pathname]);

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
    if (typeof window === "undefined") return;
    const alreadySeen = window.sessionStorage.getItem(SUPPORT_GUIDE_KEY) === "true";
    setSupportGuideStepIndex(alreadySeen ? null : 0);
  }, []);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        window.clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  function dismissSupportGuide() {
    setSupportGuideStepIndex(null);
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(SUPPORT_GUIDE_KEY, "true");
    }
  }

  function goToNextSupportGuideStep() {
    setSupportGuideStepIndex((current) => {
      if (typeof current !== "number") return null;
      if (current >= SUPPORT_GUIDE_STEPS.length - 1) {
        if (typeof window !== "undefined") {
          window.sessionStorage.setItem(SUPPORT_GUIDE_KEY, "true");
        }
        return null;
      }
      return current + 1;
    });
  }

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

  function handleCheckAnswer() {
    if (!currentLesson) return;

    if (!interactionComplete) {
      updateLessonState(currentLesson.id, (current) => ({
        ...current,
        feedback: "Finish the exercise first. Then the quick check becomes active.",
      }));
      return;
    }

    if (typeof currentState.selectedAnswer !== "number") {
      updateLessonState(currentLesson.id, (current) => ({
        ...current,
        feedback: "Choose an answer first.",
      }));
      return;
    }

    const correct = currentState.selectedAnswer === currentLesson.checkpoint.correct;

    updateLessonState(currentLesson.id, (current) => ({
      ...current,
      validated: correct,
      feedback: correct
        ? "Correct. You can move to the next lesson."
        : "Not quite. Re-read the textbook or hint and try again.",
      reportedComplete: correct ? current.reportedComplete || false : current.reportedComplete,
    }));

    if (correct && !currentState.reportedComplete) {
      void sendCourseEvent("lesson_completed", {
        lessonId: currentLesson.id,
        lessonTitle: currentLesson.title,
        lessonNumber: currentIndex + 1,
      });
      updateLessonState(currentLesson.id, (current) => ({
        ...current,
        reportedComplete: true,
      }));
    }
  }

  function handleAdvanceStage() {
    if (!currentLesson) return;

    if (lessonStage === "read") {
      updateLessonState(currentLesson.id, (current) => ({
        ...current,
        textbookSeen: true,
        feedback: null,
      }));
      return;
    }

    if (!interactionComplete) {
      updateLessonState(currentLesson.id, (current) => ({
        ...current,
        feedback: getExerciseIncompleteFeedback(currentLesson),
      }));
      return;
    }

    updateLessonState(currentLesson.id, (current) => ({
      ...current,
      exerciseChecked: true,
      feedback: null,
    }));
  }

  function handleNext() {
    if (!currentLesson || !currentState.validated) return;

    const nextIndex = currentIndex + 1;

    if (nextIndex >= LESSONS.length) {
      setCurrentIndex(LESSONS.length);
      router.replace(`${ADVERTISING_PATH}?completed=true`, { scroll: false });
      return;
    }

    setCurrentIndex(nextIndex);
  }

  function handleBack() {
    if (isCompleted) {
      setCurrentIndex(LESSONS.length - 1);
      router.replace(ADVERTISING_PATH, { scroll: false });
      return;
    }

    if (!currentLesson) return;

    if (lessonStage === "check") {
      updateLessonState(currentLesson.id, (current) => ({
        ...current,
        exerciseChecked: false,
        feedback: null,
      }));
      return;
    }

    if (lessonStage === "exercise") {
      updateLessonState(currentLesson.id, (current) => ({
        ...current,
        textbookSeen: false,
        feedback: null,
      }));
      return;
    }

    if (currentIndex === 0) return;
    setCurrentIndex((current) => current - 1);
  }

  function handleReplay() {
    setLessonStates(createInitialLessonStates());
    setCurrentIndex(0);
    setCopied(false);
    completionTrackedRef.current = false;
    router.replace(ADVERTISING_PATH, { scroll: false });
  }

  async function handleCopyReferralCode() {
    if (typeof window === "undefined") return;

    try {
      await navigator.clipboard.writeText(REFERRAL_REWARD_CODE);
      setCopied(true);
      void sendCourseEvent("referral_link_copied", { referralCode: REFERRAL_REWARD_CODE });
      if (copyTimeoutRef.current) {
        window.clearTimeout(copyTimeoutRef.current);
      }
      copyTimeoutRef.current = window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  }

  function handleKickoffClick() {
    void sendCourseEvent("kickoff_call_clicked", {
      destination: KICKOFF_CALL_URL,
    });
    if (typeof window !== "undefined") {
      window.open(KICKOFF_CALL_URL, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f5f2] font-sans text-[#111827]">
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col px-4 pb-6 pt-5 sm:px-6">
        <header className="flex items-center gap-4">
          <Link
            href="/"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#d4d2d0] text-[#7b7a79] transition hover:bg-[#c9c7c5]"
            aria-label="Exit course"
          >
            <X className="h-5 w-5" />
          </Link>

          <div className="flex min-w-0 flex-1 items-center gap-4">
            <div className="relative h-4 min-w-0 flex-1 overflow-hidden rounded-full bg-[#dedee4]">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full bg-[linear-gradient(90deg,#f0c4ff,#b890ff)]"
                animate={{ width: `${progressValue}%` }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
              />
            </div>

            {!isCompleted ? (
              <div className="relative shrink-0">
                <LessonSupport
                  lesson={currentLesson}
                  visibleTerms={visibleTerms}
                  activeGuideStepId={activeSupportGuideStep?.id || null}
                />

                <AnimatePresence>
                  {activeSupportGuideStep ? (
                    <SupportGuide
                      step={activeSupportGuideStep}
                      stepIndex={supportGuideStepIndex}
                      totalSteps={SUPPORT_GUIDE_STEPS.length}
                      onNext={goToNextSupportGuideStep}
                      onDismiss={dismissSupportGuide}
                    />
                  ) : null}
                </AnimatePresence>
              </div>
            ) : null}
          </div>
        </header>

        <main className="flex flex-1 items-center justify-center">
          <AnimatePresence mode="wait">
            {isCompleted ? (
              <motion.div
                key="completion"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.18 }}
                className="w-full"
              >
                <CompletionScreen
                  copied={copied}
                  onCopyReferralCode={handleCopyReferralCode}
                  onKickoffClick={handleKickoffClick}
                  onReplay={handleReplay}
                />
              </motion.div>
            ) : (
              <motion.div
                key={currentLesson.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.18 }}
                className="w-full"
              >
                <div className="mx-auto flex w-full max-w-[980px] flex-col items-center text-center">
                  <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-[#111827] sm:text-5xl">
                    {currentLesson.title}
                  </h1>
                  {showInteractionPrompt ? (
                    <p className="mt-4 max-w-2xl text-base leading-8 text-[#626b7f]">
                      {currentLesson.interaction.prompt}
                    </p>
                  ) : null}

                  <div className={cn("flex min-h-[340px] w-full items-center justify-center", showInteractionPrompt ? "mt-10" : "mt-8")}>
                    <AnimatePresence mode="wait">
                      {lessonStage === "read" ? (
                        <motion.div
                          key={`${currentLesson.id}-read`}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.18 }}
                          className="w-full"
                        >
                          <LessonTextbookCard lesson={currentLesson} />
                        </motion.div>
                      ) : null}

                      {lessonStage === "exercise" ? (
                        <motion.div
                          key={`${currentLesson.id}-exercise`}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.18 }}
                          className="w-full"
                        >
                          <LessonInteraction
                            lesson={currentLesson}
                            state={currentState}
                            updateState={(updater) => updateLessonState(currentLesson.id, updater)}
                          />
                        </motion.div>
                      ) : null}

                      {lessonStage === "check" ? (
                        <motion.div
                          key={`${currentLesson.id}-check`}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.18 }}
                          className="w-full max-w-[780px]"
                        >
                          <QuickCheck
                            lesson={currentLesson}
                            state={currentState}
                            updateState={(updater) => updateLessonState(currentLesson.id, updater)}
                          />
                        </motion.div>
                      ) : null}

                      {lessonStage === "confirmed" ? (
                        <motion.div
                          key={`${currentLesson.id}-confirmed`}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.18 }}
                          className="w-full"
                        >
                          <LessonConfirmation feedback={currentState.feedback} />
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>

                  <div className="mt-12 flex flex-col items-center gap-4">
                    <div className="flex flex-wrap items-center justify-center gap-3">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={handleBack}
                        disabled={currentIndex === 0}
                        className="rounded-full px-4 text-[#6b7280] hover:bg-white hover:text-[#111827]"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                      </Button>

                      {lessonStage === "read" ? (
                        <Button
                          type="button"
                          onClick={handleAdvanceStage}
                          className={`${PRIMARY_ACTION_BUTTON_CLASS} px-8 py-5 text-lg`}
                        >
                          Next
                        </Button>
                      ) : null}

                      {lessonStage === "exercise" ? (
                        <Button
                          type="button"
                          onClick={handleAdvanceStage}
                          className={`${PRIMARY_ACTION_BUTTON_CLASS} px-8 py-5 text-lg`}
                        >
                          Next
                        </Button>
                      ) : null}

                      {lessonStage === "confirmed" ? (
                        <Button
                          type="button"
                          onClick={handleNext}
                          className={`${PRIMARY_ACTION_BUTTON_CLASS} px-8 py-5 text-lg`}
                        >
                          Next lesson
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      ) : null}

                      {lessonStage === "check" ? (
                        <Button
                          type="button"
                          onClick={handleCheckAnswer}
                          className={`${PRIMARY_ACTION_BUTTON_CLASS} px-8 py-5 text-lg disabled:cursor-not-allowed disabled:opacity-55`}
                          disabled={!canCheckAnswer}
                        >
                          Check answer
                        </Button>
                      ) : null}
                    </div>

                    {currentState.feedback && lessonStage !== "confirmed" ? (
                      <p
                        className={cn(
                          "max-w-xl text-sm leading-7",
                          currentState.validated ? "text-[#166534]" : "text-[#6b7280]",
                        )}
                      >
                        {currentState.feedback}
                      </p>
                    ) : null}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

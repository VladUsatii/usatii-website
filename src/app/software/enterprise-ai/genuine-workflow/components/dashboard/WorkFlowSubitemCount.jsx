"use client";
import { useId, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

export default function WorkFlowSubitemCount({ count, onClick }) {
  const [position, setPosition] = useState(null);
  const id = useId();
  const reduced = useReducedMotion();
  const label = `${count} ${count === 1 ? "subitem" : "subitems"}`;
  const show = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setPosition({ left: Math.max(64, Math.min(window.innerWidth - 64, rect.left + rect.width / 2)), top: Math.max(8, rect.top - 42) });
  };
  return <><button type="button" onClick={onClick} onMouseEnter={show} onMouseLeave={() => setPosition(null)} onFocus={show} onBlur={() => setPosition(null)} onKeyDown={(event) => { if (event.key === "Escape") setPosition(null); }} aria-label={label} aria-describedby={position ? id : undefined} className="work-flow-subitem-count mx-1 inline-flex h-4 min-w-4 shrink-0 items-center justify-center rounded-sm bg-[#dce3eb] px-1 text-[10px] leading-none text-[#323338] focus-visible:outline-2 focus-visible:outline-[#0073ea]">{count}</button>{typeof document !== "undefined" && createPortal(<AnimatePresence>{position && <motion.div id={id} role="tooltip" initial={{ opacity: 0, y: reduced ? 0 : 3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .12 }} className="pointer-events-none fixed z-[250] -translate-x-1/2 rounded bg-[#323338] px-4 py-2 text-xs font-medium text-white shadow-lg" style={position}>{label}<span className="absolute -bottom-1 left-1/2 size-2 -translate-x-1/2 rotate-45 bg-[#323338]" /></motion.div>}</AnimatePresence>, document.body)}</>;
}

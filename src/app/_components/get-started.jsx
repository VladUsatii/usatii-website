"use client";
import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ChevronDown, Code2, Construction, Megaphone, Radio } from "lucide-react";
import styles from "./work-home.module.css";

const products = [
  { label: "For Communications & Social Media", href: "https://oasis.usatii.com", icon: Megaphone, color: "#9457d8" },
  { label: "For Construction Management", href: "/construction", icon: Construction, color: "#b87b26" },
  { label: "For Emergency Management", href: "/dart", icon: Radio, color: "#407c73" },
  { label: "For Custom Software Needs", href: "/software", icon: Code2, color: "#597ca6" },
];
export default function GetStarted({ label = "Get started", align = "left" }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const root = useRef(null);
  const trigger = useRef(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const outside = (event) => { if (!root.current?.contains(event.target)) setOpen(false); };
    const escape = (event) => { if (open && event.key === "Escape") { setOpen(false); trigger.current?.focus(); } };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", outside); document.removeEventListener("keydown", escape); };
  }, [open]);
  return <div className={styles.selector} ref={root} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}>
    <button ref={trigger} className={styles.primary} aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>
      {label} <ChevronDown size={16} className={open ? styles.chevronOpen : styles.chevron} aria-hidden="true" />
    </button>
    <AnimatePresence>{open && <motion.div id={id} className={`${styles.dropdown} ${align === "right" ? styles.dropdownRight : ""}`} initial={{ opacity: 0, y: reduced ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduced ? 0 : 4 }} transition={{ duration: .18 }}>
      {products.map(({ label, href, icon: Icon, color }, index) => <motion.div key={href} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: reduced ? 0 : index * .07 }}>
        <Link href={href} onClick={() => setOpen(false)} className={styles.option}>
          <motion.span className={styles.doodle} style={{ color }} animate={reduced ? undefined : { rotate: [0, -9, 6, 0], y: [0, -2, 0] }} transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 1.5 + index, delay: index * .5 }}><Icon size={19} strokeWidth={1.6} aria-hidden="true" /></motion.span>
          {label}<ArrowUpRight size={14} aria-hidden="true" />
        </Link>
      </motion.div>)}
    </motion.div>}</AnimatePresence>
  </div>;
}


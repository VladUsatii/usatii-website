"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValue, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import GetStarted from "./get-started";
import styles from "./work-home.module.css";

const cards = [
  { name: "OASIS", src: "/news/marketing-team-collaboration.webp", href: "https://oasis.usatii.com", action: "Explore OASIS" },
  { name: "REBUILDIT", src: "/about/construction.webp", href: "/news/introducing-usatii-for-construction", action: "Read case study" },
  { name: "DART", src: "/emergency-management/emergency-response-hero.webp", href: "/emergency-management", action: "Explore DART" },
];
const logos = [
  ["rebuildit", "Rebuildit"], ["kalm", "KALM"], ["bishop", "Bishop"], ["resolution", "Resolution, Inc."],
  ["cpa-dude", "The CPA Dude"], ["gamma", "Gamma"], ["happy-techies", "Happy Techies"], ["airbo", "airbo"],
  ["spectres", "Spectres"], ["ofr", "OFR"], ["oddsmate", "OddsMate"], ["rich-and-pour", "Rich & Pour"],
];
const verticals = [
  { name: "Engineering", description: "Streamline jobs, installations, clients, estimating, modeling, calls and appointments, documentation, and project management.", href: "/construction", src: "/construction/modeling-estimating.webp", caption: "From first estimate to final installation." },
  { name: "Marketing", description: "Teams can access mass social media posting, advertisements, automatic alerting, social listening, and data analytics tasks, all powered by AI and custom automations.", href: "/advertising", src: "/news/marketing-team-collaboration.webp", caption: "More creativity. Less busywork." },
  { name: "Sales", description: "Access advanced AI coaching, analysis, CRMs, and more.", href: "/ai", src: "/construction/lead-intake-telephony.webp", caption: "Turn every conversation into opportunity." },
  { name: "Operations", description: "Customize how your organization speaks across departments with our robust set of software capabilities. Integrate from hundreds of platforms or migrate data in-house.", href: "/software", src: "/construction/rebuildit-operations.webp", caption: "Every department. One connected operation." },
];

function ClientLoop() {
  const [group, setGroup] = useState(0);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return;
    const timer = setInterval(() => setGroup((previous) => (previous + 1) % 3), 4000);
    return () => clearInterval(timer);
  }, [reduced]);
  return <section className={styles.clients} aria-label="A few of the teams we work with">
    <AnimatePresence mode="wait"><motion.div key={group} className={styles.logoRow}>
      {logos.slice(group * 4, group * 4 + 4).map(([file, name], index) => <motion.div key={file} className={styles.logo} initial={{ opacity: reduced ? .65 : 0, y: reduced ? 0 : 22 }} animate={{ opacity: .65, y: 0 }} exit={{ opacity: 0, y: reduced ? 0 : -22 }} transition={{ duration: reduced ? 0 : .5, delay: reduced ? 0 : index * .18, ease: [.22, 1, .36, 1] }}><Image src={`/home/client-logos/${file}.webp`} alt={name} width={200} height={70} /></motion.div>)}
    </motion.div></AnimatePresence>
  </section>;
}

function Verticals() {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const item = verticals[active];
  return <section className={styles.verticals}>
    <div className={styles.sectionHeading}><h2>Software for every team.</h2><p>Thoughtful tools for the work you do every day.</p></div>
    <div className={styles.verticalLayout}>
      <div className={styles.verticalList}>
        {verticals.map((vertical, index) => <div key={vertical.name} className={styles.verticalItem}>
          <button id={`vertical-${index}`} aria-expanded={active === index} aria-controls={`vertical-description-${index}`} onClick={() => setActive(index)} className={active === index ? styles.activeVertical : styles.verticalButton}>{vertical.name}<span aria-hidden="true">{active === index ? "−" : "+"}</span></button>
          {active === index && <motion.div id={`vertical-description-${index}`} initial={{ opacity: reduced ? 1 : 0 }} animate={{ opacity: 1 }}><p>{vertical.description}</p><Link className={styles.learnLink} href={vertical.href}>Learn more <ArrowUpRight size={14} aria-hidden="true" /></Link></motion.div>}
        </div>)}
      </div>
      <div className={styles.verticalVisual} role="region" aria-labelledby={`vertical-${active}`}>
        <AnimatePresence mode="wait"><motion.div key={item.name} initial={{ opacity: reduced ? 1 : 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .25 }} className={styles.visualInner}>
          <Image src={item.src} alt={`${item.name} software and workflows`} fill sizes="(max-width: 760px) 100vw, 65vw" />
          <div className={styles.visualCaption}><h3>{item.caption}</h3><Link href={item.href}>Explore {item.name.toLowerCase()} <ArrowUpRight size={17} aria-hidden="true" /></Link></div>
        </motion.div></AnimatePresence>
      </div>
    </div>
  </section>;
}

export default function WorkHome() {
  const reduced = useReducedMotion();
  const boxX = useMotionValue(0);
  const boxY = useMotionValue(0);
  const resetBox = () => { boxX.set(0); boxY.set(0); };
  const moveBox = (event) => {
    const steps = { ArrowLeft: [-10, 0], ArrowRight: [10, 0], ArrowUp: [0, -10], ArrowDown: [0, 10] };
    if (steps[event.key]) {
      event.preventDefault();
      const [x, y] = steps[event.key];
      boxX.set(Math.max(-65, Math.min(65, boxX.get() + x)));
      boxY.set(Math.max(-40, Math.min(40, boxY.get() + y)));
    } else if (event.key === "Escape" || event.key === "Enter") resetBox();
  };
  return <div className={styles.home}>
    <section className={styles.hero}>
      <div className={styles.heroCopy}>
        <h1 aria-label="Intelligent software everywhere you work"><motion.span className={styles.boxed} drag dragConstraints={{ left: -65, right: 65, top: -40, bottom: 40 }} dragElastic={.12} dragMomentum={false} style={{ x: boxX, y: boxY }} tabIndex={0} onKeyDown={moveBox} onDoubleClick={resetBox} title="Drag to move. Use arrow keys to move, or Enter to reset.">Intelligent software<span className={styles.corner} aria-hidden="true" /></motion.span><span className={styles.secondLine}>everywhere you work</span></h1>
        <div className={styles.actions}><GetStarted /><Link className={styles.sales} href="/quote-request">Contact sales <ArrowUpRight size={16} aria-hidden="true" /></Link></div>
      </div>
      <div className={styles.rack}>
        {cards.map((card, index) => <motion.div key={card.name} className={`${styles.rackCard} ${index === 1 ? styles.centerCard : styles.sideCard}`} initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 65, rotate: reduced ? 0 : (index - 1) * 5 }} whileInView={{ opacity: 1, y: 0, rotate: (index - 1) * 5 }} viewport={{ once: true }} transition={{ duration: .8, delay: index * .12, ease: [.16, 1, .3, 1] }}>
          <Link href={card.href} className={styles.cardLink} aria-label={`${card.name}: ${card.action}`}>
            <Image src={card.src} alt="" fill priority={index === 1} sizes="(max-width: 760px) 75vw, 38vw" />
            <div className={styles.cardShade} />
            <div className={styles.cardTitle}>{card.name === "REBUILDIT" ? <Image className={styles.rebuilditLogo} src="/home/client-logos/rebuildit.webp" alt="REBUILDIT" width={180} height={45} /> : <strong>{card.name}</strong>}<span className={styles.cardAction}>{card.action} <ArrowUpRight size={16} aria-hidden="true" /></span></div>
          </Link>
        </motion.div>)}
      </div>
    </section>
    <ClientLoop />
    <section className={styles.intro}>
      <div><h2>Introducing USATII</h2><p className={styles.introLead}>Your ambitious custom software design partner.</p>
        <ul><li>Use our off-the-shelf solutions for communications, construction, and management</li><li>Pairs well with our AI integration solutions</li><li>Increase efficiency and reduce administrative costs</li></ul>
        <Link href="/about" className={styles.secondary}>Learn more <ArrowUpRight size={15} aria-hidden="true" /></Link>
      </div>
      <div className={styles.demo}><video src="/Inventory_DEMO.mp4" poster="/construction/rebuildit-operations.webp" autoPlay={!reduced} muted loop playsInline controls preload="metadata" aria-label="USATII inventory software demo" /></div>
    </section>
    <Verticals />
  </div>;
}

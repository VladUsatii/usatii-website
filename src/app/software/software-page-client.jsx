"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";

const platforms = [
  {
    index: "01",
    name: "OASIS",
    description: "Simplify company or government communications, public and private.",
    href: "https://oasis.usatii.com",
  },
  {
    index: "02",
    name: "Workspace",
    description: "A custom operating system to harmoniously connect every department together.",
    href: "/software/contractor-operating-system",
  },
  {
    index: "03",
    name: "REBUILDIT AI",
    description: "Workspace that unifies and automates every department within construction companies.",
    href: "https://www.rebuilditinc.com",
  },
];

function Reveal({ children, className = "", delay = 0, amount = 0.18 }) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reducedMotion ? false : { opacity: 0, y: 28 }}
      whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function SectionLabel({ children }) {
  return (
    <p className="text-sm tabular-nums text-neutral-400">
      {children}
    </p>
  );
}

const initialQuoteForm = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  customerType: "Yes, I am a potential new customer",
  urgency: "normal",
  message: "",
};

const fieldClass =
  "w-full border-b border-neutral-300 bg-transparent py-3 text-base text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-violet-600";

function QuoteForm() {
  const [form, setForm] = useState(initialQuoteForm);
  const [sessionId, setSessionId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const key = "usatii_telemetry_session_id";
    const existing = window.sessionStorage.getItem(key);
    if (existing) {
      setSessionId(existing);
      return;
    }

    const nextId = window.crypto?.randomUUID?.() || `session_${Date.now()}`;
    window.sessionStorage.setItem(key, nextId);
    setSessionId(nextId);
  }, []);

  function setField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setStatus("idle");
    setMessage("");

    try {
      const response = await fetch("/api/quote-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, sessionId, originPath: "/software" }),
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        setStatus("error");
        setMessage(payload.error || "Unable to submit right now. Please try again.");
        return;
      }

      setStatus("success");
      setMessage("Submitted. We’ll reach out shortly.");
      setForm(initialQuoteForm);
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5" aria-label="Request a software quote">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-1 text-sm text-neutral-500">
          Name
          <input required value={form.fullName} onChange={(event) => setField("fullName", event.target.value)} className={fieldClass} autoComplete="name" />
        </label>
        <label className="grid gap-1 text-sm text-neutral-500">
          Email
          <input required type="email" value={form.email} onChange={(event) => setField("email", event.target.value)} className={fieldClass} autoComplete="email" />
        </label>
        <label className="grid gap-1 text-sm text-neutral-500">
          Phone
          <input value={form.phone} onChange={(event) => setField("phone", event.target.value)} className={fieldClass} autoComplete="tel" />
        </label>
        <label className="grid gap-1 text-sm text-neutral-500">
          Address
          <input value={form.address} onChange={(event) => setField("address", event.target.value)} className={fieldClass} autoComplete="street-address" />
        </label>
        <label className="grid gap-1 text-sm text-neutral-500">
          Customer type
          <select value={form.customerType} onChange={(event) => setField("customerType", event.target.value)} className={fieldClass}>
            <option value="Yes, I am a potential new customer">Potential customer</option>
            <option value="No, I am an existing customer">Existing customer</option>
            <option value="I'm neither">Neither</option>
          </select>
        </label>
        <label className="grid gap-1 text-sm text-neutral-500">
          Urgency
          <select value={form.urgency} onChange={(event) => setField("urgency", event.target.value)} className={fieldClass}>
            <option value="urgent">Urgent</option>
            <option value="normal">Normal</option>
            <option value="low">Low</option>
          </select>
        </label>
      </div>
      <label className="grid gap-1 text-sm text-neutral-500">
        What can we help you build?
        <textarea required rows={4} value={form.message} onChange={(event) => setField("message", event.target.value)} className={`${fieldClass} resize-none`} />
      </label>

      {message ? (
        <p className={`text-sm ${status === "error" ? "text-rose-600" : "text-emerald-700"}`} role="status">
          {message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center justify-between border-b border-neutral-950 pb-3 text-sm font-medium transition-colors hover:border-violet-700 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? "Submitting…" : "Request a quote"}
        <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
}

export default function SoftwarePageClient() {
  const reducedMotion = useReducedMotion();

  return (
    <main className="overflow-hidden bg-white text-neutral-950">
      <section className="mx-auto w-full max-w-6xl px-6 pb-16 pt-20 lg:px-8 lg:pb-24 lg:pt-28">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_20rem] md:items-start lg:grid-cols-[minmax(0,1fr)_24rem]">
          <Reveal>
            <SectionLabel>USATII / SOFTWARE</SectionLabel>
            <h1 className="mt-5 max-w-4xl text-[clamp(2.4rem,6vw,5.5rem)] font-medium leading-[0.88] tracking-[-0.055em]">
              Organizations of <span className="text-violet-600">tomorrow.</span>
            </h1>
          </Reveal>

          <Reveal className="md:pt-5" delay={0.12}>
            <p className="text-xl font-medium leading-[1.15] tracking-[-0.03em] md:text-2xl">
              Effectively utilizing AI, company data, and software remains the largest barrier for businesses to solve problems efficiently.
            </p>
            <p className="mt-5 max-w-sm text-base leading-7 text-neutral-600">
              We design systems to abstract your organization, targeting little to no rote work and a higher quality of life for employees.
            </p>
            <Link
              href="/software/software-waste-audit"
              className="mt-8 inline-flex w-full items-center justify-between border-b border-neutral-300 pb-2 text-sm font-medium transition-colors hover:border-violet-700 hover:text-violet-700"
            >
              Start with a software audit
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>

        <motion.div
          className="relative mt-14 aspect-[16/9] min-h-[300px] overflow-hidden rounded-[2rem] bg-neutral-100 shadow-[0_24px_70px_rgba(15,23,42,0.14)] md:mt-20 md:min-h-0"
          initial={reducedMotion ? false : { opacity: 0, scale: 0.975 }}
          whileInView={reducedMotion ? undefined : { opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.18 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          <video
            src="/Inventory_DEMO.mp4"
            aria-label="Materials inventory software demonstration"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-white/5" />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-5 p-5 text-white md:p-8">
            <div>
              <p className="text-sm font-semibold">Software, connected</p>
              <p className="mt-2 max-w-lg text-sm text-white/75">One view of the work, the customer, and what happens next.</p>
            </div>
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/70 bg-white/10 backdrop-blur">
              <Play className="ml-0.5 h-4 w-4 fill-current" />
            </span>
          </div>
        </motion.div>
      </section>

      <section className="mx-auto w-full max-w-6xl border-t border-neutral-200 px-6 py-20 lg:px-8 lg:py-28">
        <Reveal><SectionLabel>01 / IMPACT</SectionLabel></Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-5 max-w-5xl text-[clamp(2.8rem,6vw,6rem)] font-medium leading-[0.95] tracking-[-0.045em]">
            Enterprise software is no longer <span className="text-violet-600">a luxury.</span>
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-8 md:mt-20 md:grid-cols-2">
          <div />
          <Reveal>
            <p className="max-w-lg text-2xl font-medium leading-[1.15] tracking-[-0.03em] md:text-3xl">
              Systems must abstract operational work to give employees and decision-makers clarity while reducing their workload.
            </p>
            <div className="mt-8 grid max-w-lg gap-5 text-base leading-7 text-neutral-600">
              <p>
                Status-quo companies carry various disconnected tools, have an incomplete picture of their data, and leverage pen-and-paper. The cost is not just the subscription or the mental load -- it is lost revenue, employee satisfaction, and creativity.
              </p>
              <p>
                We map your full company, abstract decision-making, and build cross-platform tooling to connect and track work holistically. The result is a practical operating system that your team understands with provenance you can own.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl border-t border-neutral-200 px-6 py-20 lg:px-8 lg:py-24">
        <Reveal><SectionLabel>02 / ABSTRACTIONS</SectionLabel></Reveal>
        <Reveal><h2 className="mt-4 text-4xl font-medium tracking-[-0.035em] md:text-6xl">You are not a machine.</h2></Reveal>

        <div className="mt-10 border-t border-neutral-200 md:mt-14">
          {platforms.map((platform, index) => (
            <motion.div
              key={platform.name}
              initial={reducedMotion ? false : { opacity: 0, x: -24 }}
              whileInView={reducedMotion ? undefined : { opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.45 }}
              transition={{ duration: 0.55, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href={platform.href}
                className="group grid gap-4 border-b border-neutral-200 py-8 transition-colors hover:bg-violet-50/60 md:grid-cols-[1fr_1fr_auto] md:items-center md:px-3"
              >
                <div className="flex items-baseline gap-4">
                  <span className="text-sm tabular-nums text-neutral-400">{platform.index}</span>
                  <h3 className="text-xl font-medium tracking-[-0.025em] md:text-2xl">↳ {platform.name}</h3>
                </div>
                <p className="max-w-xs text-sm leading-6 text-neutral-600">{platform.description}</p>
                <span className="inline-flex items-center gap-8 border-b border-neutral-300 pb-1 text-sm font-medium group-hover:border-violet-700 group-hover:text-violet-700">
                  Explore <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl border-t border-neutral-200 px-6 py-20 lg:px-8 lg:py-28">
        <Reveal><SectionLabel>03 / NEXT STEP</SectionLabel></Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-5 max-w-5xl text-[clamp(2.8rem,6vw,6rem)] font-medium leading-[0.95] tracking-[-0.045em]">
            Get in <span className="text-violet-600">contact.</span>
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-8 md:mt-20 md:grid-cols-2">
          <div />
          <Reveal>
            <QuoteForm />
          </Reveal>
        </div>
      </section>
    </main>
  );
}

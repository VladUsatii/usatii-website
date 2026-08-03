"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Boxes, ShieldCheck, Sparkles, UsersRound } from "lucide-react";

const initialForm = {
  interest: "",
  workEmail: "",
  companySize: "",
  companyName: "",
  firstName: "",
  lastName: "",
  phoneNumber: "",
  businessNeeds: "",
};

const features = [
  ["No training on your data", ShieldCheck],
  ["Unlimited governed publishing workflows", Sparkles],
  ["Easy member, role, and billing management", UsersRound],
  ["Integrations with Google Drive and more", Boxes],
];

const trustedLogos = [
  ["The CPA Dude", "https://i.postimg.cc/L5DXdKt9/CPADUDEIMAGE.png"],
  ["OFR", "https://i.postimg.cc/8Py5tGkw/FRIMAGE.png"],
  ["Gamma", "https://i.postimg.cc/3xdwqqdh/GAMMAIMAGE.png"],
  ["Happy Techies", "https://i.postimg.cc/wTxMXMz7/HTIMAGE.png"],
  ["KALM", "https://i.postimg.cc/DfPm4st9/KALMIMAGE.png"],
  ["Spectres", "https://i.postimg.cc/YCZSBxWW/SPECTRESIMAGE.png"],
  ["Rebuildit", "https://i.postimg.cc/QFtgCR0r/rebuildit-logo-uniform-gold.png"],
  ["Bishop", "https://i.postimg.cc/VS9XVmNW/image-%2812%29.png"],
  ["OddsMate", "https://i.postimg.cc/sBP5Ns2p/image-%2814%29.png"],
  ["Resolution, Inc.", "https://i.postimg.cc/jW6yFtjc/Screenshot-2026-03-22-at-19-27-33-removebg-preview.png"],
  ["airbo", "https://i.postimg.cc/8js9QnW2/AIRBO.png"],
];

const inputClass = "h-10 w-full rounded-mdx border border-control-border bg-paper px-3 text-sm text-ink outline-none transition focus:border-accent";
const labelClass = "grid gap-1.5 text-sm font-medium text-ink";
const autocompleteByName = {
  workEmail: "email",
  companyName: "organization",
  firstName: "given-name",
  lastName: "family-name",
  phoneNumber: "tel",
};

function Field({ label, name, value, onChange, type = "text", className = "", area = false, required = true }) {
  return (
    <label className={`${labelClass} ${className}`}>
      <span>{label}{required ? " *" : ""}</span>
      {area ? (
        <textarea name={name} autoComplete={autocompleteByName[name]} value={value} required={required} onChange={(event) => onChange(name, event.target.value)} className={`${inputClass} min-h-14 py-2 leading-5`} />
      ) : (
        <input type={type} name={name} autoComplete={autocompleteByName[name]} value={value} required={required} onChange={(event) => onChange(name, event.target.value)} className={inputClass} />
      )}
    </label>
  );
}

function SelectField({ label, name, value, onChange, placeholder, options }) {
  return (
    <label className={labelClass}>
      <span>{label} *</span>
      <select name={name} value={value} required onChange={(event) => onChange(name, event.target.value)} className={inputClass}>
        <option value="">{placeholder}</option>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

function RotatingTrustedLogos() {
  const [group, setGroup] = useState(0);
  const reduceMotion = useReducedMotion();
  const groupCount = Math.ceil(trustedLogos.length / 3);

  useEffect(() => {
    if (reduceMotion) return;
    const timer = window.setInterval(() => setGroup((current) => (current + 1) % groupCount), 3200);
    return () => window.clearInterval(timer);
  }, [groupCount, reduceMotion]);

  const logos = Array.from({ length: 3 }, (_, index) => trustedLogos[(group * 3 + index) % trustedLogos.length]);

  return (
    <div className="relative mt-4 min-h-14 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={group}
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-3 items-center gap-5"
        >
          {logos.map(([name, src]) => (
            <img key={name} src={src} alt={`${name} logo`} className="h-9 w-full object-contain object-left opacity-60 grayscale" loading="lazy" />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function ContactPageClient() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    const key = "usatii_telemetry_session_id";
    const existing = window.sessionStorage.getItem(key);
    const next = existing || window.crypto?.randomUUID?.() || `session_${Date.now()}`;
    if (!existing) window.sessionStorage.setItem(key, next);
    setSessionId(next);
  }, []);

  function update(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/quote-requests", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          fullName: `${form.firstName} ${form.lastName}`.trim(),
          email: form.workEmail,
          phone: form.phoneNumber,
          customerType: "Yes, I am a potential new customer",
          urgency: "normal",
          sessionId,
          originPath: "/contact",
          source: "contact",
          message: [
            `Company: ${form.companyName}`,
            `Company size: ${form.companySize}`,
            `Interest: ${form.interest}`,
            form.businessNeeds ? `Business needs: ${form.businessNeeds}` : null,
          ].filter(Boolean).join("\n"),
        }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || "Contact request failed.");
      setStatus("submitted");
      setMessage("Submitted.");
      setForm(initialForm);
    } catch (error) {
      setStatus("idle");
      setMessage(error.message || "Contact request failed.");
    }
  }

  return (
    <main className="bg-canvas text-ink">
      <section className="bg-canvas px-4 py-8 text-ink md:px-6 md:py-10" aria-labelledby="contact-heading">
        <div className="mx-auto grid w-full max-w-5xl gap-7 lg:grid-cols-[0.68fr_1.32fr] lg:items-start">
          <aside className="grid gap-7">
            <div>
              <h1 id="contact-heading" className="max-w-sm text-3xl font-semibold leading-none tracking-normal text-ink md:text-4xl">Contact our sales team</h1>
              <p className="mt-6 max-w-xs text-base leading-7 text-muted">Have a small team? Get started with <a href="/software" className="font-semibold text-accent hover:text-accent-hover">USATII software.</a></p>
            </div>

            <div>
              <h2 className="text-sm font-medium text-muted">Features</h2>
              <div className="mt-3 grid gap-3">
                {features.map(([label, Icon]) => (
                  <div key={label} className="flex items-center gap-2.5 text-sm font-medium text-ink"><Icon className="h-4 w-4" aria-hidden="true" /><span>{label}</span></div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-sm font-medium text-muted">Trusted by teams like</h2>
              <RotatingTrustedLogos />
            </div>
          </aside>

          <div>
            <form onSubmit={submit} aria-busy={status === "submitting"} className="grid gap-x-5 gap-y-5 md:grid-cols-2">
              <SelectField label="What are you interested in?" name="interest" value={form.interest} onChange={update} placeholder="Select one from the dropdown options" options={["Publishing and approvals", "Unified inbox", "Social listening", "Analytics and reporting", "Enterprise rollout"]} />
              <Field label="Work email" name="workEmail" value={form.workEmail} onChange={update} type="email" />
              <SelectField label="Company size" name="companySize" value={form.companySize} onChange={update} placeholder="Please Select" options={["1-10", "11-50", "51-200", "201-1,000", "1,001-5,000", "5,001+"]} />
              <Field label="Company name" name="companyName" value={form.companyName} onChange={update} />
              <Field label="First name" name="firstName" value={form.firstName} onChange={update} />
              <Field label="Last name" name="lastName" value={form.lastName} onChange={update} />
              <Field label="Phone number" name="phoneNumber" value={form.phoneNumber} onChange={update} type="tel" className="md:col-span-2" />
              <Field label="Can you share more about your business needs and challenges?" name="businessNeeds" value={form.businessNeeds} onChange={update} area required={false} className="md:col-span-2" />
              <p role="status" className="sr-only md:col-span-2">{status === "submitting" ? "Submitting contact request." : ""}</p>
              <div className="md:col-span-2">
                <button type="submit" disabled={status === "submitting"} className="inline-flex h-10 items-center justify-center bg-accent px-5 text-sm font-semibold text-white shadow-soft hover:bg-accent-hover disabled:opacity-60">{status === "submitting" ? "Submitting" : "Submit"}</button>
                {message ? <p role={status === "submitted" ? "status" : "alert"} className="mt-4 text-sm text-muted">{message}</p> : null}
              </div>
            </form>

            <p className="mt-10 text-center text-sm text-muted">For other inquiries, visit our <a href="/documentation" className="font-semibold text-accent hover:text-accent-hover">help center.</a></p>
          </div>
        </div>
      </section>
    </main>
  );
}

'use client'

import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

const CAL_LINK = "https://cal.com/usatii/onboarding";

const websiteTypes = [
  "Service site",
  "Product / SaaS",
  "Landing page",
  "Company site",
  "Internal portal",
  "Ecommerce",
];

const goals = [
  "More leads",
  "More calls",
  "More trust",
  "Clearer offer",
  "Better conversion",
  "Internal ops",
];

const pages = [
  "Home",
  "About",
  "Services",
  "Pricing",
  "Case studies",
  "FAQ",
  "Contact",
  "Blog",
  "Portal",
  "Dashboard",
];

const styles = [
  "Minimal",
  "Analytical",
  "Luxury",
  "Corporate",
  "Dark",
  "Editorial",
  "Modern",
  "High-trust",
];

const integrations = [
  "Cal.com",
  "CRM",
  "Payments",
  "Analytics",
  "Email capture",
  "Dashboard",
  "Auth / ACLs",
  "Audit logs",
];

const timelineOptions = [
  "ASAP",
  "2 weeks",
  "30 days",
  "60 days",
  "Flexible",
];

const budgetOptions = [
  "Under $2k",
  "$2k–$5k",
  "$5k–$10k",
  "$10k–$20k",
  "$20k+",
  "Need guidance",
];

const steps = [
  "Contact",
  "Project",
  "Goals",
  "Style",
  "Logistics",
  "Review",
];

const initialForm = {
  name: "",
  email: "",
  company: "",
  websiteType: "",
  currentSite: "",
  goals: [],
  pages: [],
  audience: "",
  differentiator: "",
  styles: [],
  inspiration: "",
  timeline: "",
  budget: "",
  integrations: [],
  notes: "",
};

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function toggleItem(list, item) {
  return list.includes(item) ? list.filter((x) => x !== item) : [...list, item];
}

function Input(props) {
  return (
    <input
      {...props}
      className={cn(
        "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition",
        "placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50",
        props.className
      )}
    />
  );
}

function Textarea(props) {
  return (
    <textarea
      {...props}
      className={cn(
        "min-h-[120px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition",
        "placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50",
        props.className
      )}
    />
  );
}

function OptionGrid({ options, value, onChange, multi = false }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const selected = multi ? value.includes(option) : value === option;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={cn(
              "rounded-full border px-3.5 py-2 text-sm transition",
              selected
                ? "border-indigo-200 bg-indigo-50 text-slate-900"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">{label}</label>
      {children}
      {error ? <p className="mt-2 text-xs text-rose-500">{error}</p> : null}
    </div>
  );
}

function StepCard({ step, title, children }) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] md:p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.05),transparent_22%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.04),transparent_26%)]" />
      <div className="relative">
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
          Step {step}
        </p>
        <h2 className="text-2xl font-semibold text-slate-950">{title}</h2>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}

export default function WebsiteRequestPage() {
  const [form, setForm] = useState(initialForm);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});

  const progress = ((step + 1) / steps.length) * 100;

  const summary = useMemo(() => {
    return [
      ["Name", form.name],
      ["Email", form.email],
      ["Company", form.company],
      ["Current site", form.currentSite || "—"],
      ["Website type", form.websiteType],
      ["Goals", form.goals.join(", ") || "—"],
      ["Pages", form.pages.join(", ") || "—"],
      ["Audience", form.audience || "—"],
      ["Differentiator", form.differentiator || "—"],
      ["Style", form.styles.join(", ") || "—"],
      ["Inspiration", form.inspiration || "—"],
      ["Timeline", form.timeline],
      ["Budget", form.budget],
      ["Integrations", form.integrations.join(", ") || "—"],
      ["Notes", form.notes || "—"],
    ];
  }, [form]);

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  }

  function validateCurrentStep() {
    const next = {};

    if (step === 0) {
      if (!form.name.trim()) next.name = "Required";
      if (!form.email.trim()) next.email = "Required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = "Enter a valid email";
      if (!form.company.trim()) next.company = "Required";
    }

    if (step === 1) {
      if (!form.websiteType) next.websiteType = "Choose one";
    }

    if (step === 2) {
      if (!form.goals.length) next.goals = "Select at least one";
      if (!form.audience.trim()) next.audience = "Required";
      if (!form.differentiator.trim()) next.differentiator = "Required";
    }

    if (step === 3) {
      if (!form.styles.length) next.styles = "Select at least one";
    }

    if (step === 4) {
      if (!form.timeline) next.timeline = "Choose one";
      if (!form.budget) next.budget = "Choose one";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function nextStep() {
    if (!validateCurrentStep()) return;
    setStep((s) => Math.min(s + 1, steps.length - 1));
  }

  function prevStep() {
    setStep((s) => Math.max(s - 1, 0));
  }

  async function copySummary() {
    const text = summary.map(([k, v]) => `${k}: ${v}`).join("\n");
    try {
      await navigator.clipboard.writeText(text);
    } catch {}
  }

  return (
    <section className="min-h-screen bg-white">
        <Link href="/"><h1 className="font-black italic tracking-tight text-xl text-center mt-5 hover:opacity-80">USATII MEDIA</h1></Link>
      <div className="mx-auto max-w-3xl px-6 py-12 md:py-16">
        <div className="mb-8">
          <h1 className="text-3xl font-medium tracking-tight text-slate-950">
            Request a website consultation.
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500">
            After you fill out this form, copy its contents and add them to the <b>Additional Notes</b> when booking on <u>Cal.com</u>.
          </p>
        </div>

        <div className="mb-8">
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
            <motion.div
              className="h-full rounded-full bg-[linear-gradient(90deg,rgba(99,102,241,0.9),rgba(168,85,247,0.8))]"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="step-0"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.22 }}
            >
              <StepCard step="01" title="Who is this for?">
                <div className="grid gap-4">
                  <Field label="Name" error={errors.name}>
                    <Input
                      placeholder="Your name"
                      value={form.name}
                      onChange={(e) => setField("name", e.target.value)}
                    />
                  </Field>

                  <Field label="Email" error={errors.email}>
                    <Input
                      type="email"
                      placeholder="you@company.com"
                      value={form.email}
                      onChange={(e) => setField("email", e.target.value)}
                    />
                  </Field>

                  <Field label="Company" error={errors.company}>
                    <Input
                      placeholder="Company name"
                      value={form.company}
                      onChange={(e) => setField("company", e.target.value)}
                    />
                  </Field>

                  <Field label="Current site">
                    <Input
                      placeholder="https://..."
                      value={form.currentSite}
                      onChange={(e) => setField("currentSite", e.target.value)}
                    />
                  </Field>
                </div>
              </StepCard>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.22 }}
            >
              <StepCard step="02" title="What are we building?">
                <Field label="Type" error={errors.websiteType}>
                  <OptionGrid
                    options={websiteTypes}
                    value={form.websiteType}
                    onChange={(value) => setField("websiteType", value)}
                  />
                </Field>
              </StepCard>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.22 }}
            >
              <StepCard step="03" title="What matters most?">
                <div className="grid gap-5">
                  <Field label="Goals" error={errors.goals}>
                    <OptionGrid
                      options={goals}
                      value={form.goals}
                      multi
                      onChange={(value) => setField("goals", toggleItem(form.goals, value))}
                    />
                  </Field>

                  <Field label="Pages">
                    <OptionGrid
                      options={pages}
                      value={form.pages}
                      multi
                      onChange={(value) => setField("pages", toggleItem(form.pages, value))}
                    />
                  </Field>

                  <Field label="Audience" error={errors.audience}>
                    <Textarea
                      placeholder="Who is the site for?"
                      value={form.audience}
                      onChange={(e) => setField("audience", e.target.value)}
                    />
                  </Field>

                  <Field label="Differentiator" error={errors.differentiator}>
                    <Textarea
                      placeholder="Why choose you?"
                      value={form.differentiator}
                      onChange={(e) => setField("differentiator", e.target.value)}
                    />
                  </Field>
                </div>
              </StepCard>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.22 }}
            >
              <StepCard step="04" title="What should it feel like?">
                <div className="grid gap-5">
                  <Field label="Style" error={errors.styles}>
                    <OptionGrid
                      options={styles}
                      value={form.styles}
                      multi
                      onChange={(value) => setField("styles", toggleItem(form.styles, value))}
                    />
                  </Field>

                  <Field label="Inspiration">
                    <Textarea
                      placeholder="Links or short notes"
                      value={form.inspiration}
                      onChange={(e) => setField("inspiration", e.target.value)}
                    />
                  </Field>
                </div>
              </StepCard>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.22 }}
            >
              <StepCard step="05" title="Timing and scope">
                <div className="grid gap-5">
                  <Field label="Timeline" error={errors.timeline}>
                    <OptionGrid
                      options={timelineOptions}
                      value={form.timeline}
                      onChange={(value) => setField("timeline", value)}
                    />
                  </Field>

                  <Field label="Budget" error={errors.budget}>
                    <OptionGrid
                      options={budgetOptions}
                      value={form.budget}
                      onChange={(value) => setField("budget", value)}
                    />
                  </Field>

                  <Field label="Integrations">
                    <OptionGrid
                      options={integrations}
                      value={form.integrations}
                      multi
                      onChange={(value) =>
                        setField("integrations", toggleItem(form.integrations, value))
                      }
                    />
                  </Field>

                  <Field label="Notes">
                    <Textarea
                      placeholder="Anything important"
                      value={form.notes}
                      onChange={(e) => setField("notes", e.target.value)}
                    />
                  </Field>
                </div>
              </StepCard>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div
              key="step-5"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.22 }}
            >
              <StepCard step="06" title="Review">
                <div className="space-y-3">
                  {summary.map(([label, value]) => (
                    <div
                      key={label}
                      className="flex flex-col gap-1 rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3"
                    >
                      <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-400">
                        {label}
                      </p>
                      <p className="text-sm text-slate-900">{value || "—"}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={copySummary}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
                  >
                    Copy summary
                  </button>

                  <a
                    href={CAL_LINK}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
                  >
                    Continue to Cal.com
                  </a>
                </div>
              </StepCard>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={prevStep}
            disabled={step === 0}
            className={cn(
              "rounded-full px-4 py-2.5 text-sm font-medium transition",
              step === 0
                ? "cursor-not-allowed text-slate-300"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
            )}
          >
            Back
          </button>

          {step < steps.length - 1 ? (
            <button
              type="button"
              onClick={nextStep}
              className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
            >
              Next
            </button>
          ) : (
            <div />
          )}
        </div>
      </div>
    </section>
  );
}
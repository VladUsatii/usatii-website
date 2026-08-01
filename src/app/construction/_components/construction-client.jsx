"use client";

import { useEffect, useState } from "react";

const stackSystems = [
  {
    id: "estimating",
    label: "Estimating",
    title: "Estimating",
    summary:
      "Construction estimating breaks when takeoffs, scope notes, historical pricing, and vendor inputs are spread across files and inboxes. USATII builds the estimating layer that keeps bid work structured and reviewable.",
    offers: [
      {
        title: "Takeoff Intake",
        body: "Centralize plans, scope notes, specifications, alternates, and bid packages before estimating starts.",
      },
      {
        title: "Bid Record Control",
        body: "Track assumptions, revisions, exclusions, approvals, and handoff notes from estimate to job launch.",
      },
      {
        title: "Historical Pricing",
        body: "Connect prior job costs, vendor quotes, and material categories to reduce guesswork on repeat work.",
      },
      {
        title: "AI Review",
        body: "Flag missing scope, unusual specifications, duplicate line items, and follow-up questions for human review.",
      },
    ],
  },
  {
    id: "procurement",
    label: "Procurement",
    title: "Procurement",
    summary:
      "Purchasing needs clean records around requests, vendors, approvals, delivery dates, job usage, and cost exposure.",
    offers: [
      {
        title: "Purchase Requests",
        body: "Create requests tied to jobs, budgets, users, required dates, and approval rules.",
      },
      {
        title: "Vendor Quote Tracking",
        body: "Compare vendor pricing, terms, lead times, alternates, and document trails in one record.",
      },
      {
        title: "Delivery Visibility",
        body: "Track ordered, shipped, received, delayed, damaged, and missing materials by job.",
      },
      {
        title: "Spend Controls",
        body: "Route high-value purchases, change orders, and exceptions through review gates.",
      },
    ],
  },
  {
    id: "labor",
    label: "Labor",
    title: "Labor",
    summary:
      "Labor systems should show who is assigned, who is available, what work is active, and where hours are going.",
    offers: [
      {
        title: "Crew Assignment",
        body: "Assign people by job, role, availability, location, certification, and workload.",
      },
      {
        title: "Time Capture",
        body: "Collect job-linked hours, notes, field blockers, travel time, and manager approvals.",
      },
      {
        title: "Productivity Views",
        body: "Show progress, missed updates, overdue work, and labor exposure by job or team.",
      },
      {
        title: "Training Records",
        body: "Track training status, onboarding steps, documents, and role readiness.",
      },
    ],
  },
  {
    id: "equipment",
    label: "Equipment",
    title: "Equipment",
    summary:
      "Equipment control depends on location, availability, condition, maintenance, ownership, and job usage.",
    offers: [
      {
        title: "Asset Register",
        body: "Maintain equipment records with ownership, serials, photos, assignments, and service history.",
      },
      {
        title: "Utilization",
        body: "Track where equipment is deployed, who has it, and when it is expected back.",
      },
      {
        title: "Maintenance Workflow",
        body: "Schedule inspections, service tasks, repair approvals, and downtime notes.",
      },
      {
        title: "Cost Attribution",
        body: "Connect equipment usage and repair costs to jobs, departments, and reporting.",
      },
    ],
  },
  {
    id: "subcontractors",
    label: "Subcontractors",
    title: "Subcontractors",
    summary:
      "Subcontractor management needs assignment records, compliance documents, scope control, billing review, and accountability.",
    offers: [
      {
        title: "Subcontractor Records",
        body: "Track contacts, trades, insurance, licenses, W-9s, agreements, rates, and performance notes.",
      },
      {
        title: "Scope Assignment",
        body: "Tie subcontractor work to jobs, phases, deliverables, schedules, and approval checkpoints.",
      },
      {
        title: "Document Trails",
        body: "Centralize COIs, contracts, change orders, invoices, lien releases, and closeout documents.",
      },
      {
        title: "Invoice Review",
        body: "Route invoices against approved scope, completion status, documents, and manager signoff.",
      },
    ],
  },
  {
    id: "project-management",
    label: "Project Management",
    title: "Project Management",
    summary:
      "Project management systems should connect clients, schedules, work orders, field status, documents, costs, and closeout records.",
    offers: [
      {
        title: "Job Command Center",
        body: "Create one record for scope, stakeholders, dates, phases, blockers, documents, and activity.",
      },
      {
        title: "Work Orders",
        body: "Assign work with owners, due dates, dependencies, notes, photos, and completion evidence.",
      },
      {
        title: "Change Control",
        body: "Track scope changes, approvals, pricing notes, client signoff, and downstream tasks.",
      },
      {
        title: "Closeout Records",
        body: "Produce final documents, photos, payment status, punch lists, and management reports.",
      },
    ],
  },
  {
    id: "production",
    label: "Production and Execution",
    title: "Production and Execution",
    summary:
      "Execution control means the field can update reality quickly while management sees the operational truth.",
    offers: [
      {
        title: "Field Updates",
        body: "Capture status, notes, blockers, photos, completion evidence, and supervisor review.",
      },
      {
        title: "Daily Logs",
        body: "Build structured logs for labor, materials, weather, issues, visitors, and progress.",
      },
      {
        title: "Punch Lists",
        body: "Assign punch items, track owners, attach photos, and confirm resolution.",
      },
      {
        title: "Production Reports",
        body: "Give leaders current views of active jobs, late work, blockers, and completion risk.",
      },
    ],
  },
  {
    id: "back-office",
    label: "Back Office",
    title: "Back Office",
    summary:
      "Back office workflows need clean handoffs between calls, documents, billing, approvals, client communication, and reporting.",
    offers: [
      {
        title: "Admin Queues",
        body: "Route intake, documents, billing tasks, approvals, and follow-ups to clear owners.",
      },
      {
        title: "Document Control",
        body: "Organize contracts, permits, insurance, invoices, client files, and closeout packages.",
      },
      {
        title: "Approval Workflows",
        body: "Control sensitive financial, scope, vendor, and administrative actions.",
      },
      {
        title: "Management Views",
        body: "Produce owner dashboards, exception reports, and exportable records.",
      },
    ],
  },
  {
    id: "telephony",
    label: "Telephony",
    title: "Telephony",
    summary:
      "Call control is operational control when revenue, service issues, dispatch, and client expectations start on the phone.",
    offers: [
      {
        title: "PBX Routing",
        body: "Design call routing, departments, fallback paths, voicemail rules, and escalation logic.",
      },
      {
        title: "Call Tagging",
        body: "Classify calls by job, client, urgency, service type, employee, and follow-up need.",
      },
      {
        title: "AI Summaries",
        body: "Generate call summaries, action items, and intake records for human review.",
      },
      {
        title: "Response Dashboards",
        body: "Track missed calls, callbacks, assignments, response time, and unresolved intake.",
      },
    ],
  },
  {
    id: "ai",
    label: "AI",
    title: "AI",
    summary:
      "AI belongs inside controlled workflows, not floating outside the business. USATII uses it for drafting, classification, search, summaries, and risk flags with human review.",
    offers: [
      {
        title: "Call and Email Summaries",
        body: "Summarize client requests, vendor messages, internal updates, and field notes.",
      },
      {
        title: "Document Search",
        body: "Search contracts, specifications, invoices, photos, notes, and closeout documents.",
      },
      {
        title: "Risk Flags",
        body: "Flag missing information, stalled tasks, unresolved approvals, and unusual cost activity.",
      },
      {
        title: "Admin Drafting",
        body: "Draft reports, updates, follow-up tasks, and management summaries for review.",
      },
    ],
  },
  {
    id: "finance",
    label: "Finance",
    title: "Finance",
    summary:
      "Finance views should connect job costs, purchases, invoices, approvals, payments, and margin exposure without rebuilding the numbers manually.",
    offers: [
      {
        title: "Job Cost Records",
        body: "Track labor, materials, vendors, equipment, invoices, and cost categories by job.",
      },
      {
        title: "Approval Gates",
        body: "Control purchases, change orders, invoice approvals, and payment exceptions.",
      },
      {
        title: "Margin Visibility",
        body: "Show cost exposure, budget drift, missing documentation, and billing blockers.",
      },
      {
        title: "Exportable Reports",
        body: "Produce finance-ready exports for accounting, management, clients, and transitions.",
      },
    ],
  },
];

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  urgency: "normal",
  workflow: "Operations software pilot",
  message: "",
};

const inputClass =
  "w-full rounded-[2px] border border-[#DADADA] bg-white px-3.5 py-3 text-sm text-[#0A0A0A] outline-none transition placeholder:text-[#737373] focus:border-[#0A0A0A]";

export function ConstructionViewportEffects() {
  useEffect(() => {
    const page = document.querySelector(".construction-page");
    if (!page) return undefined;

    const layers = Array.from(page.querySelectorAll(".viewport-layer"));
    if (!layers.length) return undefined;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      layers.forEach((layer) => layer.classList.add("is-visible"));
      return undefined;
    }

    page.classList.add("construction-page--motion");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.16,
        rootMargin: "0px 0px -12% 0px",
      },
    );

    layers.forEach((layer) => observer.observe(layer));

    return () => observer.disconnect();
  }, []);

  return null;
}

export function ConstructionOperationsStack() {
  const [activeId, setActiveId] = useState(stackSystems[0].id);
  const activeSystem =
    stackSystems.find((system) => system.id === activeId) || stackSystems[0];

  return (
    <div className="mt-12">
      <div className="flex flex-wrap gap-3 border-b border-[#DADADA] pb-10">
        {stackSystems.map((system) => {
          const selected = system.id === activeSystem.id;
          return (
            <button
              key={system.id}
              type="button"
              onClick={() => setActiveId(system.id)}
              aria-pressed={selected}
              className={[
                "rounded-[4px] border px-5 py-3 text-sm font-semibold transition",
                selected
                  ? "border-[#0A0A0A] bg-[#0A0A0A] text-white"
                  : "border-[#DADADA] bg-white text-[#0A0A0A] hover:border-[#0A0A0A]",
              ].join(" ")}
            >
              {system.label}
            </button>
          );
        })}
      </div>

      <div className="grid gap-8 border-b border-[#DADADA] py-10 lg:grid-cols-[0.75fr_0.8fr_1.25fr]">
        <div className="border border-[#DADADA] p-5">
          <h3 className="flex items-center gap-3 text-3xl font-black leading-none tracking-normal text-[#0A0A0A] md:text-5xl">
            <span className="h-6 w-6 shrink-0 rounded-full bg-[#6d4dff]" />
            {activeSystem.title}
          </h3>
        </div>

        <p className="text-[18px] leading-8 text-[#4A4A4A]">{activeSystem.summary}</p>

        <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-1">
          {activeSystem.offers.map((offer) => (
            <div key={offer.title} className="border-l border-[#DADADA] pl-5">
              <h3 className="text-2xl font-semibold leading-tight text-[#0A0A0A] md:text-3xl">
                {offer.title}
              </h3>
              <p className="mt-3 text-[16px] leading-7 text-[#4A4A4A]">{offer.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children, className = "" }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-xs font-black uppercase tracking-[0.08em] text-[#737373]">
        {label}
      </span>
      {children}
    </label>
  );
}

export function ConstructionQuoteForm() {
  const [form, setForm] = useState(initialForm);
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

    const nextId =
      typeof window.crypto?.randomUUID === "function"
        ? window.crypto.randomUUID()
        : `session_${Date.now()}_${Math.round(Math.random() * 1e8)}`;

    window.sessionStorage.setItem(key, nextId);
    setSessionId(nextId);
  }, []);

  function setField(key, value) {
    setForm((previous) => ({ ...previous, [key]: value }));
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
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          address: form.address,
          customerType: "Yes, I am a potential new customer",
          urgency: form.urgency,
          sessionId,
          originPath: "/construction",
          source: "construction",
          message: `${form.workflow}\n\n${form.message}`,
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        setStatus("error");
        setMessage(payload.error || "Unable to submit right now. Please try again.");
        return;
      }

      setStatus("success");
      setMessage("Submitted. USATII will follow up shortly.");
      setForm(initialForm);
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border border-[#0A0A0A] bg-white p-5 md:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name">
          <input
            required
            value={form.fullName}
            onChange={(event) => setField("fullName", event.target.value)}
            className={inputClass}
            placeholder="Full name"
          />
        </Field>

        <Field label="Email">
          <input
            required
            type="email"
            value={form.email}
            onChange={(event) => setField("email", event.target.value)}
            className={inputClass}
            placeholder="Email"
          />
        </Field>

        <Field label="Phone">
          <input
            value={form.phone}
            onChange={(event) => setField("phone", event.target.value)}
            className={inputClass}
            placeholder="Phone"
          />
        </Field>

        <Field label="Company / Site">
          <input
            value={form.address}
            onChange={(event) => setField("address", event.target.value)}
            className={inputClass}
            placeholder="Company or job location"
          />
        </Field>

        <Field label="Workflow">
          <select
            value={form.workflow}
            onChange={(event) => setField("workflow", event.target.value)}
            className={`${inputClass} cursor-pointer`}
          >
            <option>Operations software pilot</option>
            <option>Missed call and intake pilot</option>
            <option>Job and work order pilot</option>
            <option>Materials and cost pilot</option>
            <option>Executive dashboard pilot</option>
            <option>RFQ / solicitation response</option>
          </select>
        </Field>

        <Field label="Urgency">
          <select
            value={form.urgency}
            onChange={(event) => setField("urgency", event.target.value)}
            className={`${inputClass} cursor-pointer`}
          >
            <option value="urgent">Urgent</option>
            <option value="normal">Normal</option>
            <option value="low">Low</option>
          </select>
        </Field>

        <Field label="Message" className="sm:col-span-2">
          <textarea
            required
            rows={6}
            value={form.message}
            onChange={(event) => setField("message", event.target.value)}
            className={`${inputClass} resize-none`}
            placeholder="What workflow, RFQ, or operations problem should USATII scope?"
          />
        </Field>
      </div>

      {status === "error" ? (
        <p className="mt-4 border border-[#7f1d1d] bg-[#fff1f2] px-3.5 py-3 text-sm font-semibold text-[#7f1d1d]">
          {message}
        </p>
      ) : null}

      {status === "success" ? (
        <p className="mt-4 border border-[#166534] bg-[#f0fdf4] px-3.5 py-3 text-sm font-semibold text-[#166534]">
          {message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="mt-5 w-full rounded-[2px] border border-[#6d4dff] bg-[#6d4dff] px-5 py-4 text-sm font-black text-white transition hover:border-[#5638ea] hover:bg-[#5638ea] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Submitting..." : "Request Quote"}
      </button>
    </form>
  );
}

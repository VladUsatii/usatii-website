import { SITE_URL } from "@/lib/services-seo";

export const TRADE_AUDIT_CTA_HREF = "/software/software-waste-audit";
export const TRADE_AUDIT_BOOKING_URL = "https://cal.com/usatii/onboarding";

export const ORGANIZATION_PROFILE = {
  name: "USATII Media",
  legalName: "VAU Solutions, LLC",
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.ico`,
  description:
    "Rochester-based software and marketing systems company that builds in-house operating systems for trade businesses.",
  founder: "Vlad Usatii",
  sameAs: [
    "https://www.linkedin.com/in/vladusatii",
    "https://www.instagram.com/vladusatii_",
  ],
  areaServed: [
    "Rochester, NY",
    "Henrietta, NY",
    "Webster, NY",
    "Greece, NY",
    "Irondequoit, NY",
    "Pittsford, NY",
    "Fairport, NY",
    "Victor, NY",
    "Canandaigua, NY",
  ],
  services: [
    "Custom Contractor Software Development",
    "Contractor Website Design",
    "Contractor Marketing Systems",
    "Software Waste Audit",
  ],
};

export const PRIMARY_TRADES = [
  "HVAC",
  "Plumbing",
  "Electrical",
  "Roofing",
  "Remodeling",
  "Landscaping",
  "Flooring",
  "Painting",
  "Masonry and Concrete",
  "Pest Control",
  "Garage Door",
  "Fencing",
];

export const SOFTWARE_PAGE_DATA = {
  "custom-software-for-contractors": {
    slug: "custom-software-for-contractors",
    title: "Custom Software for Contractors",
    description:
      "USATII designs and builds custom contractor software in Rochester, NY to unify lead intake, estimates, scheduling, job tracking, invoicing, and crew communication.",
    heroEyebrow: "Contractor Software",
    heroIntro:
      "Most contractors do not need another generic dashboard. They need a system that matches how their teams quote, schedule, dispatch, document jobs, and get paid.",
    proofPoints: [
      "Lead-to-invoice workflows designed around your operation",
      "Role-based permissions for office staff, field crews, and leadership",
      "Replace duplicate subscriptions with one owned system",
    ],
    sections: [
      {
        heading: "What we build",
        body:
          "USATII builds software around the full lifecycle: website lead capture, qualification, estimate creation, schedule assignment, job progress, invoicing, and post-job follow-up.",
        bullets: [
          "Custom CRM views for dispatch, estimators, and admin",
          "Estimate templates with approval and revision tracking",
          "Crew mobile views for job notes, photos, and checklists",
          "Client portal access for quote status and invoices",
        ],
      },
      {
        heading: "Where custom wins",
        body:
          "Off-the-shelf software works when your process is generic. Custom wins when your process is specific, your team is scaling, and your software stack keeps forcing workarounds.",
        bullets: [
          "No feature bloat from modules you never use",
          "No per-seat surprises as your team grows",
          "Data model matches your terms, jobs, and reporting",
        ],
      },
      {
        heading: "Why USATII",
        body:
          "USATII grew through content systems, paid media execution, and high-output operations. That means we build software that also improves demand generation, not just internal admin.",
        bullets: [
          "Marketing + operations connection from day one",
          "Founder-led technical strategy and security mindset",
          "Build, iterate, and support in one team",
        ],
      },
    ],
    faqs: [
      {
        q: "How long does a custom contractor software build take?",
        a: "Most initial systems launch in phased milestones over 4 to 10 weeks, depending on workflow complexity and integrations.",
      },
      {
        q: "Do we need to replace every tool at once?",
        a: "No. We usually phase replacements so your team keeps operating while we migrate high-friction parts first.",
      },
      {
        q: "Can you integrate with accounting or payments?",
        a: "Yes. We can integrate with systems you want to keep, especially accounting and payment tooling that already works well for compliance.",
      },
    ],
  },
  "software-waste-audit": {
    slug: "software-waste-audit",
    title: "Free Software Waste Audit for Rochester Trade Businesses",
    description:
      "Book a free software waste audit for your Rochester trade business. USATII reviews your stack and identifies what to replace, consolidate, automate, or rebuild in-house.",
    heroEyebrow: "Free Audit",
    heroIntro:
      "Most trade companies are paying for too many disconnected tools. USATII reviews your stack and identifies what can be replaced, consolidated, automated, or rebuilt in-house.",
    proofPoints: [
      "No-cost first-pass audit for Rochester-area trade teams",
      "Clear keep/replace/rebuild recommendation map",
      "Roadmap tied to lead flow, scheduling, and cash collection",
    ],
    sections: [
      {
        heading: "You may not need another subscription",
        body:
          "Our first job is to find overlap, not to add software. We map every recurring tool to a real workflow and flag where your team is paying twice for the same function.",
        bullets: [
          "Detect duplicate CRM and intake tooling",
          "Find manual handoffs that create callback delays",
          "Highlight reporting gaps that hide margin leaks",
        ],
      },
      {
        heading: "What we audit",
        body:
          "We review your CRM, scheduling, estimates, invoices, job photos, internal forms, follow-ups, payroll/admin workflows, and website intake pipeline.",
        bullets: [
          "Lead intake and response flow",
          "Estimate and approval cycle",
          "Dispatch and job tracking process",
          "Invoicing and payment lag points",
        ],
      },
      {
        heading: "What usually stays",
        body:
          "If a tool is strong for compliance, accounting, or payments, we keep it and integrate around it.",
        bullets: [
          "Accounting systems",
          "Payment processors",
          "Email infrastructure",
          "Compliance-critical software",
        ],
      },
      {
        heading: "What can often be replaced",
        body:
          "Generic dashboards, duplicate CRMs, manual spreadsheets, and disconnected intake trackers are common replacement candidates.",
        bullets: [
          "Form builders used as patchwork",
          "Internal portals that no one trusts",
          "Spreadsheet dispatch boards",
          "Subscription add-ons that duplicate core workflows",
        ],
      },
      {
        heading: "Why trade businesses are different",
        body:
          "Trade teams run on speed, crew coordination, and field reality. Software must support same-day quoting, dispatch shifts, and photo-based progress, not generic pipeline screens.",
        bullets: [
          "Built for office and field roles",
          "Fast mobile capture for photos and notes",
          "Dispatch-aware scheduling logic",
        ],
      },
      {
        heading: "Example system flow",
        body:
          "Lead -> estimate -> job -> crew -> invoice -> review. We build the full loop so follow-up and reputation requests happen automatically after payment.",
        bullets: [
          "Lead response SLAs",
          "Estimate status visibility",
          "Job completion checks",
          "Post-job review automation",
        ],
      },
      {
        heading: "Built by developers, not just marketers",
        body:
          "USATII combines technical build capability with proven lead-generation execution. That means your operating system and your growth strategy move together.",
        bullets: [
          "Developer-led architecture",
          "Security-first role controls",
          "Marketing follow-up built into workflow",
        ],
      },
    ],
    faqs: [
      {
        q: "Is the software waste audit really free?",
        a: "Yes. The first audit is free and includes a practical summary of what to keep, replace, and prioritize.",
      },
      {
        q: "What do we need to provide?",
        a: "A list of current tools, who uses them, and a quick walkthrough of your estimate-to-invoice process is enough to start.",
      },
      {
        q: "Will this force us into a custom build?",
        a: "No. We show where custom makes sense and where it does not. Sometimes the best answer is better integration with tools you already have.",
      },
      {
        q: "Can this support multi-crew operations?",
        a: "Yes. We frequently audit systems for teams with multiple crews, overlapping jobs, and rapid scheduling changes.",
      },
    ],
  },
  "contractor-operating-system": {
    slug: "contractor-operating-system",
    title: "Contractor Operating System Built Around Your Workflow",
    description:
      "Build a contractor operating system around your exact workflow with USATII in Rochester, NY. Unify lead intake, scheduling, crews, invoicing, and reporting.",
    heroEyebrow: "Operating System",
    heroIntro:
      "Your business should run on one operating rhythm, not disconnected logins. We build contractor operating systems around how your team actually works.",
    proofPoints: [
      "One shared source of truth for office and field",
      "Automations for follow-up, reminders, and handoffs",
      "Dashboards for margin, cycle time, and job throughput",
    ],
    sections: [
      {
        heading: "Core modules",
        body:
          "Every operating system starts with lead intake, estimating, scheduling, and job execution. Then we extend into invoicing, crew comms, and customer visibility.",
        bullets: [
          "Lead scoring and routing",
          "Estimate pipeline with approval states",
          "Dispatch board and technician assignment",
          "Invoice and collections workflow",
        ],
      },
      {
        heading: "Built around your language",
        body:
          "We use your terms, your job statuses, your naming conventions, and your real responsibilities. No forced vocabulary from generic SaaS tools.",
        bullets: [
          "Custom fields and workflow states",
          "Role-specific views",
          "Permissioned data access",
        ],
      },
      {
        heading: "Reporting that operators use",
        body:
          "Your dashboard should answer what matters right now: which leads are aging, which jobs are blocked, and where cash is delayed.",
        bullets: [
          "Lead response time and close rate",
          "Estimate cycle-time tracking",
          "Technician utilization and rework flags",
          "Invoice aging and collection velocity",
        ],
      },
    ],
    faqs: [
      {
        q: "What is included in an operating system engagement?",
        a: "Discovery, architecture, build, rollout, documentation, and post-launch iteration are all included in scoped phases.",
      },
      {
        q: "Can we start with one workflow first?",
        a: "Yes. Many clients start with lead-to-estimate, then expand into scheduling and billing after the core flow is stable.",
      },
      {
        q: "Does this work for small teams?",
        a: "Yes. Small teams benefit quickly because they lose fewer hours to manual handoffs and duplicate data entry.",
      },
    ],
  },
  "replace-contractor-software-subscriptions": {
    slug: "replace-contractor-software-subscriptions",
    title: "Replace Expensive Contractor Software Subscriptions",
    description:
      "Replace expensive contractor software subscriptions with an owned, custom workflow system built by USATII in Rochester, NY.",
    heroEyebrow: "Subscription Reduction",
    heroIntro:
      "If your team is paying for overlapping software, you are not buying productivity. You are renting complexity. We replace subscription sprawl with one coherent system.",
    proofPoints: [
      "Lower recurring SaaS spend over time",
      "Reduce duplicate data entry and manual exports",
      "Keep essential compliance tools while replacing overlap",
    ],
    sections: [
      {
        heading: "How software sprawl happens",
        body:
          "Most trade companies stack tools over time: one for leads, one for estimates, one for forms, one for texting, one for crew notes, and one for dashboards.",
        bullets: [
          "Disconnected data",
          "Inconsistent reporting",
          "Per-user pricing growth",
          "Operational drag from context switching",
        ],
      },
      {
        heading: "What to replace first",
        body:
          "We prioritize high-cost, high-friction overlap first so the savings and productivity impact are visible quickly.",
        bullets: [
          "Duplicate intake systems",
          "Legacy spreadsheet trackers",
          "Manual reminder and follow-up tools",
          "Secondary CRMs with low adoption",
        ],
      },
      {
        heading: "What to keep",
        body:
          "Not every subscription should be removed. We preserve tools that are excellent at payments, accounting, or compliance and connect them to your operating system.",
        bullets: [
          "Accounting",
          "Payment processors",
          "Required compliance platforms",
          "Core communication tools",
        ],
      },
    ],
    faqs: [
      {
        q: "Will replacing subscriptions disrupt our team?",
        a: "We phase replacements and run overlap periods so your crew can transition without operational downtime.",
      },
      {
        q: "Can this work if we already use a popular contractor SaaS?",
        a: "Yes. We can integrate with it, replace specific modules, or fully migrate depending on your workflow and cost profile.",
      },
      {
        q: "How fast can we see savings?",
        a: "Most teams see immediate savings once duplicate tools are retired, with larger gains as manual admin work is eliminated.",
      },
    ],
  },
};

export const WEBSITE_PAGE_DATA = {
  "contractor-websites": {
    slug: "contractor-websites",
    title: "Contractor Websites Built to Turn Leads Into Jobs",
    description:
      "USATII builds contractor websites in Rochester, NY that connect lead intake directly to estimating, scheduling, and follow-up workflows.",
    heroEyebrow: "Contractor Websites",
    heroIntro:
      "Your website should be the front door to your operating system, not a brochure. We design contractor websites that push qualified leads into clear next steps.",
    proofPoints: [
      "Service pages structured for trade-intent SEO",
      "Fast lead forms mapped to estimate workflows",
      "Call, text, and booking CTAs tied to routing logic",
    ],
    sections: [
      {
        heading: "Built for conversion and operations",
        body:
          "Every page is designed to move visitors into action and route the data to your team with clean qualification context.",
        bullets: [
          "Service-area landing architecture",
          "Trade-specific proof sections",
          "Estimate request forms with structured intake",
          "Automation hooks for fast response",
        ],
      },
      {
        heading: "Website + CRM integration",
        body:
          "Form submissions and calls should not die in inboxes. We connect lead events to your CRM and dispatch processes.",
        bullets: [
          "Source tracking for every lead",
          "Auto-tagging by service type",
          "Instant assignment to office workflows",
          "Follow-up reminders when leads stall",
        ],
      },
      {
        heading: "Proof beyond design",
        body:
          "USATII also runs high-output content and paid ads systems. That means your site messaging aligns with how prospects discover and compare providers.",
        bullets: [
          "Message consistency across channels",
          "Campaign landing support",
          "Review and credibility placements",
        ],
      },
    ],
    faqs: [
      {
        q: "Do you only build websites for contractors?",
        a: "We build across industries, but this offer is specifically tailored to contractor and trade-service workflows.",
      },
      {
        q: "Can you keep our current site live during rebuild?",
        a: "Yes. We build and test in parallel, then switch over when conversion tracking and intake routing are ready.",
      },
      {
        q: "Will the site include location pages?",
        a: "Yes. We can create service-area pages for targeted local markets with specific proof and local CTA language.",
      },
    ],
  },
};

export const MARKETING_PAGE_DATA = {
  "contractor-marketing-systems": {
    slug: "contractor-marketing-systems",
    title: "Contractor Marketing Systems for Local Lead Generation",
    description:
      "USATII builds contractor marketing systems for Rochester trade businesses, connecting content, paid campaigns, and workflow-aware lead follow-up.",
    heroEyebrow: "Marketing Systems",
    heroIntro:
      "Content and ads are not the main product. They are proof that we understand demand generation and can feed clean leads into the systems we build.",
    proofPoints: [
      "Localized campaign strategy for trade categories",
      "Creative and paid loops tied to real job outcomes",
      "Follow-up automation connected to CRM stages",
    ],
    sections: [
      {
        heading: "How we approach trade demand",
        body:
          "We structure campaigns around intent windows, service urgency, and geography so your team gets leads they can realistically close.",
        bullets: [
          "High-intent service page targeting",
          "Offer frameworks for estimate requests",
          "Campaign segmentation by trade service",
        ],
      },
      {
        heading: "Marketing to operations handoff",
        body:
          "Lead generation only matters if your operation can act fast. We build intake standards, response SLAs, and follow-up workflows directly into your system.",
        bullets: [
          "Lead source tracking",
          "Response-time alerts",
          "Missed-lead reactivation sequences",
          "Review request automation post-completion",
        ],
      },
      {
        heading: "Why this is secondary proof",
        body:
          "USATII originally scaled through content systems, paid ads, and high-output media. That experience now supports the primary offer: in-house software systems for trades.",
        bullets: [
          "Real execution data from campaigns",
          "Copy and offer testing discipline",
          "Closed-loop reporting from click to paid invoice",
        ],
      },
    ],
    faqs: [
      {
        q: "Do you run ads even if we focus on software?",
        a: "Yes, if needed. We can run campaigns and then route demand into the custom operating workflows we build.",
      },
      {
        q: "Can marketing systems work without a full custom build?",
        a: "Yes. We can improve acquisition first, then phase in custom software where operational bottlenecks are strongest.",
      },
      {
        q: "Do you handle creative production?",
        a: "Yes. Our team can handle content production and campaign creative aligned to service-page and conversion goals.",
      },
    ],
  },
};

export const INDUSTRY_PAGE_DATA = [
  {
    slug: "hvac-software-rochester-ny",
    trade: "HVAC",
    title: "Custom Software for HVAC Companies in Rochester, NY",
    opening:
      "HVAC companies do not need another generic subscription dashboard. They need a system built around seasonal demand, emergency calls, maintenance plans, dispatch, and quote-to-install handoffs.",
    commonProblems: [
      "Emergency calls get buried behind routine follow-ups",
      "Maintenance agreements are tracked outside the main scheduling flow",
      "Technician notes and photos arrive after billing is already delayed",
      "Install quotes and financing steps are hard to track in one place",
    ],
    replaceOrConsolidate: [
      "Standalone dispatch boards",
      "Separate CRM for install opportunities",
      "Manual reminder tools for maintenance plans",
      "Spreadsheet-based technician availability trackers",
    ],
    whatWeBuild: [
      "Priority-aware dispatch board for emergency vs planned service",
      "Maintenance-plan workflow with recurring reminders",
      "Quote-to-install pipeline with financing checkpoints",
      "Tech mobile log for diagnostics, photos, and parts used",
    ],
    workflows: [
      "After-hours emergency lead -> on-call dispatch -> technician ETA updates -> completion notes -> invoice",
      "Maintenance plan reminder -> booking confirmation -> service checklist -> next cycle scheduling",
      "Replacement quote -> approval -> install date assignment -> crew prep -> post-install review request",
    ],
    websiteIntegration:
      "HVAC landing pages can route emergency calls differently than maintenance requests so your office team responds with the right urgency.",
    reportingDashboard:
      "Track first-response time, emergency close rate, maintenance retention, install conversion, and invoice aging in one dashboard.",
    securityNotes:
      "Role controls separate dispatch, technician, sales, and finance data while keeping complete audit logs for job changes.",
    faqs: [
      {
        q: "Can this support both service and installation teams?",
        a: "Yes. We separate workflows for service calls and install projects while preserving one customer timeline.",
      },
      {
        q: "Can recurring maintenance plans be automated?",
        a: "Yes. We can automate reminders, appointment prompts, and renewal tracking.",
      },
    ],
  },
  {
    slug: "plumbing-software-rochester-ny",
    trade: "Plumbing",
    title: "Custom Software for Plumbing Companies in Rochester, NY",
    opening:
      "Plumbing companies need software that handles urgent calls, estimate approvals, parts coordination, and clear communication between office staff and field technicians.",
    commonProblems: [
      "Urgent leak calls compete with scheduled jobs in the same queue",
      "Technician notes are inconsistent between jobs",
      "Parts and materials status is not visible during scheduling",
      "Follow-up for unfinished jobs slips through manually",
    ],
    replaceOrConsolidate: [
      "Generic ticketing tools",
      "Separate texting and reminder platforms",
      "Manual parts status spreadsheets",
      "Duplicate customer records across tools",
    ],
    whatWeBuild: [
      "Service request triage with urgency tags",
      "Technician checklist templates by job type",
      "Parts-needed checkpoints before scheduling",
      "Completion workflow tied to invoicing and review requests",
    ],
    workflows: [
      "Leak call intake -> urgent dispatch -> photo documentation -> same-day quote -> invoice",
      "Drain issue request -> technician assessment -> parts request -> return visit scheduling -> closeout",
      "Water heater estimate -> approval -> install scheduling -> warranty documentation -> follow-up",
    ],
    websiteIntegration:
      "Plumbing service pages can capture structured job details (issue type, urgency, property type) to speed dispatch decisions.",
    reportingDashboard:
      "Monitor urgent response speed, repeat-visit rate, average estimate approval time, and paid-invoice timeline.",
    securityNotes:
      "All edits to estimates, schedule moves, and invoices are logged so owners can trace operational decisions.",
    faqs: [
      {
        q: "Can this reduce repeat truck rolls?",
        a: "Yes. Better intake data and field checklists reduce missed information that causes return visits.",
      },
      {
        q: "Can office staff and technicians use different views?",
        a: "Yes. We design role-based views so each team sees exactly what they need.",
      },
    ],
  },
  {
    slug: "electrical-contractor-software-rochester-ny",
    trade: "Electrical",
    title: "Custom Software for Electrical Companies in Rochester, NY",
    opening:
      "Electrical companies need workflow software that supports project scoping, permit checkpoints, safety documentation, scheduling, and invoice milestones.",
    commonProblems: [
      "Small service calls and multi-day installs use the same loose process",
      "Permit and inspection status is not visible to dispatch",
      "Crew notes and panel photos are hard to retrieve later",
      "Change orders are tracked outside the core estimate record",
    ],
    replaceOrConsolidate: [
      "Disconnected project trackers",
      "Manual permit status boards",
      "Standalone field photo apps",
      "Separate estimate revision documents",
    ],
    whatWeBuild: [
      "Service vs project workflow lanes",
      "Permit and inspection status checkpoints",
      "Change-order tracking tied to estimates",
      "Field photo and documentation timeline per job",
    ],
    workflows: [
      "Panel upgrade lead -> scope visit -> permit milestone -> install scheduling -> final inspection -> invoice",
      "Service call intake -> technician assignment -> safety checklist -> completion and notes -> payment request",
      "Commercial estimate -> phased approvals -> crew allocation -> milestone billing",
    ],
    websiteIntegration:
      "Electrical service pages can collect project type and scope details that pre-qualify leads before dispatch.",
    reportingDashboard:
      "Track permit-cycle delays, change-order frequency, crew utilization, and milestone billing conversion.",
    securityNotes:
      "Permission controls protect financial data while preserving field visibility for crews and project managers.",
    faqs: [
      {
        q: "Can this handle both residential and commercial jobs?",
        a: "Yes. We can split workflows by project type while keeping shared customer and reporting structure.",
      },
      {
        q: "Can permit steps be built into the process?",
        a: "Yes. Permit, inspection, and approval statuses can be embedded as required workflow gates.",
      },
    ],
  },
  {
    slug: "roofing-software-rochester-ny",
    trade: "Roofing",
    title: "Custom Software for Roofing Companies in Rochester, NY",
    opening:
      "Roofing companies need software that can handle storm lead bursts, roof inspection photos, insurance coordination, estimate approvals, and crew scheduling across weather windows.",
    commonProblems: [
      "Storm lead volume overwhelms intake workflows",
      "Inspection photos are spread across phones and chat threads",
      "Insurance communication is not tied to job status",
      "Material orders and crew scheduling are hard to coordinate",
    ],
    replaceOrConsolidate: [
      "Standalone lead forms",
      "Manual inspection photo folders",
      "Separate insurance notes documents",
      "Spreadsheet-based material tracking",
    ],
    whatWeBuild: [
      "Storm-intake prioritization workflow",
      "Inspection photo timeline with job association",
      "Insurance documentation checkpoints",
      "Crew and material readiness dashboard",
    ],
    workflows: [
      "Storm lead -> inspection booking -> photo capture -> estimate approval -> insurance coordination -> install schedule",
      "Supplement request -> estimate revision -> approval -> material release -> crew dispatch",
      "Job completion -> final photo package -> invoice -> post-job review request",
    ],
    websiteIntegration:
      "Roofing landing pages can separate emergency tarp requests from full replacement estimates to improve response prioritization.",
    reportingDashboard:
      "Measure storm lead response speed, insurance approval cycle time, material-delay risk, and review-request completion rate.",
    securityNotes:
      "Audit logs preserve all estimate revisions, insurance-step updates, and schedule changes for accountability.",
    faqs: [
      {
        q: "Can this handle insurance-heavy roofing workflows?",
        a: "Yes. We can track documentation and communication checkpoints from inspection through claim-related approvals.",
      },
      {
        q: "Can crews see material readiness before dispatch?",
        a: "Yes. Dispatch views can include materials, permits, and approval dependencies.",
      },
    ],
  },
  {
    slug: "remodeling-contractor-software-rochester-ny",
    trade: "Remodeling",
    title: "Custom Software for Remodeling Companies in Rochester, NY",
    opening:
      "Remodeling companies run longer timelines, more change orders, and denser client communication than typical service calls. Their software must reflect that complexity.",
    commonProblems: [
      "Discovery, design, and build stages are tracked in separate systems",
      "Change orders are hard to approve and reconcile",
      "Client communication history is fragmented",
      "Milestone billing is not tied cleanly to project progress",
    ],
    replaceOrConsolidate: [
      "Disconnected project portals",
      "Email-only change-order threads",
      "Separate invoicing timeline docs",
      "Manual production schedule spreadsheets",
    ],
    whatWeBuild: [
      "Phase-based project workflow",
      "Structured change-order approval path",
      "Client portal with milestone visibility",
      "Milestone billing tied to stage completion",
    ],
    workflows: [
      "Lead intake -> scope consultation -> design approval -> project schedule -> milestone updates -> closeout",
      "Change request -> cost update -> client approval -> schedule adjustment -> crew notification",
      "Milestone completion -> documentation upload -> invoice issue -> payment confirmation",
    ],
    websiteIntegration:
      "Remodeling pages can pre-qualify project size, timeline expectations, and service scope before consult scheduling.",
    reportingDashboard:
      "Track project stage duration, change-order volume, margin drift, and milestone payment timing.",
    securityNotes:
      "Permission tiers keep client-facing updates polished while internal financial and staffing notes remain controlled.",
    faqs: [
      {
        q: "Can clients track progress without constant calls?",
        a: "Yes. A client portal can provide project-stage visibility, approvals, and document access.",
      },
      {
        q: "Can change-order approvals be standardized?",
        a: "Yes. We can enforce change-order steps so scope and pricing changes are formally tracked before execution.",
      },
    ],
  },
  {
    slug: "landscaping-software-rochester-ny",
    trade: "Landscaping",
    title: "Custom Software for Landscaping Companies in Rochester, NY",
    opening:
      "Landscaping teams manage seasonal swings, route density, recurring maintenance contracts, and project installs. Custom software helps coordinate all four.",
    commonProblems: [
      "Recurring maintenance and project installs are mixed in one queue",
      "Crew routing is not optimized by geography",
      "Seasonal schedule shifts are handled manually",
      "Photo documentation for completed work is inconsistent",
    ],
    replaceOrConsolidate: [
      "Manual route planners",
      "Separate recurring-service reminder tools",
      "Spreadsheet contract trackers",
      "Ad-hoc photo and proof-of-work systems",
    ],
    whatWeBuild: [
      "Recurring contract workflow management",
      "Route-aware scheduling by neighborhood",
      "Seasonal service calendar controls",
      "Completion photo capture tied to client records",
    ],
    workflows: [
      "Maintenance contract -> recurring job generation -> route batching -> crew completion photos -> invoicing",
      "Spring cleanup lead -> site assessment -> estimate approval -> crew schedule -> completion and upsell follow-up",
      "Landscape install project -> material planning -> staged execution -> final walkthrough",
    ],
    websiteIntegration:
      "Landscaping pages can capture property type, service frequency, and seasonal priorities to improve lead qualification.",
    reportingDashboard:
      "Monitor route efficiency, seasonal booking density, recurring retention, and completion-to-invoice timing.",
    securityNotes:
      "Crew mobile access can be limited to route-specific jobs while office staff retains full client and financial controls.",
    faqs: [
      {
        q: "Can this support recurring and one-time services together?",
        a: "Yes. We build separate workflow lanes with shared client and billing records.",
      },
      {
        q: "Can routes be organized by geography?",
        a: "Yes. Scheduling can batch jobs by service area to reduce drive time.",
      },
    ],
  },
  {
    slug: "flooring-contractor-software-rochester-ny",
    trade: "Flooring",
    title: "Custom Software for Flooring Companies in Rochester, NY",
    opening:
      "Flooring companies need software that tracks measure appointments, material selection, estimate approvals, install scheduling, and punch-list completion.",
    commonProblems: [
      "Measure and install appointments are managed in separate systems",
      "Material selections are not tied cleanly to estimate revisions",
      "Install readiness is unclear before crews are dispatched",
      "Punch-list and closeout steps are inconsistently documented",
    ],
    replaceOrConsolidate: [
      "Standalone measurement tools",
      "Separate material-selection notes",
      "Manual install readiness checklists",
      "Disconnected client communication threads",
    ],
    whatWeBuild: [
      "Measure-to-install workflow",
      "Material and estimate linkage",
      "Install readiness checkpoints",
      "Punch-list closeout and sign-off capture",
    ],
    workflows: [
      "Inbound lead -> measurement booking -> material selection -> estimate approval -> install date",
      "Material change -> estimate update -> client approval -> schedule confirmation",
      "Install completion -> punch-list review -> final sign-off -> invoice and review request",
    ],
    websiteIntegration:
      "Flooring pages can gather room counts, material preferences, and project timing during intake.",
    reportingDashboard:
      "Track measure-to-quote cycle time, approval rate by material category, and install completion quality trends.",
    securityNotes:
      "Every estimate revision and material change is logged to reduce billing disputes and rework confusion.",
    faqs: [
      {
        q: "Can this track both residential and commercial flooring jobs?",
        a: "Yes. We can support different scoping and approval rules for each job type.",
      },
      {
        q: "Can material options be tied directly to pricing?",
        a: "Yes. Material selections can automatically flow into estimate versions and approvals.",
      },
    ],
  },
  {
    slug: "painting-contractor-software-rochester-ny",
    trade: "Painting",
    title: "Custom Software for Painting Companies in Rochester, NY",
    opening:
      "Painting contractors need fast quoting, job sequencing, crew coordination, and reliable communication around prep, materials, and finish expectations.",
    commonProblems: [
      "Quote follow-ups are inconsistent after site visits",
      "Prep tasks are not tracked before paint day",
      "Crew availability and weather constraints are hard to coordinate",
      "Final walkthrough notes are captured in scattered messages",
    ],
    replaceOrConsolidate: [
      "Generic estimate trackers",
      "Manual prep checklists",
      "Separate reminder and communication tools",
      "Spreadsheet-based crew scheduling",
    ],
    whatWeBuild: [
      "Quote pipeline with follow-up triggers",
      "Prep and material readiness checklists",
      "Crew scheduling tied to job phase",
      "Final walkthrough and touch-up documentation",
    ],
    workflows: [
      "Lead intake -> site visit -> quote send -> approval follow-up -> schedule",
      "Prep checklist completion -> crew dispatch -> progress photos -> walkthrough",
      "Touch-up request -> technician assignment -> completion verification -> invoice",
    ],
    websiteIntegration:
      "Painting pages can pre-qualify interior vs exterior scope, timeline, and surface details for better quoting accuracy.",
    reportingDashboard:
      "Track quote turnaround, close rate by job type, schedule adherence, and rework frequency.",
    securityNotes:
      "Job updates, notes, and client approvals are preserved in one timeline to reduce scope disputes.",
    faqs: [
      {
        q: "Can this improve quote follow-up consistency?",
        a: "Yes. Automated follow-up logic can keep quotes from going cold.",
      },
      {
        q: "Can crews log progress from the field?",
        a: "Yes. Mobile views can capture photos, notes, and completion status in real time.",
      },
    ],
  },
  {
    slug: "masonry-concrete-software-rochester-ny",
    trade: "Masonry and Concrete",
    title: "Custom Software for Masonry and Concrete Companies in Rochester, NY",
    opening:
      "Masonry and concrete contractors need stronger workflow control for site prep, pour windows, crew sequencing, inspections, and closeout documentation.",
    commonProblems: [
      "Weather-dependent schedule changes are communicated too late",
      "Site readiness checks are inconsistent",
      "Multi-step jobs lose progress visibility between visits",
      "Inspection and sign-off documentation is fragmented",
    ],
    replaceOrConsolidate: [
      "Manual site-readiness boards",
      "Separate weather and schedule trackers",
      "Disconnected inspection documentation",
      "Paper-based crew checklists",
    ],
    whatWeBuild: [
      "Weather-aware schedule controls",
      "Site readiness and pour checklist system",
      "Multi-visit progress tracking",
      "Inspection and approval documentation workflow",
    ],
    workflows: [
      "Lead intake -> site assessment -> estimate approval -> prep checklist -> pour schedule",
      "Weather risk alert -> schedule shift -> crew notification -> client update",
      "Completion inspection -> photo documentation -> invoice release",
    ],
    websiteIntegration:
      "Masonry/concrete pages can capture project type, square footage, and timeline to improve estimate accuracy before site visits.",
    reportingDashboard:
      "Track schedule reliability, weather-related delays, inspection pass rates, and job gross margin trends.",
    securityNotes:
      "Audit trails capture schedule changes and inspection outcomes for operational and client transparency.",
    faqs: [
      {
        q: "Can this handle weather-driven rescheduling?",
        a: "Yes. Schedule logic can flag weather risk and automate communication when plans change.",
      },
      {
        q: "Can inspections be logged inside the same system?",
        a: "Yes. Inspection steps, notes, and approvals can be tied to each job record.",
      },
    ],
  },
  {
    slug: "pest-control-software-rochester-ny",
    trade: "Pest Control",
    title: "Custom Software for Pest Control Companies in Rochester, NY",
    opening:
      "Pest control companies rely on recurring service plans, technician routing, treatment records, and timely follow-up communication. Custom workflows keep all of it coordinated.",
    commonProblems: [
      "Recurring treatments are scheduled manually",
      "Technician treatment notes vary by person",
      "Route planning is inefficient across service areas",
      "Re-treatment requests are not tracked clearly",
    ],
    replaceOrConsolidate: [
      "Separate recurring reminder platforms",
      "Manual route planning sheets",
      "Standalone note apps",
      "Disconnected customer history records",
    ],
    whatWeBuild: [
      "Recurring treatment scheduling workflow",
      "Standardized field treatment logs",
      "Route-aware daily dispatch views",
      "Re-treatment and follow-up management",
    ],
    workflows: [
      "New inquiry -> treatment assessment -> plan selection -> recurring visit cadence",
      "Daily route generation -> technician logs -> treatment completion -> customer summary",
      "Re-treatment request -> priority scheduling -> completion verification",
    ],
    websiteIntegration:
      "Pest control pages can capture pest type, urgency, and property context so dispatch can prioritize correctly.",
    reportingDashboard:
      "Track recurring-plan retention, route efficiency, first-treatment completion, and re-treatment rate.",
    securityNotes:
      "Role permissions keep sensitive client and billing details separate from field-only treatment logs.",
    faqs: [
      {
        q: "Can this automate recurring service reminders?",
        a: "Yes. Reminders and follow-up tasks can be automated by treatment cadence.",
      },
      {
        q: "Can technicians log treatment details from mobile?",
        a: "Yes. Field logs can be captured in mobile views tied to each service visit.",
      },
    ],
  },
  {
    slug: "garage-door-company-software-rochester-ny",
    trade: "Garage Door",
    title: "Custom Software for Garage Door Companies in Rochester, NY",
    opening:
      "Garage door companies need fast response for repairs, clean quote-to-install workflows for replacements, and tighter coordination around parts availability.",
    commonProblems: [
      "Repair calls and replacement jobs are mixed together",
      "Parts availability is unclear during scheduling",
      "Estimate approvals are not tracked with urgency",
      "Technician updates are difficult to standardize",
    ],
    replaceOrConsolidate: [
      "Manual parts tracking sheets",
      "Generic dispatch software",
      "Disconnected quote follow-up tools",
      "Separate customer messaging systems",
    ],
    whatWeBuild: [
      "Repair vs replacement workflow lanes",
      "Parts-readiness checkpoints before dispatch",
      "Quote approval follow-up automation",
      "Field status updates and completion verification",
    ],
    workflows: [
      "Emergency repair call -> technician dispatch -> parts diagnosis -> same-day resolution or follow-up",
      "Replacement inquiry -> onsite assessment -> quote approval -> install scheduling -> completion",
      "Completion photo and notes -> invoice -> review request",
    ],
    websiteIntegration:
      "Garage door pages can capture door type, issue urgency, and preferred appointment windows during intake.",
    reportingDashboard:
      "Track emergency response time, repair completion rate, replacement close rate, and parts-delay impact.",
    securityNotes:
      "Audit logs preserve quote edits, dispatch shifts, and completion records for accountability.",
    faqs: [
      {
        q: "Can this help prioritize emergency repair requests?",
        a: "Yes. Urgency-based intake and dispatch logic can route emergency calls first.",
      },
      {
        q: "Can parts dependencies be tracked before jobs are scheduled?",
        a: "Yes. Parts-readiness checks can block scheduling until required items are confirmed.",
      },
    ],
  },
  {
    slug: "fencing-company-software-rochester-ny",
    trade: "Fencing",
    title: "Custom Software for Fencing Companies in Rochester, NY",
    opening:
      "Fencing companies need better control across site measurements, estimate approvals, material coordination, crew scheduling, and final walkthrough closeouts.",
    commonProblems: [
      "Site measurements and estimate updates are disconnected",
      "Material ordering status is not visible to schedulers",
      "Install sequencing across crews is manually coordinated",
      "Closeout approvals and warranty notes are hard to standardize",
    ],
    replaceOrConsolidate: [
      "Separate measurement and quote trackers",
      "Manual material-order spreadsheets",
      "Standalone scheduling boards",
      "Fragmented warranty documentation tools",
    ],
    whatWeBuild: [
      "Measurement-to-estimate workflow",
      "Material-readiness tracking linked to jobs",
      "Crew sequencing and install board",
      "Closeout, sign-off, and warranty logging",
    ],
    workflows: [
      "Lead capture -> site measurement -> quote approval -> material order -> install schedule",
      "Material delay alert -> schedule adjustment -> customer notification",
      "Final walkthrough -> sign-off capture -> invoice -> review request",
    ],
    websiteIntegration:
      "Fencing pages can collect fence type, footage, and property context to improve upfront lead qualification.",
    reportingDashboard:
      "Track measurement-to-quote cycle, material-delay frequency, install throughput, and closeout completion.",
    securityNotes:
      "Permission and audit controls keep pricing changes, schedule edits, and warranty records visible and accountable.",
    faqs: [
      {
        q: "Can this reduce delays caused by material coordination?",
        a: "Yes. Material status can be tied directly to schedule eligibility and customer updates.",
      },
      {
        q: "Can closeout and warranty steps be standardized?",
        a: "Yes. We can build repeatable closeout forms and warranty logging inside each job workflow.",
      },
    ],
  },
];

export const LOCATION_PAGE_DATA = [
  {
    slug: "rochester-ny",
    city: "Rochester",
    state: "NY",
    title: "Custom Software for Trade Businesses in Rochester, NY",
    intro:
      "USATII is based in Rochester and builds custom in-house systems for local trade companies that want better lead intake, dispatch speed, and operational control.",
    localProof: [
      "Founder-led team based in the Rochester market",
      "Focused on service workflows common to Monroe County trade companies",
      "Build + marketing experience in trades and service-heavy operations",
    ],
    nearbyTrades: ["HVAC", "Plumbing", "Roofing", "Electrical", "Remodeling"],
    serviceAreaLanguage:
      "We serve trade businesses in Rochester and nearby towns where your crews actually operate day to day.",
    cta:
      "Book a free software waste audit to identify which tools to keep, replace, or rebuild.",
  },
  {
    slug: "henrietta-ny",
    city: "Henrietta",
    state: "NY",
    title: "Custom Software for Trade Businesses in Henrietta, NY",
    intro:
      "Henrietta trade businesses need fast lead response and clean crew scheduling to stay competitive in a busy local corridor.",
    localProof: [
      "Strong service demand from residential and commercial zones",
      "High importance of dispatch speed and day-part scheduling",
      "Frequent need for clean estimate-to-invoice workflows",
    ],
    nearbyTrades: ["HVAC", "Plumbing", "Electrical", "Garage Door"],
    serviceAreaLanguage:
      "We support Henrietta-area service routes and nearby neighborhoods your team already covers.",
    cta:
      "Get a software waste audit to map where your current tools are slowing down response time.",
  },
  {
    slug: "webster-ny",
    city: "Webster",
    state: "NY",
    title: "Custom Software for Trade Businesses in Webster, NY",
    intro:
      "Webster service teams often juggle recurring maintenance and project installs across a wide area. Custom workflows keep both organized.",
    localProof: [
      "Recurring service demand and homeowner-heavy job mix",
      "Need for route efficiency and schedule visibility",
      "Strong value from standardized field photo documentation",
    ],
    nearbyTrades: ["Landscaping", "Roofing", "Pest Control", "Painting"],
    serviceAreaLanguage:
      "We work with Webster-area teams and nearby east-side service territories within your normal operating radius.",
    cta:
      "Book a free audit and see where recurring-service workflows can be automated.",
  },
  {
    slug: "greece-ny",
    city: "Greece",
    state: "NY",
    title: "Custom Software for Trade Businesses in Greece, NY",
    intro:
      "Greece trade companies need strong intake triage and dispatch workflows to handle varied job types without operational bottlenecks.",
    localProof: [
      "High-volume residential service opportunities",
      "Need for tighter crew communication during schedule changes",
      "Opportunity to consolidate duplicate CRM and intake tooling",
    ],
    nearbyTrades: ["Plumbing", "HVAC", "Electrical", "Fencing"],
    serviceAreaLanguage:
      "We support Greece and neighboring west-side routes where your teams can reliably deliver service.",
    cta:
      "Request your software waste audit and get a practical keep/replace plan.",
  },
  {
    slug: "irondequoit-ny",
    city: "Irondequoit",
    state: "NY",
    title: "Custom Software for Trade Businesses in Irondequoit, NY",
    intro:
      "Irondequoit service businesses benefit from workflow software that improves estimate follow-up and keeps job documentation organized.",
    localProof: [
      "Dense service geography where response speed matters",
      "Frequent need for cleaner quote and approval tracking",
      "Strong upside from better post-job review workflows",
    ],
    nearbyTrades: ["Roofing", "Plumbing", "Garage Door", "Painting"],
    serviceAreaLanguage:
      "We serve Irondequoit and nearby routes your crews can cover efficiently from your base.",
    cta:
      "Start with a free audit to uncover hidden workflow friction.",
  },
  {
    slug: "pittsford-ny",
    city: "Pittsford",
    state: "NY",
    title: "Custom Software for Trade Businesses in Pittsford, NY",
    intro:
      "Pittsford-area trade teams often need higher-touch customer communication, cleaner project tracking, and polished client portal experiences.",
    localProof: [
      "Higher expectation for communication quality and transparency",
      "Strong fit for client portal and milestone visibility features",
      "Great use case for estimate approval and project-status automation",
    ],
    nearbyTrades: ["Remodeling", "Flooring", "Painting", "Electrical"],
    serviceAreaLanguage:
      "We support Pittsford service coverage with software tuned to premium-client expectations and scheduling precision.",
    cta:
      "Book a free software waste audit and plan a cleaner client experience.",
  },
  {
    slug: "fairport-ny",
    city: "Fairport",
    state: "NY",
    title: "Custom Software for Trade Businesses in Fairport, NY",
    intro:
      "Fairport trade businesses can gain leverage by connecting local lead intake directly to estimating, scheduling, and follow-up systems.",
    localProof: [
      "Strong local-service demand across residential segments",
      "Need for consistent lead response and schedule coordination",
      "Opportunity to reduce manual admin in small-to-mid-size teams",
    ],
    nearbyTrades: ["HVAC", "Landscaping", "Roofing", "Pest Control"],
    serviceAreaLanguage:
      "We serve Fairport and nearby east-side communities that fit your practical service area.",
    cta:
      "Use the free audit to identify where software overlap is eroding margins.",
  },
  {
    slug: "victor-ny",
    city: "Victor",
    state: "NY",
    title: "Custom Software for Trade Businesses in Victor, NY",
    intro:
      "Victor trade companies scaling into nearby suburbs need better control over lead qualification, crew routing, and job throughput.",
    localProof: [
      "Growing service opportunities across residential developments",
      "Need for clearer route and crew planning",
      "Strong value from integrated marketing and operations tracking",
    ],
    nearbyTrades: ["Plumbing", "Electrical", "Garage Door", "Fencing"],
    serviceAreaLanguage:
      "We support Victor-area routes and adjacent communities where your crews are already active.",
    cta:
      "Book a software waste audit and map your next operational upgrade.",
  },
  {
    slug: "canandaigua-ny",
    city: "Canandaigua",
    state: "NY",
    title: "Custom Software for Trade Businesses in Canandaigua, NY",
    intro:
      "Canandaigua teams expanding beyond core Rochester routes need reliable processes for multi-area scheduling and customer communication.",
    localProof: [
      "Useful expansion market for organized route planning",
      "Higher travel coordination needs across jobs",
      "Clear upside from centralized lead and job tracking",
    ],
    nearbyTrades: ["Roofing", "Landscaping", "Masonry and Concrete", "Flooring"],
    serviceAreaLanguage:
      "We work with Canandaigua-area businesses when service routes remain practical and consistent for your crews.",
    cta:
      "Run the free audit before adding more subscriptions for expansion.",
  },
];

export const COMPARE_PAGE_DATA = [
  {
    slug: "custom-software-vs-jobber",
    title: "Custom Software vs Jobber for Contractors",
    description:
      "Fair comparison of custom contractor software vs Jobber, including where each option fits and when subscription sprawl creates operational drag.",
    comparedTool: "Jobber",
  },
  {
    slug: "custom-software-vs-housecall-pro",
    title: "Custom Software vs Housecall Pro for Contractors",
    description:
      "Compare custom contractor software vs Housecall Pro with a practical framework for growth-stage teams.",
    comparedTool: "Housecall Pro",
  },
  {
    slug: "custom-software-vs-service-titan",
    title: "Custom Software vs ServiceTitan for Contractors",
    description:
      "Compare custom software and ServiceTitan for contractor workflows, scaling operations, and subscription complexity.",
    comparedTool: "ServiceTitan",
  },
  {
    slug: "custom-software-vs-monday-com-for-contractors",
    title: "Custom Software vs Monday.com for Contractors",
    description:
      "Understand when Monday.com works for contractors and when custom software is better for field operations.",
    comparedTool: "Monday.com",
  },
  {
    slug: "custom-software-vs-hubspot-for-contractors",
    title: "Custom Software vs HubSpot for Contractors",
    description:
      "See how contractor-specific custom software compares to HubSpot for lead intake, scheduling, and service workflows.",
    comparedTool: "HubSpot",
  },
  {
    slug: "custom-software-vs-workday-for-small-business",
    title: "Custom Software vs Workday-Style Systems for Small Businesses",
    description:
      "Fair comparison between custom small-business software and Workday-style enterprise HR/admin platforms.",
    comparedTool: "Workday-style systems",
  },
  {
    slug: "custom-contractor-crm-vs-generic-crm",
    title: "Custom Contractor CRM vs Generic CRM",
    description:
      "Learn the differences between custom contractor CRMs and generic CRMs across field operations and lifecycle reporting.",
    comparedTool: "Generic CRM",
  },
  {
    slug: "build-vs-buy-software-for-contractors",
    title: "Build vs Buy Software for Contractors",
    description:
      "A practical build-vs-buy guide for contractors deciding between off-the-shelf SaaS and custom software systems.",
    comparedTool: "Off-the-shelf SaaS",
  },
];

export const RESOURCE_PAGE_DATA = [
  {
    slug: "contractor-software-waste-calculator",
    title: "Contractor Software Waste Calculator",
    description:
      "Calculate software waste for your contractor business by modeling overlapping subscriptions, seat count, and admin overhead.",
    type: "calculator",
  },
  {
    slug: "contractor-software-stack-checklist",
    title: "Contractor Software Stack Checklist",
    description:
      "Checklist for evaluating contractor software stacks, overlap risk, and replacement opportunities.",
    type: "guide",
  },
  {
    slug: "contractor-operations-dashboard-guide",
    title: "Contractor Operations Dashboard Guide",
    description:
      "Guide to building an operations dashboard for contractor lead flow, scheduling, crews, jobs, and invoicing.",
    type: "guide",
  },
  {
    slug: "how-to-replace-contractor-software-subscriptions",
    title: "How to Replace Contractor Software Subscriptions",
    description:
      "Step-by-step guide to replacing contractor software subscriptions without disrupting operations.",
    type: "guide",
  },
  {
    slug: "contractor-crm-requirements",
    title: "Contractor CRM Requirements",
    description:
      "Buyer-intent guide on contractor CRM requirements for field teams, dispatch, estimates, and lifecycle reporting.",
    type: "guide",
  },
  {
    slug: "job-tracking-system-for-contractors",
    title: "Job Tracking System for Contractors",
    description:
      "Framework for building a job tracking system that keeps contractor projects on schedule and visible.",
    type: "guide",
  },
  {
    slug: "estimate-to-invoice-automation-for-contractors",
    title: "Estimate-to-Invoice Automation for Contractors",
    description:
      "Guide to automating estimate-to-invoice workflows for faster closeout and cash collection.",
    type: "guide",
  },
  {
    slug: "crew-photo-tracking-system",
    title: "Crew Photo Tracking System",
    description:
      "How to design a crew photo tracking system for quality control, customer communication, and documentation.",
    type: "guide",
  },
  {
    slug: "software-security-for-small-businesses",
    title: "Software Security for Small Businesses",
    description:
      "Practical security guidance for small businesses adopting custom operational software.",
    type: "guide",
  },
  {
    slug: "what-is-a-software-waste-audit",
    title: "What Is a Software Waste Audit?",
    description:
      "Definition and methodology for software waste audits for contractor and trade-service businesses.",
    type: "guide",
  },
];

export const RESOURCE_GUIDE_SECTIONS = {
  "contractor-software-stack-checklist": [
    {
      heading: "Core checklist",
      bullets: [
        "List every recurring software subscription with annualized cost",
        "Map each tool to an exact workflow and owner",
        "Flag tools with overlapping features and low adoption",
        "Track how many manual exports or copy-paste steps happen per week",
      ],
    },
    {
      heading: "Operational checklist",
      bullets: [
        "Can office and field teams view the same job status?",
        "Are estimate revisions tracked in one timeline?",
        "Is lead-source attribution available inside operations reporting?",
        "Do missed leads trigger automated follow-up tasks?",
      ],
    },
  ],
  "contractor-operations-dashboard-guide": [
    {
      heading: "Dashboard categories",
      bullets: [
        "Lead intake speed and response SLA",
        "Estimate cycle time and approval rate",
        "Schedule adherence and crew utilization",
        "Invoice aging and collection velocity",
      ],
    },
    {
      heading: "Design rules",
      bullets: [
        "Show only metrics linked to operational decisions",
        "Keep one source of truth per metric",
        "Separate executive and daily-operator views",
        "Add filters for service type, crew, and location",
      ],
    },
  ],
  "how-to-replace-contractor-software-subscriptions": [
    {
      heading: "Replacement sequence",
      bullets: [
        "Audit overlap and rank tools by cost and friction",
        "Replace one workflow lane first (e.g., lead-to-estimate)",
        "Run an overlap period with clear cutover date",
        "Retire duplicate systems after adoption milestones",
      ],
    },
    {
      heading: "Risk controls",
      bullets: [
        "Preserve accounting and compliance systems unless replacement is required",
        "Document role-based process changes before rollout",
        "Train teams with scenario-based walkthroughs",
        "Log every workflow issue in the first 30 days",
      ],
    },
  ],
  "contractor-crm-requirements": [
    {
      heading: "Required capabilities",
      bullets: [
        "Lead source and service-type tagging",
        "Estimate version history and approval events",
        "Dispatch and schedule visibility",
        "Customer communication timeline",
      ],
    },
    {
      heading: "Nice-to-have capabilities",
      bullets: [
        "Mobile technician notes and photo capture",
        "Route-aware schedule planning",
        "Automated review-request workflow",
        "Role-based dashboard filters",
      ],
    },
  ],
  "job-tracking-system-for-contractors": [
    {
      heading: "Tracking model",
      bullets: [
        "Define explicit job states from intake to closeout",
        "Assign state ownership to specific roles",
        "Set required data for each transition",
        "Track bottleneck time between states",
      ],
    },
    {
      heading: "Execution model",
      bullets: [
        "Use mobile-friendly status updates for field crews",
        "Flag blocked jobs with cause categories",
        "Trigger reminders for stale job states",
        "Link job completion to invoice release rules",
      ],
    },
  ],
  "estimate-to-invoice-automation-for-contractors": [
    {
      heading: "Automation opportunities",
      bullets: [
        "Auto-remind unapproved estimates after defined windows",
        "Create schedule tasks immediately after approval",
        "Prompt field completion checklists before invoicing",
        "Trigger payment reminders on aging invoices",
      ],
    },
    {
      heading: "Data requirements",
      bullets: [
        "Consistent estimate status definitions",
        "Clear handoff ownership between office and field",
        "Invoice trigger rules tied to completion state",
        "Audit logs for all financial status changes",
      ],
    },
  ],
  "crew-photo-tracking-system": [
    {
      heading: "System design",
      bullets: [
        "Require photo categories (before, during, after)",
        "Attach every image to job, stage, and timestamp",
        "Allow captioning for quality and issue notes",
        "Store photos in searchable job timelines",
      ],
    },
    {
      heading: "Operational benefits",
      bullets: [
        "Reduces closeout disputes",
        "Supports better quality assurance",
        "Improves customer transparency",
        "Strengthens training feedback loops",
      ],
    },
  ],
  "software-security-for-small-businesses": [
    {
      heading: "Security baseline",
      bullets: [
        "Role-based access control by team responsibility",
        "Multi-factor authentication for sensitive actions",
        "Audit logs for quote, schedule, and invoice updates",
        "Regular backup and restore validation",
      ],
    },
    {
      heading: "Operational security",
      bullets: [
        "Separate admin permissions from field permissions",
        "Review vendor integrations quarterly",
        "Limit data exports to approved roles",
        "Document incident-response contacts and procedures",
      ],
    },
  ],
  "what-is-a-software-waste-audit": [
    {
      heading: "Definition",
      bullets: [
        "A software waste audit maps recurring tools to real workflows",
        "It identifies overlap, underutilization, and manual handoff risk",
        "It produces a keep/replace/rebuild plan with execution priority",
      ],
    },
    {
      heading: "Output",
      bullets: [
        "Cost baseline and overlap score",
        "Operational friction map",
        "90-day replacement roadmap",
        "Owner-by-owner action plan",
      ],
    },
  ],
};

export const COMPARE_CORE_SECTIONS = {
  fairRule:
    "SaaS is good when your process is generic. Custom software wins when your process is specific, your team is growing, and subscription sprawl is creating operational drag.",
  whenToolWins: [
    "You need quick setup with minimal configuration",
    "Your workflow is mostly standard across industries",
    "You are optimizing for immediate deployment over deep customization",
  ],
  whenCustomWins: [
    "Your process has unique approval and handoff requirements",
    "You need role-specific views across office and field teams",
    "Your team is paying for overlapping tools and manual coordination",
    "You want long-term ownership and control over product direction",
  ],
};

export const TRADE_SERVICE_TYPE = "ProfessionalService";

export function getSoftwarePageBySlug(slug) {
  return SOFTWARE_PAGE_DATA[slug] ?? null;
}

export function getWebsitePageBySlug(slug) {
  return WEBSITE_PAGE_DATA[slug] ?? null;
}

export function getMarketingPageBySlug(slug) {
  return MARKETING_PAGE_DATA[slug] ?? null;
}

export function getIndustryPageBySlug(slug) {
  return INDUSTRY_PAGE_DATA.find((item) => item.slug === slug) ?? null;
}

export function getLocationPageBySlug(slug) {
  return LOCATION_PAGE_DATA.find((item) => item.slug === slug) ?? null;
}

export function getComparePageBySlug(slug) {
  return COMPARE_PAGE_DATA.find((item) => item.slug === slug) ?? null;
}

export function getResourcePageBySlug(slug) {
  return RESOURCE_PAGE_DATA.find((item) => item.slug === slug) ?? null;
}

export function getAllTradeRoutes() {
  const softwareRoutes = Object.keys(SOFTWARE_PAGE_DATA).map(
    (slug) => `/software/${slug}`,
  );
  const websiteRoutes = Object.keys(WEBSITE_PAGE_DATA).map(
    (slug) => `/websites/${slug}`,
  );
  const marketingRoutes = Object.keys(MARKETING_PAGE_DATA).map(
    (slug) => `/marketing/${slug}`,
  );
  const industryRoutes = INDUSTRY_PAGE_DATA.map(
    (item) => `/industries/${item.slug}`,
  );
  const locationRoutes = LOCATION_PAGE_DATA.map(
    (item) => `/locations/${item.slug}`,
  );
  const compareRoutes = COMPARE_PAGE_DATA.map((item) => `/compare/${item.slug}`);
  const resourceRoutes = RESOURCE_PAGE_DATA.map((item) => `/resources/${item.slug}`);

  return [
    "/trades",
    "/software",
    "/websites",
    "/marketing",
    "/industries",
    "/locations",
    "/compare",
    "/resources",
    "/audits",
    "/about",
    "/about/vlad-usatii",
    "/security",
    "/reviews",
    ...softwareRoutes,
    ...websiteRoutes,
    ...marketingRoutes,
    ...industryRoutes,
    ...locationRoutes,
    ...compareRoutes,
    ...resourceRoutes,
  ];
}

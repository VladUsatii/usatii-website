export const SITE_URL = "https://usatii.com";

export const SERVICE_SLUGS = [
  "social-media-management",
  "organic-social-media-marketing",
  "short-form-content-creation",
  "website-design",
  "landing-page-design",
  "marketing-automation",
  "paid-social-advertising",
];

export const POPULAR_LOCATION_SLUGS = [
  "new-york-city",
  "los-angeles",
  "chicago",
  "houston",
  "phoenix",
  "philadelphia",
  "san-antonio",
  "san-diego",
  "dallas",
  "austin",
  "jacksonville",
  "fort-worth",
  "san-jose",
  "columbus",
  "charlotte",
  "indianapolis",
  "san-francisco",
  "seattle",
  "denver",
  "washington-dc",
  "boston",
  "miami",
  "atlanta",
  "nashville",
  "tampa",
  "orlando",
  "las-vegas",
  "portland",
  "minneapolis",
  "raleigh",
  "rochester-ny",
];

export const SERVICE_LOCATION_ROLLOUT = {
  "social-media-management": [
    "rochester-ny",
    "new-york-city",
    "los-angeles",
    "chicago",
    "miami",
  ],
  "organic-social-media-marketing": [
    "rochester-ny",
    "new-york-city",
    "los-angeles",
    "austin",
    "dallas",
  ],
  "short-form-content-creation": [
    "new-york-city",
    "los-angeles",
    "miami",
    "atlanta",
    "nashville",
  ],
  "website-design": [
    "rochester-ny",
    "new-york-city",
    "los-angeles",
    "austin",
    "denver",
  ],
  "landing-page-design": [
    "new-york-city",
    "los-angeles",
    "austin",
    "miami",
    "chicago",
  ],
  "marketing-automation": [
    "new-york-city",
    "los-angeles",
    "chicago",
    "dallas",
    "boston",
  ],
  "paid-social-advertising": [
    "new-york-city",
    "los-angeles",
    "chicago",
    "houston",
    "phoenix",
  ],
};

export const LOCATIONS = {
  "rochester-ny": {
    name: "Rochester, NY",
    opening:
      "For Rochester companies, the strongest use case is building a sharper digital presence that wins trust against larger regional competitors.",
    marketFocus:
      "service brands, healthcare groups, B2B firms, and local operators that need consistent visibility and stronger lead quality",
    deliverablePriority:
      "clean positioning, practical campaign execution, and local proof that supports higher close rates",
    faqAngle:
      "regional growth across Western New York",
    nearbyMajor: ["new-york-city", "chicago"],
  },
  "new-york-city": {
    name: "New York City",
    opening:
      "For New York City companies, the strongest use case is premium positioning, authority-building, and consistent visibility inside dense competition.",
    marketFocus:
      "professional services, venture-backed teams, and category challengers that need faster market trust",
    deliverablePriority:
      "high-quality creative velocity, strong brand voice control, and reporting tied to qualified pipeline",
    faqAngle:
      "winning attention in crowded markets",
    nearbyMajor: ["boston", "chicago"],
  },
  "los-angeles": {
    name: "Los Angeles",
    opening:
      "For Los Angeles companies, the strongest use case is visual storytelling that blends brand equity, creator-style content, and measurable acquisition.",
    marketFocus:
      "consumer brands, media-adjacent teams, and founder-led businesses that compete through creative differentiation",
    deliverablePriority:
      "visual consistency, fast production cycles, and distribution strategies that increase qualified reach",
    faqAngle:
      "turning creative output into predictable demand",
    nearbyMajor: ["san-diego", "phoenix"],
  },
  chicago: {
    name: "Chicago",
    opening:
      "For Chicago companies, the strongest use case is clear category positioning and dependable execution across long sales cycles.",
    marketFocus:
      "mid-market B2B teams, local service companies, and multi-location operators",
    deliverablePriority:
      "structured messaging, strong conversion paths, and accountable performance reviews",
    faqAngle:
      "balancing brand clarity with practical lead generation",
    nearbyMajor: ["dallas", "new-york-city"],
  },
  miami: {
    name: "Miami",
    opening:
      "For Miami companies, the strongest use case is visual-first positioning for hospitality, real estate, wellness, and bilingual audiences.",
    marketFocus:
      "high-competition local brands that need attention, trust, and a reliable inbound pipeline",
    deliverablePriority:
      "content systems built for high engagement, local relevance, and offer-driven conversion",
    faqAngle:
      "connecting brand energy with qualified demand",
    nearbyMajor: ["atlanta", "new-york-city"],
  },
  austin: {
    name: "Austin",
    opening:
      "For Austin companies, the strongest use case is founder-led content, recruiting visibility, and productized-service funnels.",
    marketFocus:
      "SaaS teams, agencies, consultants, and growing local brands with rapid go-to-market cycles",
    deliverablePriority:
      "fast iteration, clear educational messaging, and conversion-focused campaign architecture",
    faqAngle:
      "scaling demand while preserving brand personality",
    nearbyMajor: ["dallas", "houston"],
  },
  dallas: {
    name: "Dallas",
    opening:
      "For Dallas companies, the strongest use case is building repeatable marketing systems for high-volume sales and multi-market growth.",
    marketFocus:
      "enterprise-adjacent firms, home-service groups, and scale-oriented operators",
    deliverablePriority:
      "operational discipline, measurable funnel steps, and sales-aligned marketing execution",
    faqAngle:
      "supporting growth without losing process control",
    nearbyMajor: ["austin", "houston"],
  },
  atlanta: {
    name: "Atlanta",
    opening:
      "For Atlanta companies, the strongest use case is culture-led content that builds trust and demand across competitive local categories.",
    marketFocus:
      "service brands, personal brands, and consumer businesses that rely on strong community presence",
    deliverablePriority:
      "message consistency, audience resonance, and campaign systems that can scale",
    faqAngle:
      "turning audience attention into booked opportunities",
    nearbyMajor: ["miami", "nashville"],
  },
  nashville: {
    name: "Nashville",
    opening:
      "For Nashville companies, the strongest use case is education-first content that builds authority while supporting steady pipeline growth.",
    marketFocus:
      "healthcare, professional services, and founder-led businesses investing in long-term visibility",
    deliverablePriority:
      "story-led creative, clear offers, and campaign structures that increase qualified inquiries",
    faqAngle:
      "building sustained visibility instead of short spikes",
    nearbyMajor: ["atlanta", "chicago"],
  },
  denver: {
    name: "Denver",
    opening:
      "For Denver companies, the strongest use case is clear positioning for competitive service categories and fast-moving growth teams.",
    marketFocus:
      "outdoor, wellness, SaaS, and local professional brands that need stronger digital conversion performance",
    deliverablePriority:
      "clean user journeys, stronger offer packaging, and reporting tied to real business outcomes",
    faqAngle:
      "improving conversion quality, not just traffic volume",
    nearbyMajor: ["phoenix", "los-angeles"],
  },
  boston: {
    name: "Boston",
    opening:
      "For Boston companies, the strongest use case is authority-driven marketing for education, healthcare, biotech, and professional services.",
    marketFocus:
      "teams that need technical credibility and clearer paths from awareness to qualified demand",
    deliverablePriority:
      "expert-led messaging, refined conversion paths, and disciplined measurement",
    faqAngle:
      "translating expertise into stronger inbound demand",
    nearbyMajor: ["new-york-city", "chicago"],
  },
  houston: {
    name: "Houston",
    opening:
      "For Houston companies, the strongest use case is performance-focused marketing for high-volume service demand.",
    marketFocus:
      "medical, legal, home-service, and regional operators that need efficient lead flow",
    deliverablePriority:
      "acquisition efficiency, funnel clarity, and scalable campaign operations",
    faqAngle:
      "improving lead quality while managing larger volume",
    nearbyMajor: ["dallas", "austin"],
  },
  phoenix: {
    name: "Phoenix",
    opening:
      "For Phoenix companies, the strongest use case is disciplined growth execution across expanding local and regional markets.",
    marketFocus:
      "service businesses, growth-stage operators, and teams that need predictable pipeline generation",
    deliverablePriority:
      "tight campaign controls, clear conversion logic, and consistent optimization loops",
    faqAngle:
      "driving predictable growth through repeatable systems",
    nearbyMajor: ["los-angeles", "denver"],
  },
};

export const SERVICES = {
  "social-media-management": {
    name: "Social Media Management",
    agencyTitle: "Social Media Management Agency",
    outcome:
      "social media systems that turn content into attention, trust, qualified demand, and measurable growth",
    heroPromise:
      "Build a consistent multi-platform publishing system that compounds brand visibility and business demand.",
    whoFor:
      "For teams that want reliable growth without relying on random posting.",
    whatWeDo: [
      "USATII plans, produces, publishes, and optimizes social content across your priority channels with a clear growth strategy.",
      "We align every post and campaign to positioning, audience intent, and measurable business objectives so social media becomes a revenue-supporting system.",
    ],
    deliverables: [
      "Channel strategy and cadence planning",
      "Monthly content calendars and publishing management",
      "Creative direction and short-form asset planning",
      "Performance reporting with growth recommendations",
    ],
    process: [
      {
        title: "Audit and positioning",
        body: "We review your current footprint, competitors, and offer positioning to define the right platform strategy.",
      },
      {
        title: "System design",
        body: "We build a repeatable posting engine with clear themes, hooks, and conversion-focused content tracks.",
      },
      {
        title: "Execution",
        body: "Our team handles publishing operations, quality control, and continuous optimization.",
      },
      {
        title: "Optimization",
        body: "We use performance signals to improve messaging, formats, and cadence month over month.",
      },
    ],
    bestFor: [
      "Founder-led brands building market authority",
      "Service companies that need consistent inbound demand",
      "Growth teams that need social execution without hiring in-house",
    ],
    whyUs: [
      "Strategy and execution live in one operating system",
      "Creative direction tied to measurable performance",
      "Clear monthly priorities and transparent reporting",
    ],
    faqs: [
      {
        q: "How fast can social media management improve results?",
        a: "Most clients see clearer engagement and better lead quality in the first 30 to 60 days, with stronger compounding impact as the content system matures.",
      },
      {
        q: "Do you handle planning and publishing?",
        a: "Yes. We run planning, copy, posting operations, and optimization workflows so your internal team is not stuck managing daily execution.",
      },
      {
        q: "Can this work for B2B and local services?",
        a: "Yes. We tailor format, narrative, and cadence to each business model, including B2B pipelines and local service demand generation.",
      },
    ],
    relatedServices: [
      "short-form-content-creation",
      "organic-social-media-marketing",
      "paid-social-advertising",
      "website-design",
    ],
  },
  "organic-social-media-marketing": {
    name: "Organic Social Media Marketing",
    agencyTitle: "Organic Social Media Marketing Agency",
    outcome:
      "organic social growth systems that compound reach, trust, and inbound demand without dependency on paid spend",
    heroPromise:
      "Build an organic growth engine that consistently earns attention and trust from the right audience.",
    whoFor:
      "For teams that want durable brand growth through content, community, and positioning.",
    whatWeDo: [
      "USATII designs organic social strategies that prioritize clarity, consistency, and authority across platforms.",
      "We focus on sustainable demand generation by aligning content themes to your buyer journey and brand narrative.",
    ],
    deliverables: [
      "Organic growth strategy and audience roadmap",
      "Editorial pillars and topic system design",
      "Community-first publishing and engagement workflows",
      "Monthly analytics reviews and iteration plans",
    ],
    process: [
      {
        title: "Market and audience mapping",
        body: "We identify where your audience spends time and which narratives create trust fastest.",
      },
      {
        title: "Editorial system build",
        body: "We translate strategy into repeatable themes, creative frameworks, and publishing rhythms.",
      },
      {
        title: "Consistent execution",
        body: "We manage content operations and maintain brand consistency across channels.",
      },
      {
        title: "Compounding optimization",
        body: "We improve results over time through pattern analysis and message refinement.",
      },
    ],
    bestFor: [
      "Brands building long-term digital authority",
      "Companies with complex offers that need educational content",
      "Teams reducing reliance on paid-only acquisition",
    ],
    whyUs: [
      "Organic strategy rooted in commercial outcomes",
      "Editorial systems built for consistency",
      "Measurement that ties social performance to demand",
    ],
    faqs: [
      {
        q: "Is organic social still worth investing in?",
        a: "Yes. Organic content builds long-term authority and lowers acquisition risk by creating demand you can compound over time.",
      },
      {
        q: "How is this different from basic posting?",
        a: "We do not post randomly. We run a structured growth system with clear narratives, conversion goals, and optimization cycles.",
      },
      {
        q: "Can organic and paid work together?",
        a: "Yes. Strong organic positioning usually improves paid performance by increasing message trust and landing page relevance.",
      },
    ],
    relatedServices: [
      "social-media-management",
      "short-form-content-creation",
      "paid-social-advertising",
      "website-design",
    ],
  },
  "short-form-content-creation": {
    name: "Short-Form Content Creation",
    agencyTitle: "Short-Form Content Creation Agency",
    outcome:
      "short-form content systems that capture attention quickly and convert it into qualified opportunities",
    heroPromise:
      "Turn raw ideas into a short-form content engine that drives reach, trust, and demand.",
    whoFor:
      "For teams that need consistent short-form execution across Instagram, TikTok, YouTube Shorts, and LinkedIn clips.",
    whatWeDo: [
      "USATII creates short-form content systems with strong hooks, clean storytelling, and conversion-focused calls to action.",
      "We map every content track to audience intent so each asset supports brand authority and commercial goals.",
    ],
    deliverables: [
      "Hook library and narrative framework",
      "Editing workflows for platform-native short-form",
      "Publishing plans by channel and format",
      "Performance reviews with creative iteration",
    ],
    process: [
      {
        title: "Story architecture",
        body: "We define repeatable formats and message angles that fit your audience and offer.",
      },
      {
        title: "Production workflow",
        body: "We build a reliable editing and approval process that supports consistent volume.",
      },
      {
        title: "Distribution",
        body: "We sequence publishing around platform behavior and campaign priorities.",
      },
      {
        title: "Creative refinement",
        body: "We iterate based on watch time, engagement quality, and conversion signals.",
      },
    ],
    bestFor: [
      "Personal brands and founder-led companies",
      "Teams launching new offers or categories",
      "Businesses that need more top-of-funnel demand",
    ],
    whyUs: [
      "Creative systems built for speed and quality",
      "Short-form strategy tied to business outcomes",
      "A repeatable workflow your team can scale",
    ],
    faqs: [
      {
        q: "How many short-form videos do we need per month?",
        a: "Volume depends on your goals, but consistency matters most. We usually start with a sustainable weekly cadence and expand as results stabilize.",
      },
      {
        q: "Do you help with scripting and hooks?",
        a: "Yes. We build hook frameworks and narrative structures so your team is never starting from a blank page.",
      },
      {
        q: "Can short-form support lead generation?",
        a: "Yes. With the right message sequencing and calls to action, short-form can feed both audience growth and qualified demand.",
      },
    ],
    relatedServices: [
      "social-media-management",
      "organic-social-media-marketing",
      "paid-social-advertising",
      "landing-page-design",
    ],
  },
  "website-design": {
    name: "Website Design",
    agencyTitle: "Website Design Agency",
    outcome:
      "high-converting websites that clarify positioning and move qualified visitors to action",
    heroPromise:
      "Design a website that looks credible, communicates value clearly, and converts the right traffic.",
    whoFor:
      "For teams that need a stronger digital presence and a clearer conversion journey.",
    whatWeDo: [
      "USATII designs websites around positioning, user intent, and conversion architecture.",
      "We build each page to support trust, clarity, and measurable next steps for your ideal buyer.",
    ],
    deliverables: [
      "Information architecture and messaging wireframes",
      "UI design system and responsive page design",
      "Conversion path optimization across key pages",
      "Launch support and post-launch refinement plan",
    ],
    process: [
      {
        title: "Positioning and structure",
        body: "We define your core narrative and translate it into a clear page architecture.",
      },
      {
        title: "Experience design",
        body: "We design desktop and mobile experiences that feel premium and intuitive.",
      },
      {
        title: "Conversion optimization",
        body: "We place offers, proof, and calls to action where buyer intent is strongest.",
      },
      {
        title: "Launch and iterate",
        body: "We monitor behavior after launch and refine for better conversion quality.",
      },
    ],
    bestFor: [
      "Businesses repositioning in a competitive market",
      "Companies with outdated websites that no longer convert",
      "Teams launching new offers and service lines",
    ],
    whyUs: [
      "Design decisions tied to revenue goals",
      "Clear messaging before visual polish",
      "Practical launch process with measurable benchmarks",
    ],
    faqs: [
      {
        q: "How long does a website design project take?",
        a: "Most projects run 4 to 10 weeks depending on scope, revision cycles, and page count.",
      },
      {
        q: "Do you redesign existing websites?",
        a: "Yes. We can redesign your current site or create a new structure when the existing setup limits growth.",
      },
      {
        q: "Do you optimize for conversions?",
        a: "Yes. Conversion architecture is built into our process through messaging hierarchy, layout decisions, and CTA placement.",
      },
    ],
    relatedServices: [
      "landing-page-design",
      "marketing-automation",
      "social-media-management",
      "paid-social-advertising",
    ],
  },
  "landing-page-design": {
    name: "Landing Page Design",
    agencyTitle: "Landing Page Design Agency",
    outcome:
      "focused landing pages that increase conversion rates for offers, campaigns, and lead capture",
    heroPromise:
      "Create landing pages that align message, offer, and UX to turn paid and organic traffic into pipeline.",
    whoFor:
      "For teams running campaigns that need stronger conversion performance.",
    whatWeDo: [
      "USATII designs campaign-specific landing pages with structured messaging, proof placement, and clear conversion intent.",
      "We remove friction from the user journey so qualified prospects can take action quickly.",
    ],
    deliverables: [
      "Offer-driven landing page strategy",
      "Wireframes and responsive page design",
      "Conversion-focused copy structure",
      "A/B testing roadmap and performance review",
    ],
    process: [
      {
        title: "Offer and audience alignment",
        body: "We align page messaging to ad intent, audience stage, and conversion objective.",
      },
      {
        title: "Page architecture",
        body: "We design high-clarity sections that guide visitors from problem awareness to action.",
      },
      {
        title: "Launch and tracking",
        body: "We deploy with the right event and funnel tracking so conversion quality is measurable.",
      },
      {
        title: "Testing and iteration",
        body: "We run structured optimization loops to improve conversion rate over time.",
      },
    ],
    bestFor: [
      "Paid campaign teams that need better ROAS",
      "Agencies and consultants launching offers",
      "Businesses with traffic but low conversion rates",
    ],
    whyUs: [
      "Design and messaging built around conversion psychology",
      "Tight alignment between ad promise and page narrative",
      "A clear optimization roadmap after launch",
    ],
    faqs: [
      {
        q: "What makes a landing page convert better?",
        a: "Message-offer match, clear proof, and low-friction form flow usually drive the biggest gains.",
      },
      {
        q: "Can you build pages for multiple audiences?",
        a: "Yes. We can create segmented landing page variants by audience, industry, or campaign objective.",
      },
      {
        q: "Do you support testing after launch?",
        a: "Yes. We provide a testing plan and iterate based on conversion data and lead quality.",
      },
    ],
    relatedServices: [
      "website-design",
      "marketing-automation",
      "paid-social-advertising",
      "short-form-content-creation",
    ],
  },
  "marketing-automation": {
    name: "Marketing Automation",
    agencyTitle: "Marketing Automation Agency",
    outcome:
      "marketing automation systems that improve follow-through, accelerate lead response, and scale qualified pipeline",
    heroPromise:
      "Automate the right marketing and sales steps so your pipeline grows without manual chaos.",
    whoFor:
      "For teams that need reliable lead handling, nurture flows, and better operational consistency.",
    whatWeDo: [
      "USATII designs and implements automation systems for lead capture, routing, follow-up, and campaign nurturing.",
      "We connect your stack so every qualified lead receives timely, relevant communication.",
    ],
    deliverables: [
      "Automation architecture and workflow mapping",
      "CRM and funnel event integration planning",
      "Email and nurture sequence implementation",
      "Performance dashboards and optimization cadence",
    ],
    process: [
      {
        title: "System audit",
        body: "We map your current lead flow, handoff points, and operational bottlenecks.",
      },
      {
        title: "Workflow design",
        body: "We design trigger-based automations tied to funnel stage and buyer intent.",
      },
      {
        title: "Implementation",
        body: "We configure integrations, QA every flow, and launch with clear ownership.",
      },
      {
        title: "Performance tuning",
        body: "We optimize touchpoints based on response speed, conversion rate, and sales feedback.",
      },
    ],
    bestFor: [
      "Sales teams losing leads due to slow follow-up",
      "Businesses scaling volume without extra headcount",
      "Teams needing better visibility across funnel stages",
    ],
    whyUs: [
      "Automation built around practical operations",
      "Clear alignment between marketing and sales workflows",
      "Systems that are easy to maintain after launch",
    ],
    faqs: [
      {
        q: "Will automation replace our team?",
        a: "No. Automation supports your team by removing repetitive steps and improving consistency where timing matters most.",
      },
      {
        q: "What tools do you work with?",
        a: "We work across common CRM, email, and ad platforms and map implementation to your current stack whenever possible.",
      },
      {
        q: "How do you measure automation success?",
        a: "We track response speed, lead-to-opportunity progression, and closed-revenue contribution from automated flows.",
      },
    ],
    relatedServices: [
      "landing-page-design",
      "paid-social-advertising",
      "website-design",
      "social-media-management",
    ],
  },
  "paid-social-advertising": {
    name: "Paid Social Advertising",
    agencyTitle: "Paid Social Advertising Agency",
    outcome:
      "paid social campaigns that turn ad spend into qualified pipeline and predictable revenue growth",
    heroPromise:
      "Launch and scale paid social campaigns with better targeting, stronger creative, and tighter conversion tracking.",
    whoFor:
      "For teams that need paid growth with clearer economics and better lead quality.",
    whatWeDo: [
      "USATII manages paid social strategy, creative testing, audience design, and funnel optimization.",
      "We align campaign execution with landing page flow and sales feedback so performance compounds.",
    ],
    deliverables: [
      "Paid social strategy and account architecture",
      "Audience design and budget allocation framework",
      "Creative testing roadmap and iteration cycles",
      "Attribution reporting and scaling recommendations",
    ],
    process: [
      {
        title: "Offer and funnel alignment",
        body: "We match campaign strategy to your offer, funnel stage, and revenue targets.",
      },
      {
        title: "Launch architecture",
        body: "We structure campaigns and audiences to learn quickly and reduce waste.",
      },
      {
        title: "Creative and audience testing",
        body: "We test variables methodically to improve CTR, CPL, and conversion quality.",
      },
      {
        title: "Scale with controls",
        body: "We scale proven campaigns with clear guardrails for budget and performance.",
      },
    ],
    bestFor: [
      "Growth-stage businesses with clear offers",
      "Teams that need predictable lead flow from paid channels",
      "Brands expanding into new markets or audience segments",
    ],
    whyUs: [
      "Campaign systems focused on qualified demand, not vanity metrics",
      "Tight feedback loop between creative, funnel, and sales outcomes",
      "Structured testing and transparent reporting",
    ],
    faqs: [
      {
        q: "How soon can paid social produce leads?",
        a: "Campaigns can generate early signal quickly, but stable cost efficiency usually improves over the first 4 to 8 weeks of testing.",
      },
      {
        q: "Do you handle creative strategy too?",
        a: "Yes. We pair media buying with creative testing so performance is driven by both targeting and message quality.",
      },
      {
        q: "Can you improve lead quality, not just volume?",
        a: "Yes. We optimize offers, audience filters, and conversion paths to improve the quality of every lead.",
      },
    ],
    relatedServices: [
      "landing-page-design",
      "short-form-content-creation",
      "marketing-automation",
      "social-media-management",
    ],
  },
};

export function getServiceBySlug(serviceSlug) {
  return SERVICES[serviceSlug] ?? null;
}

export function getLocationBySlug(locationSlug) {
  return LOCATIONS[locationSlug] ?? null;
}

export function getServiceSlugs() {
  return SERVICE_SLUGS;
}

export function getRolloutLocationsByService(serviceSlug) {
  return SERVICE_LOCATION_ROLLOUT[serviceSlug] ?? [];
}

export function isApprovedServiceLocation(serviceSlug, locationSlug) {
  return getRolloutLocationsByService(serviceSlug).includes(locationSlug);
}

export function buildServicePath(serviceSlug) {
  return `/services/${serviceSlug}`;
}

export function buildServiceLocationPath(serviceSlug, locationSlug) {
  return `/services/${serviceSlug}/${locationSlug}`;
}

export function getApprovedServiceLocationPairs() {
  return Object.entries(SERVICE_LOCATION_ROLLOUT).flatMap(
    ([serviceSlug, locationSlugs]) =>
      locationSlugs.map((locationSlug) => ({ serviceSlug, locationSlug })),
  );
}

export function getServiceMetaDescription(service) {
  return `USATII helps businesses build ${service.outcome} through content, systems, analytics, and marketing execution.`;
}

export function getServiceLocationMetaDescription(service, location) {
  return `USATII helps ${location.name} businesses build ${service.outcome} through content, systems, analytics, and marketing execution.`;
}

export function pickRelatedServiceLocationLinks(serviceSlug, locationSlug) {
  const service = getServiceBySlug(serviceSlug);
  if (!service) return [];

  return service.relatedServices
    .filter((relatedServiceSlug) =>
      isApprovedServiceLocation(relatedServiceSlug, locationSlug),
    )
    .map((relatedServiceSlug) => ({
      serviceSlug: relatedServiceSlug,
      locationSlug,
      href: buildServiceLocationPath(relatedServiceSlug, locationSlug),
      label: `${SERVICES[relatedServiceSlug].name} in ${
        LOCATIONS[locationSlug].name
      }`,
    }));
}

export function pickNearbyServiceLocationLinks(serviceSlug, locationSlug) {
  const location = getLocationBySlug(locationSlug);
  if (!location) return [];

  const existingLocations = getRolloutLocationsByService(serviceSlug);
  return location.nearbyMajor
    .filter((nearbySlug) => existingLocations.includes(nearbySlug))
    .map((nearbySlug) => ({
      locationSlug: nearbySlug,
      href: buildServiceLocationPath(serviceSlug, nearbySlug),
      label: `${SERVICES[serviceSlug].name} in ${LOCATIONS[nearbySlug].name}`,
    }));
}

export function getApprovedSitemapRoutes() {
  const routes = ["/", "/services", "/advertising"];

  for (const serviceSlug of SERVICE_SLUGS) {
    routes.push(buildServicePath(serviceSlug));
  }

  for (const { serviceSlug, locationSlug } of getApprovedServiceLocationPairs()) {
    routes.push(buildServiceLocationPath(serviceSlug, locationSlug));
  }

  return routes;
}

export function buildCitySpecificServiceNarrative(service, location) {
  return `${location.opening} In ${location.name}, USATII structures ${service.name.toLowerCase()} for ${location.marketFocus}.`;
}

export function buildLocationDeliverables(service, location) {
  return [
    `${service.deliverables[0]} adapted for ${location.name} market conditions`,
    `${service.deliverables[1]} designed for ${location.deliverablePriority}`,
    `${service.deliverables[2]} with execution calibrated to ${location.marketFocus}`,
    `${service.deliverables[3]} focused on ${location.faqAngle}`,
  ];
}

export function buildLocationFaqs(service, location) {
  return [
    {
      q: `How is ${service.name.toLowerCase()} different in ${location.name}?`,
      a: `We adjust strategy around ${location.faqAngle}, then align execution to ${location.marketFocus}. This keeps the system relevant to how buyers in ${location.name} evaluate providers.`,
    },
    {
      q: `Can USATII support teams that serve multiple areas from ${location.name}?`,
      a: `Yes. We often build a ${service.name.toLowerCase()} system that starts in ${location.name} and then scales into nearby markets with localized messaging and campaign controls.`,
    },
    {
      q: `What does the first month usually focus on?`,
      a: `The first month focuses on baseline strategy, fast operational setup, and initial execution so we can collect signal and optimize around qualified demand.`,
    },
  ];
}

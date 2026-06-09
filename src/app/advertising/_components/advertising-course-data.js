export const ADVERTISING_PATH = "/advertising";
export const COURSE_TITLE = "Advertising 101: How Online Marketing Turns Attention Into Leads";
export const COURSE_SUBTITLE =
  "A simple guide to Google Ads, Meta Ads, organic content, SEO, and the basic words you'll hear when we work together.";
export const COURSE_DURATION = "6-8 min";
export const REFERRAL_LINK_PATH = "/referral?source=advertising-course";
export const REFERRAL_REWARD_CODE = "USATII-REF-500X";
export const KICKOFF_CALL_URL = "https://cal.com/usatii/onboarding";

export const RELATED_LINKS = [
  { label: "Paid social advertising", href: "/services/paid-social-advertising" },
  { label: "Organic social service", href: "/services/organic-social-media-marketing" },
  { label: "Website design", href: "/services/website-design" },
  { label: "Quote request", href: "/quote-request" },
  { label: "Contact USATII", href: "/quote-request" },
];

export const GLOSSARY = {
  impression: {
    label: "Impression",
    definition: "One ad view on someone's screen.",
    example: "Your ad appeared 1,000 times, even if some people saw it more than once.",
  },
  reach: {
    label: "Reach",
    definition: "How many unique people saw the ad.",
    example: "1,000 impressions may come from 800 people.",
  },
  cpm: {
    label: "CPM",
    definition: "Cost per 1,000 impressions.",
    example: "$20 CPM means about $20 to buy 1,000 ad views.",
  },
  cpc: {
    label: "CPC",
    definition: "Cost per click.",
    example: "$100 spend divided by 50 clicks equals a $2 CPC.",
  },
  ctr: {
    label: "CTR",
    definition: "Click-through rate, or the percent of viewers who clicked.",
    example: "100 clicks from 10,000 impressions is a 1% CTR.",
  },
  cpa: {
    label: "CPA",
    definition: "Cost per acquisition or action, such as a lead or sale.",
    example: "$500 spend divided by 10 leads equals a $50 CPA.",
  },
  conversion: {
    label: "Conversion",
    definition: "A valuable business action after someone sees or clicks an ad.",
    example: "A call, form fill, booking, purchase, or quote request.",
  },
  campaign: {
    label: "Campaign",
    definition: "The main container for ads that share one goal and budget logic.",
    example: "A campaign named 'Orlando Roof Repair Leads'.",
  },
  adSet: {
    label: "Ad set / ad group",
    definition: "A smaller unit inside a campaign used to group audiences or keywords.",
    example: "One ad group for roof repair and one for roof replacement.",
  },
  bid: {
    label: "Bid",
    definition: "What the platform is allowed to pay to compete for a result.",
    example: "The system competes for clicks or leads inside your bid strategy.",
  },
  budget: {
    label: "Budget",
    definition: "Your spending limit over a day, month, or campaign period.",
    example: "$50 per day or $1,500 per month.",
  },
  keyword: {
    label: "Keyword",
    definition: "A search phrase you want ads to appear for.",
    example: "'Emergency plumber near me'.",
  },
  landingPage: {
    label: "Landing page",
    definition: "The page someone lands on after clicking an ad.",
    example: "A dedicated service page for roof repair in Orlando.",
  },
  pixel: {
    label: "Pixel",
    definition: "Tracking code that records website behavior for measurement and optimization.",
    example: "The Meta Pixel can record form submissions or page visits.",
  },
  retargeting: {
    label: "Retargeting",
    definition: "Showing ads again to people who already interacted with your brand.",
    example: "A site visitor later sees your offer on Instagram.",
  },
  seo: {
    label: "SEO",
    definition: "Helping search engines understand your pages so people can find them through search.",
    example: "Useful service pages, good titles, clean links, and helpful content.",
  },
  sitemap: {
    label: "Sitemap",
    definition: "A file that lists important pages so search engines can crawl them more efficiently.",
    example: "A sitemap helps Google discover key service URLs.",
  },
  roas: {
    label: "ROAS",
    definition: "Return on ad spend.",
    example: "$5,000 revenue from $1,000 in ad spend is 5x ROAS.",
  },
};

export const COURSE_FAQS = [
  {
    q: "Why does USATII often start with Google Search Ads for new clients?",
    a: "Search Ads usually come first when people are already searching for the service because that demand is active now. It is often the cleanest first paid channel for local and service businesses.",
  },
  {
    q: "Why do website setup, tracking, SEO, and sitemaps matter before ad spend?",
    a: "Ads only create attention. The site, landing pages, tracking, Search Console setup, metadata, and sitemap help convert traffic into leads and make the pages easier for search engines to understand and crawl.",
  },
  {
    q: "What does Google Ads help a business do?",
    a: "Google Ads helps a business pay to appear in front of people who are already searching or browsing in ways that match the offer. For most USATII clients, Search Ads matter first because the intent is active now.",
  },
  {
    q: "Why should organic social run alongside paid ads?",
    a: "Organic social builds trust, proof, and brand memory over time. It also creates content assets that can support paid ads, landing pages, and sales follow-up.",
  },
  {
    q: "What basic metrics should a client understand before a kickoff call?",
    a: "At a minimum: budget, CPC, CPA, CTR, conversion, and the difference between management work, creative work, website work, and actual ad spend on invoices.",
  },
];

export const COMPLETION_NOTES = [
  "Kickoff calls usually lock the offer, target actions, landing pages, tracking, creative inputs, and launch order.",
  "Invoices usually separate platform ad spend from setup, management, creative, and website work so budget conversations stay clear.",
  "Reporting should point back to calls, forms, bookings, and real lead quality, not just traffic volume.",
];

export const REWARD_TERMS =
  "Refer a business that becomes a paying USATII client and receive $500 off your next invoice after their first paid invoice is completed.";

export const LESSONS = [
  {
    id: "what-is-advertising",
    title: "What is advertising?",
    progress: 10,
    diagram: "roads",
    terms: ["conversion", "budget", "campaign"],
    body: [
      "Advertising is paying to place your business in front of people. The job is not views for their own sake. The job is qualified action: a booked call, form fill, quote request, purchase, or real conversation.",
      "USATII usually uses three lanes together. Google Ads captures people already searching. Meta Ads gets in front of people while they scroll. Organic social helps people trust you before and after discovery. Good advertising puts the right offer in front of the right person at the right moment.",
    ],
    example:
      "A roofer can capture 'roof repair near me' on Google, show before and after clips on Instagram, and keep posting project updates organically.",
    checkpoint: {
      question: "What is the main goal of advertising?",
      options: [
        "Getting qualified people to take a useful action",
        "Getting as many views as possible",
        "Posting on every platform at once",
      ],
      correct: 0,
    },
    interaction: {
      type: "lane-reveal",
      prompt: "",
      items: [
        {
          id: "searching",
          label: "Searching",
          reveal: "Google Ads reaches people who already typed the need into search.",
        },
        {
          id: "scrolling",
          label: "Scrolling",
          reveal: "Meta Ads interrupts feeds with offers, visuals, and proof.",
        },
        {
          id: "following",
          label: "Following",
          reveal: "Organic social builds familiarity through repeated content over time.",
        },
      ],
    },
  },
  {
    id: "what-google-ads-does",
    title: "What Google Ads actually does",
    progress: 20,
    diagram: "machines",
    terms: ["campaign", "budget", "keyword"],
    body: [
      "Google Ads is the system a business uses to pay for visibility on Google. In practice, that usually means choosing a goal, setting a budget, picking keywords or audiences, writing ads, and sending clicks to the right landing page.",
      "For most USATII clients, the most important part is Google Search Ads. When someone searches for a service you offer, Google Ads can place your business in that moment of intent. That is why it often becomes the first paid channel we launch.",
    ],
    example:
      "A plumbing company can build a Search campaign around keywords like 'emergency plumber near me', set a daily budget, and send the click to a service page that asks for a call or quote request.",
    checkpoint: {
      question: "What is Google Ads mainly used for?",
      options: [
        "Paying to appear in front of qualified searchers and clicks",
        "Publishing unpaid social content",
        "Monetizing a blog with display placements",
      ],
      correct: 0,
    },
    interaction: {
      type: "bucket-sort",
      prompt: "Sort each item into setup or result.",
      buckets: [
        { id: "setup", label: "Setup" },
        { id: "result", label: "Result" },
      ],
      items: [
        { id: "keywords", label: "Keyword list", correctBucket: "setup" },
        { id: "budget", label: "Daily budget", correctBucket: "setup" },
        { id: "phone-call", label: "Phone call from a lead", correctBucket: "result" },
        { id: "form-fill", label: "Form submission", correctBucket: "result" },
      ],
    },
  },
  {
    id: "three-traffic-lanes",
    title: "The three traffic lanes",
    progress: 30,
    diagram: "lanes",
    terms: ["campaign", "conversion", "reach"],
    body: [
      "Think of digital marketing as three traffic lanes. Search captures existing demand. Meta creates or awakens demand with visual creative. Organic social builds trust before and after the click.",
      "A contractor, dentist, CPA, restaurant, or med spa can use the same system with different examples. The mix changes by business type, budget, and timing, but the logic stays the same: catch high-intent searches, build familiarity on social, and give people proof when they land on the site.",
    ],
    example: "The same channel map works differently for a contractor than for a restaurant, but the funnel logic is the same.",
    checkpoint: {
      question: "Which channel is best for people already searching today?",
      options: ["Google Search Ads", "Organic social", "Meta Ads only"],
      correct: 0,
    },
    interaction: {
      type: "business-selector",
      prompt: "Pick a business type to swap in real examples.",
      businesses: [
        {
          id: "contractor",
          label: "Contractor",
          search: "Search: 'bathroom remodel Orlando' or 'roof repair near me'.",
          meta: "Meta: before and after videos, financing offers, local proof.",
          organic: "Organic: jobsite clips, FAQs, timelines, pricing explainers.",
        },
        {
          id: "dentist",
          label: "Dentist",
          search: "Search: 'family dentist near me' or 'teeth whitening Rochester'.",
          meta: "Meta: smile transformations, office vibe, new patient offers.",
          organic: "Organic: insurance FAQs, procedure walk-throughs, staff introductions.",
        },
        {
          id: "cpa",
          label: "CPA",
          search: "Search: 'small business tax CPA' or 'bookkeeping near me'.",
          meta: "Meta: deadline reminders, founder credibility, tax myths.",
          organic: "Organic: filing tips, business deductions, client education clips.",
        },
        {
          id: "restaurant",
          label: "Restaurant",
          search: "Search: 'best brunch near me' or branded local searches.",
          meta: "Meta: menu visuals, events, short chef videos, offers.",
          organic: "Organic: daily specials, behind the scenes, community posts.",
        },
        {
          id: "med-spa",
          label: "Med spa",
          search: "Search: 'Botox near me' or 'laser hair removal price'.",
          meta: "Meta: treatment demos, before and after, package offers.",
          organic: "Organic: consult prep, aftercare tips, clinician trust content.",
        },
      ],
    },
  },
  {
    id: "why-search-first",
    title: "Why Google Search Ads usually come first",
    progress: 40,
    diagram: "search",
    terms: ["keyword", "campaign", "budget"],
    body: [
      "When people are already searching for the service, Google Search Ads are usually the cleanest first paid channel. You are not trying to convince someone they have a problem. They already typed it.",
      "Someone searching 'AC repair near me' or 'family dentist near me' has immediate intent. Someone scrolling Instagram may be a fit, but they are not always ready right now. That is why USATII often starts Search first for local and service businesses, then layers other channels after the foundation is working.",
    ],
    example: "Search captures demand that already exists instead of waiting for a feed user to become interested.",
    checkpoint: {
      question: "Why do Search Ads work well for beginners?",
      options: [
        "Because the customer is already looking",
        "Because they never need a website",
        "Because Meta cannot generate leads",
      ],
      correct: 0,
    },
    interaction: {
      type: "bucket-sort",
      prompt: "Sort each phrase by intent level.",
      buckets: [
        { id: "high-intent", label: "High intent" },
        { id: "low-intent", label: "Lower intent" },
      ],
      items: [
        { id: "roof", label: "Emergency roof repair Orlando", correctBucket: "high-intent" },
        { id: "ideas", label: "Beautiful home ideas", correctBucket: "low-intent" },
        { id: "dentist", label: "Family dentist near me", correctBucket: "high-intent" },
        { id: "funny-video", label: "Funny construction video", correctBucket: "low-intent" },
        { id: "cpa", label: "Best CPA for small business taxes", correctBucket: "high-intent" },
      ],
    },
  },
  {
    id: "how-payments-work",
    title: "How ad payments work",
    progress: 50,
    diagram: "auction",
    terms: ["budget", "bid", "cpm", "cpc", "ctr", "cpa", "impression"],
    body: [
      "Most ad platforms run on auctions, not flat posting fees. You set a budget, choose a goal, and give the system room to compete for clicks, calls, or leads.",
      "Budget is your spending cap. Bid is how the platform competes for the result you want. CPC is cost per click. CPA is cost per lead or sale. CPM is cost per 1,000 impressions. CTR is the percent of people who clicked after seeing the ad. The highest bid does not always win; quality and expected performance matter too.",
    ],
    example: "$100 spend, 50 clicks, and 5 leads means a $2 CPC and a $20 CPA.",
    checkpoint: {
      question: "What is CPA?",
      options: [
        "Cost per acquisition or action, such as a lead or sale",
        "The total amount of website traffic",
        "A fixed platform fee for posting an ad",
      ],
      correct: 0,
    },
    interaction: {
      type: "calculator",
      prompt: "Use the mini calculator to expose the metrics.",
      spend: 100,
      clicks: 50,
      leads: 5,
    },
  },
  {
    id: "website-foundation",
    title: "The website is where ads become leads",
    progress: 60,
    diagram: "funnel",
    terms: ["landingPage", "seo", "sitemap", "conversion"],
    body: [
      "Ads create attention, but the website is where attention becomes leads. If the landing page is vague, slow, missing proof, or hard to contact, paid traffic gets wasted.",
      "Before serious spend, the business needs a clear landing page, service pages, contact flow, phone number, analytics, conversion tracking, Search Console, a sitemap, strong titles and descriptions, and structured data where it helps. Google describes SEO as helping search engines understand your content and helping users find your site. That foundation makes every later channel work better.",
    ],
    example: "A high-intent click is worth less if the page has no phone number, no proof, and no clear next step.",
    checkpoint: {
      question: "What happens if ads send traffic to a weak website?",
      options: [
        "You pay for clicks that may not convert",
        "Google automatically fixes the page",
        "The traffic becomes free over time",
      ],
      correct: 0,
    },
    interaction: {
      type: "hotspots",
      prompt: "Tap the weak spots in the landing page mockup.",
      spots: [
        { id: "phone", label: "No phone number", top: "18%", left: "76%" },
        { id: "service-area", label: "No service area", top: "37%", left: "28%" },
        { id: "proof", label: "No proof", top: "58%", left: "72%" },
        { id: "cta", label: "No CTA", top: "72%", left: "28%" },
        { id: "tracking", label: "No tracking", top: "82%", left: "78%" },
      ],
    },
  },
  {
    id: "tracking",
    title: "Tracking: how we know what worked",
    progress: 70,
    diagram: "tracking",
    terms: ["conversion", "pixel", "cpa"],
    body: [
      "Tracking tells us what happened after the ad view or click. Without tracking, decisions turn into guesswork and budget conversations get noisy.",
      "A conversion can be a phone call, form fill, booked appointment, purchase, quote request, chat, or directions click. Google Ads conversion tracking measures valuable actions after ad interactions. The Meta Pixel helps track website behavior, build audiences, and improve delivery. On kickoff calls, USATII usually defines which actions count first so reporting matches real business value.",
    ],
    example: "If calls matter more than clicks, the campaign should optimize and report around calls.",
    checkpoint: {
      question: "Why does tracking matter?",
      options: [
        "So we can tell which ads produce real business actions",
        "So every ad costs the same amount",
        "So social posts become free ads",
      ],
      correct: 0,
    },
    interaction: {
      type: "conversion-selector",
      prompt: "Choose which actions count as conversions for your business.",
      options: ["Calls", "Forms", "Bookings", "Purchases", "Quote requests"],
    },
  },
  {
    id: "meta-ads",
    title: "Meta Ads: discovery, visuals, and retargeting",
    progress: 80,
    diagram: "feed",
    terms: ["pixel", "retargeting", "bid", "conversion"],
    body: [
      "Meta Ads usually work best as discovery, visual storytelling, offers, and retargeting. People are often not searching in the moment; they discover while scrolling.",
      "That changes the creative standard. Before and after videos, customer stories, educational clips, and founder-led proof usually outperform weak logo-only ads or generic stock imagery. Meta's system does not look only at bid. Delivery is shaped by bid, estimated action rates, and ad quality, so stronger creative and clearer offers improve outcomes.",
    ],
    example: "A contractor may win on Meta with a strong remodel video long before the prospect searches on Google.",
    checkpoint: {
      question: "Meta Ads are usually best for...",
      options: [
        "Discovery, visual storytelling, retargeting, and offers",
        "Only branded searches",
        "Replacing your website entirely",
      ],
      correct: 0,
    },
    interaction: {
      type: "creative-choice",
      prompt: "Pick the strongest creative for a discovery campaign.",
      options: [
        {
          id: "logo",
          label: "Plain logo",
          detail: "Brand visible, but little proof or reason to stop the scroll.",
          strong: false,
        },
        {
          id: "before-after",
          label: "Before and after video",
          detail: "Shows transformation, proof, and a reason to pay attention.",
          strong: true,
        },
        {
          id: "stock-photo",
          label: "Vague stock photo",
          detail: "Looks generic and does not communicate the real offer.",
          strong: false,
        },
      ],
    },
  },
  {
    id: "organic-social",
    title: "Organic social: the trust engine",
    progress: 88,
    diagram: "flywheel",
    terms: ["reach", "conversion", "campaign"],
    body: [
      "Organic social is slower than paid traffic, but it compounds. Each useful post adds trust, memory, and proof that the business is active and real.",
      "For most USATII clients, organic posting should start early and keep running in the background while paid ads generate faster demand. Good content answers practical questions: what you do, how pricing works, what mistakes to avoid, what projects look like, and what past clients say. Those assets also become fuel for retargeting ads, landing pages, sales follow-up, and kickoff discussions.",
    ],
    example: "A contractor can post FAQs, jobsite clips, client wins, and price explainers while Search Ads handle high-intent demand.",
    checkpoint: {
      question: "What is the main job of organic social?",
      options: [
        "Build trust and familiarity over time",
        "Replace every paid campaign",
        "Make tracking unnecessary",
      ],
      correct: 0,
    },
    interaction: {
      type: "weekly-plan",
      prompt: "Build a simple weekly plan by choosing 4 content types.",
      minSelections: 4,
      options: [
        "Before and after",
        "FAQ",
        "Behind the scenes",
        "Customer proof",
        "Founder talking video",
        "Educational tip",
        "Offer post",
        "Local community post",
      ],
    },
  },
  {
    id: "timeline",
    title: "The simple 90-day marketing timeline",
    progress: 96,
    diagram: "timeline",
    terms: ["budget", "conversion", "seo", "sitemap", "landingPage"],
    body: [
      "A practical first 90 days usually look like this: week 1 fixes the foundation, collects access, and aligns the offer. That is where kickoff calls usually focus: goals, conversions, landing pages, tracking, creative, and who owns what.",
      "Weeks 2 and 3 launch high-intent Google Search Ads. Meta usually comes next once the site and tracking are stable, with retargeting added when traffic exists. Organic social runs throughout. Invoices usually separate service work from ad spend so budgets stay clear: setup, management, creative, website work, and platform media do not all mean the same thing.",
    ],
    example: "The launch order is usually foundation first, Search next, Meta after signal exists, and organic running the entire time.",
    checkpoint: {
      question: "What should run the whole time?",
      options: [
        "Organic social and website improvement",
        "Only Search Ads",
        "Only invoicing and reporting",
      ],
      correct: 0,
    },
    interaction: {
      type: "timeline-placement",
      prompt: "Place each tile into the right phase of the first 90 days.",
      slots: [
        { id: "foundation", label: "Days 1-7", detail: "Foundation and kickoff" },
        { id: "search", label: "Days 7-21", detail: "Google Search Ads" },
        { id: "meta", label: "Days 14-30", detail: "Meta Ads and retargeting" },
        { id: "always", label: "Days 1-90", detail: "Always running" },
        { id: "improve", label: "Days 30-90", detail: "Improve and expand" },
      ],
      items: [
        { id: "foundation-tile", label: "Website foundation", correctSlot: "foundation" },
        { id: "search-tile", label: "Google Search Ads", correctSlot: "search" },
        { id: "meta-tile", label: "Meta Ads", correctSlot: "meta" },
        { id: "organic-tile", label: "Organic Social", correctSlot: "always" },
        { id: "seo-tile", label: "SEO expansion", correctSlot: "improve" },
        { id: "reporting-tile", label: "Reporting and optimization", correctSlot: "improve" },
      ],
    },
  },
];

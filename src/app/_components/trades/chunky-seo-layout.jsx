import { Children } from "react";
import Image from "next/image";
import Link from "next/link";
import GoogleReviewGrid from "@/app/_components/google-review-grid";
import Header from "@/app/_components/header";
import Footer from "@/app/_components/footer";
import {
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  Clock3,
  HandCoins,
  MapPin,
  MapPinned,
  Phone,
  ShoppingBag,
} from "lucide-react";

const FOOTER_PHONE = "(585) 441-0972";
const SEO_PLACEHOLDER_IMAGE = "/recent-work/usatii-workstation.png";
const ROCHESTER_MAP_EMBED_URL = "https://www.google.com/maps?q=Rochester,NY&z=11&output=embed";
const ROCHESTER_MAP_LINK = "https://www.google.com/maps/place/Rochester,+NY/";

const FALLBACK_POINTS = [
  "Workflow-aligned system design",
  "Ownership and operational clarity",
  "Faster internal handoffs",
  "Higher conversion follow-through",
];

const FOOTER_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Software", href: "/software" },
  { label: "Industries", href: "/industries" },
  { label: "Locations", href: "/locations" },
  { label: "About Us", href: "/about" },
];

const RECENT_WEBSITE_WORK = [
  {
    title: "Rebuildit Inc.",
    description: "Construction marketing website and local conversion architecture for Sacramento service traffic.",
    href: "https://www.rebuilditinc.com/",
    image: "/recent-work/rebuilditinc-home.png",
  },
  {
    title: "Orlando Town Construction",
    description: "General contractor website designed for service-area visibility and direct lead capture.",
    href: "https://www.orlandotownconstruction.com/",
    image: "/recent-work/orlandotownconstruction-home.png",
  },
  {
    title: "BISHOP 3DO",
    description: "High-contrast product landing experience for D2C positioning and product education.",
    href: "https://bishop3do.com/",
    image: "/recent-work/bishop3do-home.png",
  },
  {
    title: "Resolution Marketing",
    description: "Brand-led landing page design with campaign-forward messaging and social growth CTA focus.",
    href: "https://www.resolutionmarketing.org/",
    image: "/recent-work/resolutionmarketing-home.png",
  },
];

function SectionBadge() {
  return (
    <div className="mx-auto flex items-center justify-center gap-4 text-[#6d4dff]">
      <span className="h-px w-14 bg-[#c3b4ff]" />
      <MapPinned className="h-5 w-5" />
      <span className="h-px w-14 bg-[#c3b4ff]" />
    </div>
  );
}

function SlantedButton({ href, label, primary = true, full = false }) {
  const isExternal = href.startsWith("http");

  return (
    <Link
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noreferrer" : undefined}
      className={[
        "inline-flex h-11 items-center justify-center rounded-mdx px-5 text-sm font-semibold shadow-soft transition",
        full ? "w-full" : "",
        primary
          ? "bg-accent text-white hover:bg-accent-hover"
          : "border border-control-border bg-paper text-ink hover:bg-surface",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}

function CtaButton({ href, label, primary = false }) {
  return <SlantedButton href={href} label={label} primary={primary} />;
}

function HeroMediaPlaceholder() {
  return (
    <div className="absolute inset-0 overflow-hidden border-y border-[#3a4263]">
      <Image
        src={SEO_PLACEHOLDER_IMAGE}
        alt="USATII workstation visual"
        fill
        className="object-cover object-center"
      />
      <div className="mx-auto h-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative h-full border-x border-dashed border-[#555f85]/70" />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[#141b31]/62" />
      <div className="pointer-events-none absolute left-0 top-0 h-full w-full bg-[radial-gradient(circle,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:30px_30px] opacity-30" />
    </div>
  );
}

function SidebarContactCard({ cta }) {
  return (
    <article className="border border-surface bg-paper p-5 text-ink shadow-soft">
      <p className="text-sm font-semibold text-accent">Start a conversation</p>
      <h3 className="mt-3 text-2xl font-semibold leading-tight">Contact USATII Today</h3>

      <div className="mt-4 space-y-2">
        {["First Name", "Last Name", "Phone", "Email", "Business Name"].map((field) => (
          <input
            key={field}
            type="text"
            placeholder={field}
            className="h-10 w-full border border-control-border bg-paper px-3 text-sm text-ink placeholder:text-faint"
          />
        ))}

        <select className="h-10 w-full border border-control-border bg-paper px-3 text-sm text-ink" defaultValue="">
          <option value="" disabled>
            Are you a new customer?
          </option>
          <option>Yes</option>
          <option>No</option>
        </select>

        <textarea
          placeholder="How can we help you?"
          rows={4}
          className="w-full border border-control-border bg-paper px-3 py-2 text-sm text-ink placeholder:text-faint"
        />
      </div>

      <p className="mt-3 text-xs leading-5 text-muted">
        {cta ?? "Tell us your workflow goals and we will map practical next steps."}
      </p>

      <div className="mt-4">
        <SlantedButton href="/quote-request" label="Send Message" full />
      </div>
    </article>
  );
}

function SidebarServicesCard({ items }) {
  return (
    <article className="border border-surface bg-paper p-5 text-ink shadow-soft">
      <h3 className="text-2xl font-semibold">Services</h3>
      <ul className="mt-4 divide-y divide-surface border-y border-surface">
        {items.map((item) => (
          <li key={item} className="flex items-center justify-between py-3 text-sm font-medium text-ink-soft">
            <span>{item}</span>
            <span className="text-accent">+</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function RecentWorkSection() {
  return (
    <section className="border-y border-[#d8ddeb] bg-[#eceff5] py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionBadge />
        <h2 className="mt-5 text-center text-5xl font-black tracking-tight text-[#1a2139]">Recent Website Work</h2>
        <p className="mx-auto mt-4 max-w-3xl text-center text-lg leading-8 text-[#5f6781]">
          Selected client website builds and redesigns relevant to conversion-focused service pages.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {RECENT_WEBSITE_WORK.map((project) => (
            <article key={project.href} className="overflow-hidden border border-[#d8deea] bg-white shadow-[0_10px_24px_rgba(74,58,255,0.08)]">
              <div className="relative h-56 border-b border-[#dde2ee] bg-[#e8ebf3]">
                <Image src={project.image} alt={`${project.title} homepage`} fill className="object-cover object-top" />
              </div>
              <div className="p-5">
                <h3 className="text-2xl font-black tracking-tight text-[#141b33]">{project.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#5a637e]">{project.description}</p>
                <Link
                  href={project.href}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#5f41ea] transition hover:text-[#4a32cb]"
                >
                  Visit website
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function SeoFooter() {
  return (
    <>
      <footer className="border-t border-[#d9deea] bg-[#eceff5]">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
          <div>
            <p className="text-lg font-black tracking-tight text-[#1a2139]">USATII MEDIA</p>
            <div className="mt-4 space-y-2 text-sm text-[#3c4562]">
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#6d4dff]" />
                {FOOTER_PHONE}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-3xl font-black tracking-tight text-[#6d4dff]">Quick Links</h3>
            <ul className="mt-3 divide-y divide-[#d6dce8] text-lg text-[#313a55]">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href} className="py-2">
                  <Link href={link.href} className="transition hover:text-[#1f2743]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-3xl font-black tracking-tight text-[#6d4dff]">Address</h3>
            <div className="mt-3 space-y-2 text-md text-[#3a4360]">
              <p className="flex items-start gap-2">
                <MapPin className="mt-1 h-4 w-4 text-[#6d4dff]" />
                Remote-first (Rochester, NY)
              </p>
            </div>

            <h3 className="mt-6 text-3xl font-black tracking-tight text-[#6d4dff]">Hours</h3>
            <div className="mt-3 space-y-2 text-md text-[#3a4360]">
              <p className="flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-[#6d4dff]" />
                Monday-Friday: Open 24 hours
              </p>
              <p>Saturday-Sunday: by booking only</p>
            </div>
          </div>

          <div>
            <div className="h-full min-h-[230px] overflow-hidden border border-[#c3c9dc] bg-[#f7f8fc]">
              <iframe
                title="Rochester, NY map"
                src={ROCHESTER_MAP_EMBED_URL}
                className="h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </footer>

      <section className="border-t border-[#d4dae7] bg-[#e3e7ef]">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="text-sm text-[#5f6781]">
            <p>© {new Date().getFullYear()} All Rights Reserved.</p>
            <div className="mt-1 flex flex-wrap gap-4">
              <Link href="/privacy" className="hover:text-[#29314d]">
                Privacy Policy
              </Link>
              <Link href="/sitemap" className="hover:text-[#29314d]">
                Site Map
              </Link>
            </div>
          </div>
          <p className="text-lg font-black italic tracking-tight text-[#1a2139]">USATII MEDIA</p>
        </div>
      </section>
    </>
  );
}

export function SchemaScripts({ schemas = [] }) {
  return schemas.map((schema, index) => (
    <script
      key={`schema-${index}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  ));
}

export function ImagePlaceholder() {
  return (
    <div className="relative min-h-[220px] overflow-hidden border border-[#c4cbdf]">
      <Image
        src={SEO_PLACEHOLDER_IMAGE}
        alt="USATII workstation visual"
        fill
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0e1428]/82 via-[#0e1428]/36 to-transparent" />
    </div>
  );
}

export function ChunkSection({ title, children, eyebrow }) {
  return (
    <section className="border border-surface bg-paper p-6 sm:p-7">
      {eyebrow ? (
        <p className="text-sm font-semibold text-accent">{eyebrow}</p>
      ) : null}
      <h2 className="mt-2 text-2xl font-semibold text-ink sm:text-4xl">{title}</h2>
      <div className="mt-4 space-y-4 text-base leading-8 text-muted">{children}</div>
    </section>
  );
}

export function BulletGrid({ items = [] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item} className="border border-surface bg-canvas px-4 py-3 text-sm leading-6 text-ink-soft">
          {item}
        </li>
      ))}
    </ul>
  );
}

export function FaqCards({ faqs = [] }) {
  return (
    <div className="space-y-3">
      {faqs.map((faq) => (
        <article key={faq.q} className="border border-surface bg-canvas px-5 py-4">
          <h3 className="text-lg font-semibold text-ink">{faq.q}</h3>
          <p className="mt-2 text-sm leading-7 text-muted">{faq.a}</p>
        </article>
      ))}
    </div>
  );
}

export function PageLinkGrid({ links = [] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="border border-surface bg-canvas px-4 py-3 text-sm font-semibold text-ink transition hover:border-accent"
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}

export default function ChunkySeoLayout({
  eyebrow,
  title,
  intro,
  proofPoints = [],
  primaryCta,
  secondaryCta,
  children,
  sidebar,
  showRecentWork,
}) {
  const sectionNodes = Children.toArray(children);
  const leadCount = Math.min(2, sectionNodes.length);
  const leadSections = sectionNodes.slice(0, leadCount);
  const remainingSections = sectionNodes.slice(leadCount);

  const architectureCards = (proofPoints.length ? proofPoints : FALLBACK_POINTS).slice(0, 4);
  const sectionTitleCards = sectionNodes
    .map((node) => node?.props?.title)
    .filter(Boolean)
    .slice(0, 6);
  const architectureCardSupport = [
    "Mapped into real scope, ownership, and timelines before build starts.",
    "Delivered with QA checkpoints so handoffs stay clean across your team.",
    "Tracked in weekly execution loops with transparent priorities and status.",
    "Measured against lead quality, response speed, and revenue operations impact.",
  ];

  const ctaPrimary = primaryCta ?? { label: "Get Started", href: "/quote-request" };
  const ctaSecondary = secondaryCta ?? { label: "Learn More", href: "/trades" };
  const primaryIsExternal = ctaPrimary.href.startsWith("http");

  const keywordText = [eyebrow, title, intro, ...proofPoints].join(" ").toLowerCase();
  const shouldShowRecentWork = typeof showRecentWork === "boolean"
    ? showRecentWork
    : /website|websites|web design|site build|site redesign|site development/.test(keywordText);

  return (
    <main className="bg-canvas text-ink" data-oasis-public>
      <Header />

      <section className="border-b border-surface bg-paper">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6 md:py-24 lg:px-8">
          <p className="text-sm font-semibold text-accent">{eyebrow}</p>
          <h1 className="mt-5 max-w-5xl text-5xl font-semibold leading-[0.96] tracking-tight text-ink sm:text-7xl">{title}</h1>
          <p className="mt-6 max-w-3xl text-xl leading-9 text-muted">{intro}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <CtaButton href={ctaPrimary.href} label={ctaPrimary.label} primary />
            <CtaButton href={ctaSecondary.href} label={ctaSecondary.label} />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8">
        <article className="space-y-5">
          <div className="flex items-center gap-3 text-[#6d4dff]">
            <MapPinned className="h-6 w-6" />
            <span className="h-px w-20 bg-[#a998ff]" />
          </div>
          <h2 className="text-4xl font-semibold leading-tight text-ink">{title}</h2>

          {proofPoints.length ? (
            <ul className="space-y-2">
              {proofPoints.map((point) => (
                <li key={point} className="border border-surface bg-paper px-4 py-3 text-sm leading-7 text-ink-soft">
                  {point}
                </li>
              ))}
            </ul>
          ) : null}

          {leadSections.map((node, index) => (
            <div key={`lead-section-${index}`} className="border border-surface bg-paper p-1">
              {node}
            </div>
          ))}

          <div className="flex flex-wrap gap-3 pt-1">
            <CtaButton href={ctaPrimary.href} label={ctaPrimary.label} primary />
            <CtaButton href={ctaSecondary.href} label={ctaSecondary.label} />
          </div>
        </article>

        <aside className="space-y-4">
          <SidebarContactCard cta={intro} />
          <SidebarServicesCard items={sectionTitleCards.length ? sectionTitleCards : architectureCards} />
          {sidebar}
        </aside>
      </section>

      <section className="border-y border-surface bg-paper py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionBadge />
          <h2 className="mt-5 text-center text-4xl font-semibold text-ink">Why Choose USATII?</h2>

          <div className="mt-10 grid border border-surface bg-paper sm:grid-cols-2">
            {architectureCards.map((item, index) => (
              <article
                key={item}
                className={[
                  "flex min-h-[280px] flex-col items-center justify-center px-7 py-10 text-center",
                  index % 2 === 0 ? "sm:border-r sm:border-[#d9deea]" : "",
                  index < 2 ? "border-b border-[#d9deea]" : "",
                ].join(" ")}
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-mdx border border-surface bg-accent-soft">
                  {index === 0 ? <HandCoins className="h-9 w-9 text-[#6d4dff]" /> : null}
                  {index === 1 ? <BadgeCheck className="h-9 w-9 text-[#6d4dff]" /> : null}
                  {index === 2 ? <CalendarClock className="h-9 w-9 text-[#6d4dff]" /> : null}
                  {index === 3 ? <MapPinned className="h-9 w-9 text-[#6d4dff]" /> : null}
                </div>
                <h3 className="mt-8 text-2xl font-semibold leading-tight text-ink">{item}</h3>
                <p className="mt-3 max-w-lg text-base leading-7 text-muted">
                  {architectureCardSupport[index] ?? architectureCardSupport[architectureCardSupport.length - 1]}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-surface bg-accent-soft py-16 text-ink">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 text-[#bdafff]">
            <MapPinned className="h-5 w-5" />
            <span className="h-px w-16 bg-[#4a5476]" />
          </div>
          <h2 className="mt-3 text-4xl font-semibold">How USATII SEO Pages Drive Qualified Pipeline</h2>
          <p className="mt-5 max-w-6xl text-lg leading-8 text-muted">
            USATII builds every route around a practical buyer sequence: intent match, trust validation,
            operational fit, then a direct next step. The goal is not traffic for its own sake. The goal is
            to convert qualified searches into sales-ready conversations.
          </p>
          <div className="mt-8 space-y-3 text-lg leading-8 text-ink-soft">
            <p>
              <strong className="text-ink">Intent-matched page structure:</strong> Service, industry, and location routes answer different search intents with specific context.
            </p>
            <p>
              <strong className="text-ink">Conversion-first UX:</strong> Calls, quote requests, and audit CTAs are mapped to the workflows your team can actually deliver.
            </p>
            <p>
              <strong className="text-ink">Entity consistency:</strong> USATII branding, schema, and proof signals stay aligned across every route to strengthen search trust.
            </p>
          </div>
        </div>
      </section>

      <GoogleReviewGrid />

      {remainingSections.length > 0 ? (
        <section className="mx-auto max-w-7xl space-y-6 px-4 py-14 sm:px-6 lg:px-8">
          {remainingSections.map((node, index) => (
            <div key={`remaining-section-${index}`} className="border border-surface bg-paper p-1">
              {node}
            </div>
          ))}
        </section>
      ) : null}

      {shouldShowRecentWork ? <RecentWorkSection /> : null}

      <section className="border-b border-surface bg-paper py-14">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_1fr] lg:px-8">
          <article>
            <SectionBadge />
            <h2 className="mt-4 text-center text-4xl font-semibold text-ink lg:text-left">Why work with us?</h2>
            <p className="mx-auto mt-5 max-w-3xl text-center text-xl leading-9 text-muted lg:mx-0 lg:text-left">
              USATII combines software engineering, conversion architecture, and operational strategy so your SEO pages
              support both discoverability and real delivery outcomes after the lead comes in.
            </p>
          </article>

          <ImagePlaceholder />
        </div>
      </section>

      <Footer />
    </main>
  );
}

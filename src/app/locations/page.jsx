import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  Clock3,
  HandCoins,
  Mail,
  MapPin,
  MapPinned,
  Phone,
  ShoppingBag,
} from "lucide-react";
import GoogleReviewGrid from "@/app/_components/google-review-grid";
import { SchemaScripts } from "@/app/_components/trades/chunky-seo-layout";
import { LOCATION_PAGE_DATA, TRADE_AUDIT_BOOKING_URL } from "@/lib/trades-seo-data";
import { buildPageMetadata, buildStandardSchemas } from "@/lib/trades-page-utils";

const PATH = "/locations";
const FEATURED_MEDIA_IMAGE = "/recent-work/usatii-workstation.png";
const ROCHESTER_MAP_EMBED_URL = "https://www.google.com/maps?q=Rochester,NY&z=11&output=embed";
const ROCHESTER_MAP_LINK = "https://www.google.com/maps/place/Rochester,+NY/";

const WHY_CHOOSE_CARDS = [
  {
    title: "Contact Us for a Free Audit",
    description: "Talk to our team today during a free software waste audit.",
    Icon: HandCoins,
  },
  {
    title: "Backed by a Clear Plan",
    description: "Every location page strategy comes with practical next-step guidance.",
    Icon: BadgeCheck,
  },
  {
    title: "Available for Real Workflows",
    description: "Pages are structured around the way trade teams actually operate in-market.",
    Icon: CalendarClock,
  },
  {
    title: "Built for Sustainable Growth",
    description: "Your local content system scales without doorway-page filler.",
    Icon: MapPinned,
  },
];

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Software", href: "/software" },
  { label: "Industries", href: "/industries" },
  { label: "Locations", href: "/locations" },
  { label: "About Us", href: "/about" },
];

export const metadata = buildPageMetadata({
  title: "Rochester Area Trade Software Service Locations",
  description:
    "Local SEO pages for Rochester-area trade software services by USATII, including Henrietta, Webster, Greece, Irondequoit, Pittsford, Fairport, Victor, and Canandaigua.",
  path: PATH,
});

function SectionBadge() {
  return (
    <div className="mx-auto flex items-center justify-center gap-4 text-[#6d4dff]">
      <span className="h-px w-14 bg-[#c3b4ff]" />
      <MapPinned className="h-5 w-5" />
      <span className="h-px w-14 bg-[#c3b4ff]" />
    </div>
  );
}

function SlantedButton({ href, label, primary = true, external = false, full = false }) {
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className={[
        "inline-flex items-center justify-center px-6 py-3 text-sm font-bold tracking-[0.01em] transition",
        full ? "w-full" : "",
        primary
          ? "bg-[#6d4dff] text-white hover:bg-[#5b3fe0]"
          : "bg-[#818bac] text-white hover:bg-[#6f7898]",
      ].join(" ")}
      style={{ clipPath: "polygon(0 0, 94% 0, 100% 100%, 0 100%)" }}
    >
      {label}
    </Link>
  );
}

function HeroMediaPlaceholder() {
  return (
    <div className="absolute inset-0 overflow-hidden border-y border-[#3a4263]">
      <Image
        src={FEATURED_MEDIA_IMAGE}
        alt="USATII workstation visual"
        fill
        className="object-cover object-center"
      />
      <div className="mx-auto h-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative h-full rounded-none border-x border-dashed border-[#555f85]/70" />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[#141b31]/62" />
      <div className="pointer-events-none absolute left-0 top-0 h-full w-full bg-[radial-gradient(circle,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:30px_30px] opacity-30" />
    </div>
  );
}

function SidebarFormCard({ primaryLocation }) {
  return (
    <article className="border border-[#1d243f] bg-[#131b33] p-5 text-white">
      <div className="flex items-center gap-3 text-[#c7b9ff]">
        <MapPinned className="h-5 w-5" />
        <span className="h-px w-12 bg-[#5f6992]" />
      </div>
      <h3 className="mt-3 text-3xl font-black leading-[1.05] tracking-tight">Contact USATII Today</h3>

      <div className="mt-4 space-y-2">
        {["First Name", "Last Name", "Phone", "Email", "Business Name"].map((field) => (
          <input
            key={field}
            type="text"
            placeholder={field}
            className="h-10 w-full border border-[#2a3455] bg-white/95 px-3 text-sm text-[#1a2139] placeholder:text-[#7e879f]"
          />
        ))}

        <select
          className="h-10 w-full border border-[#2a3455] bg-white/95 px-3 text-sm text-[#1a2139]"
          defaultValue=""
        >
          <option value="" disabled>
            Are you a new customer?
          </option>
          <option>Yes</option>
          <option>No</option>
        </select>

        <textarea
          placeholder="How can we help you?"
          rows={4}
          className="w-full border border-[#2a3455] bg-white/95 px-3 py-2 text-sm text-[#1a2139] placeholder:text-[#7e879f]"
        />
      </div>

      <p className="mt-3 text-xs leading-5 text-[#9ea8c5]">{primaryLocation.cta}</p>

      <div className="mt-4">
        <SlantedButton
          href={TRADE_AUDIT_BOOKING_URL}
          label="Book Free Audit"
          external
          full
        />
      </div>
    </article>
  );
}

function SidebarServicesCard({ trades }) {
  return (
    <article className="border border-[#1d243f] bg-[#0f1529] p-5 text-white">
      <h3 className="text-4xl font-black tracking-tight text-[#8f73ff]">Services</h3>
      <ul className="mt-4 divide-y divide-[#243051] border-y border-[#243051]">
        {trades.map((trade) => (
          <li key={trade} className="flex items-center justify-between py-2 text-lg text-[#d7ddf1]">
            <span>{trade}</span>
            <span className="text-[#8f73ff]">+</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function FooterLayout() {
  return (
    <>
      <footer className="border-t border-[#d9deea] bg-[#eceff5]">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
          <div>
            <p className="text-lg font-black tracking-tight text-[#1a2139]">USATII MEDIA</p>
            <div className="mt-4 space-y-2 text-sm text-[#3c4562]">
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#6d4dff]" />
                (585) 441-0972
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-3xl font-black tracking-tight text-[#6d4dff]">Quick Links</h3>
            <ul className="mt-3 divide-y divide-[#d6dce8] text-lg text-[#313a55]">
              {QUICK_LINKS.map((link) => (
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
            <div className="mt-3 space-y-2 text-lg text-[#3a4360]">
              <p className="flex items-start gap-2">
                <MapPin className="mt-1 h-4 w-4 text-[#6d4dff]" />
                Rochester, NY, United States
              </p>
              <p>Service areas published per practical coverage radius.</p>
            </div>

            <h3 className="mt-6 text-3xl font-black tracking-tight text-[#6d4dff]">Hours</h3>
            <div className="mt-3 space-y-2 text-lg text-[#3a4360]">
              <p className="flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-[#6d4dff]" />
                Monday-Friday: scheduled consultations
              </p>
              <p>Saturday-Sunday: by booking only</p>
            </div>
          </div>

          <div>
            <div className="h-full min-h-[230px] overflow-hidden border border-[#c3c9dc] bg-[#f7f8fc]">
              <iframe
                title="Rochester, NY map"
                src={ROCHESTER_MAP_EMBED_URL}
                className="h-[196px] w-full border-0"
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

export default function LocationsHubPage() {
  const locationLinks = LOCATION_PAGE_DATA.map((location) => ({
    label: `${location.city}, ${location.state}`,
    href: `/locations/${location.slug}`,
  }));
  const primaryLocation = LOCATION_PAGE_DATA.find((location) => location.slug === "rochester-ny")
    ?? LOCATION_PAGE_DATA[0];
  const uniqueTrades = [...new Set(LOCATION_PAGE_DATA.flatMap((location) => location.nearbyTrades))];
  const sidebarTrades = uniqueTrades.slice(0, 6);

  const schemas = buildStandardSchemas({
    path: PATH,
    title: "Rochester Area Trade Software Service Locations",
    description:
      "Rochester-area location pages for contractor software, websites, and marketing systems.",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Trades", path: "/trades" },
      { name: "Locations", path: PATH },
    ],
    serviceType: "Rochester Contractor Software Services",
    areaServed: LOCATION_PAGE_DATA.map((location) => `${location.city}, ${location.state}`),
  });

  return (
    <main className="bg-[#eaedf3] text-[#141935]">
      <SchemaScripts schemas={schemas} />

      <header>
        <section className="bg-[#6d4dff] text-white">
          <div className="mx-auto flex h-10 max-w-7xl items-center justify-between px-4 text-xs sm:px-6 lg:px-8">
            <Link href={TRADE_AUDIT_BOOKING_URL} target="_blank" rel="noreferrer" className="flex items-center gap-2 font-semibold">
              <ShoppingBag className="h-3.5 w-3.5" />
              Book Free Audit
            </Link>
            <div className="flex items-center gap-4 font-semibold">
              <span>Consult with us today.</span>
              <Link href="/portal/login" className="underline-offset-2 hover:underline">
                Client Login
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-[#0e1428] text-white">
          <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
            <p className="text-center text-3xl font-black tracking-tight">USATII MEDIA</p>
            <nav className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-lg font-semibold text-[#d8def0]">
              <Link href="/" className="hover:text-white">Home</Link>
              <Link href="/about" className="hover:text-white">About</Link>
              <Link href="/services" className="hover:text-white">Services</Link>
              <Link href="/locations" className="text-white">Service Areas</Link>
              <Link href="/quote-request" className="hover:text-white">Contact Us</Link>
            </nav>
          </div>
        </section>
      </header>

      <section className="relative isolate h-[420px] overflow-hidden border-t border-[#3b4465]">
        <HeroMediaPlaceholder />
        <div className="relative mx-auto flex h-full max-w-7xl flex-col items-center justify-center px-4 text-center sm:px-6 lg:px-8">
          <SectionBadge />
          <h1 className="mt-4 text-6xl font-black tracking-tight text-white">Locations</h1>
          <p className="mt-4 max-w-4xl text-2xl leading-10 text-[#d4daec]">
            Rochester service-area pages built around real delivery coverage, nearby trade context,
            and direct operational calls to action.
          </p>
          <div className="mt-6">
            <SlantedButton
              href={TRADE_AUDIT_BOOKING_URL}
              label="Get Started"
              external
            />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8">
        <article>
          <div className="flex items-center gap-3 text-[#6d4dff]">
            <MapPinned className="h-6 w-6" />
            <span className="h-px w-20 bg-[#a998ff]" />
          </div>
          <h2 className="mt-4 text-5xl font-black leading-[0.95] tracking-tight text-[#12182f]">
            Rochester Service Areas
          </h2>

          <div className="mt-6 space-y-5 text-lg leading-9 text-[#424b65]">
            <p>{primaryLocation.intro}</p>
            <p>
              These location pages are written as real service-area pages with local language,
              nearby trades served, and specific calls to action.
            </p>
            <p>{primaryLocation.serviceAreaLanguage}</p>
            <p>{primaryLocation.cta}</p>
          </div>

          <h3 className="mt-8 text-4xl font-black tracking-tight text-[#11182f]">Our service locations include:</h3>
          <ul className="mt-4 space-y-2 text-2xl text-[#3f4761]">
            {locationLinks.map((location) => (
              <li key={location.href}>
                <Link href={location.href} className="transition hover:text-[#262f4a]">
                  {location.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-3">
            <SlantedButton href={TRADE_AUDIT_BOOKING_URL} label="Contact Us" external />
            <SlantedButton href="/industries" label="View Industries" primary={false} />
          </div>
        </article>

        <aside className="space-y-4">
          <SidebarFormCard primaryLocation={primaryLocation} />
          <SidebarServicesCard trades={sidebarTrades} />
        </aside>
      </section>

      <section className="border-y border-[#dbe0ec] bg-[#e6eaf2] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionBadge />
          <h2 className="mt-5 text-center text-5xl font-black tracking-tight text-[#1b2239]">
            Why Choose USATII?
          </h2>

          <div className="mt-10 grid border border-[#d5dae7] bg-white sm:grid-cols-2">
            {WHY_CHOOSE_CARDS.map(({ title, description, Icon }, index) => (
              <article
                key={title}
                className={[
                  "flex min-h-[340px] flex-col items-center justify-center px-7 py-10 text-center",
                  index % 2 === 0 ? "sm:border-r sm:border-[#d9deea]" : "",
                  index < 2 ? "border-b border-[#d9deea]" : "",
                ].join(" ")}
              >
                <div className="flex h-28 w-28 items-center justify-center rounded-full border border-[#d7cfff] bg-[#f4f1ff]">
                  <Icon className="h-10 w-10 text-[#6d4dff]" />
                </div>
                <h3 className="mt-8 text-4xl font-black leading-tight tracking-tight text-[#131b32]">{title}</h3>
                <p className="mt-4 max-w-lg text-xl leading-8 text-[#5a637e]">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[radial-gradient(circle_at_50%_50%,rgba(109,77,255,0.26),transparent_36%),linear-gradient(95deg,#080d1e_0%,#0f1730_45%,#070c1d_100%)] py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 text-[#bdafff]">
            <MapPinned className="h-5 w-5" />
            <span className="h-px w-16 bg-[#4a5476]" />
          </div>
          <h2 className="mt-3 text-5xl font-black tracking-tight">Why Hire a Professional Team for Local Pages?</h2>
          <p className="mt-5 max-w-6xl text-lg leading-8 text-[#c9d0e5]">
            Location architecture should not be generic. It should reflect where your crews operate,
            what trades you serve, and which workflows drive growth. We use the same operational
            logic across every page so local intent, conversion paths, and service boundaries stay clear.
          </p>
          <p className="mt-5 max-w-6xl text-lg leading-8 text-[#c9d0e5]">
            Best of all, your location pages stay aligned with real-world execution, helping you avoid
            weak content patterns that dilute trust or create inaccurate market signals.
          </p>

          <div className="mt-8 space-y-3 text-lg leading-8 text-[#c4cce3]">
            <p>
              <strong className="text-white">Coverage accuracy:</strong> Serve the locations your teams can actually support.
            </p>
            <p>
              <strong className="text-white">Workflow clarity:</strong> Keep lead intake, estimating, and dispatch language aligned.
            </p>
            <p>
              <strong className="text-white">Trust signals:</strong> Publish local pages with concrete context instead of filler.
            </p>
            <p>
              <strong className="text-white">Scalable structure:</strong> Expand pages while preserving consistency and intent.
            </p>
          </div>
        </div>
      </section>

      <GoogleReviewGrid />

      <section className="border-b border-[#d8ddeb] bg-[#eceff5] py-14">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_1fr] lg:px-8">
          <article>
            <SectionBadge />
            <h2 className="mt-4 text-center text-5xl font-black tracking-tight text-[#11182f] lg:text-left">Why work with us?</h2>
            <p className="mx-auto mt-5 max-w-3xl text-center text-xl leading-9 text-[#49526a] lg:mx-0 lg:text-left">
              We combine software execution and marketing systems so every location page can support both
              discoverability and operational clarity. Our team focuses on precision, practical delivery
              boundaries, and conversion-ready structure.
            </p>
          </article>

          <div className="relative min-h-[280px] overflow-hidden border border-[#c4cbdf]">
            <Image
              src={FEATURED_MEDIA_IMAGE}
              alt="USATII workstation visual"
              fill
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e1428]/82 via-[#0e1428]/36 to-transparent" />
          </div>
        </div>
      </section>

      <FooterLayout />
    </main>
  );
}

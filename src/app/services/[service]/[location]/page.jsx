import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "../../../_components/header";
import Footer from "../../../_components/footer";
import {
  SITE_URL,
  buildCitySpecificServiceNarrative,
  buildLocationDeliverables,
  buildLocationFaqs,
  buildServiceLocationPath,
  buildServicePath,
  getApprovedServiceLocationPairs,
  getLocationBySlug,
  getServiceBySlug,
  getServiceLocationMetaDescription,
  isApprovedServiceLocation,
  pickNearbyServiceLocationLinks,
  pickRelatedServiceLocationLinks,
} from "@/lib/services-seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return getApprovedServiceLocationPairs().map(({ serviceSlug, locationSlug }) => ({
    service: serviceSlug,
    location: locationSlug,
  }));
}

export async function generateMetadata({ params }) {
  const { service: serviceSlug, location: locationSlug } = await params;

  const service = getServiceBySlug(serviceSlug);
  const location = getLocationBySlug(locationSlug);

  if (!service || !location || !isApprovedServiceLocation(serviceSlug, locationSlug)) {
    return {
      title: "Page Not Found | USATII",
    };
  }

  const canonicalPath = buildServiceLocationPath(serviceSlug, locationSlug);

  return {
    title: `${service.agencyTitle} in ${location.name} | USATII`,
    description: getServiceLocationMetaDescription(service, location),
    alternates: {
      canonical: `${SITE_URL}${canonicalPath}`,
    },
  };
}

function SectionTitle({ children }) {
  return (
    <h2 className="text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl">
      {children}
    </h2>
  );
}

export default async function ServiceLocationPage({ params }) {
  const { service: serviceSlug, location: locationSlug } = await params;

  const service = getServiceBySlug(serviceSlug);
  const location = getLocationBySlug(locationSlug);

  if (!service || !location || !isApprovedServiceLocation(serviceSlug, locationSlug)) {
    notFound();
  }

  const locationNarrative = buildCitySpecificServiceNarrative(service, location);
  const locationDeliverables = buildLocationDeliverables(service, location);
  const locationFaqs = buildLocationFaqs(service, location);
  const relatedServiceLinks = pickRelatedServiceLocationLinks(serviceSlug, locationSlug);
  const nearbyLocationLinks = pickNearbyServiceLocationLinks(serviceSlug, locationSlug);

  return (
    <>
      <Header />
      <main className="bg-white px-4 pb-20 pt-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-14">
          <section className="rounded-3xl border border-neutral-200 bg-neutral-50 p-7 sm:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">
              {location.name}
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-neutral-950 sm:text-5xl">
              {service.agencyTitle} in {location.name}
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-neutral-700 sm:text-lg">
              USATII helps {location.name} businesses build {service.outcome}.
            </p>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-neutral-600 sm:text-base">
              {locationNarrative}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="https://cal.com/usatii/onboarding"
                target="_blank"
                className="inline-flex items-center rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800"
              >
                Book strategy call
              </Link>
              <Link
                href={buildServicePath(serviceSlug)}
                className="inline-flex items-center rounded-full border border-black px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-black hover:text-white"
              >
                View {service.name} service
              </Link>
            </div>
          </section>

          <section className="space-y-6">
            <SectionTitle>
              {service.name} for {location.name} businesses
            </SectionTitle>
            <p className="text-base leading-7 text-neutral-700">{locationNarrative}</p>
          </section>

          <section className="space-y-6">
            <SectionTitle>What is included</SectionTitle>
            <ul className="grid gap-3 sm:grid-cols-2">
              {locationDeliverables.map((deliverable) => (
                <li
                  key={deliverable}
                  className="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-700"
                >
                  {deliverable}
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-6">
            <SectionTitle>
              How USATII approaches {service.name.toLowerCase()} in {location.name}
            </SectionTitle>
            <div className="space-y-4 text-base leading-7 text-neutral-700">
              <p>
                We start by aligning your offer to the realities of the {location.name} market, then
                translate that into a repeatable execution system.
              </p>
              <p>
                The focus is practical growth: clearer positioning, stronger message-market fit,
                and consistent optimization tied to qualified demand.
              </p>
            </div>
          </section>

          <section className="space-y-6">
            <SectionTitle>Best-fit businesses</SectionTitle>
            <ul className="list-disc space-y-3 pl-6 text-base leading-7 text-neutral-700">
              {service.bestFor.map((audience) => (
                <li key={audience}>{audience}</li>
              ))}
            </ul>
          </section>

          <section className="space-y-6">
            <SectionTitle>Why work with USATII</SectionTitle>
            <ul className="list-disc space-y-3 pl-6 text-base leading-7 text-neutral-700">
              {service.whyUs.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          </section>

          <section className="space-y-6">
            <SectionTitle>FAQs</SectionTitle>
            <div className="space-y-4">
              {locationFaqs.map((faq) => (
                <article key={faq.q} className="rounded-xl border border-neutral-200 p-5">
                  <h3 className="text-lg font-semibold text-neutral-950">{faq.q}</h3>
                  <p className="mt-2 text-sm leading-6 text-neutral-700">{faq.a}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <SectionTitle>Related services</SectionTitle>
            <div className="grid gap-3 sm:grid-cols-2">
              {relatedServiceLinks.map((relatedLink) => (
                <Link
                  key={relatedLink.href}
                  href={relatedLink.href}
                  className="rounded-xl border border-neutral-200 px-4 py-3 text-sm font-medium text-neutral-800 transition hover:border-neutral-400"
                >
                  {relatedLink.label}
                </Link>
              ))}
            </div>

            {nearbyLocationLinks.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-neutral-950">
                  Nearby or major markets for {service.name}
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {nearbyLocationLinks.map((nearbyLink) => (
                    <Link
                      key={nearbyLink.href}
                      href={nearbyLink.href}
                      className="rounded-xl border border-neutral-200 px-4 py-3 text-sm font-medium text-neutral-800 transition hover:border-neutral-400"
                    >
                      {nearbyLink.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

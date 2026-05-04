import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "../../_components/header";
import Footer from "../../_components/footer";
import {
  SITE_URL,
  getServiceBySlug,
  getServiceMetaDescription,
  getServiceSlugs,
  getRolloutLocationsByService,
  getLocationBySlug,
  buildServiceLocationPath,
  buildServicePath,
} from "@/lib/services-seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return getServiceSlugs().map((service) => ({ service }));
}

export async function generateMetadata({ params }) {
  const { service: serviceSlug } = await params;
  const service = getServiceBySlug(serviceSlug);

  if (!service) {
    return {
      title: "Service Not Found | USATII",
    };
  }

  const canonicalPath = buildServicePath(serviceSlug);

  return {
    title: `${service.agencyTitle} | USATII`,
    description: getServiceMetaDescription(service),
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

export default async function ServicePage({ params }) {
  const { service: serviceSlug } = await params;
  const service = getServiceBySlug(serviceSlug);

  if (!service) {
    notFound();
  }

  const locationSlugs = getRolloutLocationsByService(serviceSlug);

  return (
    <>
      <Header />
      <main className="bg-white px-4 pb-20 pt-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-14">
          <section className="rounded-3xl border border-neutral-200 bg-neutral-50 p-7 sm:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Service
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-neutral-950 sm:text-5xl">
              {service.agencyTitle}
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-neutral-700 sm:text-lg">
              {service.heroPromise}
            </p>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-neutral-600 sm:text-base">
              {service.whoFor}
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
                href="/services"
                className="inline-flex items-center rounded-full border border-black px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-black hover:text-white"
              >
                Browse all services
              </Link>
            </div>
          </section>

          <section className="space-y-6">
            <SectionTitle>What USATII does for this service</SectionTitle>
            <div className="space-y-4 text-base leading-7 text-neutral-700">
              {service.whatWeDo.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <SectionTitle>Deliverables</SectionTitle>
            <ul className="grid gap-3 sm:grid-cols-2">
              {service.deliverables.map((deliverable) => (
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
            <SectionTitle>Process</SectionTitle>
            <div className="grid gap-4 md:grid-cols-2">
              {service.process.map((step, index) => (
                <article
                  key={step.title}
                  className="rounded-2xl border border-neutral-200 bg-white p-5"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">
                    Step {index + 1}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-neutral-950">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-neutral-700">{step.body}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <SectionTitle>Who this is best for</SectionTitle>
            <ul className="list-disc space-y-3 pl-6 text-base leading-7 text-neutral-700">
              {service.bestFor.map((audience) => (
                <li key={audience}>{audience}</li>
              ))}
            </ul>
          </section>

          <section className="space-y-6">
            <SectionTitle>Why USATII</SectionTitle>
            <ul className="list-disc space-y-3 pl-6 text-base leading-7 text-neutral-700">
              {service.whyUs.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          </section>

          <section className="space-y-6">
            <SectionTitle>FAQs</SectionTitle>
            <div className="space-y-4">
              {service.faqs.map((faq) => (
                <article key={faq.q} className="rounded-xl border border-neutral-200 p-5">
                  <h3 className="text-lg font-semibold text-neutral-950">{faq.q}</h3>
                  <p className="mt-2 text-sm leading-6 text-neutral-700">{faq.a}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <SectionTitle>Popular locations for this service</SectionTitle>
            <div className="grid gap-3 sm:grid-cols-2">
              {locationSlugs.map((locationSlug) => {
                const location = getLocationBySlug(locationSlug);
                if (!location) return null;

                return (
                  <Link
                    key={locationSlug}
                    href={buildServiceLocationPath(serviceSlug, locationSlug)}
                    className="rounded-xl border border-neutral-200 px-4 py-3 text-sm font-medium text-neutral-800 transition hover:border-neutral-400"
                  >
                    {service.name} in {location.name}
                  </Link>
                );
              })}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

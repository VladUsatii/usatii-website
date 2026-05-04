import Link from "next/link";
import Header from "../_components/header";
import Footer from "../_components/footer";
import {
  SITE_URL,
  SERVICES,
  SERVICE_SLUGS,
  buildServicePath,
} from "@/lib/services-seo";

export const metadata = {
  title: "Services | USATII",
  description:
    "USATII helps businesses build marketing systems across content, websites, advertising, automation, and analytics.",
  alternates: {
    canonical: `${SITE_URL}/services`,
  },
};

export default function ServicesPage() {
  return (
    <>
      <Header />
      <main className="bg-white px-4 pb-20 pt-10 sm:px-6 lg:px-8">
        <section className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">
            USATII Services
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-neutral-950 sm:text-5xl">
            Services
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-neutral-700 sm:text-lg">
            USATII helps businesses build marketing systems across content,
            websites, advertising, automation, and analytics.
          </p>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICE_SLUGS.map((serviceSlug) => {
              const service = SERVICES[serviceSlug];
              return (
                <article
                  key={serviceSlug}
                  className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-[0_8px_24px_-20px_rgba(0,0,0,0.45)]"
                >
                  <h2 className="text-xl font-bold text-neutral-950">
                    {service.name}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-neutral-700">
                    {service.heroPromise}
                  </p>
                  <Link
                    href={buildServicePath(serviceSlug)}
                    className="mt-5 inline-flex items-center rounded-full border border-black px-4 py-2 text-sm font-semibold text-black transition hover:bg-black hover:text-white"
                  >
                    View service
                  </Link>
                </article>
              );
            })}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

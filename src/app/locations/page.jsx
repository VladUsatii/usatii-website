import Header from "@/app/_components/header";
import Footer from "@/app/_components/footer";
import LocationsGlobe from "./locations-globe";
import { buildPageMetadata } from "@/lib/trades-page-utils";

export const metadata = buildPageMetadata({
  title: "USATII Locations and Client Reach",
  description:
    "USATII operates from New York and North Dakota and has supported clients across North America, Europe, and Asia.",
  path: "/locations",
});

export default function LocationsPage() {
  return (
    <>
      <Header />
      <main className="overflow-x-clip bg-white text-neutral-950">
        <section className="mx-auto flex min-h-[calc(100svh-65px)] max-w-6xl flex-col items-center px-6 pb-12 pt-14 text-center lg:px-8 lg:pt-16">
          <div className="relative z-10">
            <p className="text-xs font-medium text-neutral-500">Company</p>
            <h1 className="mt-4 text-5xl font-medium tracking-[-0.045em] sm:text-6xl">
              Locations
            </h1>
            <p className="mx-auto mt-5 max-w-md text-sm leading-6 text-neutral-600">
              Two operating locations, with client work spanning North America, Europe, and Asia.
            </p>
          </div>

          <LocationsGlobe />
        </section>

        <section className="border-t border-neutral-200">
          <div className="mx-auto max-w-5xl px-6 py-24 lg:px-8 lg:py-28">
            <div className="grid gap-14 md:grid-cols-[0.72fr_1.28fr] md:gap-20">
              <div>
                <p className="text-xs font-medium text-neutral-500">Our footprint</p>
                <h2 className="mt-4 text-3xl font-medium leading-tight tracking-[-0.035em]">
                  Our work always comes to you. Anywhere in the world.
                </h2>
              </div>
              <div className="grid gap-10 sm:grid-cols-2">
                <article className="border-t border-neutral-300 pt-5">
                  <p className="text-xs text-neutral-400">01</p>
                  <h3 className="mt-3 text-xl font-medium tracking-[-0.02em]">North Dakota</h3>
                  <p className="mt-3 text-sm leading-6 text-neutral-600">
                    The place where USATII was founded and where we serve our Midwestern clients.
                  </p>
                </article>
                <article className="border-t border-neutral-300 pt-5">
                  <p className="text-xs text-neutral-400">02</p>
                  <h3 className="mt-3 text-xl font-medium tracking-[-0.02em]">New York</h3>
                  <p className="mt-3 text-sm leading-6 text-neutral-600">
                    Where we help our international clients and government agencies.
                  </p>
                </article>
              </div>
            </div>

          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

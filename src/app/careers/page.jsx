import { ArrowRight } from "lucide-react";

import PublicLayout from "./_components/public-layout";

export const metadata = {
  title: "Careers",
  description: "Build safe, generalized enterprise software with Usatii Media."
};

const values = [
  {
    title: "Intelligence wins.",
    body: "Usatii means working towards understanding the secrets of the universe with great fervor, passion, and humanity. The most intelligent software moves the needle farthest."
  },
  {
    title: "Ship power.",
    body: "We desire perfect control of our environment and our future. It starts with optimistic integrity."
  },
  {
    title: "America first.",
    body: "We have an implicit obligation to defend our country and ensure that our intelligence far exceeds the world's bandwidth for the rest of humankind."
  }
];

const operatingPrinciples = [
  {
    title: "Understand the impossible.",
    body: "Solutions must be quirky, hacky, novel, and surprising. Find a way to measure things that can't be measured. Discover patterns that no machine can prove."
  },
  {
    title: "Focus fast.",
    body: "We move at a breakneck pace with an unparalleled work ethic. Clarity and focus enable us to make hard decisions."
  }
];

const PublicMain = "main";

function PrincipleList({ items }) {
  return (
    <div className="mx-auto mt-7 grid max-w-2xl gap-6 text-left">
      {items.map((item) => (
        <div key={item.title} className="border-t border-surface pt-5">
          <h3 className="text-base font-semibold text-ink">{item.title}</h3>
          <p className="mt-2 max-w-2xl text-base leading-8 text-muted">{item.body}</p>
        </div>
      ))}
    </div>
  );
}

export default function CareersPage() {
  return (
    <PublicLayout className="bg-canvas text-ink">
      <PublicMain className="bg-canvas text-ink">
        <section className="px-4 py-16 md:px-6 md:py-24" aria-labelledby="careers-heading">
          <div className="mx-auto w-full max-w-3xl text-center">
            <p className="text-sm font-semibold text-accent">Company</p>
            <h1 id="careers-heading" className="mx-auto mt-6 max-w-3xl text-4xl font-semibold leading-none tracking-normal text-ink md:text-6xl">
              Build safe, generalized enterprise software
            </h1>
            <p className="mx-auto mt-8 max-w-xl text-lg leading-8 text-muted">
              We're looking for world-class builders from a range of disciplines.
            </p>
            <div className="mt-8">
              <a href="#open-roles" className="inline-flex h-11 items-center gap-2 bg-accent px-5 text-sm font-semibold text-white shadow-soft hover:bg-accent-hover">
                View open roles
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>

        <section className="border-t border-surface bg-paper px-4 py-14 md:px-6 md:py-20" aria-labelledby="careers-mission">
          <div className="mx-auto w-full max-w-3xl text-center">
            <h2 id="careers-mission" className="mx-auto max-w-3xl text-2xl font-semibold leading-tight text-ink md:text-4xl">
              Software must adapt to the full spectrum of humanity's experiences and perspectives.
            </h2>
          </div>
        </section>

        <section className="border-t border-surface px-4 py-14 md:px-6 md:py-20" aria-labelledby="careers-values">
          <div className="mx-auto w-full max-w-2xl text-left">
            <h2 id="careers-values" className="text-2xl font-semibold text-ink">Values</h2>
            <p className="mt-3 max-w-2xl text-base leading-8 text-muted">
              These values define our most important focuses and guide our decision-making.
            </p>
            <PrincipleList items={values} />
          </div>
        </section>

        <section className="border-t border-surface bg-accent-soft px-4 py-14 md:px-6 md:py-20" aria-labelledby="careers-coordination">
          <div className="mx-auto w-full max-w-3xl text-center">
            <p id="careers-coordination" className="mx-auto max-w-3xl text-2xl font-semibold leading-tight text-ink md:text-4xl">
              We must build systems with perfect memory and prophetic foresight to ensure planetary coordination.
            </p>
          </div>
        </section>

        <section className="border-t border-surface bg-paper px-4 py-14 md:px-6 md:py-20" aria-labelledby="careers-principles">
          <div className="mx-auto w-full max-w-2xl text-left">
            <h2 id="careers-principles" className="text-2xl font-semibold text-ink">Operating Principles</h2>
            <p className="mt-3 max-w-2xl text-base leading-8 text-muted">
              These define how we work. They establish a culture that builds world-class software.
            </p>
            <PrincipleList items={operatingPrinciples} />
          </div>
        </section>

        <section id="open-roles" className="border-t border-surface px-4 py-14 md:px-6 md:py-20" aria-labelledby="careers-open-roles">
          <div className="mx-auto w-full max-w-2xl text-left">
            <h2 id="careers-open-roles" className="text-2xl font-semibold text-ink">Open roles</h2>
            <p className="mt-3 max-w-2xl text-base leading-8 text-muted">
              We are looking for exceptional builders across engineering, design, operations, research, and customer-facing work.
            </p>
            <div className="mt-8">
              <a href="/contact" className="inline-flex h-11 items-center gap-2 border border-control-border bg-paper px-5 text-sm font-semibold text-ink shadow-soft hover:bg-surface">
                Contact recruiting
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>

        <section className="border-t border-surface bg-paper px-4 py-14 md:px-6 md:py-20" aria-labelledby="careers-benefits">
          <div className="mx-auto w-full max-w-2xl text-left">
            <h2 id="careers-benefits" className="text-2xl font-semibold text-ink">Benefits</h2>
            <p className="mt-3 max-w-2xl text-base leading-8 text-muted">
              Intelligence must be rewarded with abundance. Our benefits package supports you as you prepare the world for tomorrow.
            </p>
          </div>
        </section>
      </PublicMain>
    </PublicLayout>
  );
}

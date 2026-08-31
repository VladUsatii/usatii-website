import Image from "next/image";
import Link from "next/link";
import Header from "@/app/_components/header";
import Footer from "@/app/_components/footer";

export const metadata = {
  title: "Social impact",
  description:
    "Usatii Media’s commitments to reducing administrative labor, improving working life, preserving organizational control, and governing artificial intelligence responsibly.",
  alternates: { canonical: "/social-impact" },
  openGraph: {
    title: "Social impact | Usatii Media",
    description:
      "Usatii Media’s commitments to reducing administrative labor, improving working life, preserving organizational control, and governing artificial intelligence responsibly.",
    url: "/social-impact",
    type: "article",
  },
};

function ReportImage({ src, alt }) {
  return (
    <figure className="my-9 sm:my-11">
      <div className="relative aspect-[16/9] overflow-hidden bg-neutral-100">
        <Image src={src} alt={alt} fill sizes="(min-width: 768px) 700px, calc(100vw - 40px)" className="object-cover grayscale" />
      </div>
    </figure>
  );
}

function ReportSection({ title, image, imageAlt, children }) {
  return (
    <section className="border-t border-neutral-200 pt-8">
      <h2 className="text-[24px] font-medium leading-tight tracking-[-0.025em] text-neutral-950 sm:text-[28px]">{title}</h2>
      <div className="mt-5 space-y-6">{children}</div>
      <ReportImage src={image} alt={imageAlt} />
    </section>
  );
}

export default function SocialImpactPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-950">
      <Header />
      <main>
        <article className="mx-auto w-full max-w-[1180px] px-5 pb-28 pt-14 sm:px-7 lg:pb-36 lg:pt-18">
          <Link href="/about" className="text-[12px] font-medium text-neutral-500 transition hover:text-neutral-950">Company</Link>

          <header className="max-w-[860px]">
            <h1 className="mt-7 text-[42px] font-medium leading-[1.02] tracking-[-0.04em] sm:text-[54px] lg:text-[68px]">Social impact</h1>
            <div className="mt-7 flex items-center gap-3 text-[12px]">
              <span className="font-medium">Company report</span>
              <span className="text-neutral-500">Aug 31, 2026</span>
            </div>
          </header>

          <div className="mx-auto mt-16 max-w-[700px] space-y-14 text-[16px] leading-[1.8] text-neutral-950 sm:mt-20 sm:text-[17px]">
            <p className="text-[21px] leading-[1.65] tracking-[-0.012em] sm:text-[24px]">
              Usatii is committed to improving the way people experience work. Our software reduces repetitive administrative tasks and improves quality of life for employees. We believe businesses should retain ownership over the technology that runs their organizations. By helping local and regional organizations modernize their operations, adopt artificial intelligence responsibly, and improve productivity, we aim to strengthen the communities that depend on these businesses as well.
            </p>

            <ReportSection title="We commit to returning time to people" image="/social-impact/time-returned.webp" imageAlt="An employee leaving a calm workplace in the late afternoon">
              <p>Administrative labor becomes a burden when employees spend their days copying information between systems, reconstructing histories, chasing approvals, and reporting facts the organization already possesses. We study those burdens inside the operation and build software that carries information forward, assigns responsibility clearly, and completes routine coordination automatically.</p>
              <p>We judge our progress by the useful time a system returns. Fewer repeated entries, fewer avoidable handoffs, shorter waits for decisions, and a reliable account of completed work give employees more room for judgment, service, craft, learning, and life beyond the working day.</p>
            </ReportSection>

            <ReportSection title="We commit to a better experience of work" image="/social-impact/better-work.webp" imageAlt="A small team working together in a bright and orderly workplace">
              <p>Workplace software establishes the conditions in which people perform a large part of their jobs. Fragmented information, obscure responsibilities, and constant interruption produce uncertainty and preventable pressure. We design clear records, intelligible workflows, accessible interfaces, and dependable automation so that employees can direct their attention toward the work that calls for their knowledge.</p>
              <p>We listen closely to the people who operate each process because their experience reveals where a system creates friction and where it can restore confidence. Their judgment shapes our requirements, our implementation, and our measure of success.</p>
            </ReportSection>

            <ReportSection title="We commit to organizational control" image="/social-impact/organizational-control.webp" imageAlt="A regional business owner overseeing an active modern operation">
              <p>An organization must understand and govern the technology that carries its work. We build systems that keep operational knowledge, records, permissions, and workflows under the organization’s authority. Leaders must be able to understand how critical processes function, decide who may change them, retrieve their data, and adapt the system as the organization evolves.</p>
              <p>We document architecture, define ownership, protect access, and preserve a clear path for maintenance. These practices convert technical control into institutional strength by allowing the organization to make decisions from knowledge instead of dependence.</p>
            </ReportSection>

            <ReportSection title="We commit to stronger local and regional organizations" image="/social-impact/stronger-communities.webp" imageAlt="Employees opening a local business on an active town street">
              <p>Local and regional organizations sustain employment, essential services, specialized knowledge, and relationships built over generations. Their strength reaches beyond their own walls because families, suppliers, customers, and civic institutions depend upon their continuity.</p>
              <p>We help these organizations modernize the operations that support their daily work and long-term growth. Each productive hour recovered, each process made more resilient, and each decision grounded in reliable information strengthens the institution and the community that relies upon it.</p>
            </ReportSection>

            <ReportSection title="We commit to responsible artificial intelligence" image="/social-impact/responsible-ai.webp" imageAlt="An experienced employee leading an operational decision in a modern facility">
              <p>We require every artificial intelligence capability to begin with a defined operational purpose, an accountable owner, governed access to data, review procedures, and a durable record of its actions. We preserve human authority over decisions that affect employees, customers, communities, and the rights of individuals.</p>
              <p>We examine the quality of the information a model receives, the limits of the conclusions it produces, and the consequences of error before we place it inside a workflow. We monitor its performance after deployment and revise or withdraw it when the evidence requires action. Responsible adoption remains a continuing obligation throughout the life of the system.</p>
            </ReportSection>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}

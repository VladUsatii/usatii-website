import { ArrowUpRight } from "lucide-react";

const projects = [
  { name: "Rebuildit Inc.", url: "https://www.rebuilditinc.com/", type: "Operations platform", description: "A high-trust construction operating system spanning inquiries, projects, payroll, HR, tasks, and team productivity." },
  { name: "Resolution, Inc.", url: "https://www.resolutionmarketing.org/", type: "Growth system", description: "A focused acquisition experience built around qualification, offer clarity, and low-friction applications." },
  { name: "Bishop3DO", url: "https://bishop-topaz.vercel.app/", type: "Medtech product", description: "A premium product experience explaining novel hardware, scan-to-fit workflow, clinical credibility, and purchase intent." },
];

export default function WebsiteShowcase() {
  return (
    <section className="w-full bg-white px-6 py-24 text-left lg:px-8">
      <div className="mx-auto max-w-6xl border-t border-neutral-200 pt-8">
        <h2 className="max-w-4xl text-4xl font-medium tracking-[-0.035em] text-neutral-950 sm:text-6xl">Infrastructure, presented clearly.</h2>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-neutral-600">Public-facing products and internal operations systems designed as one coherent business layer.</p>
        <div className="mt-14 border-t border-neutral-200">
          {projects.map((project, index) => (
            <article key={project.name} className="grid gap-5 border-b border-neutral-200 py-8 md:grid-cols-[80px_0.7fr_1fr_auto] md:items-start md:gap-8">
              <span className="text-sm tabular-nums text-neutral-400">0{index + 1}</span>
              <div><p className="text-sm text-neutral-500">{project.type}</p><h3 className="mt-2 text-2xl font-medium tracking-[-0.02em] text-neutral-950">{project.name}</h3></div>
              <p className="max-w-xl text-base leading-7 text-neutral-600">{project.description}</p>
              <a href={project.url} target="_blank" rel="noreferrer" aria-label={`Visit ${project.name}`} className="grid h-11 w-11 place-items-center rounded-full border border-neutral-300 transition hover:bg-neutral-100"><ArrowUpRight className="h-4 w-4" /></a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

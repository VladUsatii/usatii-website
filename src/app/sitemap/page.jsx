import Link from "next/link";
import Header from "@/app/_components/header";
import Footer from "@/app/_components/footer";
import { buildPageMetadata } from "@/lib/trades-page-utils";
import { getCanonicalSitemapPaths } from "@/lib/sitemap-data";

export const metadata = buildPageMetadata({
  title: "Sitemap",
  description: "A complete map of the canonical pages on USATII.",
  path: "/sitemap",
});

const groups = [
  { label: "software", test: (path) => path === "/software" || path.startsWith("/software/") },
  { label: "services", test: (path) => path === "/services" || path.startsWith("/services/") },
  { label: "industries", test: (path) => path === "/industries" || path.startsWith("/industries/") },
  { label: "locations", test: (path) => path === "/locations" || path.startsWith("/locations/") },
  { label: "case-studies", test: (path) => path === "/case-studies" || path.startsWith("/case-studies/") },
  { label: "resources", test: (path) => path === "/resources" || path.startsWith("/resources/") },
  { label: "compare", test: (path) => path === "/compare" || path.startsWith("/compare/") },
];

function RouteLink({ path, last }) {
  const name = path === "/" ? "home" : path.split("/").filter(Boolean).at(-1);

  return (
    <li className="flex min-w-0 items-start gap-3">
      <span aria-hidden="true" className="shrink-0 text-neutral-300">
        {last ? "└──" : "├──"}
      </span>
      <Link
        href={path}
        className="min-w-0 break-words text-neutral-700 underline-offset-4 transition hover:text-violet-700 hover:underline"
      >
        {name}
      </Link>
    </li>
  );
}

export default async function SitemapPage() {
  const paths = await getCanonicalSitemapPaths();
  const assigned = new Set();
  const sections = groups.map((group) => {
    const routes = paths.filter(group.test);
    routes.forEach((route) => assigned.add(route));
    return { ...group, routes };
  });
  const rootRoutes = paths.filter((path) => !assigned.has(path));

  return (
    <>
      <Header />
      <main className="bg-white px-6 py-20 font-mono text-[13px] leading-7 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-6xl">
            <h1 className="mb-8 text-4xl font-medium tracking-[-0.035em] text-neutral-950 md:text-6xl">Sitemap</h1>

            <div className="font-semibold text-violet-600">usatii.com</div>
            <div className="grid gap-x-12 gap-y-8 border-l border-neutral-200 pl-4 md:grid-cols-2 lg:grid-cols-3">
              <ul>
                {rootRoutes.map((path, index) => (
                  <RouteLink key={path} path={path} last={index === rootRoutes.length - 1} />
                ))}
              </ul>

              {sections.filter((section) => section.routes.length).map((section, sectionIndex, visibleSections) => (
                <section key={section.label} aria-labelledby={`map-${section.label}`}>
                  <h2 id={`map-${section.label}`} className="flex gap-3 font-semibold text-violet-600">
                    <span aria-hidden="true">{sectionIndex === visibleSections.length - 1 ? "└──" : "├──"}</span>
                    {section.label}/
                  </h2>
                  <ul className="ml-[1.15rem] border-l border-neutral-200 pl-4">
                    {section.routes.map((path, index) => (
                      <RouteLink key={path} path={path} last={index === section.routes.length - 1} />
                    ))}
                  </ul>
                </section>
              ))}
            </div>

        </div>
      </main>
      <Footer />
    </>
  );
}

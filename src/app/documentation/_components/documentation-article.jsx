import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Header from "@/app/_components/header";
import Footer from "@/app/_components/footer";
import { documentationPages } from "@/lib/documentation";
import styles from "@/app/news/introducing-usatii-for-construction/article.module.css";
import linkStyles from "@/app/news/how-usatii-approaches-custom-software/article.module.css";

function headingId(children) {
  const text = String(children);
  const special = {
    "Have a bootcamp coming up? Start here": "getting-started",
    "A brief overview of the bootcamp": "bootcamp-overview",
  };
  return special[text] || text.toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const markdownComponents = {
  h2: ({ children }) => <h2 id={headingId(children)} className="!mb-6 !mt-16 scroll-mt-28 first:!mt-0">{children}</h2>,
  h3: ({ children }) => <h3 id={headingId(children)} className="mb-5 mt-10 scroll-mt-28 text-[21px] font-medium leading-snug tracking-[-0.02em]">{children}</h3>,
  a: ({ href, children }) => {
    const external = /^https?:\/\//.test(href);
    const icon = external
      ? `https://www.google.com/s2/favicons?domain=${new URL(href).hostname}&sz=32`
      : "/favicon.ico";
    return <Link href={href} className={linkStyles.sourceLink} style={{ "--source-icon": `url("${icon}")` }}>{children}</Link>;
  },
  ul: ({ children }) => <ul className="mb-6 list-disc space-y-3 pl-6">{children}</ul>,
  ol: ({ children }) => <ol className="mb-6 list-decimal space-y-3 pl-6">{children}</ol>,
  blockquote: ({ children }) => <blockquote className="my-7 border-l border-neutral-300 pl-5 text-neutral-600 [&_p]:!mb-0">{children}</blockquote>,
  table: ({ children }) => <div className="my-8 max-w-full overflow-x-auto" role="region" aria-label="Reference table" tabIndex={0}><table className="w-full border-collapse text-left text-[13px] leading-6">{children}</table></div>,
  th: ({ children }) => <th scope="col" className="border-b border-neutral-950 px-3 py-3 align-bottom font-medium first:pl-0">{children}</th>,
  td: ({ children }) => <td className="border-b border-neutral-200 px-3 py-3 align-top first:min-w-36 first:pl-0">{children}</td>,
  p: ({ children, node }) => {
    // Keep the SVG figure outside a paragraph so the document remains valid HTML.
    if (node.children.some((child) => child.tagName === "img")) return <>{children}</>;
    return <p>{children}</p>;
  },
  img: ({ src, alt }) => <figure className="my-8">
    <picture>
      <source media="(max-width: 640px)" srcSet="/documentation/fde-process-mobile.svg" width="460" height="1900" />
      <img src={src} alt={alt} width="960" height="1040" loading="lazy" className="block h-auto w-full" />
    </picture>
    <figcaption className="mt-4 text-[12px] leading-5 text-neutral-500">Discovery, pilot engineering, demonstrations, and the bootcamp have no development fee. Travel expenses and production implementation are separate.</figcaption>
  </figure>,
};

export default function DocumentationArticle({ page }) {
  return <div className="min-h-screen bg-white text-neutral-950">
    <Header />
    <main>
      <div className="mx-auto w-full max-w-[1080px] px-5 pb-28 pt-10 sm:px-7 lg:pb-36">
        <div className="grid items-start gap-8 md:grid-cols-[180px_minmax(0,1fr)]">
          <aside className={styles.sidePicker}>
            <details open>
              <summary>Documentation</summary>
              <nav aria-label="Documentation topics">
                {documentationPages.map((entry) => <Link key={entry.slug} href={entry.href} aria-current={entry.slug === page.slug ? "page" : undefined} className={entry.slug === page.slug ? "!text-neutral-950 underline decoration-neutral-400 underline-offset-4" : undefined}>{entry.label}</Link>)}
              </nav>
            </details>
            {page.sections && <details className="mt-7">
              <summary>On this page</summary>
              <nav aria-label="Sections in this guide">
                {page.sections.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}
              </nav>
            </details>}
          </aside>
          <article className={styles.articleBody}>
            <header className="mb-7">
              <h1 className="text-[38px] font-medium leading-[1.04] tracking-[-0.038em] sm:text-[46px] lg:text-[54px]">{page.title}</h1>
            </header>
            {page.slug === "bootcamp" && <figure className="mb-9">
              <Image src="/documentation/bootcamp-session.webp" alt="A presenter speaking with a microphone beside a whiteboard and lectern in a lecture room" width={1717} height={989} sizes="(min-width: 1080px) 812px, (min-width: 768px) calc(100vw - 268px), calc(100vw - 40px)" priority className="h-auto w-full" />
            </figure>}
            <div className={styles.prose} style={{ maxWidth: "none", margin: 0 }}>
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>{page.content}</ReactMarkdown>
            </div>
          </article>
        </div>
      </div>
    </main>
    <Footer />
  </div>;
}

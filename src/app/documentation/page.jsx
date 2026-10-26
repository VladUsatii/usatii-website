import Link from "next/link";
import DocumentationArticle from "./_components/documentation-article";
import { documentationPages } from "@/lib/documentation";
import linkStyles from "@/app/news/how-usatii-approaches-custom-software/article.module.css";

export const metadata = {
  title: "Documentation",
  description: "Guides to working with Usatii: pilot bootcamps, account and API access, data handling, implementation, and employee adoption.",
  alternates: { canonical: "/documentation" },
  openGraph: {
    title: "Documentation",
    description: "Guides to working with Usatii, from pilot preparation to production implementation.",
    url: "/documentation",
    type: "website",
  },
};

export default function DocumentationPage() {
  return <DocumentationArticle page={{ slug: "overview", title: "Documentation" }}>
    <p>Guides to preparing your team, evaluating a pilot, and implementing software with Usatii.</p>
    <ul className="mt-8 list-none">
      {documentationPages.map((page) => <li key={page.slug} className="border-t border-neutral-200 py-6">
        <h2 className="!mb-3 !text-[21px]">
          <Link href={page.href} className={linkStyles.sourceLink} style={{ "--source-icon": 'url("/favicon.ico")' }}>{page.title}</Link>
        </h2>
        <p className="!mb-0 text-[15px] leading-7 text-neutral-600">{page.description}</p>
      </li>)}
    </ul>
  </DocumentationArticle>;
}

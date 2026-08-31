import { notFound } from "next/navigation";
import IndustryDetail from "@/app/industries/_components/industry-detail";
import {
  getIndustryPageBySlug,
  INDUSTRY_PAGE_DATA,
} from "@/lib/trades-seo-data";
import { buildPageMetadata, buildStandardSchemas } from "@/lib/trades-page-utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return INDUSTRY_PAGE_DATA.map((industry) => ({ industry: industry.slug }));
}

export async function generateMetadata({ params }) {
  const { industry } = await params;
  const page = getIndustryPageBySlug(industry);

  if (!page) {
    return {
      title: "Page Not Found | USATII",
    };
  }

  return buildPageMetadata({
    title: `${page.trade} operations software`,
    description: page.opening,
    path: `/industries/${page.slug}`,
  });
}

export default async function IndustryDetailPage({ params }) {
  const { industry } = await params;
  const page = getIndustryPageBySlug(industry);

  if (!page) {
    notFound();
  }

  const schemas = buildStandardSchemas({
    path: `/industries/${page.slug}`,
    title: `${page.trade} operations software`,
    description: page.opening,
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Industries", path: "/industries" },
      { name: page.trade, path: `/industries/${page.slug}` },
    ],
    faqs: page.faqs,
    serviceType: `${page.trade} operations software`,
    areaServed: ["United States"],
  });

  const pageIndex = INDUSTRY_PAGE_DATA.findIndex((item) => item.slug === page.slug);
  const relatedIndustries = [1, 2, 3].map(
    (offset) => INDUSTRY_PAGE_DATA[(pageIndex + offset) % INDUSTRY_PAGE_DATA.length]
  );

  return <IndustryDetail page={page} relatedIndustries={relatedIndustries} schemas={schemas} />;
}

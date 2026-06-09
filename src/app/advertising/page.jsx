import { SchemaScripts } from "@/app/_components/trades/chunky-seo-layout";
import AdvertisingCourse from "@/app/advertising/_components/advertising-course-minimal";
import {
  ADVERTISING_PATH,
  COURSE_FAQS,
  COURSE_SUBTITLE,
  COURSE_TITLE,
} from "@/app/advertising/_components/advertising-course-data";
import { buildStandardSchemas } from "@/lib/trades-page-utils";
import { absoluteUrl } from "@/lib/trades-schema";

const SEO_TITLE = "Advertising 101 for Business Owners | USATII Media";
const SEO_DESCRIPTION =
  "Learn the basics of Google Ads, Meta Ads, organic social media, SEO, ad budgets, CPM, CPC, and conversion tracking before starting a campaign.";

export const metadata = {
  title: {
    absolute: SEO_TITLE,
  },
  description: SEO_DESCRIPTION,
  alternates: {
    canonical: absoluteUrl(ADVERTISING_PATH),
  },
  openGraph: {
    title: SEO_TITLE,
    description: SEO_DESCRIPTION,
    url: absoluteUrl(ADVERTISING_PATH),
    siteName: "USATII",
    type: "website",
  },
};

function buildCourseSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": `${absoluteUrl(ADVERTISING_PATH)}#course`,
    name: COURSE_TITLE,
    description: COURSE_SUBTITLE,
    url: absoluteUrl(ADVERTISING_PATH),
    timeRequired: "PT8M",
    educationalLevel: "Beginner",
    provider: {
      "@id": "https://usatii.com#organization",
    },
    teaches: [
      "What paid ads are",
      "Why Google Search Ads often come first",
      "How Meta Ads differ from Google Ads",
      "Why organic social should run in parallel",
      "Why websites, sitemaps, SEO, tracking, and landing pages matter",
      "What CPM, CPC, CTR, CPA, conversion, bid, budget, campaign, pixel, retargeting, and SEO mean",
    ],
  };
}

export default async function AdvertisingPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const initialCompleted = resolvedSearchParams?.completed === "true";

  const schemas = [
    ...buildStandardSchemas({
      path: ADVERTISING_PATH,
      title: COURSE_TITLE,
      description: SEO_DESCRIPTION,
      breadcrumbs: [
        { name: "Home", path: "/" },
        { name: "Advertising 101", path: ADVERTISING_PATH },
      ],
      faqs: COURSE_FAQS,
      includeFounder: false,
    }),
    buildCourseSchema(),
  ];

  return (
    <>
      <SchemaScripts schemas={schemas} />
      <AdvertisingCourse initialCompleted={initialCompleted} />
    </>
  );
}

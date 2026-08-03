import Footer from "@/app/_components/footer";
import Header from "@/app/_components/header";
import { SchemaScripts } from "@/app/_components/trades/chunky-seo-layout";
import ReviewsStories from "@/app/reviews/_components/reviews-stories";
import { buildPageMetadata, buildStandardSchemas } from "@/lib/trades-page-utils";

const PATH = "/reviews";

export const metadata = buildPageMetadata({
  title: "Customer Stories",
  description: "Customer stories and reviews from teams working with USATII.",
  path: PATH,
});

export default function ReviewsPage() {
  const schemas = buildStandardSchemas({
    path: PATH,
    title: "Customer Stories",
    description: "Customer stories and reviews from teams working with USATII.",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Reviews", path: PATH },
    ],
    serviceType: "Software and Marketing Systems",
    areaServed: ["United States"],
    includeArticle: true,
  });

  return (
    <>
      <Header />
      <main className="bg-white text-neutral-950">
        <SchemaScripts schemas={schemas} />

        <ReviewsStories />
      </main>
      <Footer />
    </>
  );
}

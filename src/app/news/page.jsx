import Header from "@/app/_components/header";
import Footer from "@/app/_components/footer";
import NewsIndex from "./news-index";

export const metadata = {
  title: "News",
  description:
    "Latest company news, product updates, engineering notes, and field insights from USATII.",
  alternates: { canonical: "/news" },
};

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-950">
      <Header />
      <NewsIndex />
      <Footer />
    </div>
  );
}

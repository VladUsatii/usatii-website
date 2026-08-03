import Header from "@/app/_components/header";
import Footer from "@/app/_components/footer";
import SoftwarePageClient from "./software-page-client";
import { buildPageMetadata } from "@/lib/trades-page-utils";

export const metadata = buildPageMetadata({
  title: "Software Systems Built Around Your Business",
  description:
    "Custom software systems by USATII for teams ready to replace disconnected tools and operate from one clear system.",
  path: "/software",
});

export default function SoftwarePage() {
  return (
    <>
      <Header />
      <SoftwarePageClient />
      <Footer />
    </>
  );
}

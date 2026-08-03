import Header from "@/app/_components/header";
import Footer from "@/app/_components/footer";
import ContactPageClient from "./contact-page-client";

export const metadata = {
  title: "Contact Us | USATII Media",
  description: "Contact the USATII Media sales team about marketing and operations software.",
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <ContactPageClient />
      <Footer />
    </>
  );
}

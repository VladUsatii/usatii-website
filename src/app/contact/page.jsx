import Header from "@/app/_components/header";
import Footer from "@/app/_components/footer";
import ContactPageClient from "./contact-page-client";

export const metadata = {
  title: "Contact Us | USATII Media",
  description: "Contact USATII about custom business software, websites, and artificial intelligence integration.",
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

import Image from "next/image";
import Link from "next/link";
import Header from "@/app/_components/header";
import Footer from "@/app/_components/footer";
import { SchemaScripts } from "@/app/_components/trades/chunky-seo-layout";
import { buildArticleSchema, buildFounderPersonSchema, buildOrganizationSchema } from "@/lib/trades-schema";

export const metadata = {
  title: "Introducing digital business cards",
  description: "Usatii Media now supports digital business cards through Apple Wallet.",
  alternates: { canonical: "/news/introducing-digital-business-cards" },
  openGraph: {
    title: "Introducing digital business cards",
    description: "Usatii Media now supports digital business cards through Apple Wallet.",
    images: ["/news/digital-business-card.webp"],
  },
};

function ArticleImage({ src, alt, restrained = false }) {
  if (restrained) {
    return (
      <figure className="mx-auto my-12 max-w-[340px] sm:my-14">
        <Image
          src={src}
          alt={alt}
          width={640}
          height={810}
          sizes="(min-width: 640px) 340px, 84vw"
          className="h-auto w-full"
        />
      </figure>
    );
  }

  return (
    <figure className="mx-auto my-12 w-full max-w-[880px] sm:my-14">
      <div className="relative aspect-[16/9] overflow-hidden bg-[#f3f3f0]">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 880px, 92vw"
          className="object-cover"
        />
      </div>
    </figure>
  );
}

export default function DigitalBusinessCardsArticle() {
  const schemas = [
    buildOrganizationSchema(),
    buildFounderPersonSchema(),
    buildArticleSchema({
      path: "/news/introducing-digital-business-cards",
      title: "Introducing digital business cards",
      description: "Usatii Media now supports digital business cards through Apple Wallet.",
      datePublished: "2026-08-28",
      dateModified: "2026-08-28",
      image: "/news/digital-business-card.webp",
    }),
  ];
  return (
    <div className="min-h-screen bg-white text-neutral-950">
      <Header />
      <main>
        <SchemaScripts schemas={schemas} />
        <article className="mx-auto w-full max-w-[1180px] px-5 pb-28 pt-14 sm:px-7 lg:pb-36 lg:pt-18">
          <Link href="/news" className="text-[12px] font-medium text-neutral-500 transition hover:text-neutral-950">
            News
          </Link>

          <header className="max-w-[820px]">
            <h1 className="mt-7 text-[38px] font-medium leading-[1.04] tracking-[-0.038em] sm:text-[46px] lg:text-[54px]">
              Introducing digital business cards
            </h1>
            <p className="mt-6 max-w-[620px] text-[16px] italic leading-7 text-neutral-700 sm:text-[18px]">
              Usatii Media now supports digital business cards through Apple Wallet.
            </p>
            <div className="mt-6 flex items-center gap-3 text-[12px]">
              <span className="font-medium">Product</span>
              <span className="text-neutral-500">Aug 28, 2026</span>
            </div>
          </header>

          <div className="mx-auto mt-14 max-w-[660px] space-y-6 text-[16px] font-normal leading-[1.75] text-black">
            <p>Each card is issued from a dedicated URL per employee at any organization.</p>

            <p>card.usatii.com/vlad, for example, generates an Apple Wallet card containing the holder’s business identity and their contact information. A QR code is embedded so that others can scan and save it as well.</p>

            <p>The card can be added directly to Apple Wallet and stored on the recipient’s phone. It is designed for meetings, conferences, and other in-person introductions.</p>

            <p>Each card contains a full name, your company and role, a phone number, a good email address and website to reach you at, and other business information that you specify. The card is then presented through an Apple Wallet card that you can save to your iPhone.</p>
          </div>

          <ArticleImage
            src="/news/digital-business-card.webp"
            alt="USATII digital business card for Apple Wallet with contact details blurred"
            restrained
          />

          <div className="mx-auto max-w-[660px] space-y-6 text-[16px] font-normal leading-[1.75] text-black">
            <p>To ensure social robustness, we use QR codes. A QR code displayed on the card can open the corresponding card URL, allowing another person to add the card to their own device without friction. Ideally, NFC should make tapping your phone present your card, but this is yet to be a native iOS feature.</p>

            <p>Organizations can use our card system for employee identification as well. In on example, each employee receives a persistent card.usatii.com address. The same address can be distributed through email signatures, websites, printed materials, or other company systems. After it is added to each employee&apos;s phone, Apple Wallet handles its storage and presentation on the device and it can be used to check into a building or identify their unique identity.</p>
          </div>

          <ArticleImage
            src="/news/employee-wallet-check-in.webp"
            alt="Employee using a digital Wallet card to check into a workplace"
          />

          <div className="mx-auto max-w-[660px] space-y-6 text-[16px] font-normal leading-[1.75] text-black">
            <p>Our card system separates data from distribution. Identity information is managed by the software that generates the pass. The URL provides a consistent endpoint for issuing it.</p>

            <p>This architecture also allows digital business cards to be managed as organizational infrastructure. A company can issue individual cards to employees while maintaining common company information, branding, and configuration across the organization.</p>

            <p>As we navigate a paper-free, administrative world where identities become salient digitally rather than via conventional means, we encourage our partners to aid us in developing best practices and better understand the current card culture.</p>

            <p>We will continue to embed additional Wallet capabilities to this new product.</p>

            <p>Digital business cards are now being used internally at Usatii and these capabilities are officially offered by our firm to other organizations for a quoted fee. The first public card demo is available at card.usatii.com/vlad.</p>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}

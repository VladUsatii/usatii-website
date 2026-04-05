import Link from "next/link";
import { Button } from "@/components/ui/button";
import DocumentationCarousel from "./_components/documentation-carousel";
import { getDocumentationPdfs } from "@/lib/documentation";

export const metadata = {
  title: "Documentation",
  description:
    "USATII Media documentation library with a fixed in-browser PDF carousel and implementation notes.",
};

export const revalidate = 3600;

export default async function DocumentationPage() {
  const docs = await getDocumentationPdfs();

  return (
    <div className="flex h-[100dvh] w-full flex-col overflow-hidden bg-slate-950">
      <header className="z-40 border-b border-slate-200/80 bg-white/92 backdrop-blur">
        <div className="mx-auto flex w-full items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="block">
            <div className="text-center font-black italic tracking-tight hover:opacity-80">
              USATII MEDIA
            </div>
          </Link>

          <Link href="https://cal.com/usatii/onboarding" target="_blank" rel="noreferrer">
            <Button className="cursor-pointer border-[2px] border-black bg-white px-5 py-3 text-sm font-semibold text-black transition hover:scale-105 hover:bg-white">
              Book call
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 min-h-0 w-full">
        <DocumentationCarousel docs={docs} />
      </main>
    </div>
  );
}

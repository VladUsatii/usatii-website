"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Header() {
  return (
    <header className="flex flex-col gap-3 px-3 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="flex items-center gap-3 text-lg font-black italic tracking-tight sm:text-2xl md:text-3xl"
        >
          <span
            aria-hidden="true"
            className="h-[1em] w-[1em] shrink-0 rounded-full bg-[radial-gradient(circle_at_32%_24%,rgba(255,255,255,0.42),transparent_30%),linear-gradient(135deg,#db37ff_0%,#b91cff_42%,#8b16ef_100%)] shadow-[inset_0.25em_0.2em_0.45em_rgba(255,255,255,0.2),inset_-0.35em_-0.3em_0.6em_rgba(67,0,142,0.34),0_0.25em_0.7em_rgba(168,85,247,0.32)]"
          />
          <span>USATII MEDIA</span>
        </Link>
      </div>

      <div className="flex flex-row items-center gap-x-2 sm:gap-x-4">
        <Link href="/quote-request">
          <Button className="cursor-pointer bg-neutral-900 text-white hover:bg-black border-[2px] border-neutral-900 px-2 sm:px-5 py-3 text-xs sm:text-sm font-semibold transition hover:scale-105">
            Get a quote
          </Button>
        </Link>
        <Link href="https://cal.com/usatii/onboarding" target="_blank">
          <Button className="cursor-pointer bg-white text-black hover:bg-white border-[2px] border-black px-2 sm:px-5 py-3 text-xs sm:text-sm font-semibold transition hover:scale-105">
            Book now
          </Button>
        </Link>
        <Link
          href="/portal/login"
          target="_blank"
          className="cursor-pointer text-black hover:underline pr-2 sm:pr-5 py-3 text-xs sm:text-sm font-semibold transition hover:scale-105"
        >
          Client login
        </Link>
      </div>
    </header>
  );
}

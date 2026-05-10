"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Header() {
  return (
    <header className="flex flex-col gap-3 px-3 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div className="flex items-center gap-4">
        <Link href="/" className="text-lg sm:text-2xl md:text-3xl font-black tracking-[-1px] italic">
          USATII MEDIA
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

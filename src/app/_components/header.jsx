'use client'
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

// components/Header.jsx
export default function Header() {
  return (
    <header className="flex items-center justify-between px-3 sm:px-6 py-4">
      <span className="text-lg sm:text-2xl md:text-3xl font-black tracking-[-1px] italic">USATII&nbsp;MEDIA</span>

    <div className="flex flex-row items-center gap-x-2 sm:gap-x-4">
      <p className="text-xs sm:text-sm">Build a content system.</p>
      <Link
        href="/apply"
        target="_blank"
      >
        <Button className="cursor-pointer bg-white text-black hover:bg-white border-[2px] border-black px-2 sm:px-5 py-3 text-xs sm:text-sm font-semibold tranisition hover:scale-105">APPLY NOW</Button>
      </Link>
    </div>
    </header>
  );
}

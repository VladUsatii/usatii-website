'use client'
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

// components/Header.jsx
export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4">
      <span className="text-3xl font-black tracking-[-1px] italic">USATII&nbsp;MEDIA</span>
      <Link
        href="https://calendly.com/usatii/onboarding"
        target="_blank"
      >
        <Button className="cursor-pointer bg-white text-black hover:bg-white border-[3px] border-black px-5 py-3 text-md font-semibold tranisition hover:scale-105">Book a call</Button>
      </Link>
    </header>
  );
}

// components/Hero.js
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center gap-6 py-20 mx-3 text-center">
      <h1 className="max-w-4xl text-5xl font-black md:text-7xl tracking-tight">
        We build <span className="text-indigo-600">systems</span> for organic marketing.
      </h1>

      <Link
        id="book"
        href="https://calendly.com/usatii/onboarding"
        target="_blank"
      >
        <Button className="cursor-pointer  text-xl font-bold px-6 py-6 rounded-[25px] transition hover:scale-105">Book a discovery call 📓</Button>
      </Link>

      {/* replace /figma-demo.gif with your actual file */}
      <div className="mt-[75px] aspect-video w-full max-w-4xl flex items-center justify-center">
        <Image
          alt="diagram"
          src="https://diagrams.helpful.dev/d/d:iTyrxEyZ"
          width={500}
          height={500}
          unoptimized
        />
      </div>
    </section>
  );
}

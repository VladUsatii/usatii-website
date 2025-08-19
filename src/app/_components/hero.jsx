// components/Hero.js
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import AvatarGroup from "./avatar-group";
import LogoMarquee from "./logo-marquee";
import CaseStudySwiper from "./case-study-swiper";
import SystemsBentoGrid from "./bento-systems";
import DemoGridWithLiveVideo from "./demo-grid-live-video";

export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center gap-6 py-20 mx-3 text-center">
      <h1 className="max-w-4xl text-5xl font-black md:text-7xl tracking-tight">
        We build marketing <span className="text-indigo-600"> systems</span> for teams.
      </h1>

      <h3 className="font-bold text-xl md:text-2xl tracking-tight mx-3">Clients save 30 hrs/week on content and $10K/yr on software.</h3>

      <Link
        id="book"
        href="https://cal.com/usatii/onboarding"
        target="_blank"
      >
        <Button className="cursor-pointer  text-lg font-bold px-6 py-6 rounded-[25px] transition hover:scale-105">Book a call ☕️</Button>
      </Link>
        <div className="flex flex-col items-center justify-center gap-y-3 mt-4 p-5 text-sm sm:text-md">
          <AvatarGroup count={5} size={42} />
          <p>Helping 1,000+ other founders achieve their<br />
          business goals through proven systems.</p>
        </div>

        <LogoMarquee images={[
          "https://i.postimg.cc/L5DXdKt9/CPADUDEIMAGE.png",
          "https://i.postimg.cc/8Py5tGkw/FRIMAGE.png",
          "https://i.postimg.cc/3xdwqqdh/GAMMAIMAGE.png",
          "https://i.postimg.cc/wTxMXMz7/HTIMAGE.png",
          "https://i.postimg.cc/DfPm4st9/KALMIMAGE.png",
          "https://i.postimg.cc/YCZSBxWW/SPECTRESIMAGE.png"
        ]} />

      {/* <h3 className="text-3xl font-black mt-16">Here is an example system.</h3>
      <p className="text-md text-muted-foreground max-w-xl mx-auto">
        Proven engines built for founders: from ideation to growth, fully automated.
      </p>
      <div className="mt-[75px] aspect-video w-full max-w-4xl flex items-center justify-center">
        <Image
          alt="diagram"
          src="https://diagrams.helpful.dev/d/d:iTyrxEyZ"
          width={500}
          height={500}
          unoptimized
        />
      </div> */}


      <SystemsBentoGrid />

      <DemoGridWithLiveVideo />

      <CaseStudySwiper />
    </section>
  );
}

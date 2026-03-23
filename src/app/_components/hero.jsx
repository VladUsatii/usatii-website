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
import TrustedByGrid from "./brands";
import HeroSection from "./top-hero";

export default function Hero() {
  return (
    <>
    <HeroSection />
    <section className="flex flex-col items-center justify-center gap-6 py-10 mx-0 text-center">
      <TrustedByGrid />
      <SystemsBentoGrid />
      <DemoGridWithLiveVideo />
      <CaseStudySwiper />
    </section>
    </>
  );
}

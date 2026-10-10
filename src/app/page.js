import Header from "./_components/header";
import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import headerStyles from "./_components/public-header.module.css";
import WorkHome from "./_components/work-home";
// import Hero from "./_components/hero";
import Footer from "./_components/footer";
// import HeroTwo from "./_components/hero_two";
// import CaseStudySwiper from "./_components/case-study-swiper";
// import HeroThree from "./_components/hero_three";
// import HeroFour from "./_components/hero_four";
import UsatiiCard from "./_components/usatii-card";
// import HeroFive from "./_components/hero_five";
// import ComparisonTable from "./_components/comparison-table";
// import Roadmap from "./_components/roadmap";
// import WebsiteShowcase from "./_components/websites";
import EventsCarousel from "./_components/events-carousel";
import { events } from "@/lib/events";

export default function Home() {
  return (
    <>
      <Header />
      <aside className={headerStyles.banner} aria-label="USATII nonprofit initiative">
        <div className={headerStyles.bannerInner}>
          <span className={headerStyles.bannerName}>Usatii:<b>Nonprofit</b><em>[Initiative]</em></span>
          <p className={headerStyles.bannerCopy}>Explore our latest software builds with local Rochester nonprofits.</p>
          <Link className={headerStyles.bannerCta} href="/news/building-better-intelligence-tools-for-communication">Read now <ChevronRight size={16} aria-hidden="true" /></Link>
        </div>
      </aside>
      <main>
        <WorkHome />
        {/* Previous homepage sections preserved for reuse:
        <Hero />
        <Roadmap />
        <HeroTwo />
        <CaseStudySwiper />
        <WebsiteShowcase />
        <HeroThree />
        <ComparisonTable />
        <HeroFour />
        */}
        <EventsCarousel events={events} />
        {/* <HeroFive /> */}
      </main>
      <UsatiiCard />
      <Footer />
    </>
  );
}

import Image from "next/image";
import Header from "./_components/header";
import React from "react";
import Hero from "./_components/hero";
import Footer from "./_components/footer";
import HeroTwo from "./_components/hero_two";
import CaseStudySwiper from "./_components/case-study-swiper";
import HeroThree from "./_components/hero_three";
import HeroFour from "./_components/hero_four";
import Link from "next/link";
import UsatiiMediaCard from "./_components/usatii-media-card";
// import HeroFive from "./_components/hero_five";
import ComparisonTable from "./_components/comparison-table";
import Roadmap from "./_components/roadmap";
import WebsiteShowcase from "./_components/websites";
import EventsCarousel from "./_components/events-carousel";
import { events } from "@/lib/events";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Roadmap />
        <HeroTwo />
        <CaseStudySwiper />
        <WebsiteShowcase />
        <HeroThree />
        <ComparisonTable />
        <EventsCarousel events={events} />
        <HeroFour />
        {/* <HeroFive /> */}
      </main>
      <UsatiiMediaCard />
      <Footer />
    </>
  );
}

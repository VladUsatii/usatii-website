'use client'
import Image from "next/image";
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const benefits = [
  {
    title: "Marketing Architecture",
    rows: [
      ["What", "End‑to‑end content pipelines for video and text."],
      ["Where", "Code and no-code tools."],
      ["Why", "Eliminate guesswork and save hours."],
      ["Outcome", "Daily post cadence, saving you time."],
    ],
  },
  {
    title: "Funnel Mastery",
    rows: [
      ["What", "Content and wording formats for conversion."],
      ["Where", "Advanced tooling."],
      ["Why", "Boost customer acquisition."],
      ["Outcome", "+100 % targeted follower growth"],
    ],
  },
  {
    title: "Sales Blueprint",
    rows: [
      ["What", "Story‑selling frameworks for selling."],
      ["Where", "A pen, a paper, and a team."],
      ["Why", "Turn eyeballs into buyers."],
      ["Outcome", "Keep a steady ROI and high LTCV."],
    ],
  },
  {
    title: "Analytics Mastery",
    rows: [
      ["What", "Signal‑driven iteration."],
      ["Where", "Advanced analytics tooling."],
      ["Why", "Double down on winning strategies."],
      ["Outcome", "Compounding performance lifts."],
    ],
  },
];

function Apply() {
  return (
     <div className="min-h-screen bg-gradient-to-br from-[#0A000B] to-[#1a001d] text-white flex flex-col items-center">
      <div className="min-h-screen  text-white flex flex-col items-center">
      {/* Brand */}
      <Link href="/"><h1 className="font-black text-center text-md text-white/80 hover:text-white/100 pt-5">USATII MEDIA</h1></Link>

      <div className="transform skew-y-[2deg] skew-x-[1deg] flex flex-row items-center gap-x-4 justify-center w-full mt-10 mb-10">
        <Image
          alt="architect logo"
          width={70}
          height={70}
          src={"/architect_logo.png"}
          className="shadow-lg"
        />
        <h1 className="font-black text-4xl tracking-wider">ARCHITECT.</h1>
      </div>

      <div className="transform skew-y-[2deg] skew-x-[1deg]  flex flex-row items-center gap-x-2 justify-center text-center max-w-[850px] w-full mb-10">
        <h1 className="font-bold text-6xl tracking-tight">Your business is one step away from growth.</h1>
      </div>

      <div className="transform skew-y-[2deg] skew-x-[1deg] flex flex-col items-center gap-x-2 justify-center text-center max-w-[850px] w-full mb-20 opacity-70 gap-y-5">
        <h1 className="font-base text-2xl tracking-tight">The future belongs to founders who can leverage automated marketing systems to their advantage.</h1>

        <Button className="font-semibold border-white border-[2px] bg-transparent hover:bg-transparent hover:border-white opacity-70 hover:opacity-100 text-md px-5 py-5 rounded-[15px] hover:shadow-lg cursor-pointer">COMING SOON.</Button>
      </div>

      {/* Benefits Grid */}
      {/* <p>Coming soon.</p> */}
      {/* Benefits Grid */}
        <div className="w-full px-6 md:px-0">
          <div className="grid max-w-5xl mx-auto grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((b, i) => (
              <Card
                key={i}
                className="relative border border-pink-500/60 bg-black/20 backdrop-blur-md shadow-[0_0_20px_5px_rgba(255,0,150,0.4)] animate-neon rounded-2xl"
              >
                <CardHeader>
                  <CardTitle className="text-xl font-extrabold text-white">
                    {b.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <table className="w-full text-sm text-white/90">
                    <tbody>
                      {b.rows.map((row, idx) => (
                        <tr key={idx} className="border-t border-pink-500/20">
                          <td className="py-2 pr-4 font-semibold whitespace-nowrap">
                            {row[0]}
                          </td>
                          <td className="py-2">{row[1]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      {/* Test Section */}
      <div className="mx-auto px-4 md:px-8 lg:px-12">
      <div className="w-full max-w-5xl mt-[100px] text-white text-left">
        <h3 className="text-4xl font-extrabold mb-6">The Architect Advantage</h3>
        
        <p className="text-lg text-white/80 mb-4">
          Most founders are stuck playing the content game by ear, guessing what to post, chasing algorithms, and burning hours trying to be everywhere at once. Architect flips that model upside down.
        </p>
        
        <p className="text-md text-white/60 mb-4">
          This is a closed-door mentorship and execution lab for elite operators, designed to scale an online presence with precision in 60 days. We don't teach theory. We implement systems.
        </p>
        
        <p className="text-md text-white/60 mb-4">
          Inside, you'll work directly with our team to build out a full-stack content infrastructure: automated pipelines, proven conversion flows, audience capture systems, and frameworks that compound value over time. Every asset we touch is engineered to reduce friction and increase momentum across all channels, i.e. short-form video, written posts, press writing, and email marketing.
        </p>

        <p className="text-md text-white/60 mb-4">
          Whether you're scaling your personal brand, pushing a product, or building out a client acquisition flywheel, this is your unfair advantage.
        </p>

        <p className="text-md text-white font-bold mb-4">
          You bring the vision. We bring the views.
        </p>


        <div className="mt-10 p-6 rounded-xl border border-pink-500/30 bg-black/30 backdrop-blur-md shadow-lg mb-[100px]">
          <h4 className="text-xl font-bold text-white mb-2">Membership is Limited</h4>
          <p className="text-white/70">
            Architect is invite-only. If you're a founder or operator looking to systemize growth and build digital leverage, request access to join the next cohort of 7 founders.
          </p>
        </div>
      </div>
      </div>
      {/* Neon animation */}
      <style jsx global>{`
        @keyframes neonPulse {
          0% {
            box-shadow: 0 0 4px rgba(255, 0, 255, 0.4), 0 0 12px rgba(255, 0, 255, 0.3),
              0 0 24px rgba(255, 0, 255, 0.2);
          }
          50% {
            box-shadow: 0 0 8px rgba(255, 0, 255, 0.7), 0 0 20px rgba(255, 0, 255, 0.5),
              0 0 40px rgba(255, 0, 255, 0.3);
          }
          100% {
            box-shadow: 0 0 4px rgba(255, 0, 255, 0.4), 0 0 12px rgba(255, 0, 255, 0.3),
              0 0 24px rgba(255, 0, 255, 0.2);
          }
        }
        .animate-neon {
          animation: neonPulse 6s ease-in-out infinite alternate;
        }
      `}</style>
    </div>
    </div>
  );
}

export default Apply;

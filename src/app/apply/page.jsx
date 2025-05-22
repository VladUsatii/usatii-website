'use client'
import Image from "next/image";
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Footer from "../_components/footer";

const benefits = [
  {
    title: "System Architecture",
    rows: [
      ["Focus", "End‑to‑end content pipelines"],
      ["Why", "Eliminate guesswork, save hours"],
      ["Outcome", "Weekly posting cadence on autopilot"],
    ],
  },
  {
    title: "Audience Growth Engine",
    rows: [
      ["Focus", "Algorithm‑friendly formats"],
      ["Why", "Boost reach + engagement"],
      ["Outcome", "+300 % targeted follower growth"],
    ],
  },
  {
    title: "Conversion Blueprint",
    rows: [
      ["Focus", "Story‑selling frameworks"],
      ["Why", "Turn eyeballs into buyers"],
      ["Outcome", "Higher LTV & faster ROI"],
    ],
  },
  {
    title: "Analytics Mastery",
    rows: [
      ["Focus", "Signal‑driven iteration"],
      ["Why", "Cut waste, double down on wins"],
      ["Outcome", "Compounding performance lifts"],
    ],
  },
];

function Apply() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a001d] via-[#100013] to-[#1a001d] text-white p-5 flex flex-col items-center">
      {/* Brand */}
      <h1 className="font-black text-center text-md text-white/80">USATII MEDIA</h1>

      <div className="flex flex-row items-center gap-x-4 justify-center w-full mt-10 mb-10">
        <Image
          alt="architect logo"
          width={70}
          height={70}
          src={"/architect_logo.png"}
        />
        <h1 className="font-black text-4xl tracking-wider">ARCHITECT.</h1>
      </div>

      <div className="flex flex-row items-center gap-x-2 justify-center text-center max-w-[850px] w-full mb-20">
        <h1 className="font-bold text-6xl tracking-tight">Your business is one step away from growth.</h1>
      </div>

      {/* Benefits Grid */}
      <p>Coming soon.</p>
      {/* <div className="grid w-full max-w-5xl grid-cols-1 md:grid-cols-2 gap-8">
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
      </div> */}

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
  );
}

export default Apply;

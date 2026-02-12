import React from "react";
import Footer from "../_components/footer";
import { Github, Linkedin, Twitter, X } from "lucide-react";
import Link from "next/link";

/**
 * Write your bio as plain text.
 * For links, use: [[label|https://example.com]]
 * Newlines / spacing are preserved (and it still wraps).
 */
const BIO = `
I believe intelligence is [[compression|http://prize.hutter1.net/]].

This drives my core work towards studying patterns in program behavior and program analysis within popular systems (e.g. LLMs, cryptocurrencies). One day, I want to help us reach AGI and I believe that it starts with maximally compressing multiple humanities worth of information through intelligent algorithms.

I'm an undergraduate student of Computer Science B.S. at [[Rochester Institute of Technology (RIT)|https://www.rit.edu/study/computer-science-bs]], graduating in 2027 with the intent of pursuing [[Princeton's CS Master's program|https://www.cs.princeton.edu/grad/masters-degree-requirements]].

I work on computer security with a research focus on program analysis and the security of distributed systems. In the future, I'd like to pivot towards applying program analysis and security to traditional economic systems.

Currently, I do research on vulnerability classes and have discovered several zero-day vulnerabilities in high-stakes DeFi protocols with millions in LTV. I identified a gap in security systems for Ethereum smart contracts and am currently raising money for [[thrum.sh|https://thrum.sh/]], a research lab that is building a pipeline to detect every class of hidden bugs in protocol code. The goal is to abstract towards traditional financial tooling and collaborate on payment rails and government payment systems.

Outside of research, I run [[usatii.com|https://usatii.com/]] (Usatii Media), North America's largest marketing agency by views and upload volume. We serve 40+ clients in 10+ countries and generate 100M+ views every month for clients.

I've collaborated with the CEO of [[Gamma|https://gamma.app/]] (Series B), [[Airbo|https://www.airbo.com/]], [[TheCPADude|https://thecpadude.com/]], [[UNWD|https://feelkalm.com/]], [[Bishop3DO|https://bishop3do.com/]], [[Rich & Pour Teas|https://richandpourco.com/]], [[Spectres|https://spectres.io/]], [[Kerja.io|https://kerja.io/]], [[MotionElements|https://www.motionelements.com/]], [[Rebuildit Inc.|https://www.rebuilditinc.com/]], and over 150 other companies. I've worked with multiple celebrities as well (email for details).

`.trim();

function renderWithLinks(text) {
  const re = /\[\[([^\]|]+)\|([^\]]+)\]\]/g;
  const out = [];
  let last = 0;
  let m;

  while ((m = re.exec(text)) !== null) {
    const [full, label, href] = m;
    if (m.index > last) out.push(text.slice(last, m.index));

    out.push(
      <a
        key={`${href}-${m.index}`}
        href={href}
        target="_blank"
        rel="noreferrer"
        className="underline decoration-blue-500 underline-offset-4 hover:text-blue-600"
      >
        {label}
      </a>
    );

    last = m.index + full.length;
  }

  if (last < text.length) out.push(text.slice(last));
  return out;
}

export default function VladAbout() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-[800px]">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-start sm:gap-8">
          <img
            src="/aboutme.png"
            alt="Vlad Usatii"
            className="w-48 shrink-0 rounded-xl object-cover"
          />

          <div className="flex flex-col gap-3">
            <div className="flex justify-between">
            <h1 className="text-2xl font-bold tracking-tight">Vlad Usatii</h1>
            <div className="flex flex-row gap-x-2">
            <Link href="https://www.github.com/VladUsatii"><Github /></Link>
            <Link href="https://www.linkedin.com/in/vladusatii"><Linkedin /></Link>
            <Link href="https://www.x.com/vladusatii">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>

            </Link>
            </div>
            </div>

            <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-relaxed text-zinc-700 sm:text-base">
              {renderWithLinks(BIO)}
            </pre>

            <section className="w-full mt-5">
                <h2 className="text-xl font-bold tracking-tight">Research</h2>

                <div className="mt-4 space-y-2">
                    <h3 className="text-sm font-base italic leading-snug">
                        The Curse of Redundancy: Systemic Inconsistency in DeFi via Multi-Variable State
                        Desynchronization
                    </h3>
                    <h3 className="text-sm font-base italic leading-snug">
                        <b>V. Usatii</b>, Y. Liu
                    </h3>

                    <div className="mt-2 text-sm text-zinc-700">USENIX Security 2026 (under review); <a
                        href="https://example.com/preprint.pdf"
                        target="_blank"
                        rel="noreferrer"
                        className="underline decoration-blue-500 underline-offset-4 hover:text-blue-600"
                        >
                        Preprint (PDF)
                        </a></div>
                </div>
                </section>

                <section className="w-full mt-5">
                <h2 className="text-xl font-bold tracking-tight">Portfolio</h2>

                <div className="mt-4 space-y-2">
                    <h3 className="text-sm font-base italic leading-snug">
                        To be added
                    </h3>
                </div>
                </section>
          </div>
        </div>

      </div>
    </div>
  );
}

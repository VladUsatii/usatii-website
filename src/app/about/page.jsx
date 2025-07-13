'use client'
import Link from 'next/link'
import React from 'react'
import Footer from '../_components/footer'
import { motion } from 'framer-motion'
import Image from 'next/image'

function About() {
  return (<>
    <div className="max-w-[800px] w-full mx-auto px-8 py-12 bg-white">
      {/* Brand */}
      <Link href="/">
        <h1 className="font-black text-center text-md text-indigo-600 hover:text-indigo-800 transition-colors">
          USATII MEDIA
        </h1>
      </Link>

      <h2 className="text-gray-800 my-5 text-4xl font-black">
        About us.
      </h2>

      <motion.div
        className="grid gap-y-5 text-gray-700 font-medium"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <div className='flex flex-col sm:flex-row justify-between'>
        <div className="relative m-auto justify-center mb-5 sm:hidden block max-w-[250px] w-full">
            <img
                src="https://github.com/VladUsatii/usatii-website/blob/main/public/VLAD.JPEG?raw=true"
                alt="Vlad"
                className="
                w-full
                aspect-square
                object-cover
                object-top
                rounded-full
                border-[2px] border-neutral-100
                "
            />
        </div>
        <div>
        <p>Hi there. I'm Vlad. Quick facts about me:<br />
        • 3rd-year Computer Science student specializing in Artificial Intelligence.<br />• Research assistant at RIT ESL GCI working on Ethereum inconsistent state detection.<br />
        • 1600+ rating in Chess.<br />• Played piano for a decade.<br />• Avid traveler, often working remote in coffee shops around the world.<br />• Former CTO and spearhead of Onlock's online platform.<br />• Avid lifter with 5+ years spent pumping iron.</p>
        <p><br />
          I founded Usatii Media to help challenge the current marketing landscape. We don't chase leads. We don't pitch in comment sections. We don’t offer low-effort one-size-fits-all packaging.
        </p>
        </div>
        <div className="hidden sm:block max-w-[500px] w-full">
            <img
                src="https://github.com/VladUsatii/usatii-website/blob/main/public/VLAD.JPEG?raw=true"
                alt="Vlad"
                className="
                w-full
                aspect-square
                object-cover
                object-top
                rounded-full
                border-[2px] border-neutral-100
                "
            />
        </div>
        </div>

        <p>
          Usatii Media partners only with founders who know exactly what they’re building - or are brave enough to DYR and hit hard on their offer.
        </p>

        <p>
          We operate in <span className="font-bold text-indigo-600">high-context marketing</span>.<br />• Systems-driven marketing, no cookie-cutter scheduling. <br />• IP creation, not engagement hacks.<br />• Positioning before performance.
        </p>

        <p>
          Our clients are startups or established businesses with unique and overengineered ideas: a proprietary edge, a technical thesis, or a contrarian belief that needs articulation.
        </p>

        <p>
          We don’t just do your boring labor work. We build layered content systems rooted in your strategy and surfaced through distribution mechanics that compound over time.
        </p>

        <p>
          We have a remote-first team of 20+ editors, 2 managers, and myself. My team is trained to understand behavioral psychology from first-principles and apply these ideas to their everyday work. Everyone on our team has a life outside of the agency, actively developing groundbreaking technologies in fields like AI, Web3, and quantum.
        </p>

        <p>
          If you haven’t thought about your GTM structure, customer belief gaps, or the lifecycle of your brand narrative - you're not ready for us. And that’s okay.
        </p>

        <p className="italic text-sm text-neutral-500">
          But if you've done your homework and are confident in your brand, let's start the conversation.
        </p>

        <p className="font-bold text-indigo-700">
          @vladusatii_ on most platforms.
        </p>
      </motion.div>
    </div>
    <Footer /></>
  )
}

export default About
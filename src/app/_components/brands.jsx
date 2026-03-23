"use client";

import { motion, useReducedMotion } from "framer-motion";

const DEFAULT_LOGOS = [
  {
    name: "The CPA Dude",
    src: "https://i.postimg.cc/L5DXdKt9/CPADUDEIMAGE.png",
    alt: "The CPA Dude logo",
  },
  {
    name: "OFR",
    src: "https://i.postimg.cc/8Py5tGkw/FRIMAGE.png",
    alt: "OFR logo",
  },
  {
    name: "Gamma",
    src: "https://i.postimg.cc/3xdwqqdh/GAMMAIMAGE.png",
    alt: "Gamma logo",
  },
  {
    name: "Happy Techies",
    src: "https://i.postimg.cc/wTxMXMz7/HTIMAGE.png",
    alt: "Happy Techies logo",
  },
  {
    name: "KALM",
    src: "https://i.postimg.cc/DfPm4st9/KALMIMAGE.png",
    alt: "KALM logo",
  },
  {
    name: "Spectres",
    src: "https://i.postimg.cc/YCZSBxWW/SPECTRESIMAGE.png",
    alt: "Spectres logo",
  },
  {
    name: "Rebuildit",
    src: "https://i.postimg.cc/QFtgCR0r/rebuildit-logo-uniform-gold.png",
    alt: "Rebuildit logo",
  },
  {
    name: "Bishop",
    src: "https://i.postimg.cc/VS9XVmNW/image-%2812%29.png",
    alt: "Bishop logo",
  },
  {
    name: "OddsMate",
    src: "https://i.postimg.cc/sBP5Ns2p/image-%2814%29.png",
    alt: "OddsMate logo",
  },
  {
    name: "Rich & Pour",
    src: "https://i.postimg.cc/d7RGxw09/Rich-and-Pour-RGB-03-clear.avif",
    alt: "Rich and Pour logo",
  },
  {
    name: "Resolution, Inc.",
    src: "https://i.postimg.cc/jW6yFtjc/Screenshot-2026-03-22-at-19-27-33-removebg-preview.png",
    alt: "Resolution, Inc. logo",
  },
  {
    name: "airbo",
    src: "https://i.postimg.cc/8js9QnW2/AIRBO.png",
    alt: "airbo logo",
  },
];

export default function TrustedByGrid({
    eyebrow = "#1 content marketing agency in the US by volume",
    title = "Trusted by ambitious companies.",
    subtitle = "For the last 4 years, my team and I have solidified a workflow that has helped hundreds of businesses and personalities build a solid presence online.",
    logos = DEFAULT_LOGOS,
    className = "",
  }) {
    const shouldReduceMotion = useReducedMotion();
  
    const container = {
      hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 10 },
      show: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.8,
          ease: [0.16, 1, 0.3, 1],
        },
      },
    };
  
    const item = {
      hidden: {
        opacity: 0,
        y: shouldReduceMotion ? 0 : 10,
        filter: "blur(4px)",
      },
      show: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: {
          duration: 0.7,
          delay: 0.08,
          ease: [0.16, 1, 0.3, 1],
        },
      },
    };
  
    return (
      <section className={`relative overflow-hidden bg-white text-neutral-950 ${className}`}>
  
        <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-8 md:py-24">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-500">
              {eyebrow}
            </div>
  
            <h2 className="mt-4 text-balance text-3xl font-medium tracking-[-0.045em] text-neutral-950 sm:text-4xl md:text-5xl">
              {title}
            </h2>
  
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-neutral-600 sm:text-base">
              {subtitle}
            </p>
          </motion.div>
  
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            className="mt-14 grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-4"
          >
            {logos.map((logo) => (
              <motion.div
                key={logo.name}
                variants={item}
                className="flex min-h-[72px] items-center justify-center"
              >
                <img
                  src={logo.src}
                  alt={logo.alt || logo.name}
                  className="h-8 w-auto max-w-[160px] object-contain opacity-70 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0"
                  loading="lazy"
                  draggable={false}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    );
  }
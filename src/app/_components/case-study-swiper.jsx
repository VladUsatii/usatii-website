'use client';
import React, { useState } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { Inter } from "next/font/google";
import { Button } from "@/components/ui/button";
import { ThumbsUpIcon, ThumbsDownIcon, ExternalLinkIcon } from "lucide-react";

const onest = Inter({ subsets: ["latin"], weight: ["400", "700"] });

const caseStudies = [
  {
    id: "1",
    title: "@chrisstocksofficial",
    subtitle: "Influencer",
    metrics: [
      "10% engagement rate increase in 90 days",
      "5+ qualified UGC leads worth over $30K",
      "95% viewer retention over 5 seconds",
    ],
    date: "2023-2024",
    link: "https://instagram.com/chrisstocksofficial",
    tags: ["UGC", "Influencer", "Growth"],
    avatar: "https://via.placeholder.com/80?text=Chris"
  },
  {
    id: "2",
    title: "Rich & Pour Teas",
    subtitle: "California tea distributors",
    metrics: [
      "1× organic user growth in 60 days",
      "50+ qualified leads found via Instagram",
      "10% engagement rate increase in 60 days",
    ],
    date: "2023",
    link: "https://richandpour.com",
    tags: ["E-commerce", "Organic", "Leads"],
    avatar: "https://via.placeholder.com/80?text=Tea"
  },
  {
    id: "3",
    title: "@hamishnewtonvesty",
    subtitle: "Influencer",
    metrics: [
      "2× organic user growth in 30 days",
      "10+ qualified UGC leads straight to IG inbox",
      "3.5K follower increase",
    ],
    date: "2024",
    link: "https://instagram.com/hamishnewtonvesty",
    tags: ["UGC", "Influencer", "Followers"],
    avatar: "https://via.placeholder.com/80?text=Hamish"
  },
];

function TinderCard({ cs, index, total, onSwipe }) {
  const [flipped, setFlipped] = useState(false);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-20, 20]);
  const opacityLike = useTransform(x, [50, 120], [0, 1]);
  const opacityDislike = useTransform(x, [-120, -50], [1, 0]);

  const scale = 1 - (total - index - 1) * 0.04;
  const translateY = (total - index - 1) * 14;

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      style={{ x, rotate, scale, y: translateY }}
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: translateY }}
      exit={{ opacity: 0, y: 60, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 260, damping: 25 }}
      onDragEnd={(_, info) => {
        if (info.offset.x > 120 || info.offset.x < -120) onSwipe(cs.id);
      }}
      whileHover={{ scale: scale + 0.02, boxShadow: "0 10px 20px rgba(0,0,0,0.12)" }}
      className="absolute left-1/2 -translate-x-1/2 w-[400px] h-[380px] bg-white rounded-2xl shadow-lg border border-neutral-200 px-6 py-5 cursor-grab select-none perspective-1000"
    >
      <motion.div style={{ opacity: opacityLike }} className="absolute top-4 left-4">
        <ThumbsUpIcon size={28} className="text-green-500" />
      </motion.div>
      <motion.div style={{ opacity: opacityDislike }} className="absolute top-4 right-4">
        <ThumbsDownIcon size={28} className="text-red-500" />
      </motion.div>

      <motion.div
        className="relative w-full h-full origin-center"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front */}
        <div
          onClick={() => setFlipped(true)}
          className="absolute backface-hidden w-full h-full flex flex-col justify-center px-0 py-5"
        >
          <div className="space-y-5">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <h3 className="text-2xl font-black">{cs.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {cs.subtitle} • {cs.date}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {cs.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-block px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>

            <ul className="list-disc list-outside pl-4 space-y-1 text-left">
              {cs.metrics.map((m, i) => (
                <li key={i} className="text-sm">
                  {m}
                </li>
              ))}
            </ul>

            <p className="flex items-center text-indigo-600">
              ↩️ Press to flip
            </p>
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute backface-hidden rotate-y-180 w-full h-full flex flex-col text-center p-4"
          style={{ transform: 'rotateY(180deg)' }}
        >
          <h4 className="text-xl font-semibold mb-2">Explore this case study.</h4>
          <p className="text-sm mb-4">
            Dive deeper into the strategy and outcomes.
          </p>
          <a
            href={cs.link || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            View their page
          </a>
          <button
            onClick={() => setFlipped(false)}
            className="mt-4 text-gray-500 hover:underline"
          >
            Back
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ComplexCaseStudySwiper() {
  const [cards, setCards] = useState(caseStudies);

  const handleSwipe = (id) => {
    setCards((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <section className="w-full py-16 sm:py-20 lg:py-24">
      <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-12 px-6 sm:px-8 lg:grid-cols-[minmax(0,1fr)_460px] lg:items-center lg:gap-16 xl:gap-24">
        <div className="max-w-xl text-center lg:text-left">
          <h2 className="text-4xl font-medium leading-[0.95] tracking-tight sm:text-5xl lg:text-6xl">
            Case studies
            <br />
            matter.
          </h2>

          <p className="mt-4 text-base leading-7 text-neutral-600 sm:text-lg">
            Swipe through a few of our past clients.
          </p>
        </div>

        <div className="mx-auto flex w-full max-w-[460px] flex-col items-center lg:mx-0 lg:justify-self-end">
          <div
            className={`${onest.className} relative h-[420px] w-full sm:h-[440px]`}
          >
            <AnimatePresence>
              {cards.map((cs, idx) => (
                <TinderCard
                  key={cs.id}
                  cs={cs}
                  index={idx}
                  total={cards.length}
                  onSwipe={handleSwipe}
                />
              ))}
            </AnimatePresence>

            {cards.length === 0 && (
              <Button
                onClick={() => setCards(caseStudies)}
                className="absolute inset-0 m-auto rounded-full px-5 py-2"
              >
                Reload Cases ✨
              </Button>
            )}
          </div>

          <div className="mt-6 flex items-center justify-center gap-2">
            {caseStudies.map((c) => {
              const active = cards.findIndex((x) => x.id === c.id) !== -1;

              return (
                <span
                  key={c.id}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    active ? "w-2.5 bg-purple-500" : "w-2.5 bg-neutral-300"
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
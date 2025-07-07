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

  const handleSwipe = (id) => setCards(prev => prev.filter(c => c.id !== id));

  return (
    <section className="flex flex-col items-center w-full mt-24">
      <h2 className="font-black text-3xl sm:text-5xl mb-2">Case studies matter.</h2>
      <p className="text-center text-md sm:text-lg text-neutral-600 mb-6 max-w-md">
        Swipe through a few of our past clients.
      </p>

      <div className={`${onest.className} relative h-[400px] w-full max-w-[420px]`}>
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
          <Button onClick={() => setCards(caseStudies)} className="absolute inset-0 m-auto">
            Reload Cases ✨
          </Button>
        )}
      </div>

      <div className="flex mt-8 space-x-2">
        {caseStudies.map(c => (
          <span
            key={c.id}
            className={`block w-3 h-3 rounded-full ${
              cards.findIndex(x => x.id === c.id) === -1
                ? 'bg-gray-300'
                : 'bg-purple-500'
            }`}
          />
        ))}
      </div>
    </section>
  );
}

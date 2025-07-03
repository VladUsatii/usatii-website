'use client'
import { useEffect, useRef } from 'react'

const reviews = [
  {
    name: 'James K.',
    title: 'Founder @ KALM',
    avatar: 'https://i.pravatar.cc/90?img=1',
    review:
      '“It has been a year of incredible results. Post after post, we hit new highs I\'ve never seen before. 10K views here, 30K there... if you want good SMM, Vlad is your guy.”',
    date: '1 month ago',
  },
  {
    name: 'Chris B.',
    title: '@chrisstocksofficial',
    avatar: 'https://i.pravatar.cc/50?img=2',
    review:
      '"Vlad is incredible. His quality is out-of-the-park, he is always available, and the guy knows how to get views."',
    date: '2 weeks ago',
  },
  {
    name: 'Anonymous',
    title: 'Director @ Stealth Startup',
    avatar: 'https://i.pravatar.cc/90?img=3',
    review:
      '“Vlad’s strategy helped us scale past our social media bottlenecks. These are genuinely weapons of mass destruction.”',
    date: '3 weeks ago',
  },
  {
    name: 'Anonymous',
    title: 'Celebrity group',
    avatar: 'https://i.pravatar.cc/90?img=4',
    review:
      '“Vlad is dialed - he crunches hundreds of uploads per month and has created organic systems to boost our engagement big-time.”',
    date: '5 days ago',
  },
  {
    name: 'Tony H.',
    title: 'Founder @ TheCPADude',
    avatar: 'https://i.pravatar.cc/60',
    review:
      '“Sick edits! Good job here, I like how you did with these styles.”',
    date: '4 weeks ago',
  },
]

export default function ReviewCarousel() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    let index = 0
    const interval = setInterval(() => {
      const scrollTo = container.children[index].offsetLeft - (container.offsetWidth - container.children[index].offsetWidth) / 2
      container.scrollTo({ left: scrollTo, behavior: 'smooth' })
      index = (index + 1) % reviews.length
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full overflow-hidden">
      <h3 className="font-black text-center text-4xl pb-8">What founders are saying</h3>
      <div
        ref={containerRef}
        className="flex gap-6 overflow-x-scroll scroll-smooth px-4 snap-x snap-mandatory"
        style={{ scrollBehavior: 'smooth' }}
      >
        {reviews.map((review, i) => (
          <section
            key={i}
            className="bg-white p-6 rounded-2xl shadow-md min-w-[300px] sm:min-w-[400px] md:min-w-[500px] snap-center border border-gray-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <img
                  src={review.avatar}
                  alt={`${review.name} Avatar`}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h4 className="font-bold text-gray-900">{review.name}</h4>
                  <p className="text-sm text-gray-500">{review.title}</p>
                </div>
              </div>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-4 h-4 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09L5.66 12.18.781 8.41l6.362-.926L10 2l2.857 5.484 6.362.926-4.879 3.77 1.538 5.91z" />
                  </svg>
                ))}
              </div>
            </div>
            <p className="text-gray-800 leading-relaxed mb-4">{review.review}</p>
            <div className="text-sm text-gray-500 italic">Posted {review.date}</div>
          </section>
        ))}
      </div>
    </div>
  )
}

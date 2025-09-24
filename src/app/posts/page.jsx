'use client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import ArticleCard from './_components/article-card'
import Footer from '../_components/footer'

const DATA_URL = 'https://raw.githubusercontent.com/VladUsatii/usatii-website/main/public/posts/posts.json'

function Posts() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    fetch(DATA_URL)
      .then((r) => (r.ok ? r.json() : []))
      .then(setPosts)
      .catch(() => setPosts([]))
  }, [])

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-16">
      {/* Brand */}
      <Link href="/">
        <h1 className="font-black text-center text-sm text-neutral-700 hover:text-black tracking-tight italic">
          USATII MEDIA
        </h1>
      </Link>

      <h2 className="text-black mt-4 mb-2 text-4xl font-black text-center bg-gradient-to-r from-indigo-600 to-purple-500 bg-clip-text text-transparent italic">BUILDER BLOG
      </h2>

      <p className="text-center text-sm text-neutral-500 max-w-xl mx-auto mb-10">
        Technical marketing communication and challenges posed to the public.
      </p>

      <div className="grid gap-10 grid-cols-1">

        {[1, 2].map((post, i) => (
          <ArticleCard key={i} id={i} />
        ))}
      </div>

      <div className="h-[600px]" />
      <Footer />
    </div>
  )
}

export default Posts

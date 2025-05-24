'use client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import ArticleCard from './_components/article-card'
import Footer from '../_components/footer'

// Free, zero‑cost storage: raw JSON hosted on a public GitHub repo (served by GitHub CDN)
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
    <div className="max-w-screen-xl mx-auto px-4 py-12">
      {/* Brand */}
      <Link href="/"><h1 className="font-black text-center text-md text-black/80 hover:text-black/100">USATII MEDIA</h1></Link>

      <h2 className='text-black my-5 text-4xl font-black'>BLOG.</h2>

      <div className="grid gap-8 grid-cols-1">
        {posts.length === 0 && (
          <p className="text-neutral-400">No posts available.</p>
        )}

        {posts.map((post, _i) => (
          <ArticleCard key={_i} post={post} />
        ))}
      </div>

        <div className='h-[800px]'/>
      <Footer />
    </div>
  )
}

export default Posts
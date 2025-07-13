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
        Careers.
      </h2>

      <motion.div
        className="grid gap-y-5 text-gray-700 font-medium"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <p>We are currently not hiring.</p>
      </motion.div>
   </div>
    <Footer /></>
  )
}

export default About
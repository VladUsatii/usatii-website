'use client';

import React, { useState } from 'react';
import CourseProgress from '../_components/course-progress';
import Link from 'next/link';

const PASSWORD = 'secret123';

export default function Index() {
  const [password, setPassword] = useState('');
  const [allowed, setAllowed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === PASSWORD) {
      setAllowed(true);
    } else {
      alert('Incorrect password');
      setPassword('');
    }
  };

  if (!allowed) {
    return (
      <div className="flex flex-col gap-y-10 items-center justify-center h-screen bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-100">
        {/* Brand */}
        <Link href="/">
        <h1 className="font-black text-center text-md text-indigo-600 hover:text-indigo-800 transition-colors">
        USATII MEDIA
        </h1>
        </Link>
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md border-neutral-200 border-[2px] w-80">
          <h2 className="text-2xl font-black italic tracking-tight text-center text-gray-800 dark:text-gray-100">
            ADMIN COURSES
          </h2>
          <p className='text-sm text-neutral-500 pt-3 pb-2'>Enter a password to continue.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full px-4 py-2 border-[2px] border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition"
            />
            <button
              type="submit"
              className="cursor-pointer w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition transform hover:scale-105"
            >
              Log in 📦
            </button>
          </form>
        </div>
        <div className='max-w-[500px] w-full'>
        <p className='text-xs text-neutral-500 text-center'>By signing in to the admin platform, you acknowledge and agree to maintain the confidentiality of all content and proprietary information. Your access constitutes a binding agreement. Any unauthorized disclosure or misuse may result in legal consequences.</p>
        </div>
      </div>
    );
  }

  return <CourseProgress />;
}

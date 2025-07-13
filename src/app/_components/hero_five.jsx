'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Folder, FolderOpen } from 'lucide-react';

// Debounce hook for search input
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

// Expandable folder component without extra imports
function ExpandableFolder({ title, items, defaultOpen = true }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const toggle = () => setIsOpen(!isOpen);

  return (
    <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-inner">
      <button
        onClick={toggle}
        className="flex items-center w-full text-left space-x-2 focus:outline-none"
        aria-expanded={isOpen}
      >
        <motion.span
          animate={{ rotate: isOpen ? 0 : -90 }}
          transition={{ duration: 0.2 }}
          className="w-5 h-5 text-indigo-500"
        >
          <ChevronDown />
        </motion.span>
        <Folder className="w-6 h-6 text-yellow-400" />
        <span className="font-semibold text-gray-800 dark:text-gray-100">
          {title}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ ease: 'easeInOut', duration: 0.3 }}
            className="overflow-hidden pl-8 mt-3 space-y-2"
          >
            {items.map(item => (
              <li
                key={item}
                className="flex items-center text-gray-700 dark:text-gray-200 hover:text-indigo-600 transition"
              >
                <span className="font-mono text-gray-400">├</span>
                <FolderOpen className="w-4 h-4 ml-1 text-yellow-300" />
                <span className="ml-2">{item}</span>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

// Main hero section
export default function HeroFive() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const contentBlueprints = useMemo(
    () => [
      'LinkedIn Posts',
      'Short-Form Topic Cookbook',
      'Instagram Static Mastery',
      'TikTok FYP Mastery',
      'Funnel Blueprint'
    ].filter(item => item.toLowerCase().includes(debouncedSearch.toLowerCase())),
    [debouncedSearch]
  );

  const agencyProjectItems = useMemo(
    () => [
      'Brand Strategy',
      'Content Calendar',
      'Creative Assets',
      'Performance Reports',
      'Onboarding Notes',
      'Financials',
      'ROI Tracker'
    ].filter(item => item.toLowerCase().includes(debouncedSearch.toLowerCase())),
    [debouncedSearch]
  );

  return (
    <div className='flex items-center justify-center '>
    <section className="max-w-3xl mx-2 border-[2px] border-neutral-200 bg-white dark:bg-gray-900 p-8 rounded-2xl mt-8 shadow-lg mb-16 font-sans">
      <motion.h2
        className="text-center font-black text-3xl mb-2 text-gray-900 dark:text-gray-100"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 120 }}
      >
        Try our systems.
      </motion.h2>
      <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
        A few of our favorite templates.
      </p>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search templates..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-gray-100 dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-600 rounded-md p-2 focus:outline-none"
        />
      </div>

      <ExpandableFolder title="Content Blueprints" items={contentBlueprints} />
      <ExpandableFolder title="Agency Projects" items={agencyProjectItems} />

      <footer className="mt-8 text-center text-xs text-gray-500 dark:text-gray-400">
        Disclaimer: While we leverage advanced strategies and proprietary methodologies to optimize campaign performance, we do not guarantee specific results or outcomes. All projections are illustrative and past performance is not indicative of future returns.
      </footer>
    </section>
    </div>
  );
}

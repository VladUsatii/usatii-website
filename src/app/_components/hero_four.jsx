import React from "react";

// components/HeroFour.jsx
export default function HeroFour() {
  const subFolders = [
    "LinkedIn Posts",
    "Short-Form Topic Cookbook",
    "Instagram Static Mastery",
    "TikTok FYP Mastery",
    "Funnel Blueprint",
  ];

  const subFolders2 = [
    "Brand Strategy",
    "Content Calendar",
    "Creative Assets",
    "Performance Reports",
    "Onboarding Notes",
    "Financials",
    "ROI Tracker"
  ];
  return (
    <section className="bg-blue-50 p-6 rounded-2xl shadow-md max-w-sm mx-auto font-sans mt-10 mb-20">
      <h3 className="font-black text-center text-3xl pb-3">Try our <span className="text-indigo-500 tracking-tight">systems</span>.</h3>
      <h3 className="font-bold text-center text-xl pb-8">A few of our favorite templates.</h3>
      {/* root folder header */}
      <div className="flex items-center mb-3 text-gray-700">
        {/* expanded arrow */}
        <span className="font-mono text-gray-500">▼</span>
        {/* folder icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 text-yellow-400 ml-1"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M2 4a2 2 0 012-2h5l2 2h5a2 2 0 012 2v2H2V4z" />
          <path d="M2 8h16v6a2 2 0 01-2 2H4a2 2 0 01-2-2V8z" />
        </svg>
        <span className="ml-2 font-semibold">Content Blueprints</span>
      </div>

      {/* sub-folder list */}
      <ul className="ml-6 space-y-2">
        {subFolders.map((name) => (
          <li key={name} className="flex items-center text-gray-600 hover:text-gray-800 transition-colors">
            {/* branch symbol */}
            <span className="font-mono text-gray-400">├─</span>
            {/* small folder icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-yellow-300 ml-1 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M2 4a2 2 0 012-2h5l2 2h5a2 2 0 012 2v2H2V4z" />
              <path d="M2 8h16v6a2 2 0 01-2 2H4a2 2 0 01-2-2V8z" />
            </svg>
            {/* folder name */}
            <span className="ml-2">{name}</span>
          </li>
        ))}
      </ul>

      <hr className="my-7"/>

      {/* root folder header */}
      <div className="flex items-center mb-3 text-gray-700">
        {/* expanded arrow */}
        <span className="font-mono text-gray-500">▼</span>
        {/* folder icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 text-yellow-400 ml-1"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M2 4a2 2 0 012-2h5l2 2h5a2 2 0 012 2v2H2V4z" />
          <path d="M2 8h16v6a2 2 0 01-2 2H4a2 2 0 01-2-2V8z" />
        </svg>
        <span className="ml-2 font-semibold">Agency Project</span>
      </div>

      {/* sub-folder list */}
      <ul className="ml-6 space-y-2">
        {subFolders2.map((name) => (
          <li key={name} className="flex items-center text-gray-600 hover:text-gray-800 transition-colors">
            {/* branch symbol */}
            <span className="font-mono text-gray-400">├─</span>
            {/* small folder icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-yellow-300 ml-1 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M2 4a2 2 0 012-2h5l2 2h5a2 2 0 012 2v2H2V4z" />
              <path d="M2 8h16v6a2 2 0 01-2 2H4a2 2 0 01-2-2V8z" />
            </svg>
            {/* folder name */}
            <span className="ml-2">{name}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

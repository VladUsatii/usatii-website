import React from "react";

// components/Footer.jsx

export default function Footer() {
  // const links = [
  //   "Top 5 Reels Hooks of 2025",
  //   "Why Paid Ads Alone Stop Working",
  //   "The Science of Going Viral",
  // ];

  return (
    <footer className="border-t px-6 py-10 text-sm">
{/* 
      <nav className="flex flex-wrap gap-4">
        {links.map(link => (
          <a key={link} href="#" className="text-neutral-500 hover:underline">
            {link}
          </a>
        ))}
      </nav> */}

      <p className="text-neutral-400">
        &copy; {new Date().getFullYear()} Usatii Media. All rights reserved.
      </p>
    </footer>
  );
}

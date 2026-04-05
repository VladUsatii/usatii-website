import React from 'react';
import { Linkedin, Instagram } from 'lucide-react';

const productTiles = [
  { id: 1, title: 'Market Intelligence', href: '/demos/1' },
  { id: 2, title: 'Editor', href: '/editor' },
];

export default function Footer() {
  return (
    <footer className="border-t-neutral-100 border-t-[2px] bg-gradient-to-tr text-black py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo & Newsletter */}
        <div className="space-y-0">
          <p className="text-lg font-black italic tracking-tight text-black">
          USATII MEDIA</p>
          <p className='text-sm leading-relaxed'>build your audience organically.</p>
        </div>

        {/* Products */}
        <div>
          <h3 className="text-black font-semibold mb-4">Products</h3>
          <ul className="space-y-2">
          {productTiles.map((tile) => (
              <li key={tile.id}>
                <a
                  href={tile.href}
                  className="hover:text-black transition-colors"
                >
                  {tile.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-black font-semibold mb-4">Resources</h3>
          <ul className="space-y-2">
            <li>
              <a href="/case-studies" className="hover:text-black">
                Case Studies
              </a>
            </li>
            <li>
              <a href="/documentation" className="hover:text-black transition-colors">
                Documentation
              </a>
            </li>
          </ul>
        </div>

        {/* Company & Social */}
        <div className="space-y-4">
          <h3 className="text-black font-semibold mb-4">Company</h3>
          <ul className="space-y-2">
            <li><a href="/vlad" className="hover:text-black">Our Founder's Story</a></li>
            <li><a href="/careers" className="hover:text-black">Careers</a></li>
            <li><a href="/referral" className="hover:text-black">Referrals</a></li>
            <li><a href="/privacy" className="hover:text-black">Privacy Policy</a></li>
          </ul>
          <div className="flex space-x-4 pt-4">
            <a href="https://linkedin.com/in/vladusatii" aria-label="LinkedIn">
              <Linkedin className="h-5 w-5" />
            </a>
            <a href="https://instagram.com/vladusatii_" aria-label="Instagram">
              <Instagram className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>

      <div className="text-center mt-10 text-xs text-neutral-500">
        © {new Date().getFullYear()} VAU SOLUTIONS, LLC. All rights reserved.
      </div>
    </footer>
  );
}

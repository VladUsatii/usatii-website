import React from "react";
import { Linkedin, Instagram } from "lucide-react";

const productTiles = [
  { id: 1, title: "Usatii for Construction", href: "/construction" },
  { id: 2, title: "Software", href: "/software" },
  { id: 3, title: "Industries", href: "/industries" },
  { id: 4, title: "Locations", href: "/locations" },
];

export default function Footer() {
  return (
    <footer className="bg-paper text-ink">
      <div className="border-t border-surface bg-white">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 px-4 py-10 md:grid-cols-4 md:px-6">
        <div className="space-y-0">
          <p className="text-lg font-black italic tracking-tight text-ink">USATII MEDIA</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">AI &amp; operations software.</p>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-black text-ink">Solutions</h3>
          <ul className="space-y-3 text-sm font-medium text-ink-soft">
            {productTiles.map((tile) => (
              <li key={tile.id}>
                <a href={tile.href} className="transition-colors hover:text-ink">
                  {tile.title}
                </a>
              </li>
            ))}
          </ul>
          <h3 className="mb-3 mt-7 text-sm font-black text-ink">Products</h3>
          <ul className="space-y-3 text-sm font-medium text-ink-soft">
            <li>
              <a href="https://oasis.usatii.com" className="transition-colors hover:text-ink">
                OASIS
              </a>
            </li>
            <li>
              <a href="/editor" className="transition-colors hover:text-ink">
                EDITOR
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-black text-ink">Resources</h3>
          <ul className="space-y-3 text-sm font-medium text-ink-soft">
            <li>
              <a href="/software/software-waste-audit" className="hover:text-black">
                Software Waste Audit
              </a>
            </li>
            <li>
              <a href="/compare" className="hover:text-black">
                Compare
              </a>
            </li>
            <li>
              <a href="/resources" className="hover:text-black">
                Software Capabilities
              </a>
            </li>
            <li>
              <a href="/marketing-case-studies" className="hover:text-black">
                Marketing Archive
              </a>
            </li>
          </ul>
          <h3 className="mb-3 mt-7 text-sm font-black text-ink">Case Studies</h3>
          <ul className="space-y-3 text-sm font-medium text-ink-soft">
            <li>
              <a href="/case-studies/rebuildit-inc" className="hover:text-black">
                REBUILDIT INC.
              </a>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="mb-4 text-sm font-black text-ink">Company</h3>
          <ul className="space-y-3 text-sm font-medium text-ink-soft">
            <li>
              <a href="/careers" className="hover:text-ink">
                Careers
              </a>
            </li>
            <li>
              <a href="/about" className="hover:text-black">
                About
              </a>
            </li>
            <li>
              <a href="/vlad-usatii" className="hover:text-black">
                Founder
              </a>
            </li>
            <li>
              <a href="/news" className="hover:text-black">
                News
              </a>
            </li>
            <li>
              <a href="/events" className="hover:text-black">
                Events
              </a>
            </li>
            <li>
              <a href="/security" className="hover:text-black">
                Security
              </a>
            </li>
            <li>
              <a href="/reviews" className="hover:text-black">
                Reviews
              </a>
            </li>
            <li>
              <a href="/privacy" className="hover:text-black">
                Privacy Policy
              </a>
            </li>
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
      </div>
      <div className="border-t border-surface bg-paper">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-7 text-sm text-muted-foreground md:flex-row md:items-end md:justify-between md:px-6">
        <div className="grid gap-3">
          <p>© {new Date().getFullYear()} VAU SOLUTIONS, LLC. All rights reserved.</p>
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2" aria-label="Legal footer navigation">
            <a href="/sitemap" className="hover:text-ink">Site Map</a>
            <a href="/privacy" className="hover:text-ink">Privacy Policy</a>
            <a href="/privacy-choices" className="hover:text-ink">Your Privacy Choices</a>
            <a href="/security" className="hover:text-ink">Security</a>
            <a href="/careers" className="hover:text-ink">Careers</a>
          </nav>
        </div>
        <p className="text-base font-black italic uppercase tracking-tight text-ink">USATII MEDIA</p>
      </div>
      </div>
    </footer>
  );
}

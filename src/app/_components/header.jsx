import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import GetStarted from "./get-started";
import SiteSearch from "./site-search";
import homeStyles from "./work-home.module.css";
import styles from "./public-header.module.css";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-surface bg-paper/95 backdrop-blur">
      <div className={`mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6 ${styles.headerInner}`}>
        <Link
          href="/"
          className={`flex items-center gap-2 text-lg font-black italic tracking-tight text-ink ${styles.brand}`}
        >
          <span
            aria-hidden="true"
            className="h-[1em] w-[1em] shrink-0 rounded-full bg-[radial-gradient(circle_at_32%_24%,rgba(255,255,255,0.42),transparent_30%),linear-gradient(135deg,#db37ff_0%,#b91cff_42%,#8b16ef_100%)] shadow-[inset_0.25em_0.2em_0.45em_rgba(255,255,255,0.2),inset_-0.35em_-0.3em_0.6em_rgba(67,0,142,0.34),0_0.25em_0.7em_rgba(168,85,247,0.32)]"
          />
          <span>USATII</span>
        </Link>
        <nav className="mr-auto hidden items-center gap-1 text-sm font-semibold text-muted-foreground md:flex" aria-label="Primary navigation">
          <Link href="/software" className="flex h-10 items-center rounded-mdx px-2 hover:bg-surface hover:text-ink">Software</Link>
          <Link href="/industries" className="flex h-10 items-center rounded-mdx px-2 hover:bg-surface hover:text-ink">Industries</Link>
          <Link href="/about" className="flex h-10 items-center rounded-mdx px-2 hover:bg-surface hover:text-ink">Company</Link>
          <SiteSearch />
        </nav>
        <div className={styles.controls}>
          <span className={styles.mobileSearch}><SiteSearch /></span>
          <GetStarted label="Try Usatii" align="right" />
          <Link href="/quote-request" className={`${homeStyles.sales} ${styles.sales}`}>Contact sales <ArrowUpRight size={16} aria-hidden="true" /></Link>
        </div>
      </div>
    </header>
  );
}

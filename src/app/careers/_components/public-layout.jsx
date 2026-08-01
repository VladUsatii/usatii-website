import Footer from "@/app/_components/footer";
import Header from "@/app/_components/header";

export default function PublicLayout({ children, className = "" }) {
  return (
    <>
      <a href="#public-main-content" className="fixed left-2 top-2 z-[100] -translate-y-24 bg-paper px-3 py-2 text-sm font-semibold text-ink focus:translate-y-0">
        Skip to main content
      </a>
      <Header />
      <main id="public-main-content" tabIndex={-1} className={`min-h-screen bg-canvas text-ink ${className}`} data-public-site-format="template-driven">
        {children}
      </main>
      <Footer />
    </>
  );
}

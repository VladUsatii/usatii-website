import Header from '@/app/_components/header';
import Footer from '@/app/_components/footer';
import PrivacyChoicesForm from './privacy-choices-form';

export const metadata = {
  title: 'Your Privacy Choices | USATII Media',
  description: 'Choose whether USATII Media may use optional first-party usage analytics in this browser.',
};

export default function PrivacyChoicesPage() {
  return (
    <>
      <Header />
      <main className="bg-canvas text-ink">
        <section className="mx-auto w-full max-w-4xl px-4 py-14 md:px-6 md:py-24">
          <h1 className="text-5xl font-medium tracking-tight md:text-7xl">Your Privacy Choices</h1>
          <p className="mt-7 max-w-3xl text-lg leading-8 text-ink-soft">
            Control first-party usage analytics for this browser. Your selection is stored for one year and can be changed whenever you return to this page. We do not use marketing or targeted-advertising trackers.
          </p>
          <div className="mt-12">
            <PrivacyChoicesForm />
          </div>
          <div className="mt-12 border-t border-surface-strong pt-8 text-sm leading-7 text-ink-soft">
            <p><a href="/quote-request" className="font-semibold text-ink underline underline-offset-4">Contact us here</a> or learn more in our <a href="/privacy" className="font-semibold text-ink underline underline-offset-4">privacy policy</a> if you have any questions.</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

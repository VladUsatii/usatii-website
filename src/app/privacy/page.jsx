import Header from "@/app/_components/header";
import Footer from "@/app/_components/footer";

const privacySections = [
  ["information", "Information we collect", "We collect information you provide directly, such as contact details submitted through forms, and limited technical information needed to operate, secure, and understand use of the website."],
  ["use", "How we use information", "We use information to provide and improve Oasis, respond to inquiries, maintain security, prevent abuse, fulfill contractual obligations, and comply with applicable law."],
  ["sharing", "How we share information", "We may share information with service providers that support hosting, communications, security, and business operations. We do not sell personal information."],
  ["retention", "Retention", "We retain personal information only for as long as needed for the purposes described here, including legitimate business, legal, security, and recordkeeping needs."],
  ["choices", "Your choices", "You can manage optional website preferences through Your Privacy Choices. You may also opt out of nonessential communications using the instructions included in them."],
  ["rights", "Your rights", "Depending on where you live, you may have rights to access, correct, delete, restrict, or obtain a copy of your personal information, and to appeal certain decisions."],
  ["security", "Security", "We use administrative, technical, and organizational safeguards designed to protect personal information. No method of transmission or storage is completely secure."],
  ["children", "Children", "Oasis is intended for organizations and is not directed to children. We do not knowingly collect personal information from children through this website."],
  ["changes", "Changes to this policy", "We may update this policy as our services and legal obligations change. The updated date above shows when this version became effective."],
  ["contact", "Contact us", "For privacy questions or requests, contact Usatii Media through our contact page and include enough detail for us to understand and respond to your request."],
];

export const metadata = {
  title: "Privacy Policy | USATII Media",
  description: "How USATII Media collects, uses, shares, and protects personal information.",
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="bg-white text-ink">
        <article className="mx-auto w-full max-w-7xl px-4 py-12 md:px-6 md:py-20">
          <header className="text-center">
            <p className="text-sm text-muted-foreground">Updated: August 1, 2026</p>
            <h1 className="mt-8 text-5xl font-medium tracking-tight md:text-7xl">Privacy Policy</h1>
          </header>
          <div className="mt-20 grid gap-12 lg:grid-cols-[240px_minmax(0,760px)] lg:justify-between">
            <nav className="space-y-3 text-sm lg:sticky lg:top-24 lg:self-start" aria-label="Privacy policy sections">
              {privacySections.map(([id, title], index) => (
                <a key={id} href={`#${id}`} className="block text-muted-foreground hover:text-ink">
                  {index + 1}. {title}
                </a>
              ))}
            </nav>
            <div>
              <p className="text-xl leading-9 md:text-2xl md:leading-10">Usatii Media builds Oasis for organizations managing social operations. This policy explains what information we collect through our public website and services, why we use it, and the choices available to you.</p>
              <p className="mt-8 text-base leading-8 text-muted-foreground">This policy covers information for which Usatii Media determines the purposes and means of processing. Customer content processed on behalf of an organization is governed by that organization’s agreement with Usatii Media.</p>
              <div className="mt-16 space-y-14">
                {privacySections.map(([id, title, body], index) => (
                  <section key={id} id={id} className="scroll-mt-24 border-t border-surface pt-8">
                    <p className="text-sm text-muted-foreground">{String(index + 1).padStart(2, "0")}</p>
                    <h2 className="mt-2 text-3xl font-medium tracking-tight">{title}</h2>
                    <p className="mt-4 text-base leading-8 text-ink-soft">{body}</p>
                    {id === "choices" ? <a href="/privacy-choices" className="mt-4 inline-flex text-sm font-semibold underline underline-offset-4">Open Your Privacy Choices</a> : null}
                    {id === "contact" ? <a href="/quote-request" className="mt-4 inline-flex text-sm font-semibold underline underline-offset-4">Contact Usatii Media</a> : null}
                  </section>
                ))}
              </div>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}

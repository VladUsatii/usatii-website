import Link from 'next/link'

export const metadata = {
  title: 'Non-Human Identity Management Careers | OASIS Security',
  description:
    'Non Human Identity Management Careers | Oasis unlocks lifecycle management and security for non-human identities.',
}

const galleryImages = [
  {
    src: 'https://cdn.prod.website-files.com/679b2b742e3af6fc4669f5cd/68093357ed7ee672f4730840_42901bf11de9c33209c3edc8a49ef1a9_career-3.avif',
    alt: 'Oasis reception',
    className: 'row-span-2 min-h-[460px] md:min-h-[640px]',
  },
  {
    src: 'https://cdn.prod.website-files.com/679b2b742e3af6fc4669f5cd/691f72a49c1f73ed4c25f9c2_oasis-careers-2025.avif',
    alt: 'Oasis office team',
    className: 'min-h-[220px] md:min-h-[310px]',
  },
  {
    src: 'https://cdn.prod.website-files.com/679b2b742e3af6fc4669f5cd/68093358acfd0cbeabf0e51e_career-1.avif',
    alt: 'Oasis team',
    className: 'min-h-[220px] md:min-h-[310px]',
  },
]

const footerGroups = [
  {
    title: 'Product',
    links: ['Why Oasis', 'Product', 'Get a Demo'],
  },
  {
    title: 'Company',
    links: ['About', 'Careers', 'Newsroom'],
  },
  {
    title: 'Resources',
    links: ['Resources Library', 'Glossary', 'Blog', 'Upcoming Events'],
  },
]

const navGroups = [
  { label: 'Why Oasis', href: '#' },
  { label: 'Product', href: '#' },
  { label: 'Solutions', href: '#' },
  { label: 'Company', href: '#' },
  { label: 'Resources', href: '#' },
]

function Logo({ light = false }) {
  return (
    <Link href="/" className="inline-flex items-center gap-2.5" aria-label="USATII home">
      <span
        className={`grid h-7 w-7 place-items-center rounded-full border ${
          light
            ? 'border-white/25 bg-white text-[#101112]'
            : 'border-[#27201d] bg-[#101112] text-white'
        }`}
      >
        <span className="h-2.5 w-2.5 rounded-full bg-current" />
      </span>
      <span className={`text-[22px] font-semibold tracking-[-0.04em] ${light ? 'text-white' : 'text-[#101112]'}`}>
        Oasis
      </span>
    </Link>
  )
}

function CareersPage() {
  return (
    <main className="min-h-screen bg-[#080908] text-[#f6eee6]">
      <header className="relative overflow-hidden bg-[#f1e5d8] text-[#141414]">
        <nav className="fixed left-0 right-0 top-0 z-50 border-b border-[#141414]/10 bg-[#f1e5d8]/90 px-5 py-3 backdrop-blur-xl md:px-8">
          <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-6">
            <Logo />
            <div className="hidden items-center gap-8 text-[14px] font-medium text-[#141414]/75 lg:flex">
              {navGroups.map((item) => (
                <a key={item.label} href={item.href} className="transition hover:text-[#141414]">
                  {item.label}
                </a>
              ))}
            </div>
            <a
              href="#newsletter"
              className="rounded-full border border-[#161616]/10 bg-[#101112] px-5 py-3 text-[13px] font-semibold text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.15)] transition hover:bg-black"
            >
              Request a Demo
            </a>
          </div>
        </nav>

        <section className="relative mx-auto grid min-h-[720px] max-w-[1440px] place-items-center px-5 pb-28 pt-28 md:min-h-[820px] md:px-8">
          <div className="absolute inset-0 opacity-45">
            <div className="grid h-full grid-cols-3 grid-rows-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="border-b border-r border-[#1d1714]/10" />
              ))}
            </div>
          </div>
          <div className="absolute left-[12%] top-[31%] h-5 w-5 rounded-full border border-[#1d1714]/25 bg-[#f1e5d8]" />
          <div className="absolute right-[32%] top-[31%] h-5 w-5 rounded-full border border-[#1d1714]/25 bg-[#f1e5d8]" />
          <div className="absolute bottom-[29%] left-[32%] h-5 w-5 rounded-full border border-[#1d1714]/25 bg-[#f1e5d8]" />
          <div className="absolute bottom-[29%] right-[12%] h-5 w-5 rounded-full border border-[#1d1714]/25 bg-[#f1e5d8]" />

          <div className="relative z-10 flex flex-col items-center text-center">
            <h1 className="max-w-[980px] text-[76px] font-semibold leading-[0.92] tracking-[-0.07em] text-[#101112] sm:text-[110px] md:text-[150px] lg:text-[178px]">
              Join the team
            </h1>
            <div className="mt-8 rounded-full border border-[#101112]/10 bg-[#fff7ef]/70 px-5 py-2 text-sm font-medium text-[#151515]/70 shadow-[0_18px_60px_rgba(20,17,15,0.08)]">
              Careers
            </div>
          </div>
        </section>
      </header>

      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_18%_0%,rgba(157,121,90,0.38),transparent_30%),linear-gradient(135deg,#111312_0%,#171615_35%,#5f473a_100%)] px-5 py-24 md:px-8 md:py-32">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:220px_220px]" />
        <div className="relative z-10 mx-auto max-w-[1180px]">
          <h2 className="mx-auto max-w-[1000px] text-center text-[31px] font-medium leading-[1.18] tracking-[-0.045em] text-[#fff9f0] md:text-[54px]">
            At Oasis Security, we are building something special to tackle one of cybersecurity&apos;s biggest challenges: securing and managing non-human identities at scale. We&apos;re a team of builders, problem-solvers, and innovators redefining how enterprises secure their expanding digital ecosystems.
            <br />
            <br />
            As we grow, we are on the lookout for passionate individuals to join our dynamic team. Here, you&apos;ll work alongside industry experts, push the boundaries of security innovation, and make a direct impact in protecting the digital world. If you&apos;re passionate about solving real security problems and want to be part of a team that&apos;s shaping the future of cybersecurity, we&apos;d love to meet you.
          </h2>

          <div className="mt-24 grid gap-4 md:mt-32 md:grid-cols-[0.82fr_1fr] md:grid-rows-2 md:gap-5">
            {galleryImages.map((image) => (
              <div
                key={image.src}
                className={`overflow-hidden rounded-[5px] bg-[#221d1a] shadow-[0_28px_90px_rgba(0,0,0,0.32)] ${image.className}`}
              >
                <img src={image.src} alt={image.alt} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#080908] px-5 py-24 md:px-8 md:py-32">
        <div className="mx-auto max-w-[980px]">
          <h2 className="max-w-[780px] text-[46px] font-semibold leading-[0.98] tracking-[-0.055em] text-[#fff4ea] md:text-[86px]">
            Join us and help secure the next frontier.
          </h2>

          <div className="mt-16 border-y border-white/10 py-10">
            <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="text-[15px] font-semibold uppercase tracking-[0.16em] text-[#d6bca7]/70">
                  Open roles
                </p>
                <h3 className="mt-3 text-[28px] font-medium tracking-[-0.04em] text-white md:text-[42px]">
                  No current openings listed.
                </h3>
                <p className="mt-4 max-w-[620px] text-[17px] leading-7 text-white/58">
                  We&apos;re always interested in exceptional builders, operators, and security thinkers. Send your details and we&apos;ll reach out when there is a fit.
                </p>
              </div>
              <a
                href="mailto:careers@usatii.com"
                className="w-fit rounded-full border border-white/12 bg-[#f4dfcf] px-6 py-3 text-[14px] font-semibold text-[#101112] transition hover:bg-white"
              >
                Contact careers
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer
        id="newsletter"
        className="relative overflow-hidden bg-[radial-gradient(circle_at_85%_10%,rgba(255,255,255,0.76),transparent_25%),linear-gradient(145deg,#efd5c5_0%,#d9c3b4_46%,#bfa996_100%)] px-5 py-16 text-[#151515] md:px-8 md:py-20"
      >
        <div className="absolute inset-0 bg-[linear-gradient(rgba(20,20,20,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(20,20,20,0.045)_1px,transparent_1px)] bg-[size:180px_180px]" />
        <div className="relative z-10 mx-auto max-w-[1180px]">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
            <div className="flex flex-col gap-10">
              <Logo />
              <div className="max-w-[430px]">
                <h3 className="text-[24px] font-semibold tracking-[-0.035em]">
                  Sign up for our newsletter
                </h3>
                <form className="mt-5 flex rounded-full border border-[#161616]/12 bg-white/45 p-1 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.28)]">
                  <input
                    type="email"
                    placeholder="Business email"
                    className="min-w-0 flex-1 bg-transparent px-4 text-sm text-[#151515] outline-none placeholder:text-[#151515]/48"
                  />
                  <button type="button" className="rounded-full bg-[#111312] px-5 py-3 text-sm font-semibold text-white">
                    Submit
                  </button>
                </form>
                <p className="mt-3 text-xs leading-5 text-[#151515]/58">
                  By submitting the form you are agreeing to our privacy policy
                </p>
              </div>
            </div>

            <div className="grid gap-10 md:grid-cols-3">
              {footerGroups.map((group) => (
                <div key={group.title}>
                  <h4 className="text-[15px] font-semibold">{group.title}</h4>
                  <div className="mt-5 flex flex-col items-start gap-3">
                    {group.links.map((link) => (
                      <a key={link} href="#" className="text-sm text-[#151515]/62 transition hover:text-[#151515]">
                        {link}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 grid gap-8 border-t border-[#151515]/10 pt-8 md:grid-cols-[1fr_auto_1fr] md:items-end">
            <div className="flex items-center gap-3">
              <a href="#" aria-label="X" className="grid h-9 w-9 place-items-center rounded-full bg-[#151515]/8 text-sm font-semibold">
                X
              </a>
              <a href="#" aria-label="LinkedIn" className="grid h-9 w-9 place-items-center rounded-full bg-[#151515]/8 text-sm font-semibold">
                in
              </a>
              <a href="#" aria-label="YouTube" className="grid h-9 w-9 place-items-center rounded-full bg-[#151515]/8 text-sm font-semibold">
                yt
              </a>
            </div>
            <div className="text-sm text-[#151515]/62 md:text-center">
              <a href="tel:+16466870855" className="font-semibold text-[#151515]">
                Phone:
              </a>{' '}
              +1 646-687-0855
              <br />
              240 W 37th street NY, 10018
            </div>
            <div className="text-sm text-[#151515]/62 md:text-right">
              © 2026 Oasis Security
              <br />
              Terms of use - Privacy policy - Cookie preferences
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}

export default CareersPage

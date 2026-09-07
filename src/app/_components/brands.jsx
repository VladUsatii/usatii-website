import Link from "next/link";

const DEFAULT_LOGOS = [
  {
    name: "The CPA Dude",
    src: "/home/client-logos/cpa-dude.webp",
    width: 640,
    height: 122,
    alt: "The CPA Dude logo",
  },
  {
    name: "OFR",
    src: "/home/client-logos/ofr.webp",
    width: 220,
    height: 220,
    alt: "OFR logo",
  },
  {
    name: "Gamma",
    src: "/home/client-logos/gamma.webp",
    width: 568,
    height: 220,
    alt: "Gamma logo",
  },
  {
    name: "Happy Techies",
    src: "/home/client-logos/happy-techies.webp",
    width: 633,
    height: 220,
    alt: "Happy Techies logo",
  },
  {
    name: "KALM",
    src: "/home/client-logos/kalm.webp",
    width: 640,
    height: 178,
    alt: "KALM logo",
  },
  {
    name: "Spectres",
    src: "/home/client-logos/spectres.webp",
    width: 640,
    height: 83,
    alt: "Spectres logo",
  },
  {
    name: "Rebuildit",
    src: "/home/client-logos/rebuildit.webp",
    width: 180,
    height: 45,
    alt: "Rebuildit logo",
  },
  {
    name: "Bishop",
    src: "/home/client-logos/bishop.webp",
    width: 180,
    height: 44,
    alt: "Bishop logo",
  },
  {
    name: "OddsMate",
    src: "/home/client-logos/oddsmate.webp",
    width: 180,
    height: 87,
    alt: "OddsMate logo",
  },
  {
    name: "Rich & Pour",
    src: "/home/client-logos/rich-and-pour.webp",
    width: 170,
    height: 102,
    alt: "Rich and Pour logo",
  },
  {
    name: "Resolution, Inc.",
    src: "/home/client-logos/resolution.webp",
    width: 179,
    height: 51,
    alt: "Resolution, Inc. logo",
  },
  {
    name: "airbo",
    src: "/home/client-logos/airbo.webp",
    width: 179,
    height: 52,
    alt: "airbo logo",
  },
];

export default function TrustedByGrid({
    eyebrow = "",
    title = "Custom software development for growing organizations.",
    subtitle = "For the last half-decade, Usatii has helped businesses and creators build efficient operational systems through hands-on engineering work.",
    logos = DEFAULT_LOGOS,
    className = "",
  }) {
    return (
      <section className={`relative w-full overflow-hidden border-b border-neutral-200 bg-white text-neutral-950 ${className}`}>
  
        <div className="relative mx-auto w-full max-w-6xl px-6 pb-16 pt-24 sm:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-500">
              {eyebrow}
            </div>
  
            <h2 className="mt-4 text-balance text-3xl font-medium tracking-[-0.045em] text-neutral-950 sm:text-4xl md:text-5xl">
              Custom software built around your operation.
            </h2>
  
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-neutral-600 sm:text-base">
              For the last half-decade, Usatii has helped businesses build efficient operations software and bring critical workflows in-house.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/software" className="rounded-full bg-neutral-100 px-4 py-2 text-xs font-medium transition hover:bg-neutral-200">
                Operations work ↗
              </Link>
            </div>
          </div>
  
          <div className="mt-14 grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {logos.map((logo) => (
              <div
                key={logo.name}
                className="flex min-h-[72px] items-center justify-center"
              >
                <img
                  src={logo.src}
                  alt={logo.alt || logo.name}
                  width={logo.width}
                  height={logo.height}
                  className="h-8 w-auto max-w-[160px] object-contain opacity-70 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0"
                  loading="lazy"
                  decoding="async"
                  fetchPriority="low"
                  draggable={false}
                />
              </div>
            ))}
          </div>

          <section aria-labelledby="community-heading" className="mx-auto mt-20 max-w-2xl pb-8 text-center sm:mt-24">
            <h3 id="community-heading" className="mx-auto max-w-sm text-balance text-2xl font-medium leading-tight tracking-[-0.035em] text-neutral-950 sm:max-w-none sm:text-3xl">
              Working together in our community.
            </h3>
            <div className="mx-auto mt-10 grid max-w-lg grid-cols-2 items-center justify-items-center gap-6 sm:mt-12 sm:gap-12">
            <a
              href="https://www.greaterrochesterchamber.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Greater Rochester Chamber of Commerce"
              className="inline-flex shrink-0 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-4"
            >
              <img
                src="/images/greater-rochester-chamber-member.jpg"
                alt="Proud Member of the Greater Rochester Chamber of Commerce"
                width="5576"
                height="2873"
                className="h-auto w-28 max-w-full sm:w-36"
                loading="lazy"
                decoding="async"
              />
            </a>
            <a
              href="https://www.monroeupstatenyapex.org/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Monroe County Upstate NY APEX Accelerator"
              className="inline-flex shrink-0 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-4"
            >
              <img
                src="/images/monroe-upstate-ny-apex-accelerator.png"
                alt="Monroe County Upstate NY APEX Accelerator"
                width="1042"
                height="350"
                className="h-auto w-36 max-w-full sm:w-52"
                loading="lazy"
                decoding="async"
              />
            </a>
            </div>
          </section>
        </div>
      </section>
    );
  }

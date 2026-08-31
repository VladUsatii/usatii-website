import { SITE_URL } from "@/lib/services-seo";
import { ORGANIZATION_PROFILE, TRADE_SERVICE_TYPE } from "@/lib/trades-seo-data";

export const AUTHOR_PROFILE = {
  "@type": "Person",
  "@id": `${SITE_URL}/vlad-usatii#person`,
  name: "Vladislav Usatii",
  alternateName: "Vlad Usatii",
  url: `${SITE_URL}/vlad-usatii`,
  image: `${SITE_URL}/authors/vladislav-usatii.webp`,
  jobTitle: "Founder",
  worksFor: { "@id": `${SITE_URL}#organization` },
  sameAs: [
    "https://www.linkedin.com/in/vladusatii",
    "https://github.com/VladUsatii",
    "https://x.com/vladusatii",
  ],
};

export function absoluteUrl(path = "/") {
  return `${SITE_URL}${path}`;
}

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}#organization`,
    name: ORGANIZATION_PROFILE.name,
    legalName: ORGANIZATION_PROFILE.legalName,
    url: ORGANIZATION_PROFILE.url,
    logo: ORGANIZATION_PROFILE.logo,
    description: ORGANIZATION_PROFILE.description,
    founder: { "@id": AUTHOR_PROFILE["@id"] },
    sameAs: ORGANIZATION_PROFILE.sameAs,
    areaServed: ORGANIZATION_PROFILE.areaServed,
    makesOffer: ORGANIZATION_PROFILE.services.map((serviceName) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: serviceName,
      },
    })),
  };
}

export function buildFounderPersonSchema() {
  return {
    "@context": "https://schema.org",
    ...AUTHOR_PROFILE,
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Rochester Institute of Technology",
      url: "https://www.rit.edu/",
    },
    sameAs: [
      "https://www.linkedin.com/in/vladusatii",
      "https://github.com/VladUsatii",
      "https://x.com/vladusatii",
    ],
    description:
      "Founder of USATII Media with a background in software systems and security research.",
  };
}

export function buildProfessionalServiceSchema({
  path,
  name,
  description,
  areaServed,
  serviceType,
}) {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", TRADE_SERVICE_TYPE],
    "@id": `${absoluteUrl(path)}#service-business`,
    name,
    url: absoluteUrl(path),
    description,
    areaServed,
    serviceType,
    parentOrganization: {
      "@id": `${SITE_URL}#organization`,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Rochester",
      addressRegion: "NY",
      addressCountry: "US",
    },
  };
}

export function buildServiceSchema({ path, name, description, areaServed }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${absoluteUrl(path)}#service`,
    name,
    description,
    serviceType: name,
    provider: {
      "@id": `${SITE_URL}#organization`,
    },
    areaServed,
    url: absoluteUrl(path),
  };
}

export function buildFaqSchema(faqs = []) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };
}

export function buildBreadcrumbSchema(items = []) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function buildArticleSchema({ path, title, description, datePublished, dateModified, image }) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${absoluteUrl(path)}#article`,
    headline: title,
    description,
    author: { "@id": AUTHOR_PROFILE["@id"] },
    publisher: {
      "@id": `${SITE_URL}#organization`,
    },
    mainEntityOfPage: absoluteUrl(path),
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified ? { dateModified } : {}),
    ...(image ? { image: absoluteUrl(image) } : {}),
  };
}

export function buildEventSchema(event) {
  const virtual = event.location === "Virtual";
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    "@id": `${absoluteUrl(`/events/${event.slug}`)}#event`,
    name: event.title,
    description: event.summary,
    startDate: event.date,
    endDate: event.endDate,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: virtual
      ? "https://schema.org/OnlineEventAttendanceMode"
      : "https://schema.org/OfflineEventAttendanceMode",
    location: virtual
      ? { "@type": "VirtualLocation", url: event.sourceUrl }
      : { "@type": "Place", name: event.location, address: event.location },
    organizer: { "@type": "Organization", name: event.organizer, url: event.sourceUrl },
    image: absoluteUrl(event.image),
    url: absoluteUrl(`/events/${event.slug}`),
    attendee: { "@id": AUTHOR_PROFILE["@id"] },
  };
}

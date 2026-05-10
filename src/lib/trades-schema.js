import { SITE_URL } from "@/lib/services-seo";
import { ORGANIZATION_PROFILE, TRADE_SERVICE_TYPE } from "@/lib/trades-seo-data";

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
    founder: {
      "@type": "Person",
      name: ORGANIZATION_PROFILE.founder,
    },
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
    "@type": "Person",
    "@id": `${SITE_URL}#vlad-usatii`,
    name: "Vlad Usatii",
    url: `${SITE_URL}/vlad`,
    jobTitle: "Founder",
    worksFor: {
      "@id": `${SITE_URL}#organization`,
    },
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

export function buildArticleSchema({ path, title, description }) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${absoluteUrl(path)}#article`,
    headline: title,
    description,
    author: {
      "@id": `${SITE_URL}#organization`,
    },
    publisher: {
      "@id": `${SITE_URL}#organization`,
    },
    mainEntityOfPage: absoluteUrl(path),
  };
}

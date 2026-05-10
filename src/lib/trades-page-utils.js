import {
  absoluteUrl,
  buildArticleSchema,
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildFounderPersonSchema,
  buildOrganizationSchema,
  buildProfessionalServiceSchema,
  buildServiceSchema,
} from "@/lib/trades-schema";

export function buildPageMetadata({ title, description, path }) {
  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl(path),
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(path),
      siteName: "USATII",
      type: "website",
    },
  };
}

export function buildStandardSchemas({
  path,
  title,
  description,
  breadcrumbs,
  faqs,
  includeFounder = true,
  serviceType,
  areaServed,
  includeArticle = false,
}) {
  const schemas = [buildOrganizationSchema()];

  if (includeFounder) {
    schemas.push(buildFounderPersonSchema());
  }

  if (serviceType) {
    schemas.push(
      buildProfessionalServiceSchema({
        path,
        name: `USATII - ${serviceType}`,
        description,
        areaServed,
        serviceType,
      }),
    );

    schemas.push(
      buildServiceSchema({
        path,
        name: serviceType,
        description,
        areaServed,
      }),
    );
  }

  if (breadcrumbs?.length) {
    schemas.push(buildBreadcrumbSchema(breadcrumbs));
  }

  if (faqs?.length) {
    schemas.push(buildFaqSchema(faqs));
  }

  if (includeArticle) {
    schemas.push(
      buildArticleSchema({
        path,
        title,
        description,
      }),
    );
  }

  return schemas;
}

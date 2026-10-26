import { notFound } from "next/navigation";
import DocumentationArticle from "../_components/documentation-article";
import { documentationPages, documentationMetadata, getDocumentationPage } from "@/lib/documentation";

export const dynamicParams = false;

export function generateStaticParams() {
  return documentationPages.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = documentationPages.find((entry) => entry.slug === slug);
  return page ? documentationMetadata(page) : {};
}

export default async function DocumentationTopic({ params }) {
  const { slug } = await params;
  const page = await getDocumentationPage(slug);
  if (!page) notFound();
  return <DocumentationArticle page={page} />;
}

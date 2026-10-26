import DocumentationArticle from "./_components/documentation-article";
import { documentationPages, documentationMetadata, getDocumentationPage } from "@/lib/documentation";

export const metadata = documentationMetadata(documentationPages[0]);

export default async function DocumentationPage() {
  const page = await getDocumentationPage("bootcamp");
  return <DocumentationArticle page={page} />;
}

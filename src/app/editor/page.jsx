import Header from "@/app/_components/header";
import Footer from "@/app/_components/footer";
import { buildPageMetadata } from "@/lib/trades-page-utils";
import EditorPageClient from "./editor-page-client";

export const metadata = buildPageMetadata({
  title: "USATII Editor for macOS",
  description: "Edit video, create motion graphics, generate subtitles, clean audio, follow faces, and export finished work from one macOS application.",
  path: "/editor",
});

export default function EditorPage() {
  return <><Header /><EditorPageClient /><Footer /></>;
}

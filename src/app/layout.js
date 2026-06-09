import "./globals.css";
import TelemetryTracker from "@/app/_components/telemetry-tracker";
import GlobalUiOverlays from "@/app/_components/global-ui-overlays";
import { Suspense } from "react";

export const metadata = {
  metadataBase: new URL("https://usatii.com"),
  title: {
    default: "USATII MEDIA | Custom Websites, Marketing Systems & Business Software",
    template: "%s | USATII",
  },
  description:
    "Rochester-based custom software, website, and marketing systems for trade businesses.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      style={{
        "--font-inter":
          "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <body className="font-sans antialiased">
        <Suspense fallback={null}>
          <TelemetryTracker />
        </Suspense>
        {children}
        <GlobalUiOverlays />
      </body>
    </html>
  );
}

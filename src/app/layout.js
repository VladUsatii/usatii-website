import "./globals.css";
import TelemetryTracker from "@/app/_components/telemetry-tracker";
import GlobalUiOverlays from "@/app/_components/global-ui-overlays";
import PrivacyConsentBanner from "@/app/_components/privacy-consent-banner";
import { Suspense } from "react";

export const metadata = {
  metadataBase: new URL("https://usatii.com"),
  title: {
    default: "USATII MEDIA | Business Software, Custom Websites, & AI Integration",
    template: "%s | USATII",
  },
  description:
    "Rochester-based custom software, business websites, and artificial intelligence integration for organizations that want to own their systems.",
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
        <PrivacyConsentBanner />
      </body>
    </html>
  );
}

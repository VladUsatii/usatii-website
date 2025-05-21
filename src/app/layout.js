import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",      // keeps FOUT small
  variable: "--font-inter",
});

export const metadata = {
  title: "USATII MEDIA - organic social media marketing.",
  description: "providing all-inclusive growth services for the business world.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body
        className={`font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

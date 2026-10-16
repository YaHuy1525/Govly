import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "@hai/ui/tokens.css";
import "../styles/global.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.holisticai.com"),
  title: {
    default: "Holistic AI – The Leading AI Governance Platform",
    template: "%s – Holistic AI",
  },
  description:
    "Holistic AI is the leading enterprise AI governance platform. One end-to-end tool to identify, protect, and enforce AI governance at scale. Get a demo.",
  openGraph: {
    type: "website",
    siteName: "Holistic AI",
    title: "Holistic AI – The Leading AI Governance Platform",
    description:
      "Discover every model, agent, and application. Assess AI risk, enforce policies, and bring your teams together around continuous governance.",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={GeistSans.className}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Tracker: data-consent="required" gates everything behind the banner (GDPR-correct).
            To replicate the original's ungated behavior, remove data-consent. */}
        <script
          src={`${process.env.NEXT_PUBLIC_TRACKER_URL || "https://hai-brain.localhost/hai-track.js"}`}
          data-consent="required"
          data-activity="on"
          defer
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

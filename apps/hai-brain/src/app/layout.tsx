import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "../styles/form.css";

export const metadata: Metadata = {
  title: "HAI Brain",
  description: "Holistic AI form and attribution platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body>{children}</body>
    </html>
  );
}

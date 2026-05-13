import type { Metadata, Viewport } from "next";
import { SiteShell } from "@/components/site-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nexus Portfolio | Embedded Systems & Software",
  description:
    "Personal portfolio for web technologies, embedded systems, and performance-focused engineering.",
  keywords: [
    "portfolio",
    "embedded systems",
    "software engineering",
    "hardware",
    "IoT",
    "low-level programming"
  ],
  authors: [{ name: "Miraj" }],
  openGraph: {
    title: "Nexus Portfolio",
    description:
      "Designing efficient systems for the real world through web technologies, embedded systems, and performance-focused engineering.",
    type: "website"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#050605"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SiteShell>{children}</SiteShell>
        <div className="scanline" aria-hidden="true" />
      </body>
    </html>
  );
}

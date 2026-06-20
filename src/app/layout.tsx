import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { AhrefsAnalytics } from "@/components/analytics/ahrefs-analytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CitePlex — AI-Powered Citation Generator | APA, MLA, Bluebook, Turabian",
  description:
    "Generate accurate citations in APA 7, MLA 9, Chicago, Turabian, Bluebook, and Harvard styles instantly. No ads, no clutter — just fast, clean citations for academics, law students, and researchers.",
  keywords: [
    "citation generator",
    "APA citation generator",
    "MLA citation generator",
    "bluebook citation generator",
    "turabian citation generator",
    "chicago citation generator",
    "harvard citation generator",
    "legal citation generator",
    "academic citation tool",
    "bibliography generator",
    "reference generator",
    "AI citation tool",
  ],
  openGraph: {
    title: "CitePlex — AI-Powered Citation Generator",
    description: "Fast, accurate citations in APA, MLA, Chicago, Turabian & Bluebook. No ads.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
      {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
      <AhrefsAnalytics />
    </html>
  );
}

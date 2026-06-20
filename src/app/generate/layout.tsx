import type { Metadata } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://citeplex.com";

// The generator reads ?style=…&type=… on the client, so every variant renders
// the same page. Declare a single canonical (the clean /generate URL) so those
// query-string variants aren't treated as duplicate pages.
export const metadata: Metadata = {
  title: "Citation Generator — APA, MLA, Chicago & More | CitePlex",
  description:
    "Generate perfectly formatted citations in seconds. Choose your style and source type, fill in the details, and copy your reference.",
  alternates: { canonical: `${BASE}/generate` },
  openGraph: {
    title: "CitePlex Citation Generator",
    description: "Create accurate citations in APA, MLA, Chicago, and 8 more styles.",
    type: "website",
    url: `${BASE}/generate`,
  },
};

export default function GenerateLayout({ children }: { children: React.ReactNode }) {
  return children;
}

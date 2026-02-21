import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us — Our Mission in Automated Copy Trading",
  description:
    "Meet the team behind Cloudbright. Licensed by HONG KONG CLOUD BRIGHT SOFTWARE LIMITED, we build the most transparent copy trading platform with verified bots and real-time performance tracking.",
  keywords:
    "about cloudbright, copy trading company, trading bot team, Hong Kong fintech, automated trading",
  openGraph: {
    title: "About Cloudbright — Copy Trading Platform",
    description:
      "Meet the team behind Cloudbright. Building the most transparent copy trading platform with verified bots.",
    type: "website",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

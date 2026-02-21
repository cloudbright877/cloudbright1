import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — Crypto Trading Insights, Strategies & Market Analysis",
  description:
    "Stay ahead with Cloudbright's blog: expert analysis on crypto markets, copy trading strategies, bot performance reviews, and industry updates for beginners and experienced traders.",
  keywords:
    "crypto blog, trading strategies, market analysis, copy trading tips, bot reviews, crypto news",
  openGraph: {
    title: "Blog — Cloudbright",
    description:
      "Expert analysis on crypto markets, copy trading strategies, and bot performance reviews.",
    type: "website",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

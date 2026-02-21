import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trading Services — Automated Copy Trading & Bot Marketplace",
  description:
    "Explore Cloudbright's suite of trading services: bot marketplace with diverse strategies, social copy trading, custodial wallets, real-time analytics, and automated portfolio management for crypto traders.",
  keywords:
    "copy trading services, bot marketplace, automated trading, crypto portfolio management, social trading, trading analytics",
  openGraph: {
    title: "Trading Services — Cloudbright",
    description:
      "Bot marketplace, social copy trading, custodial wallets, and real-time analytics for crypto traders.",
    type: "website",
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

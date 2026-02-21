import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bot Marketplace — Browse & Copy Verified Trading Strategies",
  description:
    "Discover and copy top-performing trading bots on Binance, Bybit, and OKX. Filter by exchange, strategy type, and performance metrics. Start with as little as $50 capital reservation.",
  keywords:
    "trading bots, bot marketplace, copy trading bots, Binance bots, Bybit bots, OKX bots, automated strategies, crypto bots",
  openGraph: {
    title: "Bot Marketplace — Cloudbright",
    description:
      "Discover and copy top-performing trading bots on Binance, Bybit, and OKX.",
    type: "website",
  },
};

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

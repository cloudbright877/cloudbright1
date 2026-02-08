import type { Metadata } from "next";
import "./globals.css";
import "./fonts.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "CLOUDBRIGHT — Bot Marketplace & Copy Trading Platform",
  description: "Professional trading bot marketplace. Browse, compare, and copy algorithmic trading strategies across 9+ exchanges. Non-custodial — your funds stay on your exchange.",
  keywords: "crypto trading bots, copy trading, bot marketplace, algorithmic trading, non-custodial, Binance, Bybit, OKX",
  authors: [{ name: "HONG KONG CLOUD BRIGHT SOFTWARE LIMITED" }],
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'none',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "CLOUDBRIGHT — Bot Marketplace & Copy Trading",
    description: "Professional trading bot marketplace. Copy algorithmic strategies across 9+ exchanges. Non-custodial.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans bg-white dark:bg-dark-900 text-gray-900 dark:text-white">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

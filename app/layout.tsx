import type { Metadata } from "next";
import "./globals.css";
import "./fonts.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: {
    default: "Cloudbright — Bot Marketplace & Copy Trading Platform",
    template: "%s | Cloudbright",
  },
  description: "Copy verified trading bots and earn passive income. Transparent real-time statistics, social copy trading community, secure custodial wallets for multiple cryptocurrencies.",
  keywords: "crypto copy trading, passive income, trading bots, bot marketplace, custodial wallets, Binance, Bybit, OKX",
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
    title: "Cloudbright — Bot Marketplace & Copy Trading",
    description: "Copy verified trading bots and earn passive income. Transparent statistics, social community, secure custodial wallets.",
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

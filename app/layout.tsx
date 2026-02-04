import type { Metadata } from "next";
import "./globals.css";
import "./fonts.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "Celestian - AI-Powered Crypto Investing | 1% Daily ROI",
  description: "Earn consistent 1% daily returns with our advanced AI trading algorithms. Join thousands of smart investors who trust Celestian for automated crypto trading.",
  keywords: "crypto investing, AI trading, passive income, crypto staking, automated trading, daily ROI",
  authors: [{ name: "Celestian Limited" }],
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
    title: "Celestian - AI-Powered Crypto Investing",
    description: "Earn 1% daily returns with AI-driven crypto trading",
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

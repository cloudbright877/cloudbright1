import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Affiliate Program — Earn Commissions with Cloudbright Referrals",
  description:
    "Join Cloudbright's affiliate program and earn recurring commissions. Share your referral link, invite traders to the platform, and build a passive income stream with our multi-tier bonus system.",
  keywords:
    "crypto affiliate program, referral program, trading affiliate, earn commissions, passive income referrals, copy trading affiliate",
  openGraph: {
    title: "Affiliate Program — Cloudbright",
    description:
      "Earn recurring commissions by referring traders to Cloudbright's copy trading platform.",
    type: "website",
  },
};

export default function AffiliateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

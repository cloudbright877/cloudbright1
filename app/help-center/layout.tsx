import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help Center — Guides, FAQ & Support Resources",
  description:
    "Find answers to your questions about Cloudbright's copy trading platform. Browse guides on bot setup, wallet management, deposits, withdrawals, and account security.",
  keywords:
    "help center, FAQ, copy trading guide, how to copy trade, trading bot setup, wallet management",
  openGraph: {
    title: "Help Center — Cloudbright",
    description:
      "Guides, FAQ, and support resources for Cloudbright's copy trading platform.",
    type: "website",
  },
};

export default function HelpCenterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

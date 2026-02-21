import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us — Reach the Cloudbright Support Team",
  description:
    "Have questions about Cloudbright's copy trading platform? Get in touch with our support team. We're here to help with account setup, bot selection, and technical inquiries.",
  keywords:
    "contact cloudbright, copy trading support, customer service, trading platform help",
  openGraph: {
    title: "Contact Us — Cloudbright",
    description:
      "Get in touch with the Cloudbright support team for help with copy trading and bot setup.",
    type: "website",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Legal",
    template: "%s | Cloudbright",
  },
  description: "Legal documents, policies, and compliance information for Cloudbright copy trading platform.",
};

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

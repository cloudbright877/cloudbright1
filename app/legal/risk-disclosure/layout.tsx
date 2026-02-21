import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Risk Disclosure",
  description: "Important information about the risks associated with cryptocurrency copy trading. Understand market volatility, potential losses, and responsible trading practices.",
};

export default function RiskDisclosureLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

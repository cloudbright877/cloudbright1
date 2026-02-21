import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account Recovery",
  description: "Recover access to your Cloudbright account. Verify your identity and restore your trading portfolio.",
};

export default function RecoveryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

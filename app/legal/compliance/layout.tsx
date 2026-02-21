import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compliance",
  description: "Cloudbright's regulatory compliance information. Licensed by HONG KONG CLOUD BRIGHT SOFTWARE LIMITED with adherence to AML, KYC, and financial regulations.",
};

export default function ComplianceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

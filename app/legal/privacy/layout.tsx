import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Learn how Cloudbright collects, uses, and protects your personal data. Our privacy policy covers data processing, cookies, and your rights under applicable regulations.",
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

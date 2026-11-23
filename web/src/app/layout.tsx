import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EligiBharat — Open-Source Indian Welfare Scheme Eligibility Assistant",
  description:
    "Deterministic rule checking and local LLM extraction for Indian government welfare schemes in English and Hindi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}

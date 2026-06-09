import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "RevenuePulse - AI Revenue Growth Analytics Platform",
    template: "%s | RevenuePulse"
  },
  description:
    "AI revenue analytics platform monitoring SaaS KPIs, churn, retention, CAC, LTV, funnel conversion, campaign ROI, data quality, anomaly detection, and grounded insight reporting."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

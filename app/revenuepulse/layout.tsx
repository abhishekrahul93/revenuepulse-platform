import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "RevenuePulse - AI Revenue Growth Analytics Platform"
  },
  description: "AI revenue analytics platform for SaaS KPIs, churn, retention, funnel, CAC, LTV, data quality, anomaly detection, source-grounded copilot answers, and insight reporting."
};

export default function RevenuePulseLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}

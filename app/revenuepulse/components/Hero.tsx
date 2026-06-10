"use client";

import { type RevenuePulseSnapshot, type MonthlyRevenueMetric } from "@/lib/revenuepulse";
import { formatCurrency, formatChange } from "../utils";

interface HeroProps {
  snapshot: RevenuePulseSnapshot;
  maxMrr: number;
  latest: MonthlyRevenueMetric;
  previous: MonthlyRevenueMetric;
  reportState: "idle" | "loading" | "ready" | "error";
  refreshInsightReport: () => Promise<void>;
}

export function Hero({ snapshot, maxMrr, latest, previous, reportState, refreshInsightReport }: HeroProps) {
  return (
    <section className="rp-hero">
      <div className="rp-hero-copy">
        <p className="eyebrow">Revenue Growth Analytics Platform</p>
        <h1>RevenuePulse</h1>
        <h2>AI revenue intelligence for growth decisions.</h2>
        <p>
          Monitor revenue movement, detect churn and funnel risk, and ask a grounded AI copilot for source-backed recommendations across MRR, CAC, LTV, retention, and campaign ROI.
        </p>
        <div className="rp-hero-actions">
          <a className="rp-primary-link" href="#rp-dashboard">View live dashboard</a>
          <a className="rp-secondary-link" href="#rp-copilot">Ask AI copilot</a>
          <button type="button" onClick={() => void refreshInsightReport()} disabled={reportState === "loading"}>
            {reportState === "loading" ? "Generating..." : "Generate stakeholder report"}
          </button>
        </div>
        <div className="rp-proof-row" aria-label="RevenuePulse capabilities">
          <span>SQL metric layer</span>
          <span>Data-quality checks</span>
          <span>Python anomaly logic</span>
          <span>Grounded AI copilot</span>
          <span>Evaluation panel</span>
        </div>
      </div>

      <div className="rp-hero-product" aria-label="RevenuePulse live product preview">
        <div className="rp-product-top">
          <div>
            <span>Live growth review</span>
            <strong>{latest.month}</strong>
          </div>
          <span className="rp-status rp-risk">Risk detected</span>
        </div>
        <div className="rp-product-metrics">
          <div>
            <span>MRR</span>
            <strong>{formatCurrency(latest.mrr)}</strong>
            <small>{formatChange(((latest.mrr - previous.mrr) / previous.mrr) * 100)} MoM</small>
          </div>
          <div>
            <span>Gross churn</span>
            <strong>{((latest.churnedCustomers / previous.activeCustomers) * 100).toFixed(1)}%</strong>
            <small>{latest.churnedCustomers} churned accounts</small>
          </div>
          <div>
            <span>CAC</span>
            <strong>{formatCurrency(latest.marketingSpend / latest.paidConversions)}</strong>
            <small>above target</small>
          </div>
        </div>
        <div className="rp-product-chart" aria-label="Mini MRR trend">
          {snapshot.monthlyMetrics.slice(-8).map((month) => (
            <span key={month.month} style={{ height: `${Math.max(18, (month.mrr / maxMrr) * 104)}px` }} />
          ))}
        </div>
        <div className="rp-product-report">
          <span>Recommended decision</span>
          <p>Pause weakest paid campaigns, investigate activation tracking, and launch a Seed SaaS retention save motion.</p>
        </div>
      </div>
    </section>
  );
}

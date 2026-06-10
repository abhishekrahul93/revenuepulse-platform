"use client";

import { type InsightReport } from "@/lib/revenuepulse";
import { formatDate } from "../utils";

interface ReportProps {
  report: InsightReport;
  reportState: "idle" | "loading" | "ready" | "error";
  reportGeneratedAt: string | null;
  reportFlash: boolean;
}

export function Report({ report, reportState, reportGeneratedAt, reportFlash }: ReportProps) {
  return (
    <section id="rp-report" className={`rp-report ${reportFlash ? "rp-report-flash" : ""}`}>
      <div className="rp-section-heading">
        <div>
          <p className="eyebrow">{report.source === "openai" ? "AI-generated" : "Grounded demo engine"}</p>
          <h2>{report.title}</h2>
        </div>
        <span aria-live="polite">{reportState === "loading" ? "Generating..." : reportState === "ready" ? "Generated" : reportState === "error" ? "Fallback shown" : "Ready"}</span>
      </div>
      <div className="rp-report-meta" aria-live="polite">
        <span>{report.source === "openai" ? "OpenAI generation" : "Grounded fallback engine"}</span>
        <span>{reportState === "loading" ? "Generating stakeholder brief..." : reportGeneratedAt ? `Generated ${formatDate(reportGeneratedAt)}` : "Click Generate report to refresh this stakeholder brief."}</span>
      </div>
      <p className="rp-report-summary">{report.executiveSummary}</p>
      <div className="rp-report-grid">
        <div>
          <h3>Findings</h3>
          <ul>{report.findings.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
        <div>
          <h3>Decisions</h3>
          <ul>{report.decisions.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
        <div>
          <h3>Risks</h3>
          <ul>{report.risks.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { getRevenuePulseSnapshot, type InsightReport } from "@/lib/revenuepulse";
import { Hero } from "./components/Hero";
import { Dashboard } from "./components/Dashboard";
import { Workspace } from "./components/Workspace";
import { Copilot } from "./components/Copilot";
import { Report } from "./components/Report";

type ReportState = "idle" | "loading" | "ready" | "error";

const snapshot = getRevenuePulseSnapshot();

export default function RevenuePulsePage() {
  const [activeView, setActiveView] = useState<"overview" | "quality" | "definitions">("overview");
  const [report, setReport] = useState<InsightReport>(snapshot.insightReport);
  const [reportState, setReportState] = useState<ReportState>("idle");
  const [reportGeneratedAt, setReportGeneratedAt] = useState<string | null>(null);
  const [reportFlash, setReportFlash] = useState(false);

  const maxMrr = useMemo(() => Math.max(...snapshot.monthlyMetrics.map((month) => month.mrr)), []);
  const latest = snapshot.monthlyMetrics[snapshot.monthlyMetrics.length - 1];
  const previous = snapshot.monthlyMetrics[snapshot.monthlyMetrics.length - 2];

  function scrollToSection(id: string) {
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function openWorkspaceView(view: "overview" | "quality" | "definitions") {
    setActiveView(view);
    scrollToSection("rp-workflow");
  }

  function revealGeneratedReport() {
    setReportGeneratedAt(new Date().toISOString());
    setReportFlash(true);
    scrollToSection("rp-report");
    window.setTimeout(() => setReportFlash(false), 2600);
  }

  async function refreshInsightReport() {
    setReportState("loading");
    setReportGeneratedAt(null);
    setReportFlash(true);
    scrollToSection("rp-report");

    try {
      const response = await fetch("/api/revenuepulse/insight", { method: "POST" });
      const nextReport = (await response.json()) as InsightReport;

      if (!response.ok) {
        setReport(snapshot.insightReport);
        setReportState("error");
        revealGeneratedReport();
        return;
      }

      setReport(nextReport);
      setReportState("ready");
      revealGeneratedReport();
    } catch {
      setReport(snapshot.insightReport);
      setReportState("error");
      revealGeneratedReport();
    }
  }

  return (
    <main className="rp-shell">
      <nav className="rp-nav" aria-label="RevenuePulse navigation">
        <Link className="rp-brand" href="/revenuepulse">
          <span>RP</span>
          <div>
            <strong>RevenuePulse</strong>
            <small>Growth analytics platform</small>
          </div>
        </Link>
        <div className="rp-nav-actions">
          <a href="#rp-dashboard">Dashboard</a>
          <a href="#rp-copilot">AI Copilot</a>
          <a href="#rp-report">Insight Report</a>
          <button type="button" onClick={() => openWorkspaceView("definitions")}>Metric Layer</button>
        </div>
      </nav>

      <Hero
        snapshot={snapshot}
        maxMrr={maxMrr}
        latest={latest}
        previous={previous}
        reportState={reportState}
        refreshInsightReport={refreshInsightReport}
      />

      <section className="rp-demo-flow" aria-label="How to use RevenuePulse">
        <div className="rp-demo-flow-copy">
          <p className="eyebrow">How to use this demo</p>
          <h2>Follow the same workflow a growth analyst would present to leadership.</h2>
        </div>
        <div className="rp-flow-steps">
          <a href="#rp-dashboard">
            <span>01</span>
            <strong>Review KPIs</strong>
            <small>MRR, ARR, churn, CAC, LTV, activation, and ROI.</small>
          </a>
          <button type="button" onClick={() => openWorkspaceView("quality")}>
            <span>02</span>
            <strong>Check trust layer</strong>
            <small>Inspect anomaly, freshness, duplicate, and tracking checks.</small>
          </button>
          <a href="#rp-copilot">
            <span>03</span>
            <strong>Ask AI copilot</strong>
            <small>Get grounded answers, sources, caveats, and next actions.</small>
          </a>
          <button type="button" onClick={() => void refreshInsightReport()} disabled={reportState === "loading"}>
            <span>04</span>
            <strong>{reportState === "loading" ? "Generating..." : "Generate report"}</strong>
            <small>Turn the analysis into a stakeholder-ready decision brief.</small>
          </button>
        </div>
      </section>

      <Dashboard snapshot={snapshot} />

      <Workspace
        snapshot={snapshot}
        maxMrr={maxMrr}
        latest={latest}
        activeView={activeView}
        setActiveView={setActiveView}
        reportState={reportState}
        refreshInsightReport={refreshInsightReport}
      />

      <Copilot snapshot={snapshot} />

      <Report
        report={report}
        reportState={reportState}
        reportGeneratedAt={reportGeneratedAt}
        reportFlash={reportFlash}
      />
    </main>
  );
}

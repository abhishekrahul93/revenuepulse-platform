"use client";

import { type RevenuePulseSnapshot, type MonthlyRevenueMetric } from "@/lib/revenuepulse";
import { formatCurrency, formatNumber, formatDate, statusLabel, statusClass } from "../utils";

interface WorkspaceProps {
  snapshot: RevenuePulseSnapshot;
  maxMrr: number;
  latest: MonthlyRevenueMetric;
  activeView: "overview" | "quality" | "definitions";
  setActiveView: (view: "overview" | "quality" | "definitions") => void;
  reportState: "idle" | "loading" | "ready" | "error";
  refreshInsightReport: () => Promise<void>;
}

export function Workspace({ snapshot, maxMrr, latest, activeView, setActiveView, reportState, refreshInsightReport }: WorkspaceProps) {
  return (
    <section id="rp-workflow" className="rp-workspace">
      <aside className="rp-sidebar" aria-label="RevenuePulse workflow controls">
        <div>
          <p className="eyebrow">Workflow</p>
          <h2>Analyst command center</h2>
        </div>
        <div className="rp-tabs" role="tablist" aria-label="Dashboard views">
          <button className={activeView === "overview" ? "active" : ""} type="button" onClick={() => setActiveView("overview")}>Overview</button>
          <button className={activeView === "quality" ? "active" : ""} type="button" onClick={() => setActiveView("quality")}>Data Quality</button>
          <button className={activeView === "definitions" ? "active" : ""} type="button" onClick={() => setActiveView("definitions")}>Metric Layer</button>
        </div>
        <div className="rp-context-box">
          <strong>{snapshot.companyContext.company}</strong>
          <span>{snapshot.companyContext.model}</span>
        </div>
        <div className="rp-context-box muted">
          <strong>Hiring signal</strong>
          <span>{snapshot.companyContext.audience}</span>
        </div>
        <button className="rp-primary-action" type="button" onClick={() => void refreshInsightReport()} disabled={reportState === "loading"}>
          {reportState === "loading" ? "Generating..." : "Generate Stakeholder Report"}
        </button>
        <p className="rp-helper">Use the tabs to inspect evidence, ask the copilot, then generate a leadership brief grounded in the visible metrics and quality checks.</p>
      </aside>

      <section className="rp-main-panel">
        {activeView === "overview" ? (
          <>
            <section className="rp-section rp-two-column">
              <article>
                <div className="rp-section-heading">
                  <div>
                    <p className="eyebrow">Trend</p>
                    <h2>MRR by month</h2>
                  </div>
                  <span>Updated {formatDate(snapshot.generatedAt)}</span>
                </div>
                <div className="rp-bar-chart" aria-label="Monthly recurring revenue trend">
                  {snapshot.monthlyMetrics.map((month) => (
                    <div className="rp-bar-item" key={month.month}>
                      <div style={{ height: `${Math.max(16, (month.mrr / maxMrr) * 180)}px` }} />
                      <span>{month.month.replace(" 202", " '2")}</span>
                    </div>
                  ))}
                </div>
              </article>

              <article>
                <div className="rp-section-heading">
                  <div>
                    <p className="eyebrow">Funnel</p>
                    <h2>Lead to paid conversion</h2>
                  </div>
                  <span>{formatNumber(latest.leads)} leads</span>
                </div>
                <div className="rp-funnel">
                  {snapshot.funnel.map((step) => (
                    <div className="rp-funnel-step" key={step.label}>
                      <div>
                        <strong>{step.label}</strong>
                        <span>{formatNumber(step.value)}</span>
                      </div>
                      <div className="rp-funnel-track">
                        <span className={`rp-funnel-fill rp-${step.health}`} style={{ width: `${Math.max(12, step.conversionFromPrevious ?? 100)}%` }} />
                      </div>
                      <small>{step.conversionFromPrevious === null ? "Starting volume" : `${step.conversionFromPrevious.toFixed(1)}% from previous step`}</small>
                    </div>
                  ))}
                </div>
              </article>
            </section>

            <section className="rp-section">
              <div className="rp-section-heading">
                <div>
                  <p className="eyebrow">Root cause</p>
                  <h2>Anomaly explanation queue</h2>
                </div>
                <span>{snapshot.anomalies.length} detected issues</span>
              </div>
              <div className="rp-anomaly-list">
                {snapshot.anomalies.map((anomaly) => (
                  <article className="rp-anomaly" key={anomaly.metric}>
                    <div>
                      <span className={statusClass(anomaly.severity)}>{statusLabel(anomaly.severity)}</span>
                      <h3>{anomaly.metric}</h3>
                    </div>
                    <p><strong>Detected:</strong> {anomaly.detectedChange}</p>
                    <p><strong>Likely cause:</strong> {anomaly.likelyCause}</p>
                    <p><strong>Impact:</strong> {anomaly.businessImpact}</p>
                    <p><strong>Action:</strong> {anomaly.recommendedAction}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="rp-section rp-two-column">
              <article>
                <div className="rp-section-heading">
                  <div>
                    <p className="eyebrow">Segments</p>
                    <h2>Customer health</h2>
                  </div>
                </div>
                <div className="rp-table">
                  <div className="rp-table-row heading">
                    <span>Segment</span>
                    <span>MRR</span>
                    <span>Churn</span>
                    <span>NRR</span>
                  </div>
                  {snapshot.segments.map((segment) => (
                    <div className="rp-table-row" key={segment.segment}>
                      <strong>{segment.segment}</strong>
                      <span>{formatCurrency(segment.mrr)}</span>
                      <span>{(segment.churnRate * 100).toFixed(1)}%</span>
                      <span>{(segment.netRevenueRetention * 100).toFixed(0)}%</span>
                    </div>
                  ))}
                </div>
              </article>

              <article>
                <div className="rp-section-heading">
                  <div>
                    <p className="eyebrow">Channels</p>
                    <h2>Spend efficiency</h2>
                  </div>
                </div>
                <div className="rp-channel-list">
                  {snapshot.channels.map((channel) => (
                    <div className="rp-channel" key={channel.channel}>
                      <div>
                        <strong>{channel.channel}</strong>
                        <span className={statusClass(channel.status)}>{statusLabel(channel.status)}</span>
                      </div>
                      <div className="rp-channel-metrics">
                        <span>CAC {formatCurrency(channel.cac)}</span>
                        <span>ROI {channel.roi.toFixed(1)}x</span>
                        <span>{channel.customers} customers</span>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            </section>
          </>
        ) : null}

        {activeView === "quality" ? (
          <section className="rp-section">
            <div className="rp-section-heading">
              <div>
                <p className="eyebrow">Trust layer</p>
                <h2>Data-quality checks before business action</h2>
              </div>
              <span>{snapshot.dataQuality.length} checks</span>
            </div>
            <div className="rp-quality-grid">
              {snapshot.dataQuality.map((check) => (
                <article className="rp-quality-card" key={check.check}>
                  <div>
                    <span className={statusClass(check.status)}>{statusLabel(check.status)}</span>
                    <small>{check.owner}</small>
                  </div>
                  <h3>{check.check}</h3>
                  <p>{check.result}</p>
                  <strong>{check.impact}</strong>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {activeView === "definitions" ? (
          <section className="rp-section">
            <div className="rp-section-heading">
              <div>
                <p className="eyebrow">Semantic layer</p>
                <h2>Metric definitions recruiters can inspect</h2>
              </div>
              <span>{snapshot.metricDefinitions.length} core metrics</span>
            </div>
            <div className="rp-definition-list">
              {snapshot.metricDefinitions.map((definition) => (
                <article className="rp-definition" key={definition.name}>
                  <div>
                    <h3>{definition.name}</h3>
                    <span>{definition.owner}</span>
                  </div>
                  <p>{definition.definition}</p>
                  <pre>{definition.sql}</pre>
                </article>
              ))}
            </div>
          </section>
        ) : null}
      </section>
    </section>
  );
}

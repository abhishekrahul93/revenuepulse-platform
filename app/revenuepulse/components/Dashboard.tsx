"use client";

import { type RevenuePulseSnapshot } from "@/lib/revenuepulse";
import { formatChange, statusLabel, statusClass } from "../utils";

interface DashboardProps {
  snapshot: RevenuePulseSnapshot;
}

export function Dashboard({ snapshot }: DashboardProps) {
  return (
    <section id="rp-dashboard" className="rp-kpi-grid" aria-label="RevenuePulse KPI summary">
      {snapshot.kpis.map((kpi) => (
        <article className="rp-kpi-card" key={kpi.label}>
          <div>
            <span className={statusClass(kpi.status)}>{statusLabel(kpi.status)}</span>
            <small>{kpi.category}</small>
          </div>
          <strong>{kpi.value}</strong>
          <p>{kpi.label}</p>
          <div className="rp-kpi-meta">
            <span>{formatChange(kpi.change)} vs previous month</span>
            <span>{kpi.target}</span>
          </div>
        </article>
      ))}
    </section>
  );
}

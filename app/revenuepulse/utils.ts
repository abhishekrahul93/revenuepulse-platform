import { type Status } from "@/lib/revenuepulse";

export function statusLabel(status: Status) {
  if (status === "good") return "Healthy";
  if (status === "watch") return "Watch";
  return "Risk";
}

export function statusClass(status: Status) {
  return `rp-status rp-${status}`;
}

export function formatChange(change: number) {
  const sign = change > 0 ? "+" : "";
  return `${sign}${change.toFixed(1)}%`;
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-DE").format(value);
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
    notation: "compact"
  }).format(value);
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-DE", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Berlin"
  }).format(new Date(value));
}

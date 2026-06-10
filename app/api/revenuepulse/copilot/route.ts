import { NextResponse } from "next/server";
import {
  getRevenuePulseCopilotResponse,
  getRevenuePulseSnapshot,
  type CopilotEvaluation,
  type CopilotResponse
} from "@/lib/revenuepulse";
import { extractResponseText, parseJsonText, toList, getOpenAIKey } from "@/lib/utils";

type CopilotRequest = {
  question?: string;
};

function clampScore(value: unknown, fallback: number) {
  if (typeof value !== "number" || Number.isNaN(value)) return fallback;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function normalizeEvaluation(value: Partial<CopilotEvaluation> | undefined, fallback: CopilotEvaluation): CopilotEvaluation {
  return {
    groundedness: clampScore(value?.groundedness, fallback.groundedness),
    completeness: clampScore(value?.completeness, fallback.completeness),
    actionability: clampScore(value?.actionability, fallback.actionability),
    hallucinationRisk: value?.hallucinationRisk === "Medium" || value?.hallucinationRisk === "High" ? value.hallucinationRisk : fallback.hallucinationRisk,
    checks: toList(value?.checks).slice(0, 4).length ? toList(value?.checks).slice(0, 4) : fallback.checks
  };
}

function normalizeCopilotResponse(parsed: Partial<CopilotResponse>, fallback: CopilotResponse): CopilotResponse {
  return {
    question: typeof parsed.question === "string" && parsed.question.trim() ? parsed.question : fallback.question,
    answer: typeof parsed.answer === "string" && parsed.answer.trim() ? parsed.answer : fallback.answer,
    nextActions: toList(parsed.nextActions).slice(0, 4).length ? toList(parsed.nextActions).slice(0, 4) : fallback.nextActions,
    caveats: toList(parsed.caveats).slice(0, 3).length ? toList(parsed.caveats).slice(0, 3) : fallback.caveats,
    sources: fallback.sources,
    evaluation: normalizeEvaluation(parsed.evaluation, fallback.evaluation),
    source: "openai"
  };
}

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => ({}))) as CopilotRequest;
  const question = payload.question?.trim() || "What should the CEO do this week?";
  const fallback = getRevenuePulseCopilotResponse(question);
  const openAIKey = getOpenAIKey();

  if (!openAIKey) {
    return NextResponse.json(fallback);
  }

  const snapshot = getRevenuePulseSnapshot();
  const groundedPayload = {
    question,
    fallbackAnswer: fallback.answer,
    allowedSources: fallback.sources,
    kpis: snapshot.kpis.map((kpi) => ({
      label: kpi.label,
      value: kpi.value,
      change: Number(kpi.change.toFixed(2)),
      status: kpi.status,
      definition: kpi.definition
    })),
    anomalies: snapshot.anomalies,
    dataQuality: snapshot.dataQuality,
    metricDefinitions: snapshot.metricDefinitions,
    segments: snapshot.segments,
    channels: snapshot.channels
  };

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${openAIKey}`
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content:
            "You are RevenuePulse Copilot, a production-style analytics copilot. Answer only from the supplied JSON. Return strict JSON with question, answer, nextActions, caveats, and evaluation. Do not invent metrics, dates, customers, companies, or causes. nextActions and caveats must be short string arrays. evaluation must include groundedness, completeness, actionability, hallucinationRisk, and checks."
        },
        {
          role: "user",
          content: JSON.stringify(groundedPayload)
        }
      ]
    })
  });

  if (!response.ok) {
    return NextResponse.json(fallback);
  }

  try {
    const data = await response.json();
    return NextResponse.json(normalizeCopilotResponse(parseJsonText<Partial<CopilotResponse>>(extractResponseText(data)), fallback));
  } catch {
    return NextResponse.json(fallback);
  }
}

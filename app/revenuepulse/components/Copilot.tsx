"use client";

import { useState } from "react";
import { type CopilotResponse, getRevenuePulseCopilotResponse, type RevenuePulseSnapshot } from "@/lib/revenuepulse";

type CopilotState = "idle" | "loading" | "ready" | "error";

interface CopilotProps {
  snapshot: RevenuePulseSnapshot;
}

export function Copilot({ snapshot }: CopilotProps) {
  const [copilotQuestion, setCopilotQuestion] = useState(snapshot.copilotQuestions[0].question);
  const [copilotResponse, setCopilotResponse] = useState<CopilotResponse>(getRevenuePulseCopilotResponse(snapshot.copilotQuestions[0].question));
  const [copilotState, setCopilotState] = useState<CopilotState>("idle");

  async function askCopilot(question = copilotQuestion) {
    const trimmed = question.trim();
    if (!trimmed) return;

    setCopilotQuestion(trimmed);
    setCopilotState("loading");

    try {
      const response = await fetch("/api/revenuepulse/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmed })
      });
      const result = (await response.json()) as CopilotResponse;

      if (!response.ok) {
        setCopilotState("error");
        return;
      }

      setCopilotResponse(result);
      setCopilotState("ready");
    } catch {
      setCopilotState("error");
    }
  }

  return (
    <section id="rp-copilot" className="rp-copilot">
      <div className="rp-section-heading">
        <div>
          <p className="eyebrow">Grounded AI Copilot</p>
          <h2>Ask revenue questions with sources and evaluation.</h2>
        </div>
        <span>{copilotResponse.source === "openai" ? "OpenAI + grounded context" : "Grounded demo engine"}</span>
      </div>

      <div className="rp-question-grid" aria-label="Suggested copilot questions">
        {snapshot.copilotQuestions.map((item) => (
          <button
            className={copilotQuestion === item.question ? "active" : ""}
            key={item.question}
            type="button"
            onClick={() => void askCopilot(item.question)}
            disabled={copilotState === "loading"}
          >
            <span>{item.label}</span>
            {item.question}
          </button>
        ))}
      </div>

      <form
        className="rp-copilot-form"
        onSubmit={(event) => {
          event.preventDefault();
          void askCopilot();
        }}
      >
        <input
          aria-label="Ask RevenuePulse Copilot"
          value={copilotQuestion}
          onChange={(event) => setCopilotQuestion(event.target.value)}
          placeholder="Ask why churn moved, whether MRR is real, or what to do next..."
        />
        <button type="submit" disabled={copilotState === "loading"}>
          {copilotState === "loading" ? "Thinking..." : "Ask"}
        </button>
      </form>

      <div className="rp-copilot-answer">
        <article>
          <div className="rp-answer-top">
            <span className="rp-status rp-good">Grounded answer</span>
            <small>{copilotState === "error" ? "Fallback shown" : "Ready"}</small>
          </div>
          <h3>{copilotResponse.question}</h3>
          <p>{copilotResponse.answer}</p>
          <div className="rp-answer-columns">
            <div>
              <h4>Next actions</h4>
              <ul>{copilotResponse.nextActions.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
            <div>
              <h4>Caveats</h4>
              <ul>{copilotResponse.caveats.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          </div>
        </article>

        <aside>
          <h3>Source grounding</h3>
          <div className="rp-source-list">
            {copilotResponse.sources.map((item) => (
              <div key={`${item.type}-${item.label}`}>
                <span>{item.type}</span>
                <strong>{item.label}</strong>
                <p>{item.detail}</p>
              </div>
            ))}
          </div>
        </aside>
      </div>

      <div className="rp-eval-panel">
        <div>
          <span>{copilotResponse.evaluation.groundedness}</span>
          <strong>Groundedness</strong>
        </div>
        <div>
          <span>{copilotResponse.evaluation.completeness}</span>
          <strong>Completeness</strong>
        </div>
        <div>
          <span>{copilotResponse.evaluation.actionability}</span>
          <strong>Actionability</strong>
        </div>
        <div>
          <span>{copilotResponse.evaluation.hallucinationRisk}</span>
          <strong>Hallucination risk</strong>
        </div>
      </div>

      <div className="rp-eval-checks">
        {copilotResponse.evaluation.checks.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </section>
  );
}

# RevenuePulse - AI Revenue Growth Analytics Platform

RevenuePulse is a recruiter-facing portfolio project for Data Analyst, Business Analyst, Product Analyst, BI Analyst, Growth Analyst, and Analytics Engineer roles.

It simulates a realistic B2B SaaS growth analytics environment with:

- MRR, ARR, churn, retention, activation, CAC, LTV, trial-to-paid conversion, and campaign ROI monitoring
- SQL-style metric definitions and an inspectable semantic layer
- Data-quality checks for freshness, duplicate subscriptions, attribution completeness, event reconciliation, and finance reconciliation
- Anomaly detection and root-cause explanations for KPI movement
- Segment and acquisition-channel performance views
- Grounded AI copilot answers with source cards, caveats, next actions, and evaluation signals
- Stakeholder-ready insight reports with optional OpenAI generation and deterministic local fallback

## Live Demo

Run locally:

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000/revenuepulse
```

## AI Setup

RevenuePulse works without an API key using its grounded fallback engine.

For optional OpenAI-generated responses, add:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

## Technical Scope

- `app/revenuepulse/page.tsx` - dashboard, AI copilot, evaluation panel, and insight report UI
- `app/api/revenuepulse/copilot/route.ts` - grounded copilot API with local fallback and optional OpenAI generation
- `app/api/revenuepulse/insight/route.ts` - grounded insight report API with local fallback and optional OpenAI generation
- `lib/revenuepulse.ts` - synthetic SaaS growth dataset, KPI definitions, data-quality checks, anomaly logic, copilot grounding model, and report model
- `docs/revenuepulse-case-study.md` - recruiter-friendly project narrative and demo script

## Portfolio Pitch

Companies do not only need dashboards; they need trustworthy revenue metrics, explainable KPI movement, and AI systems that answer business questions without inventing evidence. RevenuePulse shows the full analyst workflow from metric definition to anomaly detection to grounded AI decision support.

## Deploy On Vercel

1. Push this repository to GitHub.
2. Import the repository in Vercel.
3. Use the default Next.js settings.
4. Add `OPENAI_API_KEY` only if you want live OpenAI generation.
5. Deploy.

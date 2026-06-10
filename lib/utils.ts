import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

export function extractResponseText(data: {
  output_text?: string;
  output?: Array<{
    content?: Array<{
      text?: string;
    }>;
  }>;
}) {
  if (data.output_text) {
    return data.output_text;
  }

  return data.output?.flatMap((item) => item.content || []).find((content) => content.text)?.text || "";
}

export function parseJsonText<T>(content: string): T {
  const cleaned = content
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "");

  return JSON.parse(cleaned) as T;
}

export function toList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((item) => toList(item));
  }

  if (typeof value === "string") {
    return [value];
  }

  if (value && typeof value === "object") {
    return Object.entries(value as Record<string, unknown>).flatMap(([key, item]) =>
      toList(item).map((detail) => `${key}: ${detail}`)
    );
  }

  return [];
}

export function getOpenAIKey() {
  if (process.env.NODE_ENV === "production") {
    return process.env.OPENAI_API_KEY || "";
  }

  const envPath = join(process.cwd(), ".env.local");
  if (existsSync(envPath)) {
    const line = readFileSync(envPath, "utf8")
      .split(/\r?\n/)
      .find((item) => item.startsWith("OPENAI_API_KEY="));

    const localKey = line?.replace("OPENAI_API_KEY=", "").trim();
    if (localKey) {
      return localKey;
    }
  }

  return process.env.OPENAI_API_KEY || "";
}

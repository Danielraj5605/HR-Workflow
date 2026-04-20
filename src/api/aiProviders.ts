// src/api/aiProviders.ts
// Provider-agnostic AI abstraction layer
// Supports: Anthropic (Claude), Google (Gemini), MiniMax

import type { AIAnalysis } from '../types/workflow';

// ─────────────────────────────────────────
// Provider & Model catalogue
// ─────────────────────────────────────────

export type AIProvider = 'anthropic' | 'gemini' | 'minimax';

export interface AIModel {
  id: string;
  label: string;
  description: string;
}

export interface AIProviderConfig {
  id: AIProvider;
  label: string;
  logo: string;            // emoji fallback
  color: string;
  envKey: string;          // VITE_* env var name
  placeholder: string;    // placeholder text for the key input
  models: AIModel[];
  defaultModel: string;
  docsUrl: string;
}

export const AI_PROVIDERS: AIProviderConfig[] = [
  {
    id: 'anthropic',
    label: 'Anthropic Claude',
    logo: '🟣',
    color: '#6366f1',
    envKey: 'VITE_ANTHROPIC_API_KEY',
    placeholder: 'sk-ant-…',
    docsUrl: 'https://console.anthropic.com/',
    defaultModel: 'claude-3-haiku-20240307',
    models: [
      { id: 'claude-3-haiku-20240307',  label: 'Claude 3 Haiku',  description: 'Fast & affordable' },
      { id: 'claude-3-sonnet-20240229', label: 'Claude 3 Sonnet', description: 'Balanced' },
      { id: 'claude-3-opus-20240229',   label: 'Claude 3 Opus',   description: 'Most capable' },
    ],
  },
  {
    id: 'gemini',
    label: 'Google Gemini',
    logo: '🔵',
    color: '#4285f4',
    envKey: 'VITE_GEMINI_API_KEY',
    placeholder: 'AIza…',
    docsUrl: 'https://aistudio.google.com/app/apikey',
    defaultModel: 'gemini-2.0-flash',
    models: [
      { id: 'gemini-2.0-flash',        label: 'Gemini 2.0 Flash',   description: 'Fast & powerful' },
      { id: 'gemini-1.5-pro',          label: 'Gemini 1.5 Pro',     description: 'Long context' },
      { id: 'gemini-1.5-flash',        label: 'Gemini 1.5 Flash',   description: 'Balanced' },
    ],
  },
  {
    id: 'minimax',
    label: 'MiniMax',
    logo: '🟡',
    color: '#f59e0b',
    envKey: 'VITE_MINIMAX_API_KEY',
    placeholder: 'eyJ…',
    docsUrl: 'https://platform.minimaxi.com/',
    defaultModel: 'abab6.5s-chat',
    models: [
      { id: 'abab6.5s-chat', label: 'abab6.5s',   description: 'Fast & low cost' },
      { id: 'abab6.5-chat',  label: 'abab6.5',    description: 'High quality' },
      { id: 'abab5.5-chat',  label: 'abab5.5',    description: 'Legacy' },
    ],
  },
];

// ─────────────────────────────────────────
// Prompt builder (shared across providers)
// ─────────────────────────────────────────

export function buildPrompt(workflowJson: string): string {
  return `You are an expert HR workflow analyst. Analyze the following HR workflow JSON and respond ONLY with a valid JSON object (no markdown fences, no explanation, no prose) matching this exact schema:
{
  "issues": ["string", ...],
  "suggestions": ["string", ...],
  "summary": "string"
}

issues = things that are wrong, risky, or incomplete.
suggestions = concrete, actionable improvements.
summary = 1–2 sentence plain-English description of what this workflow does.

Workflow JSON:
${workflowJson}`;
}

// ─────────────────────────────────────────
// Fence stripper: handles various LLM output quirks
// ─────────────────────────────────────────

function stripFences(text: string): string {
  // Remove ```json ... ``` or ``` ... ``` wrappers
  let t = text.trim();
  t = t.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  // Find the first { and last } in case there's leading/trailing prose
  const start = t.indexOf('{');
  const end   = t.lastIndexOf('}');
  if (start !== -1 && end !== -1 && end > start) {
    t = t.slice(start, end + 1);
  }
  return t;
}

async function callAnthropic(apiKey: string, model: string, prompt: string): Promise<string> {
  // /api/anthropic is proxied by Vite to https://api.anthropic.com
  const res = await fetch('/api/anthropic/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { error?: { message?: string } };
    throw new Error(err.error?.message ?? `Anthropic API error (${res.status})`);
  }

  const json = await res.json() as { content: Array<{ type: string; text: string }> };
  return json.content.find(c => c.type === 'text')?.text ?? '{}';
}

async function callGemini(apiKey: string, model: string, prompt: string): Promise<string> {
  // /api/gemini is proxied by Vite to https://generativelanguage.googleapis.com
  const url = `/api/gemini/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 1024,
      },
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { error?: { message?: string } };
    throw new Error(err.error?.message ?? `Gemini API error (${res.status})`);
  }

  const json = await res.json() as {
    candidates: Array<{ content: { parts: Array<{ text: string }> } }>;
  };

  const raw = json.candidates?.[0]?.content?.parts?.[0]?.text ?? '{}';
  return stripFences(raw);
}

async function callMiniMax(apiKey: string, model: string, prompt: string): Promise<string> {
  // /api/minimax is proxied by Vite → https://api.minimax.io (international)
  // Uses the OpenAI-compatible endpoint
  const res = await fetch('/api/minimax/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: 'You are an expert HR workflow analyst. Always respond with valid JSON only. No markdown fences, no extra text.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 1024,
      temperature: 0.2,
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    let msg = `MiniMax API error (${res.status})`;
    try {
      const parsed = JSON.parse(errText) as {
        error?: { message?: string };
        base_resp?: { status_msg?: string };
      };
      msg = parsed.error?.message ?? parsed.base_resp?.status_msg ?? msg;
    } catch { /* ignore parse errors */ }
    throw new Error(msg);
  }

  const json = await res.json() as {
    choices?: Array<{ message: { content: string } }>;
    error?: { message: string };
    base_resp?: { status_code: number; status_msg: string };
  };

  // Check for application-level errors embedded in a 200 response
  if (json.error?.message) throw new Error(json.error.message);
  if (json.base_resp?.status_code && json.base_resp.status_code !== 0) {
    throw new Error(json.base_resp.status_msg ?? 'MiniMax returned an error.');
  }

  const raw = json.choices?.[0]?.message?.content ?? '{}';
  return stripFences(raw);
}

// ─────────────────────────────────────────
// Unified call function
// ─────────────────────────────────────────

export async function callAIProvider(
  provider: AIProvider,
  apiKey: string,
  model: string,
  workflowJson: string
): Promise<AIAnalysis> {
  const prompt = buildPrompt(workflowJson);

  let rawText: string;
  switch (provider) {
    case 'anthropic': rawText = await callAnthropic(apiKey, model, prompt); break;
    case 'gemini':    rawText = await callGemini(apiKey, model, prompt);    break;
    case 'minimax':   rawText = await callMiniMax(apiKey, model, prompt);   break;
  }

  try {
    const raw = JSON.parse(rawText) as Record<string, unknown>;

    // Dev-mode: log what the AI actually returned so we can debug
    if (import.meta.env.DEV) {
      console.log(`[AI/${provider}] raw parsed:`, raw);
    }

    // Normalize: LLMs sometimes use different keys or null values
    const summary = (
      typeof raw.summary     === 'string' ? raw.summary :
      typeof raw.message     === 'string' ? raw.message :
      typeof raw.description === 'string' ? raw.description :
      'Unable to generate summary.'
    );
    const normalized: AIAnalysis = {
      summary,
      issues:      (Array.isArray(raw.issues)      ? raw.issues      as string[] :
                   Array.isArray(raw.problems)     ? raw.problems    as string[] : []),
      suggestions: (Array.isArray(raw.suggestions) ? raw.suggestions as string[] :
                   Array.isArray(raw.improvements) ? raw.improvements as string[] :
                   Array.isArray(raw.recommendations) ? raw.recommendations as string[] : []),
    };
    return normalized;
  } catch {
    // If JSON.parse fails, log the raw text for debugging
    if (import.meta.env.DEV) {
      console.warn(`[AI/${provider}] failed to parse JSON. Raw text:`, rawText);
    }
    throw new Error(`Failed to parse AI response as JSON. Raw: ${rawText.slice(0, 300)}`);
  }
}

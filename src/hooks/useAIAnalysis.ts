// src/hooks/useAIAnalysis.ts
import { useState, useCallback } from 'react';
import type { AIAnalysis } from '../types/workflow';
import type { AIProvider } from '../api/aiProviders';
import { callAIProvider } from '../api/aiProviders';
import { serializeGraph } from '../utils/graphSerializer';
import { useWorkflowStore } from './useWorkflowStore';

export interface AIAnalysisOptions {
  provider: AIProvider;
  model: string;
  /** Runtime API key entered in the panel (overrides env var) */
  runtimeKey?: string;
}

interface UseAIAnalysisReturn {
  analysis: AIAnalysis | null;
  loading: boolean;
  error: string | null;
  analyze: (opts: AIAnalysisOptions) => Promise<void>;
  reset: () => void;
}

const PLACEHOLDER_VALUES = new Set([
  'your_anthropic_api_key_here',
  'your_gemini_api_key_here',
  'your_minimax_api_key_here',
  '',
]);

/** Returns the env-configured API key for a given provider, or empty string if not set */
export function getEnvKey(provider: AIProvider): string {
  let key = '';
  switch (provider) {
    case 'anthropic': key = import.meta.env.VITE_ANTHROPIC_API_KEY ?? ''; break;
    case 'gemini':    key = import.meta.env.VITE_GEMINI_API_KEY    ?? ''; break;
    case 'minimax':   key = import.meta.env.VITE_MINIMAX_API_KEY   ?? ''; break;
  }
  return PLACEHOLDER_VALUES.has(key.trim()) ? '' : key.trim();
}

export function useAIAnalysis(): UseAIAnalysisReturn {
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);

  const nodes = useWorkflowStore(s => s.nodes);
  const edges = useWorkflowStore(s => s.edges);

  const analyze = useCallback(async ({ provider, model, runtimeKey }: AIAnalysisOptions) => {
    // Key resolution: runtime input > env var
    const apiKey = runtimeKey?.trim() || getEnvKey(provider);

    if (!apiKey) {
      setError(`No API key configured for ${provider}. Enter one in the panel or add it to .env.local.`);
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const graph       = serializeGraph(nodes, edges);
      const workflowJson = JSON.stringify(graph, null, 2);
      const result      = await callAIProvider(provider, apiKey, model, workflowJson);
      setAnalysis(result);
    } catch (e) {
      setError((e as Error).message ?? 'AI analysis failed');
    } finally {
      setLoading(false);
    }
  }, [nodes, edges]);

  const reset = useCallback(() => {
    setAnalysis(null);
    setError(null);
  }, []);

  return { analysis, loading, error, analyze, reset };
}

// src/hooks/useSimulate.ts
import { useState, useCallback } from 'react';
import type { SimulationResult } from '../types/workflow';
import { serializeGraph } from '../utils/graphSerializer';
import { useWorkflowStore } from './useWorkflowStore';

interface UseSimulateReturn {
  result: SimulationResult | null;
  loading: boolean;
  error: string | null;
  run: () => Promise<void>;
  reset: () => void;
}

export function useSimulate(): UseSimulateReturn {
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { nodes, edges } = useWorkflowStore();

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const graph = serializeGraph(nodes, edges);
      const res = await fetch('/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workflow: graph }),
      });

      if (!res.ok) throw new Error(`Simulation failed (${res.status})`);
      const data = (await res.json()) as SimulationResult;
      setResult(data);
    } catch (e) {
      setError((e as Error).message ?? 'Simulation error');
    } finally {
      setLoading(false);
    }
  }, [nodes, edges]);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { result, loading, error, run, reset };
}

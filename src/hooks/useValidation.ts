// src/hooks/useValidation.ts
import { useMemo } from 'react';
import { useWorkflowStore } from './useWorkflowStore';
import { validateWorkflow } from '../utils/workflowValidator';
import type { ValidationError } from '../types/workflow';

export function useValidation(): ValidationError[] {
  const nodes = useWorkflowStore(s => s.nodes);
  const edges  = useWorkflowStore(s => s.edges);

  return useMemo(() => validateWorkflow(nodes, edges), [nodes, edges]);
}

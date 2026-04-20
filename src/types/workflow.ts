// src/types/workflow.ts
import type { Node, Edge } from '@xyflow/react';
import type { WorkflowNodeData, NodeType } from './nodes';

export interface WorkflowGraph {
  nodes: Node<WorkflowNodeData>[];
  edges: Edge[];
}

export type SimulationStatus = 'completed' | 'pending' | 'skipped' | 'error';

export interface SimulationStep {
  nodeId: string;
  nodeLabel: string;
  nodeType: NodeType;
  status: SimulationStatus;
  duration: number;     // mocked seconds
  detail: string;       // human-readable explanation
  timestamp: string;    // ISO 8601
}

export interface SimulationResult {
  steps: SimulationStep[];
  summary: string;
  totalDuration: number;
}

export interface ValidationError {
  nodeId?: string;
  type: 'start_count' | 'end_count' | 'cycle' | 'disconnected' | 'missing_edge';
  message: string;
  severity: 'error' | 'warning';
}

export interface AIAnalysis {
  issues: string[];
  suggestions: string[];
  summary: string;
}

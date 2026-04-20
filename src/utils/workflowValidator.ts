// src/utils/workflowValidator.ts
// Validates the workflow graph and returns a list of ValidationErrors.

import type { Node, Edge } from '@xyflow/react';
import type { WorkflowNodeData } from '../types/nodes';
import type { ValidationError } from '../types/workflow';
import { hasCycle } from './cycleDetector';

export function validateWorkflow(
  nodes: Node<WorkflowNodeData>[],
  edges: Edge[]
): ValidationError[] {
  const errors: ValidationError[] = [];

  // ── 1. Start node count ──────────────────────────────────
  const startNodes = nodes.filter(n => n.data.type === 'start');
  if (startNodes.length === 0) {
    errors.push({
      type: 'start_count',
      message: 'Workflow must have exactly one Start node.',
      severity: 'error',
    });
  } else if (startNodes.length > 1) {
    errors.push({
      type: 'start_count',
      message: `Workflow has ${startNodes.length} Start nodes — exactly one is required.`,
      severity: 'error',
    });
  }

  // ── 2. End node count ────────────────────────────────────
  const endNodes = nodes.filter(n => n.data.type === 'end');
  if (endNodes.length === 0) {
    errors.push({
      type: 'end_count',
      message: 'Workflow must have at least one End node.',
      severity: 'error',
    });
  }

  // ── 3. Cycle detection ───────────────────────────────────
  if (hasCycle(nodes.map(n => n.id), edges)) {
    errors.push({
      type: 'cycle',
      message: 'Workflow contains a cycle. All flows must be directed acyclic.',
      severity: 'error',
    });
  }

  // ── 4. Disconnected nodes ────────────────────────────────
  if (nodes.length > 0) {
    const connectedIds = new Set<string>();
    for (const edge of edges) {
      connectedIds.add(edge.source);
      connectedIds.add(edge.target);
    }

    for (const node of nodes) {
      const isStart = node.data.type === 'start';
      const isEnd   = node.data.type === 'end';

      if (!isStart && !isEnd && !connectedIds.has(node.id)) {
        errors.push({
          nodeId: node.id,
          type: 'disconnected',
          message: `"${node.data.label}" is not connected to the workflow.`,
          severity: 'warning',
        });
      }

      // Start node must have at least one outgoing edge
      if (isStart && edges.filter(e => e.source === node.id).length === 0 && nodes.length > 1) {
        errors.push({
          nodeId: node.id,
          type: 'missing_edge',
          message: `Start node "${node.data.label}" has no outgoing connections.`,
          severity: 'warning',
        });
      }

      // End node must have at least one incoming edge
      if (isEnd && edges.filter(e => e.target === node.id).length === 0 && nodes.length > 1) {
        errors.push({
          nodeId: node.id,
          type: 'missing_edge',
          message: `End node "${node.data.label}" has no incoming connections.`,
          severity: 'warning',
        });
      }
    }
  }

  return errors;
}

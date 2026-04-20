// src/utils/graphSerializer.ts
// Serializes the workflow graph to a clean JSON-safe object.

import type { Node, Edge } from '@xyflow/react';
import type { WorkflowNodeData } from '../types/nodes';
import type { WorkflowGraph } from '../types/workflow';

export function serializeGraph(
  nodes: Node<WorkflowNodeData>[],
  edges: Edge[]
): WorkflowGraph {
  // Strip React Flow internal fields we don't want to persist
  const cleanNodes = nodes.map(({ id, type, position, data }) => ({
    id,
    type,
    position,
    data,
  })) as Node<WorkflowNodeData>[];

  const cleanEdges = edges.map(({ id, source, target, type, animated, style }) => ({
    id,
    source,
    target,
    type,
    animated,
    style,
  })) as Edge[];

  return { nodes: cleanNodes, edges: cleanEdges };
}

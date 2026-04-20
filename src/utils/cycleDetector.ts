// src/utils/cycleDetector.ts
// DFS-based directed cycle detection for the workflow graph.
// Returns true if the graph contains at least one cycle.

import type { Edge } from '@xyflow/react';

export function hasCycle(nodeIds: string[], edges: Edge[]): boolean {
  // Build adjacency list
  const adj: Map<string, string[]> = new Map();
  for (const id of nodeIds) {
    adj.set(id, []);
  }
  for (const edge of edges) {
    const neighbors = adj.get(edge.source);
    if (neighbors) {
      neighbors.push(edge.target);
    }
  }

  // DFS with three-color marking: 0=white, 1=gray (in stack), 2=black (done)
  const color: Map<string, 0 | 1 | 2> = new Map(nodeIds.map(id => [id, 0]));

  function dfs(node: string): boolean {
    color.set(node, 1);
    for (const neighbor of (adj.get(node) ?? [])) {
      if (color.get(neighbor) === 1) return true;  // back edge → cycle
      if (color.get(neighbor) === 0 && dfs(neighbor)) return true;
    }
    color.set(node, 2);
    return false;
  }

  for (const id of nodeIds) {
    if (color.get(id) === 0 && dfs(id)) return true;
  }

  return false;
}

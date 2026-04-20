// src/components/nodes/nodeColors.ts
// Separate file to avoid React Fast Refresh issues (non-component exports in component files)

import type { NodeType } from '../../types/nodes';

export const NODE_COLORS: Record<string, string> = {
  start:         '#22c55e',
  task:          '#6366f1',
  approval:      '#f59e0b',
  automatedStep: '#06b6d4',
  end:           '#ef4444',
};

export function getNodeColor(type: string | undefined): string {
  return NODE_COLORS[(type as NodeType) ?? ''] ?? '#6366f1';
}

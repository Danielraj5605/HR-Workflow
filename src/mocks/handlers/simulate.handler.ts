// src/mocks/handlers/simulate.handler.ts
// POST /simulate — Kahn's topological sort + status simulation
import { http, HttpResponse } from 'msw';
import type { SimulationResult, SimulationStep, SimulationStatus } from '../../types/workflow';
import type { WorkflowGraph } from '../../types/workflow';
import type { NodeType } from '../../types/nodes';

// Mock durations per node type (seconds)
const DURATION: Record<string, number> = {
  start:         0,
  task:          3,
  approval:      2,
  automatedStep: 1,
  end:           0,
};

function detailFor(type: string, status: SimulationStatus, label: string): string {
  if (status === 'skipped')   return `"${label}" was skipped due to a pending upstream approval.`;
  if (status === 'pending')   return `"${label}" is awaiting manual approval — downstream nodes are blocked.`;
  if (status === 'error')     return `"${label}" encountered an error during execution.`;
  switch (type) {
    case 'start':         return `Workflow initiated at "${label}".`;
    case 'task':          return `Task "${label}" completed successfully.`;
    case 'approval':      return `Approval "${label}" auto-approved based on threshold.`;
    case 'automatedStep': return `Automated action at "${label}" executed successfully.`;
    case 'end':           return `Workflow reached terminal node "${label}".`;
    default:              return `"${label}" completed.`;
  }
}

export const simulateHandler = http.post('/simulate', async ({ request }) => {
  const body = (await request.json()) as { workflow: WorkflowGraph };
  const { nodes, edges } = body.workflow;

  if (!nodes || nodes.length === 0) {
    return HttpResponse.json({ steps: [], summary: 'Empty workflow.', totalDuration: 0 });
  }

  // ─── Build adjacency structures ──────────────────────────
  const inDegree = new Map<string, number>();
  const adj = new Map<string, string[]>();
  const predecessors = new Map<string, string[]>();

  for (const node of nodes) {
    inDegree.set(node.id, 0);
    adj.set(node.id, []);
    predecessors.set(node.id, []);
  }

  for (const edge of edges) {
    inDegree.set(edge.target, (inDegree.get(edge.target) ?? 0) + 1);
    adj.get(edge.source)?.push(edge.target);
    predecessors.get(edge.target)?.push(edge.source);
  }

  // ─── Kahn's algorithm ────────────────────────────────────
  const queue: string[] = [];
  for (const [id, deg] of inDegree) {
    if (deg === 0) queue.push(id);
  }

  const nodeStatus = new Map<string, SimulationStatus>();
  const steps: SimulationStep[] = [];
  const now = new Date();

  while (queue.length > 0) {
    const nodeId = queue.shift()!;
    const node = nodes.find(n => n.id === nodeId);
    if (!node) continue;

    const type = (node.type ?? 'task') as string;
    const data = node.data as { label?: string; autoApproveThreshold?: number } & Record<string, unknown>;
    const label = data.label ?? nodeId;

    // Determine status
    let status: SimulationStatus;
    const preds = predecessors.get(nodeId) ?? [];
    const anyPredPending = preds.some(
      pid => nodeStatus.get(pid) === 'pending' || nodeStatus.get(pid) === 'skipped'
    );

    if (anyPredPending) {
      status = 'skipped';
    } else if (type === 'approval' && !anyPredPending) {
      const threshold = (data.autoApproveThreshold as number | undefined) ?? 0;
      status = threshold > 0 ? 'completed' : 'pending';
    } else {
      status = 'completed';
    }

    nodeStatus.set(nodeId, status);

    const stepTime = new Date(now.getTime() + steps.length * 500);
    steps.push({
      nodeId,
      nodeLabel: label,
      nodeType: type as NodeType,
      status,
      duration: DURATION[type] ?? 1,
      detail: detailFor(type, status, label),
      timestamp: stepTime.toISOString(),
    });

    // Decrement in-degree of successors and enqueue when 0
    for (const targetId of (adj.get(nodeId) ?? [])) {
      const remaining = (inDegree.get(targetId) ?? 1) - 1;
      inDegree.set(targetId, remaining);
      if (remaining === 0) queue.push(targetId);
    }
  }

  // ─── Build summary ───────────────────────────────────────
  const hasPending = steps.some(s => s.status === 'pending');
  const hasSkipped = steps.some(s => s.status === 'skipped');
  const totalDuration = steps.reduce((acc, s) => acc + s.duration, 0);

  let summary: string;
  if (hasPending) {
    summary = `Workflow paused — waiting for manual approval. ${hasSkipped ? 'Downstream nodes skipped.' : ''}`.trim();
  } else {
    summary = `Workflow completed in ${totalDuration}s — all ${steps.length} steps processed successfully.`;
  }

  const result: SimulationResult = { steps, summary, totalDuration };
  return HttpResponse.json(result);
});

// src/types/api.ts

export interface AutomationAction {
  id: string;
  label: string;
  params: string[];   // parameter names for this action
}

export interface SimulatePayload {
  workflow: import('./workflow').WorkflowGraph;
}

// Note: GET /automations returns AutomationAction[] directly (array, not wrapped)
// POST /simulate body: SimulatePayload → SimulationResult
// POST /analyze body: { workflow: WorkflowGraph } → AIAnalysis

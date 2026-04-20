// src/types/nodes.ts

export const NodeType = {
  Start:         'start',
  Task:          'task',
  Approval:      'approval',
  AutomatedStep: 'automatedStep',
  End:           'end',
} as const;
export type NodeType = typeof NodeType[keyof typeof NodeType];

// ─────────────────────────────────────────
// Individual node data interfaces
// Discriminated union — data.type is the discriminant
// ─────────────────────────────────────────

export interface StartNodeData {
  type: 'start';
  label: string;
  metadata: Record<string, string>;
}

export interface TaskNodeData {
  type: 'task';
  label: string;
  description: string;
  assignee: string;
  dueDate: string;          // ISO date string
  customFields: Record<string, string>;
}

export interface ApprovalNodeData {
  type: 'approval';
  label: string;
  approverRole: 'Manager' | 'HRBP' | 'Director';
  approverName: string;          // optional specific approver name
  autoApproveThreshold: number;  // timeout in days; 0 = requires manual
  rejectionAction: 'reject' | 'escalate' | 'send_back';  // what happens on rejection
}

export interface AutomatedStepNodeData {
  type: 'automatedStep';
  label: string;
  actionId: string;          // references AutomationAction.id
  actionLabel: string;       // display label for the action
  params: Record<string, string>;  // dynamic key-value params
  maxRetries: number;        // 0 = no retry on failure
  retryDelaySeconds: number; // seconds to wait between retries
}

export interface EndNodeData {
  type: 'end';
  label: string;
  endMessage: string;
  showSummary: boolean;
}

export type WorkflowNodeData =
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutomatedStepNodeData
  | EndNodeData;

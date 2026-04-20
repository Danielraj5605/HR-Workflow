// src/hooks/useWorkflowStore.ts
import { create } from 'zustand';
import {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  type XYPosition,
  type NodeChange,
  type EdgeChange,
  type Connection,
} from '@xyflow/react';
import type { WorkflowNodeData, NodeType } from '../types/nodes';
import { nanoid } from '../utils/nanoid';

// ─────────────────────────────────────────
// Default data factories
// ─────────────────────────────────────────

function defaultData(type: NodeType): WorkflowNodeData {
  switch (type) {
    case 'start':
      return { type: 'start', label: 'Start', metadata: {} };
    case 'task':
      return { type: 'task', label: 'New Task', description: '', assignee: '', dueDate: '', customFields: {} };
    case 'approval':
      return { type: 'approval', label: 'Approval', approverRole: 'Manager', approverName: '', autoApproveThreshold: 0, rejectionAction: 'reject' };
    case 'automatedStep':
      return { type: 'automatedStep', label: 'Automated Step', actionId: '', actionLabel: '', params: {}, maxRetries: 0, retryDelaySeconds: 30 };
    case 'end':
      return { type: 'end', label: 'End', endMessage: 'Workflow completed.', showSummary: true };
  }
}

// ─────────────────────────────────────────
// Store Interface
// ─────────────────────────────────────────

interface WorkflowStore {
  // Core graph state
  nodes: Node<WorkflowNodeData>[];
  edges: Edge[];

  // Selection
  selectedNodeId: string | null;

  // React Flow change handlers
  onNodesChange: OnNodesChange<Node<WorkflowNodeData>>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;

  // Selection
  setSelectedNode: (id: string | null) => void;

  // Node data mutation
  updateNodeData: (id: string, data: Partial<WorkflowNodeData>) => void;

  // Graph CRUD
  addNode: (type: NodeType, position: XYPosition) => void;
  deleteNode: (id: string) => void;
  clearWorkflow: () => void;
  importWorkflow: (nodes: Node<WorkflowNodeData>[], edges: Edge[]) => void;

  // Helper
  getNodeById: (id: string) => Node<WorkflowNodeData> | undefined;
}

// ─────────────────────────────────────────
// Store Implementation
// ─────────────────────────────────────────

export const useWorkflowStore = create<WorkflowStore>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,

  onNodesChange: (changes: NodeChange<Node<WorkflowNodeData>>[]) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) });
  },

  onEdgesChange: (changes: EdgeChange[]) => {
    set({ edges: applyEdgeChanges(changes, get().edges) });
  },

  onConnect: (connection: Connection) => {
    set({
      edges: addEdge(
        { ...connection, animated: true, style: { stroke: '#6366f1', strokeWidth: 2 } },
        get().edges
      ),
    });
  },

  setSelectedNode: (id) => set({ selectedNodeId: id }),

  updateNodeData: (id, data) => {
    set({
      nodes: get().nodes.map(node =>
        node.id === id
          ? { ...node, data: { ...node.data, ...data } as WorkflowNodeData }
          : node
      ),
    });
  },

  addNode: (type, position) => {
    const id = nanoid();
    const newNode: Node<WorkflowNodeData> = {
      id,
      type,
      position,
      data: defaultData(type),
    };
    set({ nodes: [...get().nodes, newNode] });
  },

  deleteNode: (id) => {
    set({
      nodes: get().nodes.filter(n => n.id !== id),
      edges: get().edges.filter(e => e.source !== id && e.target !== id),
      selectedNodeId: get().selectedNodeId === id ? null : get().selectedNodeId,
    });
  },

  clearWorkflow: () => set({ nodes: [], edges: [], selectedNodeId: null }),

  importWorkflow: (nodes, edges) =>
    set({ nodes, edges, selectedNodeId: null }),

  getNodeById: (id) => get().nodes.find(n => n.id === id),
}));

// src/components/forms/NodeFormPanel.tsx
// Discriminated union router — renders the correct form based on selected node's data.type

import { useWorkflowStore } from '../../hooks/useWorkflowStore';
import StartForm from './StartForm';
import TaskForm from './TaskForm';
import ApprovalForm from './ApprovalForm';
import AutomatedStepForm from './AutomatedStepForm';
import EndForm from './EndForm';
import type {
  StartNodeData, TaskNodeData, ApprovalNodeData,
  AutomatedStepNodeData, EndNodeData,
} from '../../types/nodes';

export default function NodeFormPanel() {
  const selectedNodeId = useWorkflowStore(s => s.selectedNodeId);
  const getNodeById = useWorkflowStore(s => s.getNodeById);

  if (!selectedNodeId) {
    return (
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        padding: '0 24px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 32 }}>🖱️</div>
        <p style={{ color: '#475569', fontSize: 13, fontWeight: 500, margin: 0 }}>
          Select a node to configure it
        </p>
        <p style={{ color: '#334155', fontSize: 11.5, margin: 0 }}>
          Click any node on the canvas to see its settings here
        </p>
      </div>
    );
  }

  const node = getNodeById(selectedNodeId);
  if (!node) return null;

  const { data } = node;

  return (
    <div
      style={{ padding: '16px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column' }}
      className="animate-fade-in"
    >
      {/* Node type badge */}
      <div style={{ marginBottom: 14 }}>
        <span style={{
          fontSize: 10,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: '#6366f1',
          background: 'rgba(99,102,241,0.12)',
          padding: '3px 8px',
          borderRadius: 20,
        }}>
          {data.type}
        </span>
        <p style={{ color: '#64748b', fontSize: 11, margin: '6px 0 0' }}>
          Node ID: <code style={{ color: '#94a3b8', fontSize: 10 }}>{selectedNodeId}</code>
        </p>
      </div>

      {/* Form routing */}
      {data.type === 'start'         && <StartForm         nodeId={selectedNodeId} data={data as StartNodeData} />}
      {data.type === 'task'          && <TaskForm          nodeId={selectedNodeId} data={data as TaskNodeData} />}
      {data.type === 'approval'      && <ApprovalForm       nodeId={selectedNodeId} data={data as ApprovalNodeData} />}
      {data.type === 'automatedStep' && <AutomatedStepForm  nodeId={selectedNodeId} data={data as AutomatedStepNodeData} />}
      {data.type === 'end'           && <EndForm           nodeId={selectedNodeId} data={data as EndNodeData} />}
    </div>
  );
}

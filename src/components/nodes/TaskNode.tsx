// src/components/nodes/TaskNode.tsx
import { ClipboardList } from 'lucide-react';
import { type NodeProps } from '@xyflow/react';
import BaseNode from './BaseNode';
import type { TaskNodeData } from '../../types/nodes';

export default function TaskNode({ id, data, selected }: NodeProps) {
  const nodeData = data as unknown as TaskNodeData;

  return (
    <BaseNode
      nodeId={id}
      type="task"
      selected={selected}
      headerIcon={<ClipboardList size={13} />}
      headerLabel="Task"
    >
      <p style={{ color: '#e2e8f0', fontWeight: 600, margin: 0, marginBottom: 4, fontSize: 13 }}>
        {nodeData.label}
      </p>
      {nodeData.assignee && (
        <p style={{ color: '#94a3b8', margin: 0, marginBottom: 2, fontSize: 11 }}>
          👤 {nodeData.assignee}
        </p>
      )}
      {nodeData.dueDate && (
        <p style={{ color: '#94a3b8', margin: 0, fontSize: 11 }}>
          📅 {nodeData.dueDate}
        </p>
      )}
    </BaseNode>
  );
}

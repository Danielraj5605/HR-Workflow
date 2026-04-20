// src/components/nodes/StartNode.tsx
import { Play } from 'lucide-react';
import { type NodeProps } from '@xyflow/react';
import BaseNode from './BaseNode';
import type { StartNodeData } from '../../types/nodes';

export default function StartNode({ id, data, selected }: NodeProps) {
  const nodeData = data as unknown as StartNodeData;

  return (
    <BaseNode
      nodeId={id}
      type="start"
      selected={selected}
      showTarget={false}
      headerIcon={<Play size={13} />}
      headerLabel="Start"
    >
      <p style={{ color: '#e2e8f0', fontWeight: 600, margin: 0, marginBottom: 2, fontSize: 13 }}>
        {nodeData.label}
      </p>
      {Object.keys(nodeData.metadata ?? {}).length > 0 && (
        <p style={{ color: '#64748b', margin: 0, fontSize: 10.5 }}>
          {Object.keys(nodeData.metadata).length} metadata field{Object.keys(nodeData.metadata).length !== 1 ? 's' : ''}
        </p>
      )}
    </BaseNode>
  );
}

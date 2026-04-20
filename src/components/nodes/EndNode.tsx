// src/components/nodes/EndNode.tsx
import { Flag } from 'lucide-react';
import { type NodeProps } from '@xyflow/react';
import BaseNode from './BaseNode';
import type { EndNodeData } from '../../types/nodes';

export default function EndNode({ id, data, selected }: NodeProps) {
  const nodeData = data as unknown as EndNodeData;

  return (
    <BaseNode
      nodeId={id}
      type="end"
      selected={selected}
      showSource={false}
      headerIcon={<Flag size={13} />}
      headerLabel="End"
    >
      <p style={{ color: '#e2e8f0', fontWeight: 600, margin: 0, marginBottom: 2, fontSize: 13 }}>
        {nodeData.label}
      </p>
      {nodeData.endMessage && (
        <p style={{ color: '#94a3b8', margin: 0, fontSize: 11 }}>
          {nodeData.endMessage}
        </p>
      )}
    </BaseNode>
  );
}

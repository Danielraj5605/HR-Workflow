// src/components/nodes/AutomatedStepNode.tsx
import { Zap } from 'lucide-react';
import { type NodeProps } from '@xyflow/react';
import BaseNode from './BaseNode';
import type { AutomatedStepNodeData } from '../../types/nodes';

export default function AutomatedStepNode({ id, data, selected }: NodeProps) {
  const nodeData = data as unknown as AutomatedStepNodeData;

  return (
    <BaseNode
      nodeId={id}
      type="automatedStep"
      selected={selected}
      headerIcon={<Zap size={13} />}
      headerLabel="Automated"
    >
      <p style={{ color: '#e2e8f0', fontWeight: 600, margin: 0, marginBottom: 4, fontSize: 13 }}>
        {nodeData.label}
      </p>
      {nodeData.actionLabel ? (
        <p style={{ color: '#94a3b8', margin: 0, fontSize: 11 }}>
          ⚙️ {nodeData.actionLabel}
        </p>
      ) : (
        <p style={{ color: '#475569', margin: 0, fontSize: 11, fontStyle: 'italic' }}>
          No action selected
        </p>
      )}
    </BaseNode>
  );
}

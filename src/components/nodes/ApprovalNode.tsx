// src/components/nodes/ApprovalNode.tsx
import { ShieldCheck } from 'lucide-react';
import { type NodeProps } from '@xyflow/react';
import BaseNode from './BaseNode';
import type { ApprovalNodeData } from '../../types/nodes';

export default function ApprovalNode({ id, data, selected }: NodeProps) {
  const nodeData = data as unknown as ApprovalNodeData;

  return (
    <BaseNode
      nodeId={id}
      type="approval"
      selected={selected}
      headerIcon={<ShieldCheck size={13} />}
      headerLabel="Approval"
    >
      <p style={{ color: '#e2e8f0', fontWeight: 600, margin: 0, marginBottom: 4, fontSize: 13 }}>
        {nodeData.label}
      </p>
      {nodeData.approverRole && (
        <p style={{ color: '#94a3b8', margin: 0, marginBottom: 2, fontSize: 11 }}>
          🏷️ {nodeData.approverRole}{nodeData.approverName ? ` — ${nodeData.approverName}` : ''}
        </p>
      )}
      <p style={{ color: '#94a3b8', margin: 0, marginBottom: 2, fontSize: 11 }}>
        {nodeData.autoApproveThreshold > 0
          ? `⚡ Auto-approve after ${nodeData.autoApproveThreshold}d`
          : '⏳ Manual approval required'}
      </p>
      {nodeData.rejectionAction && nodeData.rejectionAction !== 'reject' && (
        <p style={{ color: '#94a3b8', margin: 0, fontSize: 11 }}>
          ↩️ On reject: {nodeData.rejectionAction === 'escalate' ? 'Escalate' : 'Send Back'}
        </p>
      )}
    </BaseNode>
  );
}

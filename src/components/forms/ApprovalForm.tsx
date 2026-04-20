// src/components/forms/ApprovalForm.tsx
import { useCallback } from 'react';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';
import type { ApprovalNodeData } from '../../types/nodes';

interface ApprovalFormProps {
  nodeId: string;
  data: ApprovalNodeData;
}

export default function ApprovalForm({ nodeId, data }: ApprovalFormProps) {
  const updateNodeData = useWorkflowStore(s => s.updateNodeData);

  const set = useCallback(
    (patch: Partial<ApprovalNodeData>) => updateNodeData(nodeId, patch),
    [nodeId, updateNodeData]
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div>
        <label className="form-label" htmlFor="approval-label">Label</label>
        <input
          id="approval-label"
          className="form-input"
          value={data.label}
          onChange={e => set({ label: e.target.value })}
          placeholder="Approval step name"
        />
      </div>

      <div>
        <label className="form-label" htmlFor="approval-role">Approver Role</label>
        <select
          id="approval-role"
          className="form-select"
          value={data.approverRole}
          onChange={e => set({ approverRole: e.target.value as ApprovalNodeData['approverRole'] })}
        >
          <option value="Manager">Manager</option>
          <option value="HRBP">HRBP</option>
          <option value="Director">Director</option>
        </select>
      </div>

      <div>
        <label className="form-label" htmlFor="approval-name">Approver Name <span style={{ color: '#475569', textTransform: 'none', fontWeight: 400 }}>(optional)</span></label>
        <input
          id="approval-name"
          className="form-input"
          value={data.approverName ?? ''}
          onChange={e => set({ approverName: e.target.value })}
          placeholder="e.g. Jane Smith"
        />
      </div>

      <div>
        <label className="form-label" htmlFor="approval-rejection">Rejection Logic</label>
        <select
          id="approval-rejection"
          className="form-select"
          value={data.rejectionAction ?? 'reject'}
          onChange={e => set({ rejectionAction: e.target.value as ApprovalNodeData['rejectionAction'] })}
        >
          <option value="reject">Reject — terminate the request</option>
          <option value="escalate">Escalate — send to next approver level</option>
          <option value="send_back">Send Back — return to requester for edits</option>
        </select>
      </div>

      <div>
        <label className="form-label" htmlFor="approval-timeout">
          Timeout (days)
        </label>
        <input
          id="approval-timeout"
          className="form-input"
          type="number"
          min={0}
          value={data.autoApproveThreshold}
          onChange={e => set({ autoApproveThreshold: Number(e.target.value) })}
          placeholder="0 = manual approval required"
        />
        <p style={{ color: '#64748b', fontSize: 10.5, margin: '5px 0 0' }}>
          {data.autoApproveThreshold > 0
            ? `Auto-approves after ${data.autoApproveThreshold} day(s) with no action`
            : 'Set > 0 to auto-approve after a timeout'}
        </p>
      </div>
    </div>
  );
}


// src/components/forms/EndForm.tsx
import { useCallback } from 'react';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';
import type { EndNodeData } from '../../types/nodes';

interface EndFormProps {
  nodeId: string;
  data: EndNodeData;
}

export default function EndForm({ nodeId, data }: EndFormProps) {
  const updateNodeData = useWorkflowStore(s => s.updateNodeData);

  const set = useCallback(
    (patch: Partial<EndNodeData>) => updateNodeData(nodeId, patch),
    [nodeId, updateNodeData]
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div>
        <label className="form-label">Label</label>
        <input
          className="form-input"
          value={data.label}
          onChange={e => set({ label: e.target.value })}
          placeholder="End"
        />
      </div>

      <div>
        <label className="form-label">End Message</label>
        <textarea
          className="form-textarea"
          rows={3}
          value={data.endMessage}
          onChange={e => set({ endMessage: e.target.value })}
          placeholder="e.g. Workflow completed successfully."
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div
          onClick={() => set({ showSummary: !data.showSummary })}
          style={{
            width: 36,
            height: 20,
            background: data.showSummary ? '#6366f1' : '#2e3148',
            borderRadius: 10,
            position: 'relative',
            cursor: 'pointer',
            transition: 'background 0.2s',
            flexShrink: 0,
          }}
        >
          <div style={{
            position: 'absolute',
            top: 2,
            left: data.showSummary ? 18 : 2,
            width: 16,
            height: 16,
            background: '#fff',
            borderRadius: '50%',
            transition: 'left 0.2s',
          }} />
        </div>
        <label className="form-label" style={{ margin: 0, cursor: 'pointer' }}>
          Show Summary on Completion
        </label>
      </div>
    </div>
  );
}

// src/components/forms/StartForm.tsx
import { useCallback } from 'react';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';
import type { StartNodeData } from '../../types/nodes';
import KeyValueInput from './KeyValueInput';

interface StartFormProps {
  nodeId: string;
  data: StartNodeData;
}

export default function StartForm({ nodeId, data }: StartFormProps) {
  const updateNodeData = useWorkflowStore(s => s.updateNodeData);

  const set = useCallback(
    (patch: Partial<StartNodeData>) => updateNodeData(nodeId, patch),
    [nodeId, updateNodeData]
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Label */}
      <div>
        <label className="form-label" htmlFor="start-label">Label</label>
        <input
          id="start-label"
          className="form-input"
          value={data.label}
          onChange={e => set({ label: e.target.value })}
          placeholder="Start"
        />
      </div>

      {/* Metadata */}
      <div>
        <label className="form-label">Metadata</label>
        <KeyValueInput
          value={data.metadata}
          onChange={metadata => set({ metadata })}
          keyPlaceholder="e.g. version"
          valuePlaceholder="e.g. 1.0"
        />
      </div>
    </div>
  );
}

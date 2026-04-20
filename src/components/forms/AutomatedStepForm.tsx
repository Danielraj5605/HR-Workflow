// src/components/forms/AutomatedStepForm.tsx
// Fetches /automations for action dropdown; renders dynamic param fields per selected action.
import { useCallback, useEffect, useState } from 'react';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';
import type { AutomatedStepNodeData } from '../../types/nodes';
import type { AutomationAction } from '../../types/api';

interface AutomatedStepFormProps {
  nodeId: string;
  data: AutomatedStepNodeData;
}

export default function AutomatedStepForm({ nodeId, data }: AutomatedStepFormProps) {
  const updateNodeData = useWorkflowStore(s => s.updateNodeData);
  const [actions, setActions] = useState<AutomationAction[]>([]);
  const [loading, setLoading] = useState(true);

  const set = useCallback(
    (patch: Partial<AutomatedStepNodeData>) => updateNodeData(nodeId, patch),
    [nodeId, updateNodeData]
  );

  // Fetch automations list on mount
  useEffect(() => {
    let mounted = true;
    fetch('/automations')
      .then(r => r.json())
      .then((list: AutomationAction[]) => { if (mounted) { setActions(list); setLoading(false); } })
      .catch(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const selectedAction = actions.find(a => a.id === data.actionId);

  const handleActionChange = (actionId: string) => {
    const action = actions.find(a => a.id === actionId);
    set({
      actionId,
      actionLabel: action?.label ?? '',
      params: {},  // reset params on action change
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div>
        <label className="form-label">Label</label>
        <input
          className="form-input"
          value={data.label}
          onChange={e => set({ label: e.target.value })}
          placeholder="Automated step name"
        />
      </div>

      <div>
        <label className="form-label">Action</label>
        {loading ? (
          <p style={{ color: '#64748b', fontSize: 12 }}>Loading actions…</p>
        ) : (
          <select
            className="form-select"
            value={data.actionId}
            onChange={e => handleActionChange(e.target.value)}
          >
            <option value="">Select an action…</option>
            {actions.map(a => (
              <option key={a.id} value={a.id}>{a.label}</option>
            ))}
          </select>
        )}
      </div>

      {/* Dynamic params for selected action */}
      {selectedAction && selectedAction.params.length > 0 && (
        <div>
          <label className="form-label">Parameters</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {selectedAction.params.map(param => (
              <div key={param}>
                <label style={{ fontSize: 11, color: '#64748b', marginBottom: 3, display: 'block' }}>
                  {param}
                </label>
                <input
                  className="form-input"
                  value={data.params[param] ?? ''}
                  onChange={e => set({ params: { ...data.params, [param]: e.target.value } })}
                  placeholder={`Enter ${param}…`}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Retry Logic */}
      <div style={{
        padding: '12px',
        background: 'rgba(6,182,212,0.06)',
        border: '1px solid rgba(6,182,212,0.2)',
        borderRadius: 9,
      }}>
        <label className="form-label" style={{ color: '#67e8f9', marginBottom: 8 }}>Retry Logic</label>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: 10.5, color: '#64748b', marginBottom: 3, display: 'block' }}>Max Retries</label>
            <input
              className="form-input"
              type="number"
              min={0}
              max={10}
              value={data.maxRetries ?? 0}
              onChange={e => set({ maxRetries: Number(e.target.value) })}
              placeholder="0 = no retry"
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: 10.5, color: '#64748b', marginBottom: 3, display: 'block' }}>Retry Delay (s)</label>
            <input
              className="form-input"
              type="number"
              min={0}
              value={data.retryDelaySeconds ?? 30}
              onChange={e => set({ retryDelaySeconds: Number(e.target.value) })}
              placeholder="30"
            />
          </div>
        </div>
        <p style={{ color: '#475569', fontSize: 10.5, margin: '6px 0 0' }}>
          {(data.maxRetries ?? 0) > 0
            ? `Retries up to ${data.maxRetries} time(s) every ${data.retryDelaySeconds}s on failure`
            : 'No retry — failed action stops the workflow'}
        </p>
      </div>
    </div>
  );
}

// src/components/forms/TaskForm.tsx
import { useCallback } from 'react';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';
import type { TaskNodeData } from '../../types/nodes';
import KeyValueInput from './KeyValueInput';

interface TaskFormProps {
  nodeId: string;
  data: TaskNodeData;
}

export default function TaskForm({ nodeId, data }: TaskFormProps) {
  const updateNodeData = useWorkflowStore(s => s.updateNodeData);

  const set = useCallback(
    (patch: Partial<TaskNodeData>) => updateNodeData(nodeId, patch),
    [nodeId, updateNodeData]
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div>
        <label className="form-label" htmlFor="task-label">Label</label>
        <input
          id="task-label"
          className="form-input"
          value={data.label}
          onChange={e => set({ label: e.target.value })}
          placeholder="Task name"
        />
      </div>

      <div>
        <label className="form-label" htmlFor="task-description">Description</label>
        <textarea
          id="task-description"
          className="form-textarea"
          rows={3}
          value={data.description}
          onChange={e => set({ description: e.target.value })}
          placeholder="Describe what this task involves…"
        />
      </div>

      <div>
        <label className="form-label" htmlFor="task-assignee">Assignee</label>
        <input
          id="task-assignee"
          className="form-input"
          value={data.assignee}
          onChange={e => set({ assignee: e.target.value })}
          placeholder="e.g. John Smith or HR Team"
        />
      </div>

      <div>
        <label className="form-label" htmlFor="task-due-date">Due Date</label>
        <input
          id="task-due-date"
          className="form-input"
          type="date"
          value={data.dueDate}
          onChange={e => set({ dueDate: e.target.value })}
          style={{ colorScheme: 'dark' }}
        />
      </div>

      <div>
        <label className="form-label">Custom Fields</label>
        <KeyValueInput
          value={data.customFields}
          onChange={customFields => set({ customFields })}
          keyPlaceholder="Field name"
          valuePlaceholder="Field value"
        />
      </div>
    </div>
  );
}

// src/components/nodes/BaseNode.tsx
import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { X } from 'lucide-react';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';
import type { ValidationError } from '../../types/workflow';
import { NODE_COLORS } from './nodeColors';

interface BaseNodeProps {
  nodeId: string;
  type: string;
  selected?: boolean;
  showTarget?: boolean;  // default true
  showSource?: boolean;  // default true
  headerIcon: React.ReactNode;
  headerLabel: string;
  errors?: ValidationError[];
  children: React.ReactNode;
}

export default function BaseNode({
  nodeId,
  type,
  selected,
  showTarget = true,
  showSource = true,
  headerIcon,
  headerLabel,
  errors = [],
  children,
}: BaseNodeProps) {
  const deleteNode = useWorkflowStore(s => s.deleteNode);
  const color = NODE_COLORS[type] ?? '#6366f1';

  const hasError   = errors.some(e => e.severity === 'error'   && e.nodeId === nodeId);
  const hasWarning = errors.some(e => e.severity === 'warning' && e.nodeId === nodeId);

  let ringStyle: React.CSSProperties = {};
  if (selected)         ringStyle = { boxShadow: `0 0 0 2px ${color}, 0 8px 24px rgba(0,0,0,0.5)` };
  else if (hasError)    ringStyle = { boxShadow: '0 0 0 2px #ef4444, 0 8px 24px rgba(0,0,0,0.5)' };
  else if (hasWarning)  ringStyle = { boxShadow: '0 0 0 2px #f59e0b, 0 8px 24px rgba(0,0,0,0.5)' };

  return (
    <div
      className="node-card"
      style={{
        background: '#161827',
        border: '1px solid #2e3148',
        borderRadius: 10,
        minWidth: 180,
        maxWidth: 220,
        overflow: 'hidden',
        fontFamily: 'Inter, system-ui, sans-serif',
        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        transition: 'box-shadow 0.2s ease',
        ...ringStyle,
      }}
    >
      {/* Colored header bar */}
      <div
        style={{
          background: color,
          padding: '6px 10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 6,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#fff' }}>
          {headerIcon}
          <span style={{ fontSize: 11, fontWeight: 600, color: '#fff', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            {headerLabel}
          </span>
        </div>
        {/* Delete button */}
        <button
          onClick={(e) => { e.stopPropagation(); deleteNode(nodeId); }}
          title="Delete node"
          style={{
            background: 'rgba(0,0,0,0.25)',
            border: 'none',
            borderRadius: 4,
            color: '#fff',
            cursor: 'pointer',
            padding: 2,
            display: 'flex',
            alignItems: 'center',
            opacity: 0,
            transition: 'opacity 0.15s',
          }}
          className="delete-btn"
        >
          <X size={12} />
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: '10px 12px', fontSize: 12 }}>
        {children}
      </div>

      {/* Handles */}
      {showTarget && (
        <Handle
          type="target"
          position={Position.Left}
          style={{ left: -5 }}
        />
      )}
      {showSource && (
        <Handle
          type="source"
          position={Position.Right}
          style={{ right: -5 }}
        />
      )}

      {/* Show delete button on hover via inline style trick */}
      <style>{`
        .node-card:hover .delete-btn { opacity: 1 !important; }
      `}</style>
    </div>
  );
}

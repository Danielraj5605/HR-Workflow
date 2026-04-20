// src/components/canvas/Sidebar.tsx
import type { DragEvent } from 'react';
import {
  Play, ClipboardList, ShieldCheck, Zap, Flag, GripVertical,
} from 'lucide-react';
import { onSidebarDragStart } from '../../hooks/useDragDrop';

const PALETTE_ITEMS = [
  {
    type: 'start',
    label: 'Start',
    description: 'Entry point of the workflow',
    color: '#22c55e',
    icon: Play,
  },
  {
    type: 'task',
    label: 'Task',
    description: 'Assign work to a person or team',
    color: '#6366f1',
    icon: ClipboardList,
  },
  {
    type: 'approval',
    label: 'Approval',
    description: 'Gate requiring a manager sign-off',
    color: '#f59e0b',
    icon: ShieldCheck,
  },
  {
    type: 'automatedStep',
    label: 'Automated',
    description: 'Run an automated system action',
    color: '#06b6d4',
    icon: Zap,
  },
  {
    type: 'end',
    label: 'End',
    description: 'Terminal node for the workflow',
    color: '#ef4444',
    icon: Flag,
  },
] as const;

export default function Sidebar() {
  return (
    <aside
      style={{
        width: 200,
        background: '#161827',
        borderRight: '1px solid #2e3148',
        display: 'flex',
        flexDirection: 'column',
        padding: '16px 10px',
        gap: 6,
        overflow: 'auto',
        flexShrink: 0,
      }}
    >
      <p style={{
        color: '#475569',
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        margin: '0 4px 8px',
      }}>
        Node Palette
      </p>

      {PALETTE_ITEMS.map(item => {
        const Icon = item.icon;
        return (
          <div
            key={item.type}
            draggable
            onDragStart={(e: DragEvent<HTMLDivElement>) =>
              onSidebarDragStart(e, item.type)
            }
            style={{
              background: '#1e2135',
              border: '1px solid #2e3148',
              borderRadius: 10,
              padding: '10px 12px',
              cursor: 'grab',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
              transition: 'all 0.15s ease',
              userSelect: 'none',
            }}
            className="sidebar-item"
          >
            {/* Color dot + icon */}
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: item.color + '22',
              border: `1px solid ${item.color}44`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Icon size={15} color={item.color} />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: '#e2e8f0', fontWeight: 600, fontSize: 12.5, margin: 0, marginBottom: 2 }}>
                {item.label}
              </p>
              <p style={{ color: '#64748b', fontSize: 10.5, margin: 0, lineHeight: '1.4' }}>
                {item.description}
              </p>
            </div>

            <GripVertical size={12} color="#3e4460" style={{ flexShrink: 0, marginTop: 2 }} />
          </div>
        );
      })}

      <style>{`
        .sidebar-item:hover {
          background: #252840 !important;
          border-color: #4a4f6a !important;
          transform: translateX(2px);
        }
        .sidebar-item:active {
          cursor: grabbing;
          opacity: 0.8;
        }
      `}</style>
    </aside>
  );
}

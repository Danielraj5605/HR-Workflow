// src/components/sandbox/ExecutionLog.tsx
import {
  CheckCircle2, Clock, SkipForward, AlertCircle,
} from 'lucide-react';
import type { SimulationStep, SimulationStatus } from '../../types/workflow';

const STATUS_CONFIG: Record<SimulationStatus, {
  icon: typeof CheckCircle2;
  color: string;
  bgColor: string;
  label: string;
}> = {
  completed: { icon: CheckCircle2, color: '#22c55e', bgColor: 'rgba(34,197,94,0.1)',  label: 'Completed' },
  pending:   { icon: Clock,        color: '#f59e0b', bgColor: 'rgba(245,158,11,0.1)', label: 'Pending'   },
  skipped:   { icon: SkipForward,  color: '#64748b', bgColor: 'rgba(100,116,139,0.1)',label: 'Skipped'   },
  error:     { icon: AlertCircle,  color: '#ef4444', bgColor: 'rgba(239,68,68,0.1)',  label: 'Error'     },
};

interface ExecutionLogProps {
  steps: SimulationStep[];
}

export default function ExecutionLog({ steps }: ExecutionLogProps) {
  if (steps.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {steps.map((step, i) => {
        const cfg = STATUS_CONFIG[step.status];
        const Icon = cfg.icon;
        const isLast = i === steps.length - 1;

        return (
          <div key={step.nodeId} style={{ display: 'flex', gap: 12, position: 'relative' }}>
            {/* Timeline line */}
            {!isLast && (
              <div style={{
                position: 'absolute',
                top: 28,
                left: 13,
                width: 2,
                bottom: 0,
                background: '#2e3148',
                zIndex: 0,
              }} />
            )}

            {/* Status icon dot */}
            <div style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: cfg.bgColor,
              border: `2px solid ${cfg.color}44`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              zIndex: 1,
              marginTop: 6,
            }}>
              <Icon size={13} color={cfg.color} />
            </div>

            {/* Content */}
            <div style={{ flex: 1, paddingBottom: isLast ? 0 : 14, paddingTop: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <span style={{ color: '#e2e8f0', fontSize: 12.5, fontWeight: 600 }}>
                  {step.nodeLabel}
                </span>
                <span style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: cfg.color,
                  background: cfg.bgColor,
                  padding: '2px 7px',
                  borderRadius: 20,
                  flexShrink: 0,
                }}>
                  {cfg.label}
                </span>
              </div>
              <p style={{ color: '#64748b', fontSize: 11, margin: '3px 0 0', lineHeight: '1.45' }}>
                {step.detail}
              </p>
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <span style={{ color: '#334155', fontSize: 10 }}>
                  ⏱ {step.duration}s
                </span>
                <span style={{ color: '#334155', fontSize: 10 }}>
                  {new Date(step.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// src/components/sandbox/ValidationBanner.tsx
import { AlertTriangle, XCircle, CheckCircle2 } from 'lucide-react';
import type { ValidationError } from '../../types/workflow';

interface ValidationBannerProps {
  errors: ValidationError[];
}

export default function ValidationBanner({ errors }: ValidationBannerProps) {
  if (errors.length === 0) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '10px 14px',
        background: 'rgba(34,197,94,0.08)',
        border: '1px solid rgba(34,197,94,0.25)',
        borderRadius: 10,
        marginBottom: 14,
      }}>
        <CheckCircle2 size={15} color="#22c55e" />
        <p style={{ color: '#22c55e', fontSize: 12.5, fontWeight: 500, margin: 0 }}>
          Workflow is valid — ready to simulate
        </p>
      </div>
    );
  }

  const hardErrors = errors.filter(e => e.severity === 'error');
  const warnings   = errors.filter(e => e.severity === 'warning');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
      {hardErrors.map((err, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'flex-start', gap: 8,
          padding: '9px 12px',
          background: 'rgba(239,68,68,0.08)',
          border: '1px solid rgba(239,68,68,0.25)',
          borderRadius: 9,
        }}>
          <XCircle size={14} color="#ef4444" style={{ flexShrink: 0, marginTop: 1 }} />
          <p style={{ color: '#fca5a5', fontSize: 12, margin: 0, lineHeight: '1.5' }}>
            {err.message}
          </p>
        </div>
      ))}
      {warnings.map((warn, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'flex-start', gap: 8,
          padding: '9px 12px',
          background: 'rgba(245,158,11,0.08)',
          border: '1px solid rgba(245,158,11,0.25)',
          borderRadius: 9,
        }}>
          <AlertTriangle size={14} color="#f59e0b" style={{ flexShrink: 0, marginTop: 1 }} />
          <p style={{ color: '#fcd34d', fontSize: 12, margin: 0, lineHeight: '1.5' }}>
            {warn.message}
          </p>
        </div>
      ))}
    </div>
  );
}

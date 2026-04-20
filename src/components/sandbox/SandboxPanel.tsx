// src/components/sandbox/SandboxPanel.tsx
import { Play, RotateCcw, Loader2 } from 'lucide-react';
import { useSimulate } from '../../hooks/useSimulate';
import { useValidation } from '../../hooks/useValidation';
import ValidationBanner from './ValidationBanner';
import ExecutionLog from './ExecutionLog';

export default function SandboxPanel() {
  const { result, loading, error, run, reset } = useSimulate();
  const validationErrors = useValidation();
  const hasHardErrors = validationErrors.some(e => e.severity === 'error');

  return (
    <div style={{ padding: '16px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* Validation */}
      <ValidationBanner errors={validationErrors} />

      {/* Run / Reset button */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button
          onClick={run}
          disabled={loading || hasHardErrors}
          style={{
            flex: 1,
            background: hasHardErrors ? '#1e2135' : 'linear-gradient(135deg, #6366f1, #4f46e5)',
            border: 'none',
            borderRadius: 10,
            color: hasHardErrors ? '#475569' : '#fff',
            cursor: hasHardErrors || loading ? 'not-allowed' : 'pointer',
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            fontSize: 13,
            fontWeight: 600,
            transition: 'all 0.2s',
          }}
        >
          {loading
            ? <><Loader2 size={15} className="animate-spin" /> Simulating…</>
            : <><Play size={15} /> Run Simulation</>}
        </button>

        {result && (
          <button
            onClick={reset}
            style={{
              background: '#1e2135',
              border: '1px solid #2e3148',
              borderRadius: 10,
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '10px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 12,
              transition: 'all 0.15s',
            }}
          >
            <RotateCcw size={13} /> Reset
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div style={{
          padding: '10px 14px',
          background: 'rgba(239,68,68,0.08)',
          border: '1px solid rgba(239,68,68,0.25)',
          borderRadius: 9,
          color: '#fca5a5',
          fontSize: 12,
          marginBottom: 14,
        }}>
          ❌ {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="animate-fade-in">
          {/* Summary */}
          <div style={{
            padding: '12px 14px',
            background: 'rgba(99,102,241,0.08)',
            border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: 10,
            marginBottom: 16,
          }}>
            <p style={{ color: '#a5b4fc', fontSize: 12.5, fontWeight: 600, margin: '0 0 3px' }}>
              Summary
            </p>
            <p style={{ color: '#c7d2fe', fontSize: 12, margin: 0, lineHeight: '1.5' }}>
              {result.summary}
            </p>
            <p style={{ color: '#6366f1', fontSize: 11, margin: '6px 0 0', fontWeight: 500 }}>
              Total duration: {result.totalDuration}s · {result.steps.length} steps
            </p>
          </div>

          {/* Execution log */}
          <p style={{ color: '#475569', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>
            Execution Log
          </p>
          <ExecutionLog steps={result.steps} />
        </div>
      )}
    </div>
  );
}

// src/components/ai/AIAnalysisPanel.tsx
import { useState } from 'react';
import { Sparkles, Loader2, ChevronDown, Eye, EyeOff, ExternalLink } from 'lucide-react';
import { useAIAnalysis, getEnvKey } from '../../hooks/useAIAnalysis';
import { AI_PROVIDERS } from '../../api/aiProviders';
import type { AIProvider } from '../../api/aiProviders';
import AIInsightCard from './AIInsightCard';

// ─────────────────────────────────────────
// Provider selector button
// ─────────────────────────────────────────
interface ProviderTabProps {
  logo: string;
  label: string;
  color: string;
  active: boolean;
  onClick: () => void;
}

function ProviderTab({ logo, label, color, active, onClick }: ProviderTabProps) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        background: active ? `${color}18` : 'transparent',
        border: active ? `1px solid ${color}55` : '1px solid #2e3148',
        borderRadius: 9,
        padding: '8px 6px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        transition: 'all 0.15s ease',
      }}
    >
      <span style={{ fontSize: 18, lineHeight: 1 }}>{logo}</span>
      <span style={{
        fontSize: 9.5,
        fontWeight: 600,
        color: active ? color : '#475569',
        letterSpacing: '0.03em',
        textAlign: 'center',
        lineHeight: 1.3,
      }}>
        {label}
      </span>
    </button>
  );
}

// ─────────────────────────────────────────
// Main panel
// ─────────────────────────────────────────
export default function AIAnalysisPanel() {
  const { analysis, loading, error, analyze, reset } = useAIAnalysis();

  // Provider / model / key state
  const [providerId, setProviderId] = useState<AIProvider>('anthropic');
  const [modelId, setModelId]       = useState('claude-3-haiku-20240307');
  const [runtimeKey, setRuntimeKey] = useState('');
  const [showKey, setShowKey]       = useState(false);
  const [showModelDrop, setShowModelDrop] = useState(false);

  const provider = AI_PROVIDERS.find(p => p.id === providerId)!;
  const models   = provider.models;
  const model    = models.find(m => m.id === modelId) ?? models[0];

  const envKey = getEnvKey(providerId);
  const hasKey = !!(runtimeKey.trim() || envKey);

  const handleProviderSwitch = (newId: AIProvider) => {
    const newProvider = AI_PROVIDERS.find(p => p.id === newId)!;
    setProviderId(newId);
    setModelId(newProvider.defaultModel);
    setRuntimeKey('');
    reset();
  };

  const handleAnalyze = () => {
    analyze({ provider: providerId, model: modelId, runtimeKey: runtimeKey.trim() || undefined });
  };

  return (
    <div style={{ padding: '14px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>

      {/* ── Provider selector ── */}
      <div>
        <p style={{ color: '#475569', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 8px' }}>
          AI Provider
        </p>
        <div style={{ display: 'flex', gap: 6 }}>
          {AI_PROVIDERS.map(p => (
            <ProviderTab
              key={p.id}
              logo={p.logo}
              label={p.label}
              color={p.color}
              active={p.id === providerId}
              onClick={() => handleProviderSwitch(p.id)}
            />
          ))}
        </div>
      </div>

      {/* ── Model selector ── */}
      <div style={{ position: 'relative' }}>
        <p style={{ color: '#475569', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 6px' }}>
          Model
        </p>
        <button
          onClick={() => setShowModelDrop(v => !v)}
          style={{
            width: '100%',
            background: '#1e2135',
            border: `1px solid ${provider.color}44`,
            borderRadius: 9,
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            color: '#e2e8f0',
          }}
        >
          <div style={{ textAlign: 'left' }}>
            <p style={{ margin: 0, fontSize: 12.5, fontWeight: 600, color: '#e2e8f0' }}>{model.label}</p>
            <p style={{ margin: 0, fontSize: 10.5, color: '#64748b' }}>{model.description}</p>
          </div>
          <ChevronDown
            size={14}
            color="#64748b"
            style={{ transform: showModelDrop ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}
          />
        </button>

        {showModelDrop && (
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            background: '#1e2135',
            border: `1px solid ${provider.color}44`,
            borderRadius: 9,
            overflow: 'hidden',
            zIndex: 50,
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
          }}>
            {models.map(m => (
              <button
                key={m.id}
                onClick={() => { setModelId(m.id); setShowModelDrop(false); }}
                style={{
                  width: '100%',
                  background: m.id === modelId ? `${provider.color}18` : 'transparent',
                  border: 'none',
                  padding: '9px 12px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  borderBottom: '1px solid #2e3148',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                <span style={{ fontSize: 12.5, fontWeight: 600, color: m.id === modelId ? provider.color : '#e2e8f0' }}>
                  {m.label}
                </span>
                <span style={{ fontSize: 10.5, color: '#64748b' }}>{m.description}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── API Key input ── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <p style={{ color: '#475569', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0 }}>
            API Key
          </p>
          <a
            href={provider.docsUrl}
            target="_blank"
            rel="noreferrer"
            style={{ color: provider.color, fontSize: 10.5, display: 'flex', alignItems: 'center', gap: 3, textDecoration: 'none' }}
          >
            Get key <ExternalLink size={10} />
          </a>
        </div>

        {envKey ? (
          <div style={{
            padding: '8px 12px',
            background: 'rgba(34,197,94,0.08)',
            border: '1px solid rgba(34,197,94,0.25)',
            borderRadius: 9,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <span style={{ fontSize: 14 }}>✅</span>
            <p style={{ color: '#86efac', fontSize: 11.5, margin: 0 }}>
              API key loaded from <code style={{ color: '#4ade80', fontSize: 10.5 }}>.env.local</code>
            </p>
          </div>
        ) : (
          <div style={{ position: 'relative' }}>
            <input
              className="form-input"
              type={showKey ? 'text' : 'password'}
              value={runtimeKey}
              onChange={e => setRuntimeKey(e.target.value)}
              placeholder={provider.placeholder}
              style={{ paddingRight: 36, fontFamily: 'JetBrains Mono, monospace', fontSize: 11.5 }}
            />
            <button
              onClick={() => setShowKey(v => !v)}
              style={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: '#475569',
                cursor: 'pointer',
                padding: 2,
                display: 'flex',
              }}
            >
              {showKey ? <EyeOff size={13} /> : <Eye size={13} />}
            </button>
          </div>
        )}

        {!envKey && !runtimeKey && (
          <p style={{ color: '#475569', fontSize: 10.5, margin: '5px 0 0' }}>
            Or add <code style={{ color: '#64748b' }}>{provider.envKey}</code> to <code style={{ color: '#64748b' }}>.env.local</code> to persist it.
          </p>
        )}
      </div>

      {/* ── Analyze button ── */}
      <button
        onClick={analysis ? reset : handleAnalyze}
        disabled={loading || !hasKey}
        style={{
          background: (!hasKey || loading)
            ? '#1e2135'
            : `linear-gradient(135deg, ${provider.color}, ${provider.color}bb)`,
          border: 'none',
          borderRadius: 10,
          color: (!hasKey || loading) ? '#475569' : '#fff',
          cursor: (!hasKey || loading) ? 'not-allowed' : 'pointer',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          fontSize: 13,
          fontWeight: 600,
          width: '100%',
          transition: 'all 0.2s',
          boxShadow: hasKey && !loading ? `0 4px 14px ${provider.color}44` : 'none',
        }}
      >
        {loading
          ? <><Loader2 size={15} className="animate-spin" /> Analyzing…</>
          : analysis
            ? '↺ Re-analyze'
            : <><Sparkles size={15} /> Analyze with {provider.label}</>}
      </button>

      {/* ── Error ── */}
      {error && (
        <div style={{
          padding: '10px 14px',
          background: 'rgba(239,68,68,0.08)',
          border: '1px solid rgba(239,68,68,0.25)',
          borderRadius: 9,
          color: '#fca5a5',
          fontSize: 12,
        }}>
          ❌ {error}
        </div>
      )}

      {/* ── Results ── */}
      {analysis && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Provider badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 12 }}>{provider.logo}</span>
            <span style={{ fontSize: 10.5, color: provider.color, fontWeight: 600 }}>
              {provider.label} · {model.label}
            </span>
          </div>

          <AIInsightCard type="summary" text={analysis.summary} />

          {analysis.issues.length > 0 && (
            <>
              <p style={{ color: '#475569', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '4px 0 0' }}>
                Issues ({analysis.issues.length})
              </p>
              {analysis.issues.map((issue, i) => (
                <AIInsightCard key={i} type="issue" text={issue} index={i} />
              ))}
            </>
          )}

          {analysis.suggestions.length > 0 && (
            <>
              <p style={{ color: '#475569', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '4px 0 0' }}>
                Suggestions ({analysis.suggestions.length})
              </p>
              {analysis.suggestions.map((sug, i) => (
                <AIInsightCard key={i} type="suggestion" text={sug} index={i} />
              ))}
            </>
          )}
        </div>
      )}

      {/* ── Intro / empty state ── */}
      {!analysis && !loading && !error && (
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', gap: 10, textAlign: 'center', padding: '10px 0',
        }}>
          <div style={{ fontSize: 32 }}>{provider.logo}</div>
          <p style={{ color: '#475569', fontSize: 12.5, fontWeight: 500, margin: 0 }}>
            Analyze with {provider.label}
          </p>
          <p style={{ color: '#334155', fontSize: 11, margin: 0, maxWidth: 210, lineHeight: 1.55 }}>
            {hasKey
              ? 'Click the button above to get issues, suggestions, and a summary for your workflow.'
              : 'Enter your API key above to get started.'}
          </p>
        </div>
      )}
    </div>
  );
}

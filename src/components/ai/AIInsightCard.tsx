// src/components/ai/AIInsightCard.tsx
interface AIInsightCardProps {
  type: 'issue' | 'suggestion' | 'summary';
  text: string;
  index?: number;
}

const CARD_CONFIG = {
  issue:      { color: '#ef4444', bg: 'rgba(239,68,68,0.07)',      border: 'rgba(239,68,68,0.25)',      emoji: '⚠️' },
  suggestion: { color: '#22c55e', bg: 'rgba(34,197,94,0.07)',      border: 'rgba(34,197,94,0.25)',      emoji: '💡' },
  summary:    { color: '#6366f1', bg: 'rgba(99,102,241,0.07)',     border: 'rgba(99,102,241,0.25)',     emoji: '📋' },
};

export default function AIInsightCard({ type, text, index }: AIInsightCardProps) {
  const cfg = CARD_CONFIG[type];

  return (
    <div style={{
      padding: '10px 12px',
      background: cfg.bg,
      border: `1px solid ${cfg.border}`,
      borderLeft: `3px solid ${cfg.color}`,
      borderRadius: '0 9px 9px 0',
      display: 'flex',
      gap: 10,
      alignItems: 'flex-start',
    }}>
      <span style={{ fontSize: 14, flexShrink: 0, lineHeight: '1.5' }}>{cfg.emoji}</span>
      <div>
        {index !== undefined && (
          <span style={{ fontSize: 9.5, fontWeight: 700, color: cfg.color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {type} #{index + 1}
          </span>
        )}
        <p style={{ color: '#cbd5e1', fontSize: 12, margin: '2px 0 0', lineHeight: '1.55' }}>
          {text}
        </p>
      </div>
    </div>
  );
}

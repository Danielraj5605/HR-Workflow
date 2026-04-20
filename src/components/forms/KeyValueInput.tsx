// src/components/forms/KeyValueInput.tsx
// Reusable key-value pair editor (add / edit / remove rows)
import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface KeyValueInputProps {
  value: Record<string, string>;
  onChange: (updated: Record<string, string>) => void;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
}

export default function KeyValueInput({
  value,
  onChange,
  keyPlaceholder = 'Key',
  valuePlaceholder = 'Value',
}: KeyValueInputProps) {
  // Convert record → array for editing
  const pairs = Object.entries(value);
  const [newKey, setNewKey] = useState('');
  const [newVal, setNewVal] = useState('');

  const updatePair = (index: number, k: string, v: string) => {
    const next = [...pairs];
    next[index] = [k, v];
    onChange(Object.fromEntries(next));
  };

  const removePair = (index: number) => {
    const next = pairs.filter((_, i) => i !== index);
    onChange(Object.fromEntries(next));
  };

  const addPair = () => {
    if (!newKey.trim()) return;
    onChange({ ...value, [newKey.trim()]: newVal });
    setNewKey('');
    setNewVal('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {pairs.map(([k, v], i) => (
        <div key={i} style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <input
            className="form-input"
            style={{ flex: 1, fontSize: 11.5 }}
            value={k}
            placeholder={keyPlaceholder}
            onChange={e => updatePair(i, e.target.value, v)}
          />
          <input
            className="form-input"
            style={{ flex: 1, fontSize: 11.5 }}
            value={v}
            placeholder={valuePlaceholder}
            onChange={e => updatePair(i, k, e.target.value)}
          />
          <button
            onClick={() => removePair(i)}
            style={{
              background: 'none',
              border: 'none',
              color: '#ef4444',
              cursor: 'pointer',
              padding: 4,
              flexShrink: 0,
            }}
          >
            <Trash2 size={13} />
          </button>
        </div>
      ))}

      {/* Add new row */}
      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        <input
          className="form-input"
          style={{ flex: 1, fontSize: 11.5 }}
          value={newKey}
          placeholder={keyPlaceholder}
          onChange={e => setNewKey(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addPair()}
        />
        <input
          className="form-input"
          style={{ flex: 1, fontSize: 11.5 }}
          value={newVal}
          placeholder={valuePlaceholder}
          onChange={e => setNewVal(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addPair()}
        />
        <button
          onClick={addPair}
          style={{
            background: 'rgba(99,102,241,0.2)',
            border: '1px solid rgba(99,102,241,0.4)',
            borderRadius: 6,
            color: '#818cf8',
            cursor: 'pointer',
            padding: 4,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Plus size={13} />
        </button>
      </div>
    </div>
  );
}

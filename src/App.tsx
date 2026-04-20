// src/App.tsx
import { useState } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import {
  Settings2, Play, Sparkles, Cpu, Workflow,
} from 'lucide-react';

import Sidebar from './components/canvas/Sidebar';
import WorkflowCanvas from './components/canvas/WorkflowCanvas';
import NodeFormPanel from './components/forms/NodeFormPanel';
import SandboxPanel from './components/sandbox/SandboxPanel';
import AIAnalysisPanel from './components/ai/AIAnalysisPanel';
import { useValidation } from './hooks/useValidation';

// ─────────────────────────────────────────
// Tab definition
// ─────────────────────────────────────────
type Tab = 'config' | 'simulate' | 'ai';

const TABS: { id: Tab; label: string; icon: typeof Settings2 }[] = [
  { id: 'config',   label: 'Config',   icon: Settings2 },
  { id: 'simulate', label: 'Simulate', icon: Play },
  { id: 'ai',       label: 'AI',       icon: Sparkles },
];

// ─────────────────────────────────────────
// Header
// ─────────────────────────────────────────
function Header() {
  return (
    <header style={{
      height: 52,
      background: '#161827',
      borderBottom: '1px solid #2e3148',
      display: 'flex',
      alignItems: 'center',
      padding: '0 20px',
      gap: 14,
      flexShrink: 0,
      zIndex: 20,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
        <div style={{
          width: 30,
          height: 30,
          borderRadius: 8,
          background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 0 1px rgba(99,102,241,0.4)',
        }}>
          <Workflow size={16} color="#fff" />
        </div>
        <div>
          <p style={{ color: '#e2e8f0', fontWeight: 700, fontSize: 14.5, margin: 0, lineHeight: 1 }}>
            FlowForge HR
          </p>
          <p style={{ color: '#475569', fontSize: 10, margin: 0, lineHeight: 1.4 }}>
            Tredence Case Study
          </p>
        </div>
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* AI-Powered badge */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 12px',
        background: 'rgba(99,102,241,0.1)',
        border: '1px solid rgba(99,102,241,0.25)',
        borderRadius: 20,
      }}>
        <Cpu size={13} color="#818cf8" />
        <span style={{ color: '#818cf8', fontSize: 11.5, fontWeight: 600 }}>
          AI-Powered
        </span>
      </div>
    </header>
  );
}

// ─────────────────────────────────────────
// Right Panel
// ─────────────────────────────────────────
function RightPanel() {
  const [activeTab, setActiveTab] = useState<Tab>('config');
  const errors = useValidation();
  const errorCount = errors.filter(e => e.severity === 'error').length;
  const warnCount  = errors.filter(e => e.severity === 'warning').length;

  return (
    <div style={{
      width: 300,
      background: '#161827',
      borderLeft: '1px solid #2e3148',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
    }}>
      {/* Tab bar */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid #2e3148',
        flexShrink: 0,
        overflowX: 'auto',
      }}>
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-btn ${isActive ? 'active' : ''}`}
              style={{ flex: 1, justifyContent: 'center', padding: '10px 6px', fontSize: 12 }}
            >
              <Icon size={13} />
              {tab.label}
              {tab.id === 'simulate' && (errorCount + warnCount) > 0 && (
                <span style={{
                  marginLeft: 2,
                  background: errorCount > 0 ? '#ef4444' : '#f59e0b',
                  color: '#fff',
                  borderRadius: 10,
                  padding: '1px 5px',
                  fontSize: 9,
                  fontWeight: 700,
                  lineHeight: 1.6,
                }}>
                  {errorCount + warnCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {activeTab === 'config'   && <NodeFormPanel />}
        {activeTab === 'simulate' && <SandboxPanel />}
        {activeTab === 'ai'       && <AIAnalysisPanel />}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// App Root
// ─────────────────────────────────────────
export default function App() {
  return (
    <ReactFlowProvider>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        <Header />

        {/* Main three-column layout */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <Sidebar />
          <WorkflowCanvas />
          <RightPanel />
        </div>
      </div>
    </ReactFlowProvider>
  );
}

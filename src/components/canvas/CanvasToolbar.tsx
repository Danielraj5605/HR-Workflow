// src/components/canvas/CanvasToolbar.tsx
import { useCallback, useRef } from 'react';
import { useReactFlow } from '@xyflow/react';
import {
  ZoomIn, ZoomOut, Maximize2, Download, Upload, Trash2, FlaskConical,
} from 'lucide-react';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';
import { serializeGraph } from '../../utils/graphSerializer';
import type { WorkflowGraph } from '../../types/workflow';

interface CanvasToolbarProps {
  onClear: () => void;
}

export default function CanvasToolbar({ onClear }: CanvasToolbarProps) {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const nodes         = useWorkflowStore(s => s.nodes);
  const edges         = useWorkflowStore(s => s.edges);
  const importWorkflow = useWorkflowStore(s => s.importWorkflow);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = useCallback(() => {
    const graph = serializeGraph(nodes, edges);
    const json = JSON.stringify(graph, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'workflow.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [nodes, edges]);

  const handleImport = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const graph = JSON.parse(evt.target?.result as string) as WorkflowGraph;
        if (Array.isArray(graph.nodes) && Array.isArray(graph.edges)) {
          importWorkflow(graph.nodes, graph.edges);
          setTimeout(() => fitView({ padding: 0.15 }), 100);
        }
      } catch {
        alert('Invalid workflow JSON file.');
      }
    };
    reader.readAsText(file);
    // Reset so same file can be re-imported
    e.target.value = '';
  }, [importWorkflow, fitView]);

  const handleLoadSample = useCallback(async () => {
    try {
      const res  = await fetch('/sample-workflow.json');
      const graph = await res.json() as WorkflowGraph;
      if (Array.isArray(graph.nodes) && Array.isArray(graph.edges)) {
        importWorkflow(graph.nodes, graph.edges);
        setTimeout(() => fitView({ padding: 0.15 }), 100);
      }
    } catch {
      alert('Failed to load sample workflow.');
    }
  }, [importWorkflow, fitView]);

  return (
    <div
      style={{
        position: 'absolute',
        top: 14,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10,
        background: '#161827',
        border: '1px solid #2e3148',
        borderRadius: 12,
        padding: '6px 10px',
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
      }}
    >
      <ToolBtn onClick={() => zoomIn()} title="Zoom In" icon={<ZoomIn size={15} />} />
      <ToolBtn onClick={() => zoomOut()} title="Zoom Out" icon={<ZoomOut size={15} />} />
      <ToolBtn onClick={() => fitView({ padding: 0.15 })} title="Fit View" icon={<Maximize2 size={15} />} />

      <Divider />

      <ToolBtn onClick={handleExport}  title="Export JSON"       icon={<Download size={15} />} />
      <ToolBtn onClick={() => fileInputRef.current?.click()} title="Import JSON" icon={<Upload size={15} />} />
      <ToolBtn onClick={handleLoadSample} title="Load Sample Workflow" icon={<FlaskConical size={15} />} accent />
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        style={{ display: 'none' }}
        onChange={handleImport}
      />

      <Divider />

      <ToolBtn onClick={onClear} title="Clear Canvas" icon={<Trash2 size={15} />} danger />
    </div>
  );
}

function ToolBtn({
  onClick, title, icon, danger = false, accent = false,
}: {
  onClick: () => void;
  title: string;
  icon: React.ReactNode;
  danger?: boolean;
  accent?: boolean;
}) {
  const baseColor  = danger ? '#ef4444' : accent ? '#6366f1' : '#94a3b8';
  const hoverColor = danger ? '#f87171' : accent ? '#818cf8' : '#e2e8f0';
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        background: 'transparent',
        border: 'none',
        borderRadius: 7,
        color: baseColor,
        cursor: 'pointer',
        padding: '5px 7px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.15s ease',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLButtonElement).style.background = '#252840';
        (e.currentTarget as HTMLButtonElement).style.color = hoverColor;
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
        (e.currentTarget as HTMLButtonElement).style.color = baseColor;
      }}
    >
      {icon}
    </button>
  );
}

function Divider() {
  return (
    <div style={{ width: 1, height: 20, background: '#2e3148', margin: '0 2px' }} />
  );
}

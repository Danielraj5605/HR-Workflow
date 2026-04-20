// src/components/canvas/WorkflowCanvas.tsx
import { useCallback } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  type Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { nodeTypes } from '../nodes/nodeRegistry';
import { NODE_COLORS } from '../nodes/nodeColors';
import { useDragDrop } from '../../hooks/useDragDrop';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';
import CanvasToolbar from './CanvasToolbar';
import type { WorkflowNodeData } from '../../types/nodes';

// ── Empty state ───────────────────────────────────────────
function EmptyState() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        pointerEvents: 'none',
        zIndex: 1,
      }}
    >
      <div style={{
        width: 72,
        height: 72,
        borderRadius: '50%',
        background: 'rgba(99,102,241,0.08)',
        border: '2px dashed rgba(99,102,241,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 28,
      }}>
        ⬡
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: '#475569', fontWeight: 600, fontSize: 14, margin: 0 }}>
          Drop nodes here to build your workflow
        </p>
        <p style={{ color: '#334155', fontSize: 12, margin: '4px 0 0' }}>
          Drag from the Node Palette on the left
        </p>
      </div>
    </div>
  );
}
// Module-level constants — stable across renders (avoids React Flow nodeTypes warning)
const STABLE_NODE_TYPES = nodeTypes;
const DEFAULT_EDGE_OPTIONS = {
  animated: true,
  style: { stroke: '#6366f1', strokeWidth: 2 },
};

// ── WorkflowCanvas ────────────────────────────────────────
export default function WorkflowCanvas() {
  const nodes         = useWorkflowStore(s => s.nodes);
  const edges         = useWorkflowStore(s => s.edges);
  const onNodesChange = useWorkflowStore(s => s.onNodesChange);
  const onEdgesChange = useWorkflowStore(s => s.onEdgesChange);
  const onConnect     = useWorkflowStore(s => s.onConnect);
  const setSelectedNode = useWorkflowStore(s => s.setSelectedNode);
  const clearWorkflow   = useWorkflowStore(s => s.clearWorkflow);

  const { onDragOver, onDrop } = useDragDrop();

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node.id);
  }, [setSelectedNode]);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, [setSelectedNode]);

  const miniMapNodeColor = useCallback(
    (node: Node) => NODE_COLORS[(node.type as string) ?? ''] ?? '#6366f1',
    []
  );

  return (
    <div style={{ position: 'relative', flex: 1, height: '100%' }}>
      <ReactFlow
        nodes={nodes as Node<WorkflowNodeData>[]}
        edges={edges}
        nodeTypes={STABLE_NODE_TYPES}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onDragOver={onDragOver}
        onDrop={onDrop}
        deleteKeyCode="Delete"
        fitView
        defaultEdgeOptions={DEFAULT_EDGE_OPTIONS}
        style={{ background: '#0d0f1a' }}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          color="#2e3148"
          gap={20}
          size={1.2}
        />
        <Controls position="bottom-left" />
        <MiniMap
          position="bottom-right"
          nodeColor={miniMapNodeColor}
          maskColor="#0f111799"
        />
        <CanvasToolbar onClear={clearWorkflow} />
      </ReactFlow>

      {nodes.length === 0 && <EmptyState />}
    </div>
  );
}

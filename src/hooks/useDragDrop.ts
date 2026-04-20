// src/hooks/useDragDrop.ts
import { useCallback } from 'react';
import type { DragEvent } from 'react';
import { useReactFlow } from '@xyflow/react';
import { useWorkflowStore } from './useWorkflowStore';
import type { NodeType } from '../types/nodes';

const DRAG_TYPE = 'application/reactflow';

export function useDragDrop() {
  const { screenToFlowPosition } = useReactFlow();
  const addNode = useWorkflowStore(s => s.addNode);

  const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const type = event.dataTransfer.getData(DRAG_TYPE) as NodeType;
      if (!type) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      addNode(type, position);
    },
    [screenToFlowPosition, addNode]
  );

  return { onDragOver, onDrop };
}

/** Helper used by sidebar items */
export function onSidebarDragStart(event: DragEvent<HTMLDivElement>, nodeType: string) {
  event.dataTransfer.setData('application/reactflow', nodeType);
  event.dataTransfer.effectAllowed = 'move';
}

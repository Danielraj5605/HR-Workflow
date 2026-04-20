import { renderHook } from '@testing-library/react';
import { useValidation } from '../useValidation';
import { useWorkflowStore } from '../useWorkflowStore';

describe('useValidation hook', () => {
  beforeEach(() => {
    useWorkflowStore.getState().clearWorkflow();
  });

  it('should return start_count error when no start node exists', () => {
    const { addNode } = useWorkflowStore.getState();
    addNode('task', { x: 0, y: 0 });
    addNode('end', { x: 100, y: 100 });

    const { result } = renderHook(() => useValidation());
    const errors = result.current;
    expect(errors.some(e => e.type === 'start_count')).toBe(true);
  });

  it('should return end_count error when no end node exists', () => {
    const { addNode } = useWorkflowStore.getState();
    addNode('start', { x: 0, y: 0 });
    addNode('task', { x: 100, y: 100 });

    const { result } = renderHook(() => useValidation());
    const errors = result.current;
    expect(errors.some(e => e.type === 'end_count')).toBe(true);
  });

  it('should return no errors for valid linear workflow', () => {
    const { addNode } = useWorkflowStore.getState();
    addNode('start', { x: 0, y: 0 });
    addNode('task', { x: 100, y: 100 });
    addNode('end', { x: 200, y: 200 });

    const { nodes } = useWorkflowStore.getState();
    // Connect them manually via store
    const store = useWorkflowStore.getState();
    store.onConnect({ source: nodes[0].id, target: nodes[1].id, sourceHandle: null, targetHandle: null });
    store.onConnect({ source: nodes[1].id, target: nodes[2].id, sourceHandle: null, targetHandle: null });

    const { result } = renderHook(() => useValidation());
    const errorTypes = result.current.map(e => e.type);
    expect(errorTypes).not.toContain('start_count');
    expect(errorTypes).not.toContain('end_count');
  });
});

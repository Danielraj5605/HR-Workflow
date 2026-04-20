import { renderHook, act } from '@testing-library/react';
import { useSimulate } from '../useSimulate';
import { useWorkflowStore } from '../useWorkflowStore';

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('useSimulate hook', () => {
  beforeEach(() => {
    useWorkflowStore.getState().clearWorkflow();
    mockFetch.mockReset();
  });

  describe('HK-13: isLoading is false initially', () => {
    it('should start with loading=false', () => {
      const { result } = renderHook(() => useSimulate());
      expect(result.current.loading).toBe(false);
    });
  });

  describe('HK-14: isLoading is true during API call', () => {
    it('should set loading=true when run is called', async () => {
      const { addNode } = useWorkflowStore.getState();
      addNode('start', { x: 0, y: 0 });
      addNode('end', { x: 100, y: 100 });
      const { nodes } = useWorkflowStore.getState();
      const store = useWorkflowStore.getState();
      store.onConnect({ source: nodes[0].id, target: nodes[1].id, sourceHandle: null, targetHandle: null });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ steps: [], summary: 'Test', totalDuration: 0 }),
      });

      const { result } = renderHook(() => useSimulate());

      await act(async () => {
        result.current.run();
      });

      // After completion, loading should be false
      expect(result.current.loading).toBe(false);
    });
  });

  describe('HK-15: simulationResult populated after success', () => {
    it('should have result after successful simulation', async () => {
      const { addNode } = useWorkflowStore.getState();
      addNode('start', { x: 0, y: 0 });
      addNode('end', { x: 100, y: 100 });
      const { nodes } = useWorkflowStore.getState();
      const store = useWorkflowStore.getState();
      store.onConnect({ source: nodes[0].id, target: nodes[1].id, sourceHandle: null, targetHandle: null });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          steps: [{ nodeId: 'n1', nodeLabel: 'Start', nodeType: 'start', status: 'completed', duration: 0, detail: 'Test', timestamp: new Date().toISOString() }],
          summary: 'Test workflow',
          totalDuration: 0,
        }),
      });

      const { result } = renderHook(() => useSimulate());

      await act(async () => {
        await result.current.run();
      });

      expect(result.current.result).not.toBeNull();
      expect(result.current.result).toHaveProperty('steps');
      expect(result.current.result).toHaveProperty('summary');
    });
  });
});

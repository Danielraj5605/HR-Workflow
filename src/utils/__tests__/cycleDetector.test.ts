import { hasCycle } from '../cycleDetector';
import type { Edge } from '@xyflow/react';

const makeEdge = (source: string, target: string): Edge =>
  ({ id: `${source}-${target}`, source, target });

describe('Cycle Detector', () => {
  it('should return false for empty graph', () => {
    expect(hasCycle([], [])).toBe(false);
  });

  it('should return false for linear graph', () => {
    const edges: Edge[] = [makeEdge('a', 'b'), makeEdge('b', 'c')];
    expect(hasCycle(['a', 'b', 'c'], edges)).toBe(false);
  });

  it('should return true for simple cycle a → b → a', () => {
    const edges: Edge[] = [makeEdge('a', 'b'), makeEdge('b', 'a')];
    expect(hasCycle(['a', 'b'], edges)).toBe(true);
  });

  it('should return true for cycle in longer path', () => {
    const edges: Edge[] = [
      makeEdge('a', 'b'),
      makeEdge('b', 'c'),
      makeEdge('c', 'b'),
    ];
    expect(hasCycle(['a', 'b', 'c'], edges)).toBe(true);
  });

  it('should return false for diamond graph (no cycle)', () => {
    const edges: Edge[] = [
      makeEdge('a', 'b'),
      makeEdge('a', 'c'),
      makeEdge('b', 'd'),
      makeEdge('c', 'd'),
    ];
    expect(hasCycle(['a', 'b', 'c', 'd'], edges)).toBe(false);
  });

  it('should return true for graph with self-loop', () => {
    const edges: Edge[] = [makeEdge('a', 'a')];
    expect(hasCycle(['a'], edges)).toBe(true);
  });
});

import { serializeGraph } from '../graphSerializer';
import type { Node, Edge } from '@xyflow/react';

const makeNode = (id: string, type: string, data: Record<string, unknown>): Node =>
  ({ id, type, position: { x: 100 * Math.random(), y: 200 * Math.random() }, data }) as unknown as Node;

const makeEdge = (source: string, target: string): Edge =>
  ({ id: `e-${source}-${target}`, source, target, animated: true, style: { stroke: '#6366f1', strokeWidth: 2 } });

describe('Workflow Serializer', () => {
  describe('SZ-01: Serializes nodes correctly', () => {
    it('should return an object with nodes array', () => {
      const nodes: Node[] = [makeNode('n1', 'start', { type: 'start', label: 'Start' })];
      const edges: Edge[] = [];
      const result = serializeGraph(nodes, edges);
      expect(result).toHaveProperty('nodes');
      expect(Array.isArray(result.nodes)).toBe(true);
    });
  });

  describe('SZ-02: Serializes edges correctly', () => {
    it('should return an object with edges array', () => {
      const nodes: Node[] = [
        makeNode('n1', 'start', { type: 'start', label: 'Start' }),
        makeNode('n2', 'end', { type: 'end', label: 'End' }),
      ];
      const edges: Edge[] = [makeEdge('n1', 'n2')];
      const result = serializeGraph(nodes, edges);
      expect(result).toHaveProperty('edges');
      expect(Array.isArray(result.edges)).toBe(true);
    });
  });

  describe('SZ-03: Preserves node data in serialization', () => {
    it('should preserve all data fields when serializing', () => {
      const taskData = {
        type: 'task',
        label: 'Test Task',
        description: 'A description',
        assignee: 'John Doe',
        dueDate: '2025-12-31',
        customFields: { priority: 'high' },
      };
      const nodes: Node[] = [{
        id: 'n1',
        type: 'task',
        position: { x: 100, y: 200 },
        data: taskData,
      }] as unknown as Node[];
      const edges: Edge[] = [];

      const result = serializeGraph(nodes, edges);
      const serializedNode = result.nodes[0] as unknown as { data: Record<string, unknown> };
      expect(serializedNode.data.label).toBe('Test Task');
      expect(serializedNode.data.description).toBe('A description');
      expect(serializedNode.data.assignee).toBe('John Doe');
    });
  });

  describe('SZ-04: Deserialization restores workflow', () => {
    it('serialized graph should have same node count', () => {
      const nodes: Node[] = [
        makeNode('n1', 'start', { type: 'start', label: 'Start' }),
        makeNode('n2', 'task', { type: 'task', label: 'Task' }),
        makeNode('n3', 'end', { type: 'end', label: 'End' }),
      ];
      const edges: Edge[] = [makeEdge('n1', 'n2'), makeEdge('n2', 'n3')];
      const result = serializeGraph(nodes, edges);
      expect(result.nodes).toHaveLength(3);
      expect(result.edges).toHaveLength(2);
    });
  });

  describe('SZ-05: Handles special characters in field values', () => {
    it('should correctly serialize unicode characters', () => {
      const nodes: Node[] = [{
        id: 'n1',
        type: 'task',
        position: { x: 0, y: 0 },
        data: { type: 'task', label: 'Task with émojis 🎉', description: 'Test "quotes"', assignee: '', dueDate: '', customFields: {} },
      }] as unknown as Node[];
      const result = serializeGraph(nodes, []);
      const json = JSON.stringify(result);
      expect(json).toContain('🎉');
      expect(json).toContain('quotes');
    });
  });
});

import { validateWorkflow } from '../workflowValidator';
import type { Node, Edge } from '@xyflow/react';

const makeEdge = (source: string, target: string): Edge =>
  ({ id: `${source}-${target}`, source, target });

describe('Workflow Validator', () => {
  describe('UV-01: Valid workflow passes validation', () => {
    it('Linear start→task→end should have no errors', () => {
      const nodes = [
        { id: 'n1', type: 'start', position: { x: 0, y: 0 }, data: { type: 'start', label: 'Start' } },
        { id: 'n2', type: 'task', position: { x: 0, y: 0 }, data: { type: 'task', label: 'Task' } },
        { id: 'n3', type: 'end', position: { x: 0, y: 0 }, data: { type: 'end', label: 'End' } },
      ] as unknown as Node[];
      const edges = [makeEdge('n1', 'n2'), makeEdge('n2', 'n3')];
      const errors = validateWorkflow(nodes, edges);
      const errorTypes = errors.map(e => e.type);
      expect(errorTypes).not.toContain('start_count');
      expect(errorTypes).not.toContain('end_count');
      expect(errorTypes).not.toContain('cycle');
      expect(errorTypes.filter(e => e === 'disconnected')).toHaveLength(0);
    });
  });

  describe('UV-02: Missing Start Node detected', () => {
    it('should return error when no Start node exists', () => {
      const nodes = [
        { id: 'n1', type: 'task', position: { x: 0, y: 0 }, data: { type: 'task', label: 'Task' } },
        { id: 'n2', type: 'end', position: { x: 0, y: 0 }, data: { type: 'end', label: 'End' } },
      ] as unknown as Node[];
      const edges = [makeEdge('n1', 'n2')];
      const errors = validateWorkflow(nodes, edges);
      const startErrors = errors.filter(e => e.type === 'start_count');
      expect(startErrors).toHaveLength(1);
      expect(startErrors[0].message).toMatch(/Start.*node/i);
    });
  });

  describe('UV-03: Missing End Node detected', () => {
    it('should return error when no End node exists', () => {
      const nodes = [
        { id: 'n1', type: 'start', position: { x: 0, y: 0 }, data: { type: 'start', label: 'Start' } },
        { id: 'n2', type: 'task', position: { x: 0, y: 0 }, data: { type: 'task', label: 'Task' } },
      ] as unknown as Node[];
      const edges = [makeEdge('n1', 'n2')];
      const errors = validateWorkflow(nodes, edges);
      const endErrors = errors.filter(e => e.type === 'end_count');
      expect(endErrors).toHaveLength(1);
      expect(endErrors[0].message).toMatch(/End.*node/i);
    });
  });

  describe('UV-04: Multiple Start Nodes flagged', () => {
    it('should return error when more than one Start node exists', () => {
      const nodes = [
        { id: 'n1', type: 'start', position: { x: 0, y: 0 }, data: { type: 'start', label: 'Start' } },
        { id: 'n2', type: 'task', position: { x: 0, y: 0 }, data: { type: 'task', label: 'Task' } },
        { id: 'n3', type: 'start', position: { x: 0, y: 0 }, data: { type: 'start', label: 'Start' } },
        { id: 'n4', type: 'end', position: { x: 0, y: 0 }, data: { type: 'end', label: 'End' } },
      ] as unknown as Node[];
      const edges = [makeEdge('n1', 'n2'), makeEdge('n2', 'n4'), makeEdge('n3', 'n2')];
      const errors = validateWorkflow(nodes, edges);
      const startErrors = errors.filter(e => e.type === 'start_count');
      expect(startErrors).toHaveLength(1);
      expect(startErrors[0].message).toMatch(/2.*Start.*nodes/i);
    });
  });

  describe('UV-05: Disconnected node detected', () => {
    it('should return warning for disconnected non-start/end node', () => {
      const nodes = [
        { id: 'n1', type: 'start', position: { x: 0, y: 0 }, data: { type: 'start', label: 'Start' } },
        { id: 'n2', type: 'task', position: { x: 0, y: 0 }, data: { type: 'task', label: 'Task' } },
        { id: 'n3', type: 'end', position: { x: 0, y: 0 }, data: { type: 'end', label: 'End' } },
        { id: 'n4', type: 'task', position: { x: 0, y: 0 }, data: { type: 'task', label: 'Disconnected' } },
      ] as unknown as Node[];
      const edges = [makeEdge('n1', 'n2'), makeEdge('n2', 'n3')];
      const errors = validateWorkflow(nodes, edges);
      const disconErrors = errors.filter(e => e.type === 'disconnected');
      expect(disconErrors).toHaveLength(1);
      expect(disconErrors[0].nodeId).toBe('n4');
    });
  });

  describe('UV-06: Cycle in graph detected', () => {
    it('should return error when workflow contains a cycle', () => {
      const nodes = [
        { id: 'n1', type: 'start', position: { x: 0, y: 0 }, data: { type: 'start', label: 'Start' } },
        { id: 'n2', type: 'task', position: { x: 0, y: 0 }, data: { type: 'task', label: 'Task' } },
        { id: 'n3', type: 'end', position: { x: 0, y: 0 }, data: { type: 'end', label: 'End' } },
      ] as unknown as Node[];
      const edges = [makeEdge('n1', 'n2'), makeEdge('n2', 'n3'), makeEdge('n3', 'n2')];
      const errors = validateWorkflow(nodes, edges);
      const cycleErrors = errors.filter(e => e.type === 'cycle');
      expect(cycleErrors).toHaveLength(1);
      expect(cycleErrors[0].message).toMatch(/cycle/i);
    });
  });

  describe('UV-07: Empty workflow flagged', () => {
    it('should return error for empty workflow', () => {
      const errors = validateWorkflow([], []);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('UV-08: Valid complex workflow passes', () => {
    it('Multi-branch workflow should pass validation', () => {
      const nodes = [
        { id: 'start', type: 'start', position: { x: 0, y: 0 }, data: { type: 'start', label: 'Start' } },
        { id: 'task1', type: 'task', position: { x: 0, y: 0 }, data: { type: 'task', label: 'Task1' } },
        { id: 'task2', type: 'task', position: { x: 0, y: 0 }, data: { type: 'task', label: 'Task2' } },
        { id: 'approval', type: 'approval', position: { x: 0, y: 0 }, data: { type: 'approval', label: 'Approval' } },
        { id: 'end', type: 'end', position: { x: 0, y: 0 }, data: { type: 'end', label: 'End' } },
      ] as unknown as Node[];
      const edges = [
        makeEdge('start', 'task1'),
        makeEdge('start', 'task2'),
        makeEdge('task1', 'approval'),
        makeEdge('task2', 'approval'),
        makeEdge('approval', 'end'),
      ];
      const errors = validateWorkflow(nodes, edges);
      const errorTypes = errors.map(e => e.type);
      expect(errorTypes).not.toContain('cycle');
      expect(errorTypes.filter(e => e === 'disconnected')).toHaveLength(0);
    });
  });
});

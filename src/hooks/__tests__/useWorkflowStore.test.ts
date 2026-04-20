import { useWorkflowStore } from '../useWorkflowStore';
import type { Node, Edge } from '@xyflow/react';
import type { StartNodeData, TaskNodeData } from '../../types/nodes';

type AnyNodeData = StartNodeData | TaskNodeData;

// Helper to reset store before each test
const resetStore = () => {
  const store = useWorkflowStore.getState();
  store.clearWorkflow();
};

beforeEach(() => {
  resetStore();
});

afterEach(() => {
  resetStore();
});

describe('useWorkflowStore', () => {
  describe('HK-01: Initial state has empty nodes and edges arrays', () => {
    it('should start with empty nodes and edges', () => {
      resetStore();
      const { nodes, edges } = useWorkflowStore.getState();
      expect(nodes).toEqual([]);
      expect(edges).toEqual([]);
    });
  });

  describe('HK-02: addNode adds a node to state', () => {
    it('should add a start node when addNode is called', () => {
      const { addNode } = useWorkflowStore.getState();
      addNode('start', { x: 100, y: 100 });
      const { nodes } = useWorkflowStore.getState();
      expect(nodes).toHaveLength(1);
      expect(nodes[0].type).toBe('start');
      expect(nodes[0].data.label).toBe('Start');
    });

    it('should add a task node with correct defaults', () => {
      const { addNode } = useWorkflowStore.getState();
      addNode('task', { x: 100, y: 100 });
      const { nodes } = useWorkflowStore.getState();
      expect(nodes[0].data.label).toBe('New Task');
    });
  });

  describe('HK-03: removeNode removes correct node by id', () => {
    it('should remove the node with specified id', () => {
      const { addNode, deleteNode } = useWorkflowStore.getState();
      addNode('start', { x: 0, y: 0 });
      addNode('task', { x: 100, y: 100 });
      const { nodes } = useWorkflowStore.getState();
      const nodeToDelete = nodes[0];
      deleteNode(nodeToDelete.id);
      const { nodes: remainingNodes } = useWorkflowStore.getState();
      expect(remainingNodes).toHaveLength(1);
      expect(remainingNodes.find(n => n.id === nodeToDelete.id)).toBeUndefined();
    });
  });

  describe('HK-04: updateNode updates only the target node', () => {
    it('should update data of the specified node only', () => {
      const { addNode, updateNodeData } = useWorkflowStore.getState();
      addNode('task', { x: 0, y: 0 });
      addNode('task', { x: 100, y: 100 });
      const { nodes } = useWorkflowStore.getState();
      const targetNode = nodes[0];
      updateNodeData(targetNode.id, { label: 'Updated Task' });
      const { nodes: updatedNodes } = useWorkflowStore.getState();
      expect((updatedNodes.find(n => n.id === targetNode.id)?.data as AnyNodeData).label).toBe('Updated Task');
      expect((updatedNodes.find(n => n.id !== targetNode.id)?.data as AnyNodeData).label).toBe('New Task');
    });
  });

  describe('HK-05: addEdge adds an edge', () => {
    it('should add an edge between nodes', () => {
      const { addNode, onConnect } = useWorkflowStore.getState();
      addNode('start', { x: 0, y: 0 });
      addNode('task', { x: 100, y: 100 });
      const { nodes } = useWorkflowStore.getState();
      onConnect({ source: nodes[0].id, target: nodes[1].id, sourceHandle: null, targetHandle: null });
      const { edges } = useWorkflowStore.getState();
      expect(edges).toHaveLength(1);
      expect(edges[0].source).toBe(nodes[0].id);
      expect(edges[0].target).toBe(nodes[1].id);
    });
  });

  describe('HK-06: removeEdge removes correct edge', () => {
    it('should remove the specified edge', () => {
      const { addNode, onConnect, onEdgesChange } = useWorkflowStore.getState();
      addNode('start', { x: 0, y: 0 });
      addNode('task', { x: 100, y: 100 });
      const { nodes, edges } = useWorkflowStore.getState();
      onConnect({ source: nodes[0].id, target: nodes[1].id, sourceHandle: null, targetHandle: null });
      const edgeToRemove = useWorkflowStore.getState().edges[0];
      onEdgesChange([{ id: edgeToRemove.id, type: 'remove' }]);
      const { edges: remainingEdges } = useWorkflowStore.getState();
      expect(remainingEdges).toHaveLength(0);
    });
  });

  describe('HK-07: clearWorkflow resets to empty state', () => {
    it('should clear all nodes and edges', () => {
      const { addNode, clearWorkflow } = useWorkflowStore.getState();
      addNode('start', { x: 0, y: 0 });
      addNode('task', { x: 100, y: 100 });
      addNode('end', { x: 200, y: 200 });
      clearWorkflow();
      const { nodes, edges } = useWorkflowStore.getState();
      expect(nodes).toHaveLength(0);
      expect(edges).toHaveLength(0);
    });
  });
});

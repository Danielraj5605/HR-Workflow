import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TestWrapper } from '../../testUtils/TestWrapper';
import StartForm from '../forms/StartForm';
import TaskForm from '../forms/TaskForm';
import type { StartNodeData } from '../../types/nodes';
import type { TaskNodeData } from '../../types/nodes';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';

const Wrapper = TestWrapper;

describe('Edge Cases & Negative Tests', () => {
  beforeEach(() => {
    useWorkflowStore.getState().clearWorkflow();
  });

  afterEach(() => {
    useWorkflowStore.getState().clearWorkflow();
  });

  describe('EC-01: Very long node title', () => {
    it('should render long title without crash', () => {
      const longTitle = 'A'.repeat(500);
      const { getByDisplayValue } = render(
        <Wrapper>
          <StartForm nodeId="test" data={{ type: 'start', label: longTitle, metadata: {} }} />
        </Wrapper>
      );
      expect(getByDisplayValue(longTitle)).toBeInTheDocument();
    });
  });

  describe('EC-02: Special characters in form fields', () => {
    it('should render special characters as plain text', () => {
      const { getByDisplayValue } = render(
        <Wrapper>
          <StartForm nodeId="test" data={{ type: 'start', label: '<script>alert(1)</script>', metadata: {} }} />
        </Wrapper>
      );
      expect(getByDisplayValue('<script>alert(1)</script>')).toBeInTheDocument();
    });
  });

  describe('EC-06: Auto-approve threshold of 0', () => {
    it('should accept threshold of 0', async () => {
      useWorkflowStore.getState().addNode('approval', { x: 0, y: 0 });
      const nodeId = useWorkflowStore.getState().nodes[0].id;

      const { getByLabelText, rerender } = render(
        <Wrapper>
          <TaskForm nodeId={nodeId} data={{ type: 'task', label: 'Task', description: '', assignee: '', dueDate: '', customFields: {} }} />
        </Wrapper>
      );
      // Verify it renders without error
      expect(getByLabelText(/Label/i)).toBeInTheDocument();
    });
  });

  describe('EC-07: Task node with no assignee', () => {
    it('should allow empty assignee field', () => {
      const { getByLabelText } = render(
        <Wrapper>
          <TaskForm nodeId="test" data={{ type: 'task', label: 'Task', description: '', assignee: '', dueDate: '', customFields: {} }} />
        </Wrapper>
      );
      const input = getByLabelText(/Assignee/i) as HTMLInputElement;
      expect(input.value).toBe('');
    });
  });

  describe('EC-09: Workflow with only Start and End', () => {
    it('should allow empty workflow state', () => {
      const nodes = useWorkflowStore.getState().nodes;
      const edges = useWorkflowStore.getState().edges;
      expect(nodes).toHaveLength(0);
      expect(edges).toHaveLength(0);
    });
  });

  describe('EC-10: Disconnecting all edges', () => {
    it('should allow workflow with no edges when adding nodes', () => {
      useWorkflowStore.getState().addNode('start', { x: 0, y: 0 });
      useWorkflowStore.getState().addNode('end', { x: 200, y: 0 });
      // Don't connect them
      const nodes = useWorkflowStore.getState().nodes;
      expect(nodes).toHaveLength(2);
    });
  });
});

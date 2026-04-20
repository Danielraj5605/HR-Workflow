import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TestWrapper } from '../../../testUtils/TestWrapper';
import TaskForm from '../TaskForm';
import type { TaskNodeData } from '../../../types/nodes';
import { useWorkflowStore } from '../../../hooks/useWorkflowStore';

const Wrapper = TestWrapper;

const defaultData: TaskNodeData = {
  type: 'task',
  label: 'New Task',
  description: '',
  assignee: '',
  dueDate: '',
  customFields: {},
};

describe('TaskForm', () => {
  beforeEach(() => {
    useWorkflowStore.getState().clearWorkflow();
    useWorkflowStore.getState().addNode('task', { x: 0, y: 0 });
  });

  afterEach(() => {
    useWorkflowStore.getState().clearWorkflow();
  });

  describe('TF-01: Title field is required', () => {
    it('should render title input', () => {
      const { getByLabelText } = render(
        <Wrapper>
          <TaskForm nodeId="test" data={defaultData} />
        </Wrapper>
      );
      expect(getByLabelText(/Label/i)).toBeInTheDocument();
    });
  });

  describe('TF-02: Description field accepts multiline text', () => {
    it('should render textarea for description', () => {
      const { getByPlaceholderText } = render(
        <Wrapper>
          <TaskForm nodeId="test" data={defaultData} />
        </Wrapper>
      );
      expect(getByPlaceholderText(/Describe what this task/i)).toBeInTheDocument();
    });
  });

  describe('TF-03: Assignee field accepts string input', () => {
    it('should update assignee value on change', async () => {
      const nodes = useWorkflowStore.getState().nodes;
      const nodeId = nodes[0]?.id ?? 'test';

      const { getByLabelText } = render(
        <Wrapper>
          <TaskForm nodeId={nodeId} data={nodes[0]?.data as TaskNodeData ?? defaultData} />
        </Wrapper>
      );
      const input = getByLabelText(/Assignee/i) as HTMLInputElement;

      fireEvent.change(input, { target: { value: 'Alice Smith' } });

      await waitFor(() => {
        const updatedNode = useWorkflowStore.getState().getNodeById(nodeId);
        expect(updatedNode?.data.assignee).toBe('Alice Smith');
      });
    });
  });

  describe('TF-04: Due date field accepts valid date', () => {
    it('should render date input', () => {
      const { getByLabelText } = render(
        <Wrapper>
          <TaskForm nodeId="test" data={defaultData} />
        </Wrapper>
      );
      expect(getByLabelText(/Due Date/i)).toBeInTheDocument();
    });
  });

  describe('TF-08: All fields update form state correctly', () => {
    it('should update label on change', async () => {
      const nodes = useWorkflowStore.getState().nodes;
      const nodeId = nodes[0]?.id ?? 'test';

      const { getByLabelText } = render(
        <Wrapper>
          <TaskForm nodeId={nodeId} data={nodes[0]?.data as TaskNodeData ?? defaultData} />
        </Wrapper>
      );
      const input = getByLabelText(/Label/i) as HTMLInputElement;

      fireEvent.change(input, { target: { value: 'Updated Task' } });

      await waitFor(() => {
        const updatedNode = useWorkflowStore.getState().getNodeById(nodeId);
        expect(updatedNode?.data.label).toBe('Updated Task');
      });
    });
  });
});

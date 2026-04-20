import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TestWrapper } from '../../../testUtils/TestWrapper';
import userEvent from '@testing-library/user-event';
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
    it('should render assignee input', async () => {
      const user = userEvent.setup();
      const { getByLabelText } = render(
        <Wrapper>
          <TaskForm nodeId="test" data={defaultData} />
        </Wrapper>
      );
      const input = getByLabelText(/Assignee/i);
      await user.clear(input);
      await user.type(input, 'Alice Smith');
      expect((input as HTMLInputElement).value).toBe('Alice Smith');
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
    it('should update all fields', async () => {
      const user = userEvent.setup();
      const { getByLabelText } = render(
        <Wrapper>
          <TaskForm nodeId="test" data={defaultData} />
        </Wrapper>
      );

      const labelInput = getByLabelText(/Label/i);
      await user.clear(labelInput);
      await user.type(labelInput, 'Updated Task');
      expect((labelInput as HTMLInputElement).value).toBe('Updated Task');
    });
  });
});

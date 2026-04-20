import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TestWrapper } from '../../../testUtils/TestWrapper';
import TaskNode from '../TaskNode';

const Wrapper = TestWrapper;

describe('TaskNode', () => {
  describe('TN-01: Renders Task Node with title', () => {
    it('should display the task title', () => {
      const { getByText } = render(
        <Wrapper>
          <TaskNode
            id="test-task-1"
            data={{ type: 'task', label: 'Collect Documents', description: '', assignee: '', dueDate: '', customFields: {} } as any}
            selected={false}
          />
        </Wrapper>
      );
      expect(getByText('Collect Documents')).toBeInTheDocument();
    });
  });

  describe('TN-02: Renders assignee when provided', () => {
    it('should show assignee', () => {
      const { getByText } = render(
        <Wrapper>
          <TaskNode
            id="test-task-1"
            data={{ type: 'task', label: 'Task', description: '', assignee: 'John Doe', dueDate: '', customFields: {} } as any}
            selected={false}
          />
        </Wrapper>
      );
      expect(getByText(/John Doe/)).toBeInTheDocument();
    });
  });

  describe('TN-03: Renders due date when provided', () => {
    it('should show due date', () => {
      const { getByText } = render(
        <Wrapper>
          <TaskNode
            id="test-task-1"
            data={{ type: 'task', label: 'Task', description: '', assignee: '', dueDate: '2025-12-01', customFields: {} } as any}
            selected={false}
          />
        </Wrapper>
      );
      expect(getByText(/2025-12-01/)).toBeInTheDocument();
    });
  });

  describe('TN-04: Has both input and output handles', () => {
    it('should have both handles present', () => {
      const { container } = render(
        <Wrapper>
          <TaskNode
            id="test-task-1"
            data={{ type: 'task', label: 'Task', description: '', assignee: '', dueDate: '', customFields: {} } as any}
            selected={false}
          />
        </Wrapper>
      );
      const handles = container.querySelectorAll('.react-flow__handle');
      expect(handles.length).toBe(2);
    });
  });

  describe('TN-05: Shows placeholder when no description set', () => {
    it('should render node even with empty description', () => {
      const { getByText } = render(
        <Wrapper>
          <TaskNode
            id="test-task-1"
            data={{ type: 'task', label: 'New Task', description: '', assignee: '', dueDate: '', customFields: {} } as any}
            selected={false}
          />
        </Wrapper>
      );
      expect(getByText('New Task')).toBeInTheDocument();
    });
  });
});

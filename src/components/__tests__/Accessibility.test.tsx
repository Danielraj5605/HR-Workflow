import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TestWrapper } from '../../testUtils/TestWrapper';
import StartForm from '../forms/StartForm';
import TaskForm from '../forms/TaskForm';
import ApprovalForm from '../forms/ApprovalForm';
import EndForm from '../forms/EndForm';
import Sidebar from '../canvas/Sidebar';

const Wrapper = TestWrapper;

describe('Accessibility Tests', () => {
  describe('AC-02: All form inputs have associated labels', () => {
    it('StartForm inputs should have associated labels', () => {
      const { getByLabelText } = render(
        <Wrapper>
          <StartForm nodeId="test" data={{ type: 'start', label: 'Start', metadata: {} }} />
        </Wrapper>
      );
      expect(getByLabelText(/Label/i)).toBeInTheDocument();
    });

    it('TaskForm inputs should have associated labels', () => {
      const { getByLabelText } = render(
        <Wrapper>
          <TaskForm nodeId="test" data={{ type: 'task', label: 'Task', description: '', assignee: '', dueDate: '', customFields: {} }} />
        </Wrapper>
      );
      expect(getByLabelText(/Label/i)).toBeInTheDocument();
      expect(getByLabelText(/Assignee/i)).toBeInTheDocument();
      expect(getByLabelText(/Due Date/i)).toBeInTheDocument();
    });

    it('ApprovalForm inputs should have associated labels', () => {
      const { getByLabelText } = render(
        <Wrapper>
          <ApprovalForm nodeId="test" data={{ type: 'approval', label: 'Approval', approverRole: 'Manager', approverName: '', autoApproveThreshold: 0, rejectionAction: 'reject' }} />
        </Wrapper>
      );
      expect(getByLabelText(/Label/i)).toBeInTheDocument();
      expect(getByLabelText(/Approver Role/i)).toBeInTheDocument();
      expect(getByLabelText(/Timeout/i)).toBeInTheDocument();
    });

    it('EndForm inputs should have associated labels', () => {
      const { getByLabelText } = render(
        <Wrapper>
          <EndForm nodeId="test" data={{ type: 'end', label: 'End', endMessage: 'Done', showSummary: true }} />
        </Wrapper>
      );
      expect(getByLabelText(/End Message/i)).toBeInTheDocument();
    });
  });

  describe('AC-03: Form inputs are keyboard focusable', () => {
    it('StartForm textbox should be focusable', () => {
      const { getByLabelText } = render(
        <Wrapper>
          <StartForm nodeId="test" data={{ type: 'start', label: 'Start', metadata: {} }} />
        </Wrapper>
      );
      const input = getByLabelText(/Label/i);
      expect(input).not.toBeDisabled();
    });

    it('TaskForm inputs should be focusable', () => {
      const { getByLabelText } = render(
        <Wrapper>
          <TaskForm nodeId="test" data={{ type: 'task', label: 'Task', description: '', assignee: '', dueDate: '', customFields: {} }} />
        </Wrapper>
      );
      const labelInput = getByLabelText(/Label/i);
      expect(labelInput).not.toBeDisabled();
    });
  });

  describe('AC-05: Node forms are keyboard navigable', () => {
    it('should have tabbable elements in forms', () => {
      const { getByLabelText } = render(
        <Wrapper>
          <TaskForm nodeId="test" data={{ type: 'task', label: 'Task', description: '', assignee: '', dueDate: '', customFields: {} }} />
        </Wrapper>
      );
      const labelInput = getByLabelText(/Label/i);
      expect(labelInput).not.toBeDisabled();
    });
  });

  describe('AC-06: Sidebar node items have descriptive labels', () => {
    it('should have sidebar items with labels', () => {
      const { getByText } = render(
        <Wrapper>
          <Sidebar />
        </Wrapper>
      );
      expect(getByText(/Start/i)).toBeInTheDocument();
      expect(getByText(/Task/i)).toBeInTheDocument();
      expect(getByText(/Approval/i)).toBeInTheDocument();
    });
  });
});

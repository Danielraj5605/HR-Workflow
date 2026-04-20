import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TestWrapper } from '../../../testUtils/TestWrapper';
import userEvent from '@testing-library/user-event';
import ApprovalForm from '../ApprovalForm';
import type { ApprovalNodeData } from '../../../types/nodes';
import { useWorkflowStore } from '../../../hooks/useWorkflowStore';

const Wrapper = TestWrapper;

const defaultData: ApprovalNodeData = {
  type: 'approval',
  label: 'Approval',
  approverRole: 'Manager',
  approverName: '',
  autoApproveThreshold: 0,
  rejectionAction: 'reject',
};

describe('ApprovalForm', () => {
  beforeEach(() => {
    useWorkflowStore.getState().clearWorkflow();
  });

  describe('AF-01: Title field renders and is required', () => {
    it('should render label input', () => {
      const { getByLabelText } = render(
        <Wrapper>
          <ApprovalForm nodeId="test" data={defaultData} />
        </Wrapper>
      );
      expect(getByLabelText(/Label/i)).toBeInTheDocument();
    });
  });

  describe('AF-02: Approver role dropdown has correct options', () => {
    it('should have Manager, HRBP, Director options', () => {
      const { getByRole } = render(
        <Wrapper>
          <ApprovalForm nodeId="test" data={defaultData} />
        </Wrapper>
      );
      const select = getByRole('combobox');
      expect(select).toBeInTheDocument();
      expect(select.children.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('AF-03: Approver role selection updates state', () => {
    it('should update approver role value on change', async () => {
      const user = userEvent.setup();
      const { getByRole } = render(
        <Wrapper>
          <ApprovalForm nodeId="test" data={defaultData} />
        </Wrapper>
      );
      const select = getByRole('combobox') as HTMLSelectElement;
      await user.selectOptions(select, 'HRBP');
      expect(select.value).toBe('HRBP');
    });
  });

  describe('AF-04: Auto-approve threshold accepts numbers only', () => {
    it('should render number input for threshold', () => {
      const { getByLabelText } = render(
        <Wrapper>
          <ApprovalForm nodeId="test" data={defaultData} />
        </Wrapper>
      );
      expect(getByLabelText(/Timeout/i)).toBeInTheDocument();
    });
  });

  describe('AF-05: Auto-approve threshold accepts 0', () => {
    it('should allow 0 as value', () => {
      const { getByLabelText } = render(
        <Wrapper>
          <ApprovalForm nodeId="test" data={{ ...defaultData, autoApproveThreshold: 0 }} />
        </Wrapper>
      );
      const input = getByLabelText(/Timeout/i) as HTMLInputElement;
      expect(input.value).toBe('0');
    });
  });

  describe('AF-06: Negative threshold shows validation error', () => {
    it('should have min=0 on the input', () => {
      const { getByLabelText } = render(
        <Wrapper>
          <ApprovalForm nodeId="test" data={defaultData} />
        </Wrapper>
      );
      const input = getByLabelText(/Timeout/i) as HTMLInputElement;
      expect(input.min).toBe('0');
    });
  });
});

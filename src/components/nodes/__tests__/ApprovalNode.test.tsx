import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TestWrapper } from '../../../testUtils/TestWrapper';
import ApprovalNode from '../ApprovalNode';

const Wrapper = TestWrapper;

describe('ApprovalNode', () => {
  describe('AN-01: Renders Approval Node with approver role', () => {
    it('should display the approver role', () => {
      const { getByText } = render(
        <Wrapper>
          <ApprovalNode
            id="test-approval-1"
            data={{ type: 'approval', label: 'Approval', approverRole: 'Manager', approverName: '', autoApproveThreshold: 0, rejectionAction: 'reject' } as any}
            selected={false}
          />
        </Wrapper>
      );
      expect(getByText(/Manager/)).toBeInTheDocument();
    });
  });

  describe('AN-02: Renders auto-approve threshold', () => {
    it('should show threshold when greater than 0', () => {
      const { getByText } = render(
        <Wrapper>
          <ApprovalNode
            id="test-approval-1"
            data={{ type: 'approval', label: 'Approval', approverRole: 'Manager', approverName: '', autoApproveThreshold: 3, rejectionAction: 'reject' } as any}
            selected={false}
          />
        </Wrapper>
      );
      expect(getByText(/3d/)).toBeInTheDocument();
    });
  });

  describe('AN-03: Has both input and output handles', () => {
    it('should have both handles present', () => {
      const { container } = render(
        <Wrapper>
          <ApprovalNode
            id="test-approval-1"
            data={{ type: 'approval', label: 'Approval', approverRole: 'Manager', approverName: '', autoApproveThreshold: 0, rejectionAction: 'reject' } as any}
            selected={false}
          />
        </Wrapper>
      );
      const handles = container.querySelectorAll('.react-flow__handle');
      expect(handles.length).toBe(2);
    });
  });
});

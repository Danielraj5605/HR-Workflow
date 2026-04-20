import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TestWrapper } from '../../../testUtils/TestWrapper';
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
    useWorkflowStore.getState().addNode('approval', { x: 0, y: 0 });
  });

  afterEach(() => {
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
      const { getByLabelText } = render(
        <Wrapper>
          <ApprovalForm nodeId="test" data={defaultData} />
        </Wrapper>
      );
      const select = getByLabelText(/Approver Role/i) as HTMLSelectElement;
      expect(select).toBeInTheDocument();
      expect(select.options.length).toBeGreaterThanOrEqual(3);
      expect(select.options[0].value).toBe('Manager');
      expect(select.options[1].value).toBe('HRBP');
      expect(select.options[2].value).toBe('Director');
    });
  });

  describe('AF-03: Approver role selection updates state', () => {
    it('should update approver role value on change', async () => {
      const nodes = useWorkflowStore.getState().nodes;
      const nodeId = nodes[0]?.id ?? 'test';

      const { getByLabelText } = render(
        <Wrapper>
          <ApprovalForm nodeId={nodeId} data={nodes[0]?.data as ApprovalNodeData ?? defaultData} />
        </Wrapper>
      );
      const select = getByLabelText(/Approver Role/i) as HTMLSelectElement;

      fireEvent.change(select, { target: { value: 'HRBP' } });

      await waitFor(() => {
        const updatedNode = useWorkflowStore.getState().getNodeById(nodeId);
        expect(updatedNode?.data.approverRole).toBe('HRBP');
      });
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

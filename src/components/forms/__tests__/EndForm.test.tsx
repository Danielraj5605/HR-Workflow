import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TestWrapper } from '../../../testUtils/TestWrapper';
import EndForm from '../EndForm';
import type { EndNodeData } from '../../../types/nodes';
import { useWorkflowStore } from '../../../hooks/useWorkflowStore';

const Wrapper = TestWrapper;

const defaultData: EndNodeData = {
  type: 'end',
  label: 'End',
  endMessage: 'Workflow completed.',
  showSummary: true,
};

describe('EndForm', () => {
  beforeEach(() => {
    useWorkflowStore.getState().clearWorkflow();
    useWorkflowStore.getState().addNode('end', { x: 0, y: 0 });
  });

  afterEach(() => {
    useWorkflowStore.getState().clearWorkflow();
  });

  describe('EF-01: End message field renders', () => {
    it('should render end message textarea', () => {
      const { getByLabelText } = render(
        <Wrapper>
          <EndForm nodeId="test" data={defaultData} />
        </Wrapper>
      );
      expect(getByLabelText(/End Message/i)).toBeInTheDocument();
    });
  });

  describe('EF-02: Summary flag toggle renders', () => {
    it('should render toggle with label', () => {
      const { getByText } = render(
        <Wrapper>
          <EndForm nodeId="test" data={defaultData} />
        </Wrapper>
      );
      expect(getByText(/Show Summary on Completion/i)).toBeInTheDocument();
    });
  });

  describe('EF-03: Summary flag toggles correctly', () => {
    it('should toggle showSummary on click', async () => {
      const nodes = useWorkflowStore.getState().nodes;
      const nodeId = nodes[0]?.id ?? 'test';

      const { container } = render(
        <Wrapper>
          <EndForm nodeId={nodeId} data={nodes[0]?.data as EndNodeData ?? defaultData} />
        </Wrapper>
      );

      // The toggle is a div with onClick
      const toggle = container.querySelector('[style*="border-radius: 10"]');
      if (toggle) {
        fireEvent.click(toggle);
      }

      await waitFor(() => {
        const updatedNode = useWorkflowStore.getState().getNodeById(nodeId);
        expect(updatedNode?.data.showSummary).toBe(false);
      });
    });
  });

  describe('EF-04: End message updates state on change', () => {
    it('should update end message value', async () => {
      const nodes = useWorkflowStore.getState().nodes;
      const nodeId = nodes[0]?.id ?? 'test';

      const { getByLabelText } = render(
        <Wrapper>
          <EndForm nodeId={nodeId} data={nodes[0]?.data as EndNodeData ?? defaultData} />
        </Wrapper>
      );
      const textarea = getByLabelText(/End Message/i) as HTMLTextAreaElement;

      fireEvent.change(textarea, { target: { value: 'Process Complete' } });

      await waitFor(() => {
        const updatedNode = useWorkflowStore.getState().getNodeById(nodeId);
        expect(updatedNode?.data.endMessage).toBe('Process Complete');
      });
    });
  });
});

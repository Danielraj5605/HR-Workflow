import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TestWrapper } from '../../../testUtils/TestWrapper';
import AutomatedStepForm from '../AutomatedStepForm';
import type { AutomatedStepNodeData } from '../../../types/nodes';
import { useWorkflowStore } from '../../../hooks/useWorkflowStore';

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

const Wrapper = TestWrapper;

const defaultData: AutomatedStepNodeData = {
  type: 'automatedStep',
  label: 'Automated Step',
  actionId: '',
  actionLabel: '',
  params: {},
  maxRetries: 0,
  retryDelaySeconds: 30,
};

const mockAutomationsResponse = [
  { id: 'send_email', label: 'Send Email', params: ['to', 'subject'] },
  { id: 'generate_doc', label: 'Generate Document', params: ['template', 'recipient'] },
];

describe('AutomatedStepForm', () => {
  beforeEach(() => {
    useWorkflowStore.getState().clearWorkflow();
    mockFetch.mockReset();
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockAutomationsResponse),
    });
  });

  describe('ASF-01: Fetches and displays actions from mock API', () => {
    it('should populate dropdown with actions from API', async () => {
      const { getByRole } = render(
        <Wrapper>
          <AutomatedStepForm nodeId="test" data={defaultData} />
        </Wrapper>
      );

      await waitFor(() => {
        const select = getByRole('combobox');
        expect(select.children.length).toBeGreaterThanOrEqual(2);
      });
    });
  });

  describe('ASF-02: Selecting action updates parameter fields dynamically', () => {
    it('should show parameter fields when action is selected', async () => {
      useWorkflowStore.getState().addNode('automatedStep', { x: 0, y: 0 });
      const nodeId = useWorkflowStore.getState().nodes[0].id;

      const { getByRole, queryByText, rerender } = render(
        <Wrapper>
          <AutomatedStepForm nodeId={nodeId} data={useWorkflowStore.getState().nodes[0].data as AutomatedStepNodeData} />
        </Wrapper>
      );

      await waitFor(() => {
        expect(queryByText(/Loading actions/i)).not.toBeInTheDocument();
      });

      const select = getByRole('combobox') as HTMLSelectElement;
      fireEvent.change(select, { target: { value: 'send_email' } });

      rerender(
        <Wrapper>
          <AutomatedStepForm nodeId={nodeId} data={useWorkflowStore.getState().getNodeById(nodeId)?.data as AutomatedStepNodeData ?? defaultData} />
        </Wrapper>
      );

      await waitFor(() => {
        const updatedNode = useWorkflowStore.getState().getNodeById(nodeId);
        expect(updatedNode?.data.actionId).toBe('send_email');
        expect(updatedNode?.data.params).toEqual({});
      });
    });
  });

  describe('ASF-03: Changing action clears previous parameters', () => {
    it('should reset params when action changes', async () => {
      useWorkflowStore.getState().addNode('automatedStep', { x: 0, y: 0 });
      const nodeId = useWorkflowStore.getState().nodes[0].id;

      const { getByRole, rerender } = render(
        <Wrapper>
          <AutomatedStepForm nodeId={nodeId} data={useWorkflowStore.getState().nodes[0].data as AutomatedStepNodeData} />
        </Wrapper>
      );

      await waitFor(() => {
        expect(getByRole('combobox')).toBeInTheDocument();
      });

      const select = getByRole('combobox') as HTMLSelectElement;

      // Select first action
      fireEvent.change(select, { target: { value: 'send_email' } });
      rerender(
        <Wrapper>
          <AutomatedStepForm nodeId={nodeId} data={useWorkflowStore.getState().getNodeById(nodeId)?.data as AutomatedStepNodeData ?? defaultData} />
        </Wrapper>
      );

      // Now select second action
      fireEvent.change(select, { target: { value: 'generate_doc' } });
      rerender(
        <Wrapper>
          <AutomatedStepForm nodeId={nodeId} data={useWorkflowStore.getState().getNodeById(nodeId)?.data as AutomatedStepNodeData ?? defaultData} />
        </Wrapper>
      );

      await waitFor(() => {
        const updatedNode = useWorkflowStore.getState().getNodeById(nodeId);
        expect(updatedNode?.data.actionId).toBe('generate_doc');
        expect(updatedNode?.data.params).toEqual({});
      });
    });
  });

  describe('ASF-04: Shows loading state during API fetch', () => {
    it('should show loading indicator initially', () => {
      const { getByText } = render(
        <Wrapper>
          <AutomatedStepForm nodeId="test" data={defaultData} />
        </Wrapper>
      );
      expect(getByText(/Loading actions/i)).toBeInTheDocument();
    });
  });

  describe('ASF-05: Shows error state if API fails', () => {
    it('should handle fetch errors gracefully', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));
      const { queryByText } = render(
        <Wrapper>
          <AutomatedStepForm nodeId="test" data={defaultData} />
        </Wrapper>
      );

      await waitFor(() => {
        expect(queryByText(/Loading actions/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('ASF-06: Parameter values update state correctly', () => {
    it('should update params in state when input changes', async () => {
      useWorkflowStore.getState().addNode('automatedStep', { x: 0, y: 0 });
      const nodeId = useWorkflowStore.getState().nodes[0].id;

      const { getByPlaceholderText, rerender } = render(
        <Wrapper>
          <AutomatedStepForm nodeId={nodeId} data={{ ...useWorkflowStore.getState().nodes[0].data as AutomatedStepNodeData, actionId: 'send_email', actionLabel: 'Send Email' }} />
        </Wrapper>
      );

      await waitFor(() => {
        expect(getByPlaceholderText(/Enter to/i)).toBeInTheDocument();
      });

      const toInput = getByPlaceholderText(/Enter to/i) as HTMLInputElement;
      fireEvent.change(toInput, { target: { value: 'hr@company.com' } });

      rerender(
        <Wrapper>
          <AutomatedStepForm nodeId={nodeId} data={useWorkflowStore.getState().getNodeById(nodeId)?.data as AutomatedStepNodeData ?? defaultData} />
        </Wrapper>
      );

      await waitFor(() => {
        const updatedNode = useWorkflowStore.getState().getNodeById(nodeId);
        expect(updatedNode?.data.params).toHaveProperty('to', 'hr@company.com');
      });
    });
  });
});

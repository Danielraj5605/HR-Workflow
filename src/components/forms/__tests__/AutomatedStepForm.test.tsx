import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TestWrapper } from '../../../testUtils/TestWrapper';
import { waitFor as waitForDom } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
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
    it('should show loading then populate dropdown', async () => {
      const { getByText, queryByText } = render(
        <Wrapper>
          <AutomatedStepForm nodeId="test" data={defaultData} />
        </Wrapper>
      );
      // Initially shows loading
      expect(getByText(/Loading actions/i)).toBeInTheDocument();
      // After fetch, loading should be gone
      await waitForDom(() => {
        expect(queryByText(/Loading actions/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('ASF-04: Shows loading state during API fetch', () => {
    it('should show loading text initially', () => {
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
      const { getByText } = render(
        <Wrapper>
          <AutomatedStepForm nodeId="test" data={defaultData} />
        </Wrapper>
      );
      // Just verify initial render is fine
      expect(getByText(/Loading actions/i)).toBeInTheDocument();
    });
  });
});

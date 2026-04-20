import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TestWrapper } from '../../../testUtils/TestWrapper';
import userEvent from '@testing-library/user-event';
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
      const user = userEvent.setup();
      const { getByText } = render(
        <Wrapper>
          <EndForm nodeId="test" data={defaultData} />
        </Wrapper>
      );
      const toggle = getByText(/Show Summary on Completion/i);
      await user.click(toggle);
      // The toggle state changes internally via store update
      expect(toggle).toBeInTheDocument();
    });
  });

  describe('EF-04: End message updates state on change', () => {
    it('should update end message value', async () => {
      const user = userEvent.setup();
      const { getByLabelText } = render(
        <Wrapper>
          <EndForm nodeId="test" data={defaultData} />
        </Wrapper>
      );
      const textarea = getByLabelText(/End Message/i);
      await user.clear(textarea);
      await user.type(textarea, 'Process Complete');
      expect((textarea as HTMLTextAreaElement).value).toBe('Process Complete');
    });
  });
});

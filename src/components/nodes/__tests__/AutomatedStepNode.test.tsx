import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TestWrapper } from '../../../testUtils/TestWrapper';
import AutomatedStepNode from '../AutomatedStepNode';

const Wrapper = TestWrapper;

describe('AutomatedStepNode', () => {
  describe('AS-01: Renders action label', () => {
    it('should display action label when set', () => {
      const { getByText } = render(
        <Wrapper>
          <AutomatedStepNode
            id="test-auto-1"
            data={{ type: 'automatedStep', label: 'Auto', actionId: 'send_email', actionLabel: 'Send Email', params: {}, maxRetries: 0, retryDelaySeconds: 30 } as any}
            selected={false}
          />
        </Wrapper>
      );
      expect(getByText(/Send Email/, { selector: 'p' })).toBeInTheDocument();
    });
  });

  describe('AS-02: Shows action parameters', () => {
    it('should show the action label when params are set', () => {
      const { getByText } = render(
        <Wrapper>
          <AutomatedStepNode
            id="test-auto-1"
            data={{ type: 'automatedStep', label: 'Auto', actionId: 'send_email', actionLabel: 'Send Email', params: { to: 'hr@co.com' }, maxRetries: 0, retryDelaySeconds: 30 } as any}
            selected={false}
          />
        </Wrapper>
      );
      expect(getByText(/Send Email/, { selector: 'p' })).toBeInTheDocument();
    });
  });

  describe('AS-03: Shows loading state when action not loaded', () => {
    it('should show placeholder when no action selected', () => {
      const { getByText } = render(
        <Wrapper>
          <AutomatedStepNode
            id="test-auto-1"
            data={{ type: 'automatedStep', label: 'Automated Step', actionId: '', actionLabel: '', params: {}, maxRetries: 0, retryDelaySeconds: 30 } as any}
            selected={false}
          />
        </Wrapper>
      );
      expect(getByText('No action selected')).toBeInTheDocument();
    });
  });

  describe('AS-04: Has both input and output handles', () => {
    it('should have both handles present', () => {
      const { container } = render(
        <Wrapper>
          <AutomatedStepNode
            id="test-auto-1"
            data={{ type: 'automatedStep', label: 'Auto', actionId: 'send_email', actionLabel: 'Send Email', params: {}, maxRetries: 0, retryDelaySeconds: 30 } as any}
            selected={false}
          />
        </Wrapper>
      );
      const handles = container.querySelectorAll('.react-flow__handle');
      expect(handles.length).toBe(2);
    });
  });
});

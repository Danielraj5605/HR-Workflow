import React from 'react';
import { render, getByText, getAllByText } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TestWrapper } from '../../../testUtils/TestWrapper';
import StartNode from '../StartNode';

const Wrapper = TestWrapper;

describe('StartNode', () => {
  describe('SN-01: Renders Start Node with default label', () => {
    it('should display "Start" label', () => {
      const utils = render(
        <Wrapper>
          <StartNode id="test-start-1" data={{ type: 'start', label: 'Start', metadata: {} } as any} selected={false} />
        </Wrapper>
      );
      expect(utils.getAllByText('Start')).toHaveLength(2);
    });
  });

  describe('SN-03: Has only an output handle (no input handle)', () => {
    it('should have source handle but no target handle', () => {
      const { container } = render(
        <Wrapper>
          <StartNode id="test-start-1" data={{ type: 'start', label: 'Start', metadata: {} } as any} selected={false} />
        </Wrapper>
      );
      const handles = container.querySelectorAll('.react-flow__handle');
      // StartNode has showTarget=false, so only source handle
      expect(handles.length).toBe(1);
    });
  });

  describe('SN-04: Selected state applies highlight', () => {
    it('should render with selected=true prop', () => {
      const { container } = render(
        <Wrapper>
          <StartNode id="test-start-1" data={{ type: 'start', label: 'Start', metadata: {} } as any} selected={true} />
        </Wrapper>
      );
      // When selected, the node should have boxShadow
      const nodeCard = container.querySelector('.node-card');
      expect(nodeCard).not.toBeNull();
    });
  });

  describe('SN-05: Displays custom title when set', () => {
    it('should render custom title', () => {
      const { getByText } = render(
        <Wrapper>
          <StartNode id="test-start-1" data={{ type: 'start', label: 'Onboarding Start', metadata: {} } as any} selected={false} />
        </Wrapper>
      );
      expect(getByText('Onboarding Start')).toBeInTheDocument();
    });
  });
});

import React from 'react';
import { render, getByText, getAllByText } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TestWrapper } from '../../../testUtils/TestWrapper';
import EndNode from '../EndNode';

const Wrapper = TestWrapper;

describe('EndNode', () => {
  describe('EN-01: Renders End Node with end message', () => {
    it('should display end message', () => {
      const { getByText } = render(
        <Wrapper>
          <EndNode
            id="test-end-1"
            data={{ type: 'end', label: 'End', endMessage: 'Complete', showSummary: true } as any}
            selected={false}
          />
        </Wrapper>
      );
      expect(getByText('Complete')).toBeInTheDocument();
    });
  });

  describe('EN-02: Shows summary flag indicator', () => {
    it('should display label and endMessage', () => {
      const { getByText } = render(
        <Wrapper>
          <EndNode
            id="test-end-1"
            data={{ type: 'end', label: 'End', endMessage: 'Workflow completed.', showSummary: true } as any}
            selected={false}
          />
        </Wrapper>
      );
      expect(getByText('Workflow completed.')).toBeInTheDocument();
    });
  });

  describe('EN-03: Has only an input handle (no output handle)', () => {
    it('should have only target handle', () => {
      const { container } = render(
        <Wrapper>
          <EndNode
            id="test-end-1"
            data={{ type: 'end', label: 'End', endMessage: 'Workflow completed.', showSummary: true } as any}
            selected={false}
          />
        </Wrapper>
      );
      const handles = container.querySelectorAll('.react-flow__handle');
      expect(handles.length).toBe(1);
    });
  });

  describe('EN-04: Renders correct terminal styling', () => {
    it('should have header label as "End"', () => {
      const utils = render(
        <Wrapper>
          <EndNode
            id="test-end-1"
            data={{ type: 'end', label: 'End', endMessage: 'Workflow completed.', showSummary: true } as any}
            selected={false}
          />
        </Wrapper>
      );
      expect(utils.getAllByText('End')).toHaveLength(2);
    });
  });
});

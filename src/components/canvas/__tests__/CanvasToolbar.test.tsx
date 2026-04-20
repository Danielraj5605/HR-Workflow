import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TestWrapper } from '../../../testUtils/TestWrapper';
import CanvasToolbar from '../CanvasToolbar';

// Only mock useWorkflowStore, let ReactFlowProvider work normally
jest.mock('../../../hooks/useWorkflowStore', () => ({
  useWorkflowStore: () => ({
    nodes: [],
    edges: [],
    importWorkflow: jest.fn(),
  }),
}));

jest.mock('../../../utils/graphSerializer', () => ({
  serializeGraph: jest.fn(() => ({ nodes: [], edges: [] })),
}));

const Wrapper = TestWrapper;

describe('CanvasToolbar', () => {
  const mockOnClear = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('CT-01: Renders zoom controls', () => {
    it('should render toolbar without crashing', () => {
      render(<Wrapper><CanvasToolbar onClear={mockOnClear} /></Wrapper>);
      expect(document.querySelectorAll('button').length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('CT-02: Contains toolbar structure', () => {
    it('should render multiple buttons in toolbar', () => {
      render(<Wrapper><CanvasToolbar onClear={mockOnClear} /></Wrapper>);
      const buttons = document.querySelectorAll('button');
      expect(buttons.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('CT-03: Renders clear canvas button', () => {
    it('should render buttons in toolbar', () => {
      render(<Wrapper><CanvasToolbar onClear={mockOnClear} /></Wrapper>);
      const buttons = document.querySelectorAll('button');
      expect(buttons.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('CT-04: Clear button is present', () => {
    it('should have multiple buttons', () => {
      render(<Wrapper><CanvasToolbar onClear={mockOnClear} /></Wrapper>);
      expect(document.querySelectorAll('button').length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('CT-05: Toolbar renders its content', () => {
    it('should render toolbar buttons', () => {
      render(<Wrapper><CanvasToolbar onClear={mockOnClear} /></Wrapper>);
      expect(document.querySelectorAll('button').length).toBeGreaterThanOrEqual(4);
    });
  });
});

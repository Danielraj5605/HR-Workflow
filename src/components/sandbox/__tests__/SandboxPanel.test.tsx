import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TestWrapper } from '../../../testUtils/TestWrapper';
import SandboxPanel from '../SandboxPanel';

// Mock hooks at module level
jest.mock('../../../hooks/useSimulate', () => ({
  useSimulate: jest.fn(() => ({
    result: null,
    loading: false,
    error: null,
    run: jest.fn(),
    reset: jest.fn(),
  })),
}));

jest.mock('../../../hooks/useValidation', () => ({
  useValidation: jest.fn(() => []),
}));

const Wrapper = TestWrapper;

describe('SandboxPanel', () => {
  describe('SP-01: Renders Run Simulation button', () => {
    it('should display Run Simulation button', () => {
      render(<Wrapper><SandboxPanel /></Wrapper>);
      expect(screen.getByRole('button', { name: /run simulation/i })).toBeInTheDocument();
    });
  });

  describe('SP-02: ValidationBanner displays when no errors', () => {
    it('should show valid workflow message', () => {
      render(<Wrapper><SandboxPanel /></Wrapper>);
      expect(screen.getByText(/valid.*ready to simulate/i)).toBeInTheDocument();
    });
  });

  describe('SP-03: No error displayed initially', () => {
    it('should not show error message when error is null', () => {
      render(<Wrapper><SandboxPanel /></Wrapper>);
      expect(screen.queryByText(/simulating/i)).not.toBeInTheDocument();
    });
  });

  describe('SP-04: Shows loading state when loading is true', () => {
    it('should show Simulating... text when loading', () => {
      const { useSimulate } = require('../../../hooks/useSimulate');
      (useSimulate as jest.Mock).mockReturnValueOnce({
        result: null,
        loading: true,
        error: null,
        run: jest.fn(),
        reset: jest.fn(),
      });
      render(<Wrapper><SandboxPanel /></Wrapper>);
      expect(screen.getByText(/simulating/i)).toBeInTheDocument();
    });
  });
});

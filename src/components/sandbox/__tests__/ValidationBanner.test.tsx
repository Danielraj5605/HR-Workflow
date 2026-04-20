import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TestWrapper } from '../../../testUtils/TestWrapper';
import ValidationBanner from '../ValidationBanner';
import type { ValidationError } from '../../../types/workflow';

const Wrapper = TestWrapper;

describe('ValidationBanner', () => {
  describe('VB-01: Shows success state when no errors', () => {
    it('should display valid workflow message', () => {
      render(<Wrapper><ValidationBanner errors={[]} /></Wrapper>);
      expect(screen.getByText(/valid.*ready to simulate/i)).toBeInTheDocument();
    });
  });

  describe('VB-02: Shows error messages', () => {
    it('should display error messages for hard errors', () => {
      const errors: ValidationError[] = [
        { nodeId: '1', message: 'Missing Start Node', severity: 'error' },
        { nodeId: '2', message: 'Disconnected node', severity: 'error' },
      ];
      render(<Wrapper><ValidationBanner errors={errors} /></Wrapper>);
      expect(screen.getByText(/Missing Start Node/)).toBeInTheDocument();
      expect(screen.getByText(/Disconnected node/)).toBeInTheDocument();
    });
  });

  describe('VB-03: Shows warning messages', () => {
    it('should display warning messages', () => {
      const errors: ValidationError[] = [
        { nodeId: '1', message: 'More than one Start Node', severity: 'warning' },
      ];
      render(<Wrapper><ValidationBanner errors={errors} /></Wrapper>);
      expect(screen.getByText(/More than one Start Node/)).toBeInTheDocument();
    });
  });

  describe('VB-04: Shows both errors and warnings', () => {
    it('should display errors and warnings separately', () => {
      const errors: ValidationError[] = [
        { nodeId: '1', message: 'Critical error', severity: 'error' },
        { nodeId: '2', message: 'Warning message', severity: 'warning' },
      ];
      render(<Wrapper><ValidationBanner errors={errors} /></Wrapper>);
      expect(screen.getByText(/Critical error/)).toBeInTheDocument();
      expect(screen.getByText(/Warning message/)).toBeInTheDocument();
    });
  });
});

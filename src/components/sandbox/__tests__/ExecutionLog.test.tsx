import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TestWrapper } from '../../../testUtils/TestWrapper';
import ExecutionLog from '../ExecutionLog';
import type { SimulationStep } from '../../../types/workflow';

const Wrapper = TestWrapper;

const mockSteps: SimulationStep[] = [
  {
    nodeId: 'node-1',
    nodeLabel: 'Start',
    status: 'completed',
    detail: 'Workflow started',
    duration: 0.1,
    timestamp: new Date('2025-01-01T10:00:00Z').toISOString(),
  },
  {
    nodeId: 'node-2',
    nodeLabel: 'Task',
    status: 'completed',
    detail: 'Document collection completed',
    duration: 2.5,
    timestamp: new Date('2025-01-01T10:00:01Z').toISOString(),
  },
  {
    nodeId: 'node-3',
    nodeLabel: 'Approval',
    status: 'pending',
    detail: 'Waiting for manager approval',
    duration: 0,
    timestamp: new Date('2025-01-01T10:00:02Z').toISOString(),
  },
  {
    nodeId: 'node-4',
    nodeLabel: 'End',
    status: 'skipped',
    detail: 'Skipped due to pending approval',
    duration: 0,
    timestamp: new Date('2025-01-01T10:00:03Z').toISOString(),
  },
];

describe('ExecutionLog', () => {
  describe('EL-01: Renders step labels and status', () => {
    it('should display all step labels', () => {
      render(<Wrapper><ExecutionLog steps={mockSteps} /></Wrapper>);
      expect(screen.getByText('Start')).toBeInTheDocument();
      expect(screen.getByText('Task')).toBeInTheDocument();
      expect(screen.getByText('Approval')).toBeInTheDocument();
      expect(screen.getByText('End')).toBeInTheDocument();
    });
  });

  describe('EL-02: Renders completion status correctly', () => {
    it('should show Completed badge for completed steps', () => {
      render(<Wrapper><ExecutionLog steps={[mockSteps[0]]} /></Wrapper>);
      expect(screen.getByText('Completed')).toBeInTheDocument();
    });
  });

  describe('EL-03: Renders pending status correctly', () => {
    it('should show Pending badge for pending steps', () => {
      render(<Wrapper><ExecutionLog steps={[mockSteps[2]]} /></Wrapper>);
      expect(screen.getByText('Pending')).toBeInTheDocument();
    });
  });

  describe('EL-04: Renders skipped status correctly', () => {
    it('should show Skipped badge for skipped steps', () => {
      render(<Wrapper><ExecutionLog steps={[mockSteps[3]]} /></Wrapper>);
      expect(screen.getByText('Skipped')).toBeInTheDocument();
    });
  });

  describe('EL-05: Renders step details', () => {
    it('should display step detail text', () => {
      render(<Wrapper><ExecutionLog steps={[mockSteps[1]]} /></Wrapper>);
      expect(screen.getByText(/Document collection completed/)).toBeInTheDocument();
    });
  });

  describe('EL-06: Renders step duration', () => {
    it('should display step duration', () => {
      render(<Wrapper><ExecutionLog steps={[mockSteps[1]]} /></Wrapper>);
      expect(screen.getByText(/2\.5s/)).toBeInTheDocument();
    });
  });

  describe('EL-07: Returns null for empty steps', () => {
    it('should return null when steps is empty array', () => {
      const { container } = render(<Wrapper><ExecutionLog steps={[]} /></Wrapper>);
      expect(container.firstChild).toBeNull();
    });
  });
});

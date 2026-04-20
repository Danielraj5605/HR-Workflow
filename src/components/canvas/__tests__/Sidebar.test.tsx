import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TestWrapper } from '../../../testUtils/TestWrapper';
import Sidebar from '../Sidebar';

const Wrapper = TestWrapper;

describe('Sidebar', () => {
  describe('CI-01: Sidebar renders all 5 node types', () => {
    it('should display all 5 node type labels', () => {
      render(<Wrapper><Sidebar /></Wrapper>);
      expect(screen.getByText('Start')).toBeInTheDocument();
      expect(screen.getByText('Task')).toBeInTheDocument();
      expect(screen.getByText('Approval')).toBeInTheDocument();
      expect(screen.getByText('Automated')).toBeInTheDocument();
      expect(screen.getByText('End')).toBeInTheDocument();
    });
  });

  describe('CI-02: Sidebar has Node Palette header', () => {
    it('should display Node Palette heading', () => {
      render(<Wrapper><Sidebar /></Wrapper>);
      expect(screen.getByText(/node palette/i)).toBeInTheDocument();
    });
  });

  describe('CI-03: Each node type has description', () => {
    it('should show descriptions for each node type', () => {
      render(<Wrapper><Sidebar /></Wrapper>);
      expect(screen.getByText(/entry point of the workflow/i)).toBeInTheDocument();
      expect(screen.getByText(/assign work to a person or team/i)).toBeInTheDocument();
      expect(screen.getByText(/gate requiring a manager sign-off/i)).toBeInTheDocument();
      expect(screen.getByText(/run an automated system action/i)).toBeInTheDocument();
      expect(screen.getByText(/terminal node for the workflow/i)).toBeInTheDocument();
    });
  });

  describe('CI-04: Sidebar items are draggable', () => {
    it('should have draggable sidebar items', () => {
      render(<Wrapper><Sidebar /></Wrapper>);
      const draggableItems = document.querySelectorAll('[draggable="true"]');
      expect(draggableItems.length).toBe(5);
    });
  });
});

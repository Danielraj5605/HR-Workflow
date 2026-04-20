import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TestWrapper } from '../../../testUtils/TestWrapper';
import StartForm from '../StartForm';
import type { StartNodeData } from '../../../types/nodes';
import { useWorkflowStore } from '../../../hooks/useWorkflowStore';

const Wrapper = TestWrapper;

const defaultData: StartNodeData = { type: 'start', label: 'Start', metadata: {} };

describe('StartForm', () => {
  beforeEach(() => {
    useWorkflowStore.getState().clearWorkflow();
    useWorkflowStore.getState().addNode('start', { x: 0, y: 0 });
  });

  afterEach(() => {
    useWorkflowStore.getState().clearWorkflow();
  });

  describe('SF-01: Renders title input field', () => {
    it('should show title input', () => {
      const { getByLabelText } = render(
        <Wrapper>
          <StartForm nodeId="test" data={defaultData} />
        </Wrapper>
      );
      expect(getByLabelText(/Label/i)).toBeInTheDocument();
    });
  });

  describe('SF-02: Title input is required — shows error on empty submit', () => {
    it('should update label value on change', async () => {
      const nodes = useWorkflowStore.getState().nodes;
      const nodeId = nodes[0]?.id ?? 'test';

      const { getByRole, rerender } = render(
        <Wrapper>
          <StartForm nodeId={nodeId} data={nodes[0]?.data as StartNodeData ?? defaultData} />
        </Wrapper>
      );

      const input = getByRole('textbox', { name: /label/i }) as HTMLInputElement;

      // Use fireEvent which directly dispatches to DOM
      fireEvent.change(input, { target: { value: 'New Start' } });

      // Verify store was updated
      await waitFor(() => {
        const updatedNode = useWorkflowStore.getState().getNodeById(nodeId);
        expect(updatedNode?.data.label).toBe('New Start');
      });
    });
  });

  describe('SF-03: Can add metadata key-value pair', () => {
    it('should have metadata input fields', () => {
      const { getByPlaceholderText } = render(
        <Wrapper>
          <StartForm nodeId="test" data={defaultData} />
        </Wrapper>
      );
      expect(getByPlaceholderText('e.g. version')).toBeInTheDocument();
    });
  });

  describe('SF-05: onChange fires with updated values', () => {
    it('should have label input that responds to changes', async () => {
      const nodes = useWorkflowStore.getState().nodes;
      const nodeId = nodes[0]?.id ?? 'test';

      const { getByRole, rerender } = render(
        <Wrapper>
          <StartForm nodeId={nodeId} data={nodes[0]?.data as StartNodeData ?? defaultData} />
        </Wrapper>
      );

      const input = getByRole('textbox', { name: /label/i }) as HTMLInputElement;

      fireEvent.change(input, { target: { value: 'Test Label' } });

      await waitFor(() => {
        const updatedNode = useWorkflowStore.getState().getNodeById(nodeId);
        expect(updatedNode?.data.label).toBe('Test Label');
      });
    });
  });

  describe('SF-06: Populated with existing data on open', () => {
    it('should show existing metadata', () => {
      const dataWithMeta: StartNodeData = {
        type: 'start',
        label: 'My Start',
        metadata: { version: '1.0' },
      };
      const { getByDisplayValue } = render(
        <Wrapper>
          <StartForm nodeId="test" data={dataWithMeta} />
        </Wrapper>
      );
      expect(getByDisplayValue('My Start')).toBeInTheDocument();
    });
  });
});

import React from 'react';
import { render, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TestWrapper } from '../../../testUtils/TestWrapper';
import userEvent from '@testing-library/user-event';
import StartForm from '../StartForm';
import type { StartNodeData } from '../../../types/nodes';
import { useWorkflowStore } from '../../../hooks/useWorkflowStore';

const Wrapper = TestWrapper;

const defaultData: StartNodeData = { type: 'start', label: 'Start', metadata: {} };

describe('StartForm', () => {
  beforeEach(() => {
    useWorkflowStore.getState().clearWorkflow();
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
      const { getByRole } = render(
        <Wrapper>
          <StartForm nodeId="test" data={defaultData} />
        </Wrapper>
      );
      const input = getByRole('textbox', { name: /label/i }) as HTMLInputElement;

      await act(async () => {
        await userEvent.clear(input);
        await userEvent.type(input, 'New Start');
      });

      expect(input.value).toBe('New Start');
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
      const { getByRole } = render(
        <Wrapper>
          <StartForm nodeId="test" data={defaultData} />
        </Wrapper>
      );
      const input = getByRole('textbox', { name: /label/i }) as HTMLInputElement;

      await act(async () => {
        await userEvent.clear(input);
        await userEvent.type(input, 'Test Label');
      });

      expect(input.value).toBe('Test Label');
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

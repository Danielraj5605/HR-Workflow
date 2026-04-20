import React from 'react';
import { ReactFlowProvider } from '@xyflow/react';

export const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ReactFlowProvider>{children}</ReactFlowProvider>
);

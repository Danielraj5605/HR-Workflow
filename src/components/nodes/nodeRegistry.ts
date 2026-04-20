// src/components/nodes/nodeRegistry.ts
import type { NodeTypes } from '@xyflow/react';
import { NodeType } from '../../types/nodes';
import StartNode from './StartNode';
import TaskNode from './TaskNode';
import ApprovalNode from './ApprovalNode';
import AutomatedStepNode from './AutomatedStepNode';
import EndNode from './EndNode';

export const nodeTypes: NodeTypes = {
  [NodeType.Start]:         StartNode,
  [NodeType.Task]:          TaskNode,
  [NodeType.Approval]:      ApprovalNode,
  [NodeType.AutomatedStep]: AutomatedStepNode,
  [NodeType.End]:           EndNode,
};

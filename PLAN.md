# HR Workflow Designer — Implementation Plan

> Based on: Tredence JD Case Study + [FlowForge HR](https://github.com/Madan2418/hr-workflow-designer) reference repo

---

## 0. Architecture Diagrams

### 0a. Application Layout

```
┌────────────────────────────────────────────────────────────────────────────┐
│  FlowForge HR                        Tredence Case Study      [AI-Pow] │  ← Header
├─────────┬──────────────────────────────────────────────────┬──────────────┤
│         │  [Zoom+] [Zoom-] [Fit] [↓Export] [↑Import] [🗑] │              │
│  NODE   ├──────────────────────────────────────────────────┤   Config     │
│ PALETTE │                                                   │ ─────────── │
│         │                                                   │  Simulate 🔴│
│ [Start] │           React Flow Canvas                       │ ─────────── │
│ [Task]  │        (dot-grid background)                      │   AI        │
│ [Approv]│                                                    │             │
│ [Auto]  │  ◉ ──────► ◉ ──────► ◉ ──────► ◉               │  (tab       │
│ [End]   │                                                    │  content    │
│         │              [Controls]        [MiniMap]            │  switches   │
│         │                                                    │  here)      │
└─────────┴──────────────────────────────────────────────────┴──────────────┘
└────────┘          └──────────────────────────────────────┘  └───────────┘
   Sidebar                    Canvas                      RightPanel (tabs)
```

### 0b. Component Hierarchy

```
App
├── Header                        # Logo, app name, badge, AI pill
├── Sidebar                       # Draggable node palette
│   └── SidebarItem × 5          # (start/task/approval/automatedStep/end)
├── WorkflowCanvas                # ReactFlow provider
│   ├── Background                # Dot-grid
│   ├── Controls                  # Zoom +/-, fit
│   ├── MiniMap                   # Colored by node type
│   ├── BaseNode × N              # (StartNode / TaskNode / ApprovalNode /
│   │                               #  AutomatedStepNode / EndNode)
│   └── Edge × N                  # (animated, purple, default)
├── RightPanel (tabs)
│   ├── Config (tab active when node selected)
│   │   └── NodeFormPanel
│   │       ├── StartForm
│   │       ├── TaskForm
│   │       ├── ApprovalForm
│   │       ├── AutomatedStepForm
│   │       └── EndForm
│   ├── Simulate
│   │   ├── ValidationBanner
│   │   ├── [Run Simulation]
│   │   └── ExecutionLog
│   │       └── ExecutionLogEntry × N
│   └── AI
│       ├── [Analyze with AI]
│       └── AIInsightCard × N
└── CanvasToolbar                 # Zoom, fit, export, import, clear
```

### 0c. State & Data Flow

```
User drags node
      │
      ▼
Sidebar onDragStart            ┌──────────────────────────────────┐
  (sets dataTransfer type)      │      Zustand Store               │
                                 │  useWorkflowStore               │
      │                          │  ┌─────────────────────────────┐ │
      ▼                          │  │ nodes: Node[]               │ │
WorkflowCanvas onDrop            │  │ edges: Edge[]                │ │
  screenToFlowPosition()         │  │ selectedNodeId: string|null │ │
  addNode(type, position)  ─────┼─►│ onNodesChange()              │ │
                                 │  │ onEdgesChange()              │ │
      │                          │  │ updateNodeData(id, data)     │ │
      ▼                          │  │ addNode() / deleteNode()     │ │
 React Flow re-renders           │  └─────────────────────────────┘ │
      │                          └──────────────────────────────────┘
      ▼                                   │
NodeFormPanel (reads selectedNodeId)      │ updateNodeData()
  renders form by data.type              ▼
  controlled inputs                 useWorkflowStore subscribers
  debounced 300ms ──────────────────► nodes[id].data updated
  updateNodeData(nodeId, patch)         │
                                        ▼
                              BaseNode re-renders (only this node)
                              ValidationBanner re-computes errors
```

### 0d. Simulation Execution Flow (Kahn's Topological Sort)

```
POST /simulate { workflow: WorkflowGraph }
      │
      ▼
┌─────────────────────────────────────────┐
│  Build adjacency list + in-degree map   │
└─────────────────┬───────────────────────┘
                  │
                  ▼
         ┌────────────────────┐
         │ Queue all nodes    │  in-degree === 0
         │  in execution order│
         └─────────┬──────────┘
                   │
    ┌──────────────┼──────────────┐
    ▼              ▼              ▼
 [start]       [task]      [approval]
  status=       status=       autoApproveThreshold
  completed     completed         │
                               ┌───┴────┐
                               │  > 0   │  === 0
                               ▼        ▼
                          completed   pending
                                        │
                                        ▼
                               hitPending = true
                               downstream → skipped
                   │
                   ▼
         ┌────────────────────┐
         │ SimulationResult   │
         │  { steps, summary } │
         └────────────────────┘
```

---

## 1. Folder Structure

```
src/
├── App.tsx                          # Root layout: Header | Sidebar | Canvas | RightPanel (tabs)
├── main.tsx                         # MSW worker init → React mount
├── index.css                        # Tailwind directives + React Flow CSS overrides
│
├── types/
│   ├── nodes.ts                     # NodeType enum, 5 data interfaces, discriminated union
│   ├── workflow.ts                  # WorkflowGraph, SimulationStep, SimulationResult,
│   │                                #   ValidationError, AIAnalysis, ExecutionLogEntry
│   └── api.ts                      # AutomationAction, SimulatePayload
│
├── api/
│   ├── index.ts                     # Barrel: exports getAutomations, simulateWorkflow, analyzeWorkflow
│   ├── automations.ts               # GET /automations fetch wrapper
│   ├── simulate.ts                 # POST /simulate fetch wrapper
│   └── analyze.ts                   # Direct Anthropic API fetch with prompt builder
│
├── components/
│   ├── canvas/
│   │   ├── WorkflowCanvas.tsx      # ReactFlow provider, drag-drop zone, minimap, controls, empty state
│   │   ├── Sidebar.tsx             # Draggable node palette (5 types)
│   │   └── CanvasToolbar.tsx       # Zoom in/out, fit view, export JSON, import JSON, clear
│   │
│   ├── nodes/
│   │   ├── nodeRegistry.ts          # { [NodeType]: Component } map for ReactFlow
│   │   ├── BaseNode.tsx            # Shared shell: handles, delete button, validation ring, icon header
│   │   ├── StartNode.tsx           # Start node (no target handle)
│   │   ├── TaskNode.tsx            # Task node with assignee + due date display
│   │   ├── ApprovalNode.tsx         # Approval node with role + auto-approve threshold display
│   │   ├── AutomatedStepNode.tsx  # Automated node with action ID display
│   │   └── EndNode.tsx             # End node (no source handle)
│   │
│   ├── forms/
│   │   ├── NodeFormPanel.tsx        # Discriminated union switch → renders correct form by type
│   │   ├── StartForm.tsx           # label + KeyValueInput metadata
│   │   ├── TaskForm.tsx            # label, description, assignee, dueDate, customFields
│   │   ├── ApprovalForm.tsx        # label, approverRole select, autoApproveThreshold number
│   │   ├── AutomatedStepForm.tsx   # label, action select (from /automations), dynamic params
│   │   ├── EndForm.tsx             # label, endMessage, showSummary toggle
│   │   └── KeyValueInput.tsx       # Reusable add/remove key-value pairs
│   │
│   ├── sandbox/
│   │   ├── SandboxPanel.tsx        # ValidationBanner + Run Simulation button + ExecutionLog + summary
│   │   ├── ExecutionLog.tsx         # Step-by-step timeline with status icons and colors
│   │   └── ValidationBanner.tsx    # Error/warning list banner
│   │
│   └── ai/
│       ├── AIAnalysisPanel.tsx      # API key warning, Analyze button, issues/suggestions/summary display
│       └── AIInsightCard.tsx       # Colored card per insight category
│
├── hooks/
│   ├── useWorkflowStore.ts          # Zustand store: nodes, edges, selectedNodeId, CRUD operations,
│   │                                #   onNodesChange, onEdgesChange, onConnect
│   ├── useDragDrop.ts               # onDragOver + onDrop handlers for sidebar drag
│   ├── useSimulate.ts               # Calls /simulate, manages loading/error/result state
│   ├── useValidation.ts             # useMemo over validateWorkflow(nodes, edges)
│   └── useAIAnalysis.ts             # Calls Anthropic API, manages loading/error/analysis state
│
├── mocks/
│   ├── browser.ts                   # MSW setupWorker with handlers
│   ├── handlers/
│   │   │   ├── automations.handler.ts  # GET /automations → 6 mock actions
│   │   │   └── simulate.handler.ts     # POST /simulate → topological sort + status simulation
│   │   └── data/
│   │       └── automations.data.ts     # 6 automation actions: send_email, generate_doc, etc.
│   │
├── store/
│   └── (handled in hooks/useWorkflowStore.ts)  # Zustand store IS the persistence layer
│
└── utils/
    ├── nanoid.ts                     # Lightweight unique ID (inline, no external package)
    ├── cycleDetector.ts             # DFS-based directed cycle detection → boolean
    ├── workflowValidator.ts         # validateWorkflow() → ValidationError[] (start/end/cycles/disconnected)
    └── graphSerializer.ts          # serializeGraph() → clean WorkflowGraph JSON
```

---

## 2. Component Breakdown

### Canvas Layer

| Component | Purpose | Key Props |
|-----------|---------|-----------|
| `WorkflowCanvas` | ReactFlow provider; drag-drop zone, minimap, controls, dot-grid background | — |
| `Sidebar` | 5 draggable node palette items (icon + label + description + color tint) | `onDragStart` |
| `CanvasToolbar` | ZoomIn/Out, FitView, Export JSON, Import JSON (file upload), Clear canvas | `onExport`, `onImport`, `onClear` |

### Node Components

| Component | Purpose | Key Props |
|-----------|---------|-----------|
| `BaseNode` | Shared shell: colored header bar with icon + type label, source+target handles (conditional), delete button (top-right), validation ring, selection ring | `nodeId`, `data`, `type`, `selected`, `error`, `warning` |
| `StartNode` | Green (#22c55e) header, Play icon, source handle (right), no target handle | `data: StartNodeData` |
| `TaskNode` | Indigo (#6366f1) header, ClipboardList icon, assignee + due date display | `data: TaskNodeData` |
| `ApprovalNode` | Amber (#f59e0b) header, ShieldCheck icon, approverRole + threshold display | `data: ApprovalNodeData` |
| `AutomatedStepNode` | Cyan (#06b6d4) header, Zap icon, action label display | `data: AutomatedStepNodeData` |
| `EndNode` | Red (#ef4444) header, Flag icon, target handle (left), no source handle | `data: EndNodeData` |

### Form Components

| Component | Purpose | Key Props |
|-----------|---------|-----------|
| `NodeFormPanel` | Discriminated union router — renders correct form based on `selectedNode.data.type` | `nodeId` |
| `StartForm` | `label` input + `metadata` key-value editor | `nodeId`, `data`, `onChange` |
| `TaskForm` | `label`, `description`, `assignee`, `dueDate`, `customFields` (key-value) | `nodeId`, `data`, `onChange` |
| `ApprovalForm` | `label`, `approverRole` select (Manager/HRBP/Director), `autoApproveThreshold` number | `nodeId`, `data`, `onChange` |
| `AutomatedStepForm` | `label`, `action` dropdown (fetches from `/automations`), dynamic `params` per selected action | `nodeId`, `data`, `onChange` |
| `EndForm` | `label`, `endMessage`, `showSummary` toggle | `nodeId`, `data`, `onChange` |
| `KeyValueInput` | Add/edit/remove rows for any key-value collection; converts to/from `Record<string, string>` | `value`, `onChange` |

### Simulation Components

| Component | Purpose |
|-----------|--------|
| `SandboxPanel` | Right panel Simulate tab: ValidationBanner + Run Simulation button + ExecutionLog + plain-English summary |
| `ExecutionLog` | Step-by-step timeline; per-step: status icon (completed/pending/skipped/error), node type, duration, detail string |
| `ValidationBanner` | Error (red) + warning (amber) list; blocks simulation when errors exist |

### AI Components

| Component | Purpose |
|-----------|--------|
| `AIAnalysisPanel` | Right panel AI tab: API key warning, Analyze button, colored insight cards for issues/suggestions/summary |
| `AIInsightCard` | Single insight card: colored left border (red=issue, green=suggestion, blue=summary), title + body text |

---

## 3. TypeScript Interfaces

### Node Types

```typescript
// src/types/nodes.ts

export const NodeType = {
  Start:         'start',
  Task:          'task',
  Approval:      'approval',
  AutomatedStep: 'automatedStep',
  End:           'end',
} as const;
export type NodeType = typeof NodeType[keyof typeof NodeType];

// Discriminated union — data.type is the discriminant
export interface StartNodeData {
  type: 'start';
  label: string;
  metadata: Record<string, string>;  // key-value pairs from KeyValueInput
}

export interface TaskNodeData {
  type: 'task';
  label: string;
  description: string;
  assignee: string;
  dueDate: string;         // ISO date string
  customFields: Record<string, string>;
}

export interface ApprovalNodeData {
  type: 'approval';
  label: string;
  approverRole: 'Manager' | 'HRBP' | 'Director';
  autoApproveThreshold: number;  // days; 0 = requires manual approval
}

export interface AutomatedStepNodeData {
  type: 'automatedStep';
  label: string;
  actionId: string;        // references an AutomationAction.id
  actionLabel: string;    // display label for the action
  params: Record<string, string>;  // dynamic key-value params per action
}

export interface EndNodeData {
  type: 'end';
  label: string;
  endMessage: string;
  showSummary: boolean;
}

export type WorkflowNodeData =
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutomatedStepNodeData
  | EndNodeData;
```

### Workflow Types

```typescript
// src/types/workflow.ts

export interface WorkflowGraph {
  nodes: Node<WorkflowNodeData>[];
  edges: Edge[];
}

export type SimulationStatus = 'completed' | 'pending' | 'skipped' | 'error';

export interface SimulationStep {
  nodeId: string;
  nodeLabel: string;
  nodeType: NodeType;
  status: SimulationStatus;
  duration: number;       // mocked seconds
  detail: string;        // human-readable explanation
  timestamp: string;     // ISO 8601
}

export interface SimulationResult {
  steps: SimulationStep[];
  summary: string;       // "Workflow completed successfully." or similar
  totalDuration: number;
}

export interface ValidationError {
  nodeId?: string;
  type: 'start_count' | 'end_count' | 'cycle' | 'disconnected' | 'missing_edge';
  message: string;
  severity: 'error' | 'warning';
}

export interface AIAnalysis {
  issues: string[];
  suggestions: string[];
  summary: string;
}
```

### API Types

```typescript
// src/types/api.ts

export interface AutomationAction {
  id: string;
  label: string;
  params: string[];    // parameter names for this action
}

export interface SimulatePayload {
  workflow: WorkflowGraph;
}

// Note: /automations GET returns AutomationAction[] directly (array, not wrapped)
// POST /simulate body: SimulatePayload
// POST /analyze body: { workflow: WorkflowGraph } → AIAnalysis
```

---

## 4. State Management Strategy

Single **Zustand store** (`useWorkflowStore.ts`). Selector-based subscriptions prevent re-renders during drag (React Flow fires hundreds of position updates).

```typescript
interface WorkflowStore {
  // Core graph state
  nodes: Node<WorkflowNodeData>[];
  edges: Edge[];

  // Selection (only this triggers Config panel re-render)
  selectedNodeId: string | null;

  // React Flow change handlers — pass directly to <ReactFlow>
  onNodesChange: OnNodesChange<Node<WorkflowNodeData>>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;

  // Selection actions
  setSelectedNode: (id: string | null) => void;

  // Node data mutation (partial merge into existing node data)
  updateNodeData: (id: string, data: Partial<WorkflowNodeData>) => void;

  // Graph CRUD
  addNode: (type: NodeType, position: XYPosition) => void;
  deleteNode: (id: string) => void;
  clearWorkflow: () => void;
  importWorkflow: (nodes: Node<WorkflowNodeData>[], edges: Edge[]) => void;

  // Selector helpers (used by components to avoid unnecessary re-renders)
  getNodeById: (id: string) => Node<WorkflowNodeData> | undefined;
}
```

**No backend persistence.** The only persistence is manual Export JSON / Import JSON via file upload. This matches the reference repo exactly.

---

## 5. React Flow Architecture

### Node Registry

```typescript
// src/components/nodes/nodeRegistry.ts
export const nodeTypes: NodeTypes = {
  [NodeType.Start]:         StartNode,
  [NodeType.Task]:          TaskNode,
  [NodeType.Approval]:      ApprovalNode,
  [NodeType.AutomatedStep]: AutomatedStepNode,
  [NodeType.End]:           EndNode,
};
```

### Custom BaseNode Shell

Every node type wraps itself in `BaseNode`, which provides:
- Colored header bar (color per node type)
- Source handle (right side) — omitted for `End`
- Target handle (left side) — omitted for `Start`
- Delete button (top-right, visible on hover)
- Validation ring: `2px solid` border — red (error), amber (warning), none (ok)
- Selection ring: accent-colored border when selected

### Canvas Configuration

```tsx
<ReactFlow
  nodes={nodes}
  edges={edges}
  nodeTypes={nodeTypes}
  onNodesChange={onNodesChange}
  onEdgesChange={onEdgesChange}
  onConnect={onConnect}
  onNodeClick={onNodeClick}
  onPaneClick={onPaneClick}
  deleteKeyCode="Delete"
  fitView
  defaultEdgeOptions={{ animated: true, style: { stroke: '#6366f1', strokeWidth: 2 } }}
>
  <Background variant={BackgroundVariant.Dots} color="#2e3148" gap={20} size={1.2} />
  <Controls position="bottom-left" />
  <MiniMap
    position="bottom-right"
    nodeColor={(node) => NODE_COLORS[node.type as NodeType]}
    maskColor="#0f111799"
  />
</ReactFlow>
```

### Drag and Drop

- Sidebar items: `draggable`, `onDragStart` sets `dataTransfer='application/reactflow'` with the node type string
- Canvas: `onDragOver` (prevent default) + `onDrop` reads the type, calls `screenToFlowPosition()` for canvas-relative coordinates, then `addNode(type, position)`

### Edge Styling

Default animated purple edges (`animated: true`, `stroke: '#6366f1'`). No custom edge components needed — the reference repo uses the default animated edge exclusively.

---

## 6. Mock API Design

### Endpoints

| Method | Path | Handler | Response |
|--------|------|---------|----------|
| GET | `/automations` | `automationsHandler` | `AutomationAction[]` — 6 actions from `automations.data.ts` |
| POST | `/simulate` | `simulateHandler` | `SimulationResult` — topological sort + status simulation |
| POST | `https://api.anthropic.com/v1/messages` | `analyze.ts` (direct) | `AIAnalysis` — Claude API call |

### `GET /automations` Mock Data

```typescript
// src/mocks/data/automations.data.ts
[
  { id: 'send_email',       label: 'Send Email',         params: ['to', 'subject'] },
  { id: 'generate_doc',     label: 'Generate Document',  params: ['template', 'recipient'] },
  { id: 'notify_slack',     label: 'Notify Slack',        params: ['channel', 'message'] },
  { id: 'create_jira',      label: 'Create Jira Ticket',  params: ['project', 'title'] },
  { id: 'update_hris',      label: 'Update HRIS Record',  params: ['employeeId', 'field', 'value'] },
  { id: 'schedule_meeting', label: 'Schedule Meeting',    params: ['attendees', 'agenda', 'date'] },
]
```

### `POST /simulate` Logic (Kahn's Topological Sort)

```
1. Build adjacency list + in-degree map from edges
2. Queue all nodes with in-degree 0
3. While queue not empty:
   a. Dequeue node N
   b. If any predecessor has status 'pending' → N.status = 'skipped'
   c. Else if N.type === 'approval':
        - autoApproveThreshold > 0 → N.status = 'completed'
        - autoApproveThreshold === 0 → N.status = 'pending', set hitPending = true
      Else → N.status = 'completed'
4. Return steps[] + summary string
```

Mock durations per node type: `start=0s`, `task=3s`, `approval=2s`, `automatedStep=1s`, `end=0s`.

### `POST /analyze` (Anthropic Direct)

Calls `https://api.anthropic.com/v1/messages` directly with `VITE_ANTHROPIC_API_KEY`. Prompt builder constructs a detailed workflow description + asks for JSON with `issues[]`, `suggestions[]`, `summary` fields.

---

## 7. Form Architecture

### Pattern

`NodeFormPanel` reads `selectedNodeId` from store → finds the node → dispatches to the correct form by `data.type`.

```typescript
// NodeFormPanel.tsx
switch (node.data.type) {
  case 'start':         return <StartForm         nodeId={nodeId} data={node.data} />;
  case 'task':          return <TaskForm          nodeId={nodeId} data={node.data} />;
  case 'approval':      return <ApprovalForm       nodeId={nodeId} data={node.data} />;
  case 'automatedStep': return <AutomatedStepForm  nodeId={nodeId} data={node.data} />;
  case 'end':           return <EndForm           nodeId={nodeId} data={node.data} />;
}
```

Each form:
1. Reads its node's full `data` on mount
2. Renders controlled inputs/textareas/selects
3. On every change → calls `updateNodeData(nodeId, partialData)` (debounced 300ms for text fields)
4. No local "save" button — state is live

---

## 8. Implementation Order

### Phase 1: Project Foundation
1. Vite + React 18 + TypeScript scaffold
2. Install: `@xyflow/react`, `zustand`, `lucide-react`, `tailwindcss`, `autoprefixer`, `postcss`
3. Configure `tailwind.config.js` with dark palette (canvas/surface/accent/indigo/amber/cyan/red/green)
4. Configure `index.css` with Tailwind directives + React Flow dot-grid/minimap/handle overrides
5. Set up `.env.example` with `VITE_ANTHROPIC_API_KEY`
6. Set up `eslint.config.js` (flat config)

### Phase 2: Types + Utilities
7. Implement `src/types/nodes.ts` — `NodeType` const + 5 data interfaces + union type
8. Implement `src/types/workflow.ts` — `WorkflowGraph`, `SimulationStep`, `SimulationResult`, `ValidationError`, `AIAnalysis`
9. Implement `src/types/api.ts` — `AutomationAction`, `SimulatePayload`
10. Implement `src/utils/nanoid.ts` — inline ID generator (no external package)
11. Implement `src/utils/cycleDetector.ts` — DFS cycle detection
12. Implement `src/utils/workflowValidator.ts` — `validateWorkflow()` returning `ValidationError[]`
13. Implement `src/utils/graphSerializer.ts` — `serializeGraph()`

### Phase 3: Zustand Store
14. Implement `src/hooks/useWorkflowStore.ts` — full store with selectors for nodes/edges/selection CRUD + React Flow handlers

### Phase 4: Node Components
15. Implement `src/components/nodes/BaseNode.tsx` — shared shell (handles, delete, validation ring, header)
16. Implement `src/components/nodes/StartNode.tsx`
17. Implement `src/components/nodes/TaskNode.tsx`
18. Implement `src/components/nodes/ApprovalNode.tsx`
19. Implement `src/components/nodes/AutomatedStepNode.tsx`
20. Implement `src/components/nodes/EndNode.tsx`
21. Implement `src/components/nodes/nodeRegistry.ts` — node type registry map

### Phase 5: Canvas + Sidebar + Toolbar
22. Implement `src/hooks/useDragDrop.ts` — `onDragOver` + `onDrop` handlers
23. Implement `src/components/canvas/Sidebar.tsx` — 5 draggable palette items with icons and descriptions
24. Implement `src/components/canvas/CanvasToolbar.tsx` — ZoomIn/ZoomOut/FitView/Export/Import/Clear
25. Implement `src/components/canvas/WorkflowCanvas.tsx` — ReactFlow wrapper with all decorators (Background, Controls, MiniMap), empty state

### Phase 6: Forms + Config Panel
26. Implement `src/components/forms/KeyValueInput.tsx` — reusable key-value editor
27. Implement `src/components/forms/StartForm.tsx`
28. Implement `src/components/forms/TaskForm.tsx`
29. Implement `src/components/forms/ApprovalForm.tsx`
30. Implement `src/components/forms/AutomatedStepForm.tsx` — fetches `/automations` for action dropdown
31. Implement `src/components/forms/EndForm.tsx`
32. Implement `src/components/forms/NodeFormPanel.tsx` — discriminated union router

### Phase 7: Simulation (Sandbox)
33. Implement `src/mocks/handlers/automations.handler.ts` + `src/mocks/data/automations.data.ts`
34. Implement `src/mocks/handlers/simulate.handler.ts` — Kahn's topological sort + status assignment logic
35. Set up `src/mocks/browser.ts` with MSW `setupWorker`
36. Wire MSW worker in `src/main.tsx`
37. Implement `src/hooks/useSimulate.ts` — async caller for POST /simulate
38. Implement `src/components/sandbox/ValidationBanner.tsx`
39. Implement `src/components/sandbox/ExecutionLog.tsx` — step-by-step timeline
40. Implement `src/components/sandbox/SandboxPanel.tsx` — full Simulate tab (ValidationBanner + Run button + ExecutionLog + summary)

### Phase 8: AI Analysis
41. Implement `src/api/analyze.ts` — direct Anthropic API fetch
42. Implement `src/hooks/useAIAnalysis.ts` — async caller for AI analysis
43. Implement `src/components/ai/AIInsightCard.tsx`
44. Implement `src/components/ai/AIAnalysisPanel.tsx` — full AI tab

### Phase 9: Right Panel + App Shell
45. Build right panel shell with 3 tabs: Config / Simulate / AI (icon + label per tab)
46. Implement App.tsx root layout: Header (logo, name, badge, AI pill) | Sidebar | Canvas | RightPanel tabs
47. Wire up RightPanel tab switching based on selected node + simulation state

### Phase 10: Polish
48. `useValidation` hook — `useMemo` over `validateWorkflow`
49. Wire validation error ring onto `BaseNode`
50. `useWorkflowValidation` badge count on Simulate tab
51. Empty state component in `WorkflowCanvas`
52. Final edge cases: delete cascade (removing a node removes its edges), orphan edge cleanup

---

## 9. Assumptions

| # | Assumption |
|---|------------|
| 1 | **Tech stack**: Vite + React 18 + TypeScript. React Flow v12 (`@xyflow/react`). Zustand for state. Tailwind CSS for styling. Lucide React for icons. MSW v2 for API mocking. |
| 2 | **Backend**: Fully mocked in-browser via MSW. No real server. No persistence beyond manual Export/Import JSON. |
| 3 | **Start node**: Exactly one Start node required. Validation fails with `start_count` error if 0 or >1 present. |
| 4 | **End node**: At least one End node required. Validation fails with `end_count` error if none present. |
| 5 | **Simulation**: Executes in-memory. Kahn's topological sort determines execution order. Tracks `hitPending` flag to mark downstream nodes as `skipped`. |
| 6 | **Approval nodes**: `autoApproveThreshold > 0` → always `completed`. `autoApproveThreshold === 0` → `pending` and blocks downstream. |
| 7 | **Node deletion**: When a node is deleted, all edges connected to it are also removed (handled by React Flow's `onNodesChange` / `onEdgesChange`). |
| 8 | **Drag during simulation**: Simulation state is cleared when the graph changes. |
| 9 | **Forms**: All forms are controlled. Every field change updates Zustand store immediately (debounced 300ms for text). No "save" button per form — state is live. |
| 10 | **Custom fields**: `TaskNode` and `StartNode` both support `customFields`/`metadata` via `KeyValueInput`. |
| 11 | **AutomatedStep params**: Fetched from `GET /automations` at form mount time. Dynamic fields appear based on selected `actionId`. |
| 12 | **AI Analysis**: Requires `VITE_ANTHROPIC_API_KEY` in `.env.local`. MSW is configured with `onUnhandledRequest: 'bypass'` so the Anthropic API call passes through. |
| 13 | **Delete key**: React Flow native `deleteKeyCode="Delete"` handles node/edge deletion. No custom keyboard shortcut needed. |
| 14 | **Node IDs**: Generated via `nanoid()` utility — `Math.random().toString(36).slice(2,9) + Date.now().toString(36)`. |
| 15 | **No undo/redo**: Not included in the reference repo. Not included in this plan. |

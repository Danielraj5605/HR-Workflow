# HR Workflow Designer — Test Cases & Testing Guide

> **Project:** Tredence Studio — HR Workflow Designer Module  
> **Stack:** React + TypeScript + Vite + React Flow + Tailwind CSS  
> **Testing Tools:** Jest, React Testing Library (RTL), Cypress / Playwright, MSW

---

## Table of Contents

1. [Unit Tests — Node Components](#1-unit-tests--node-components)
2. [Unit Tests — Node Configuration Forms](#2-unit-tests--node-configuration-forms)
3. [Unit Tests — Custom Hooks](#3-unit-tests--custom-hooks)
4. [Unit Tests — Mock API Layer](#4-unit-tests--mock-api-layer)
5. [Unit Tests — Utility & Validation Functions](#5-unit-tests--utility--validation-functions)
6. [Integration Tests — Canvas Interactions](#6-integration-tests--canvas-interactions)
7. [Integration Tests — Workflow Sandbox / Simulate Panel](#7-integration-tests--workflow-sandbox--simulate-panel)
8. [E2E Tests — Full User Flows](#8-e2e-tests--full-user-flows)
9. [Edge Cases & Negative Tests](#9-edge-cases--negative-tests)
10. [Accessibility Tests](#10-accessibility-tests)
11. [Performance Tests](#11-performance-tests)
12. [Test Coverage Targets](#12-test-coverage-targets)

---

## 1. Unit Tests — Node Components

> **Tool:** Jest + React Testing Library  
> **Location:** `src/components/nodes/__tests__/`

---

### 1.1 Start Node

| ID | Test Case | Input | Expected Output | Priority | Status |
|----|-----------|-------|-----------------|----------|---------|
| SN-01 | Renders Start Node with default label | Mount `<StartNode />` | Displays "Start" label | High | **PASS** |
| SN-02 | Renders correct node color/style | Mount `<StartNode />` | Has green border/indicator | Medium | N/A |
| SN-03 | Has only an output handle (no input handle) | Mount `<StartNode />` | Output handle present, input handle absent | High | **PASS** |
| SN-04 | Selected state applies highlight | Pass `selected=true` prop | Node has selected CSS class | Medium | **PASS** |
| SN-05 | Displays custom title when set | Pass `data.title="Onboarding Start"` | Renders "Onboarding Start" | High | **PASS** |

---

### 1.2 Task Node

| ID | Test Case | Input | Expected Output | Priority | Status |
|----|-----------|-------|-----------------|----------|---------|
| TN-01 | Renders Task Node with title | Pass `data.title="Collect Documents"` | Title visible on node | High | **PASS** |
| TN-02 | Renders assignee when provided | Pass `data.assignee="John Doe"` | Assignee shown on node body | Medium | **PASS** |
| TN-03 | Renders due date when provided | Pass `data.dueDate="2025-12-01"` | Due date visible | Medium | **PASS** |
| TN-04 | Has both input and output handles | Mount `<TaskNode />` | Both handles present | High | **PASS** |
| TN-05 | Shows placeholder when no description set | Mount with empty description | Placeholder text displayed | Low | **PASS** |

---

### 1.3 Approval Node

| ID | Test Case | Input | Expected Output | Priority | Status |
|----|-----------|-------|-----------------|----------|---------|
| AN-01 | Renders Approval Node with approver role | Pass `data.approverRole="Manager"` | "Manager" visible on node | High | **PASS** |
| AN-02 | Renders auto-approve threshold | Pass `data.autoApproveThreshold=3` | Threshold shown | Medium | **PASS** |
| AN-03 | Has both input and output handles | Mount `<ApprovalNode />` | Both handles present | High | **PASS** |
| AN-04 | Has distinct visual style from Task Node | Mount both nodes | Different color/icon | Medium | N/A |

---

### 1.4 Automated Step Node

| ID | Test Case | Input | Expected Output | Priority | Status |
|----|-----------|-------|-----------------|----------|---------|
| AS-01 | Renders action label | Pass `data.actionId="send_email"` | Displays "Send Email" | High | **PASS** |
| AS-02 | Shows action parameters | Pass params `{to: "hr@co.com"}` | Params visible or indicated | Medium | **PASS** |
| AS-03 | Shows loading state when action not loaded | `data.actionId=null` | Shows placeholder/spinner | Medium | **PASS** |
| AS-04 | Has both input and output handles | Mount `<AutomatedStepNode />` | Both handles present | High | **PASS** |

---

### 1.5 End Node

| ID | Test Case | Input | Expected Output | Priority | Status |
|----|-----------|-------|-----------------|----------|---------|
| EN-01 | Renders End Node with end message | Pass `data.endMessage="Complete"` | Message visible | High | **PASS** |
| EN-02 | Shows summary flag indicator | Pass `data.summaryFlag=true` | Summary badge or icon shown | Medium | **PASS** |
| EN-03 | Has only an input handle (no output handle) | Mount `<EndNode />` | Input handle present, output absent | High | **PASS** |
| EN-04 | Renders correct terminal styling | Mount `<EndNode />` | Red border or distinct color | Medium | **PASS** |

---

## 2. Unit Tests — Node Configuration Forms

> **Tool:** Jest + React Testing Library  
> **Location:** `src/components/forms/__tests__/`

---

### 2.1 Start Node Form

| ID | Test Case | Input | Expected Output | Priority |
|----|-----------|-------|-----------------|----------|
| SF-01 | Renders title input field | Mount `<StartNodeForm />` | Title input visible | High |
| SF-02 | Title input is required — shows error on empty submit | Submit with empty title | Validation error shown | High |
| SF-03 | Can add metadata key-value pair | Click "Add Metadata", fill in key/value | New row appears | Medium |
| SF-04 | Can remove a metadata row | Click delete on a metadata row | Row removed from list | Medium |
| SF-05 | onChange fires with updated values | Type in title field | `onChange` called with new value | High |
| SF-06 | Populated with existing data on open | Pass existing node data | Fields pre-filled correctly | High |

---

### 2.2 Task Node Form

| ID | Test Case | Input | Expected Output | Priority |
|----|-----------|-------|-----------------|----------|
| TF-01 | Title field is required | Submit with empty title | Error: "Title is required" | High |
| TF-02 | Description field accepts multiline text | Type multiline input | Text saved correctly | Medium |
| TF-03 | Assignee field accepts string input | Type "Alice Smith" | Value saved | High |
| TF-04 | Due date field accepts valid date | Enter "2025-12-31" | Date stored in state | High |
| TF-05 | Due date field rejects invalid format | Enter "not-a-date" | Validation error or rejection | Medium |
| TF-06 | Can add custom key-value fields | Click "Add Field" | New custom field row added | Medium |
| TF-07 | Can remove custom fields | Click delete on custom field | Field removed | Medium |
| TF-08 | All fields update form state correctly | Fill all fields | onChange emits complete object | High |

---

### 2.3 Approval Node Form

| ID | Test Case | Input | Expected Output | Priority |
|----|-----------|-------|-----------------|----------|
| AF-01 | Title field renders and is required | Submit empty | Validation error shown | High |
| AF-02 | Approver role dropdown has correct options | Open dropdown | "Manager", "HRBP", "Director" visible | High |
| AF-03 | Approver role selection updates state | Select "HRBP" | State reflects "HRBP" | High |
| AF-04 | Auto-approve threshold accepts numbers only | Enter "abc" | Input rejected or error shown | Medium |
| AF-05 | Auto-approve threshold accepts 0 | Enter 0 | Accepted without error | Medium |
| AF-06 | Negative threshold shows validation error | Enter -1 | Error: invalid threshold | Medium |

---

### 2.4 Automated Step Node Form

| ID | Test Case | Input | Expected Output | Priority |
|----|-----------|-------|-----------------|----------|
| ASF-01 | Fetches and displays actions from mock API | Mount form | Dropdown populated with actions | High |
| ASF-02 | Selecting action updates parameter fields dynamically | Select "Send Email" | Shows "to" and "subject" fields | High |
| ASF-03 | Changing action clears previous parameters | Select "Send Email" then "Generate Document" | Old params cleared, new shown | High |
| ASF-04 | Shows loading state during API fetch | Before API resolves | Loading indicator shown | Medium |
| ASF-05 | Shows error state if API fails | Mock API error | Error message displayed | Medium |
| ASF-06 | Parameter values update state correctly | Fill all params | State has correct key-value pairs | High |

---

### 2.5 End Node Form

| ID | Test Case | Input | Expected Output | Priority |
|----|-----------|-------|-----------------|----------|
| EF-01 | End message field renders | Mount `<EndNodeForm />` | Text input visible | High |
| EF-02 | Summary flag toggle renders | Mount form | Toggle/checkbox visible | High |
| EF-03 | Summary flag toggles correctly | Click toggle | Boolean flips in state | High |
| EF-04 | End message updates state on change | Type "Workflow Complete" | State updated | High |

---

## 3. Unit Tests — Custom Hooks

> **Tool:** Jest + `@testing-library/react-hooks`  
> **Location:** `src/hooks/__tests__/`

---

### 3.1 useWorkflowState

| ID | Test Case | Expected Output | Priority |
|----|-----------|-----------------|----------|
| HK-01 | Initial state has empty nodes and edges arrays | `nodes=[]`, `edges=[]` | High |
| HK-02 | `addNode` adds a node to state | Call `addNode(mockNode)` → node in array | High |
| HK-03 | `removeNode` removes correct node by id | Call `removeNode("node-1")` → removed | High |
| HK-04 | `updateNode` updates only the target node | Call `updateNode("node-1", newData)` → only that node updated | High |
| HK-05 | `addEdge` adds an edge | Call `addEdge(mockEdge)` → edge in array | High |
| HK-06 | `removeEdge` removes correct edge | Call `removeEdge("edge-1")` → removed | High |
| HK-07 | `clearWorkflow` resets to empty state | Call `clearWorkflow()` → both arrays empty | Medium |

---

### 3.2 useNodeForm

| ID | Test Case | Expected Output | Priority |
|----|-----------|-----------------|----------|
| HK-08 | Returns correct initial values for node type | Pass `nodeType="task"` → task defaults | High |
| HK-09 | `updateField` updates a single field | Call `updateField("title", "Test")` → title updated | High |
| HK-10 | `validate` returns errors for required empty fields | Call `validate()` with empty title → errors object | High |
| HK-11 | `validate` returns no errors when form is valid | Fill all required fields → empty errors | High |
| HK-12 | `resetForm` resets to initial values | Call `resetForm()` → fields cleared | Medium |

---

### 3.3 useSimulation

| ID | Test Case | Expected Output | Priority |
|----|-----------|-----------------|----------|
| HK-13 | `isLoading` is false initially | Mount hook → `isLoading=false` | High |
| HK-14 | `isLoading` is true during API call | Start simulation → `isLoading=true` | High |
| HK-15 | `simulationResult` populated after success | Mock success response → results in state | High |
| HK-16 | `error` populated on API failure | Mock error → error message in state | High |
| HK-17 | `runSimulation` serializes workflow correctly | Call with nodes/edges → correct JSON sent | High |

---

## 4. Unit Tests — Mock API Layer

> **Tool:** Jest + MSW (Mock Service Worker)  
> **Location:** `src/api/__tests__/`

---

### 4.1 GET /automations

| ID | Test Case | Expected Output | Priority |
|----|-----------|-----------------|----------|
| API-01 | Returns list of automation actions | GET `/automations` → array with `id`, `label`, `params` | High |
| API-02 | Each action has required fields | Response items have `id`, `label`, `params` | High |
| API-03 | `send_email` action has correct params | `params: ["to", "subject"]` | High |
| API-04 | `generate_doc` action has correct params | `params: ["template", "recipient"]` | High |
| API-05 | Returns 200 status | GET request → status 200 | Medium |

---

### 4.2 POST /simulate

| ID | Test Case | Input | Expected Output | Priority |
|----|-----------|-------|-----------------|----------|
| API-06 | Returns step-by-step execution log | Valid workflow JSON | Array of execution steps | High |
| API-07 | Each step has node id and status | Response steps | `{nodeId, status, message}` per step | High |
| API-08 | Handles empty nodes array | `{nodes: [], edges: []}` | Error or empty steps returned | Medium |
| API-09 | Returns 400 for malformed JSON | Invalid body | Error response with message | Medium |
| API-10 | Response includes overall success/failure flag | Valid workflow | `{success: boolean, steps: [...]}` | High |

---

## 5. Unit Tests — Utility & Validation Functions

> **Tool:** Jest  
> **Location:** `src/utils/__tests__/`

---

### 5.1 Workflow Graph Validation

| ID | Test Case | Input | Expected Output | Priority |
|----|-----------|-------|-----------------|----------|
| UV-01 | Valid workflow passes validation | Linear start→task→end | `{valid: true, errors: []}` | High |
| UV-02 | Missing Start Node detected | Workflow with no Start Node | Error: "Workflow must have a Start Node" | High |
| UV-03 | Missing End Node detected | Workflow with no End Node | Error: "Workflow must have an End Node" | High |
| UV-04 | Multiple Start Nodes flagged | Two Start Nodes | Error: "Only one Start Node allowed" | High |
| UV-05 | Disconnected node detected | Node with no edges | Error: "Node X is disconnected" | High |
| UV-06 | Cycle in graph detected | A → B → A | Error: "Workflow contains a cycle" | High |
| UV-07 | Empty workflow flagged | No nodes, no edges | Error: "Workflow is empty" | Medium |
| UV-08 | Valid complex workflow passes | Multi-branch workflow | `{valid: true, errors: []}` | Medium |

---

### 5.2 Workflow Serialization

| ID | Test Case | Input | Expected Output | Priority |
|----|-----------|-------|-----------------|----------|
| SZ-01 | Serializes nodes correctly | Array of node objects | JSON with nodes array | High |
| SZ-02 | Serializes edges correctly | Array of edge objects | JSON with edges array | High |
| SZ-03 | Preserves node data in serialization | Node with form data | Data fields intact in JSON | High |
| SZ-04 | Deserialization restores workflow | Serialized JSON | Nodes and edges restored | Medium |
| SZ-05 | Handles special characters in field values | Title with quotes/unicode | Correctly escaped in JSON | Medium |

---

## 6. Integration Tests — Canvas Interactions

> **Tool:** Jest + RTL (with React Flow mocked or rendered)  
> **Location:** `src/components/canvas/__tests__/`

---

### 6.1 Sidebar & Drag-Drop

| ID | Test Case | Steps | Expected Output | Priority |
|----|-----------|-------|-----------------|----------|
| CI-01 | Sidebar renders all 5 node types | Mount canvas with sidebar | All node type buttons visible | High |
| CI-02 | Dragging a node type onto canvas adds it | Drag "Task Node" to canvas | Node appears on canvas | High |
| CI-03 | Node count increases after adding node | Add a node | `nodes.length` increases by 1 | High |
| CI-04 | Multiple nodes can be added | Add 3 different nodes | 3 nodes on canvas | High |

---

### 6.2 Node Selection & Form Panel

| ID | Test Case | Steps | Expected Output | Priority |
|----|-----------|-------|-----------------|----------|
| CI-05 | Clicking a node opens its config form | Click Task Node | Task Node form panel appears | High |
| CI-06 | Correct form renders for each node type | Click each node type | Matching form displayed | High |
| CI-07 | Clicking outside deselects node | Click canvas background | Form panel closes/hides | Medium |
| CI-08 | Form panel shows existing node data | Open form of configured node | Fields pre-populated | High |
| CI-09 | Updating form updates node data | Change title in form | Node on canvas shows new title | High |

---

### 6.3 Node Deletion

| ID | Test Case | Steps | Expected Output | Priority |
|----|-----------|-------|-----------------|----------|
| CI-10 | Delete key removes selected node | Select node, press Delete | Node removed from canvas | High |
| CI-11 | Deleting node removes connected edges | Delete connected node | Its edges also removed | High |
| CI-12 | Delete button in form panel removes node | Click delete in panel | Node removed | Medium |

---

### 6.4 Edge (Connection) Management

| ID | Test Case | Steps | Expected Output | Priority |
|----|-----------|-------|-----------------|----------|
| CI-13 | Connecting two nodes creates an edge | Drag from output handle to input handle | Edge appears | High |
| CI-14 | Cannot connect Start Node's input handle | Attempt to connect to Start input | Connection rejected | High |
| CI-15 | Cannot connect End Node's output handle | Attempt to connect from End output | Connection rejected | High |
| CI-16 | Clicking an edge selects it | Click on an edge | Edge highlighted | Medium |
| CI-17 | Deleting selected edge removes it | Select edge, press Delete | Edge removed | High |
| CI-18 | Duplicate edges between same nodes prevented | Connect A→B twice | Second connection rejected | Medium |

---

## 7. Integration Tests — Workflow Sandbox / Simulate Panel

> **Tool:** Jest + RTL + MSW  
> **Location:** `src/components/sandbox/__tests__/`

---

| ID | Test Case | Steps | Expected Output | Priority |
|----|-----------|-------|-----------------|----------|
| SB-01 | Simulate button is visible | Mount sandbox panel | "Run Simulation" button present | High |
| SB-02 | Clicking simulate calls POST /simulate | Click "Run Simulation" | API called with workflow JSON | High |
| SB-03 | Loading state shows during simulation | Click simulate (delayed response) | Loading spinner visible | Medium |
| SB-04 | Execution steps displayed after success | Mock success response | Step-by-step list rendered | High |
| SB-05 | Each step shows node name and status | Success response | Node name + "Success/Failed" per step | High |
| SB-06 | Error message shown on API failure | Mock failure response | Error text displayed to user | High |
| SB-07 | Validation errors prevent simulation | Disconnected node in workflow | Error shown, API not called | High |
| SB-08 | Simulation result clears on new run | Run, then run again | Previous result replaced | Medium |
| SB-09 | Empty workflow shows validation error | Click simulate with no nodes | "Workflow is empty" message | High |
| SB-10 | Panel displays cycle detection error | Create cyclic workflow, simulate | "Cycle detected" message | High |

---

## 8. E2E Tests — Full User Flows

> **Tool:** Cypress or Playwright  
> **Location:** `cypress/e2e/` or `e2e/`

---

### 8.1 Happy Path — Complete Onboarding Workflow

| ID | Test Case | Steps | Expected Output | Priority |
|----|-----------|-------|-----------------|----------|
| E2E-01 | Build and simulate a complete onboarding workflow | 1. Drag Start Node → 2. Add Task Node → 3. Add Approval Node → 4. Add End Node → 5. Connect all → 6. Run simulation | Simulation completes with all steps shown | High |

**Detailed Steps for E2E-01:**
1. Open the app
2. Drag "Start Node" from sidebar to canvas
3. Click Start Node → Set title "Onboarding Begin"
4. Drag "Task Node" → Set title "Collect Documents", Assignee "HR Team"
5. Drag "Approval Node" → Set Approver Role "Manager"
6. Drag "End Node" → Set message "Onboarding Complete"
7. Connect: Start → Task → Approval → End
8. Click "Run Simulation"
9. Assert: 4 steps displayed in execution log, all marked Success

---

### 8.2 Leave Approval Workflow

| ID | Test Case | Steps | Expected Output | Priority |
|----|-----------|-------|-----------------|----------|
| E2E-02 | Build leave approval flow with automated step | Start → Task (fill form) → Automated Step (send email) → Approval → End | All nodes connected, simulation runs | High |

---

### 8.3 Node Configuration Persistence

| ID | Test Case | Steps | Expected Output | Priority |
|----|-----------|-------|-----------------|----------|
| E2E-03 | Node data persists after closing and reopening form | Configure Task Node → click away → reopen form | All fields still populated | High |
| E2E-04 | Editing a node updates its canvas display | Change Task Node title to "Review Documents" | Canvas node shows new title | High |

---

### 8.4 Error Handling Flows

| ID | Test Case | Steps | Expected Output | Priority |
|----|-----------|-------|-----------------|----------|
| E2E-05 | Disconnected node blocks simulation | Add isolated node → click simulate | Error message visible, simulation blocked | High |
| E2E-06 | Missing Start Node blocks simulation | Build workflow without Start → simulate | "Must have a Start Node" error | High |
| E2E-07 | Required form fields show errors | Open Task form → submit without title | "Title is required" error visible | High |

---

### 8.5 Bonus Feature — Export/Import (if implemented)

| ID | Test Case | Steps | Expected Output | Priority |
|----|-----------|-------|-----------------|----------|
| E2E-08 | Export workflow as JSON | Build workflow → click Export | JSON file downloaded | Low |
| E2E-09 | Import workflow from JSON | Click Import → upload saved JSON | Workflow restored on canvas | Low |
| E2E-10 | Imported workflow is simulatable | Import → simulate | Simulation runs successfully | Low |

---

## 9. Edge Cases & Negative Tests

| ID | Test Case | Input / Scenario | Expected Output | Priority |
|----|-----------|------------------|-----------------|----------|
| EC-01 | Very long node title | 500-character title in Task Node | Truncated in display, full text in form | Medium |
| EC-02 | Special characters in form fields | `<script>alert(1)</script>` in title | Rendered as plain text, not executed | High |
| EC-03 | Rapid clicking of simulate button | Click "Run" 10 times fast | Only one API call made (debounced) | Medium |
| EC-04 | Adding 50+ nodes to canvas | Drag 50 nodes | No crash, canvas remains responsive | Medium |
| EC-05 | Metadata with duplicate keys | Add two metadata rows with same key | Warning shown or last value wins | Low |
| EC-06 | Auto-approve threshold of 0 | Set threshold to 0 | Accepted, no error | Medium |
| EC-07 | Task node with no assignee | Leave assignee blank | Allowed, no error (optional field) | Medium |
| EC-08 | Network failure during automation fetch | API offline when Automated Step form opens | Error state shown gracefully | High |
| EC-09 | Workflow with only Start and End | No middle nodes, connected Start→End | Valid workflow, simulation runs | Medium |
| EC-10 | Disconnecting all edges | Remove all edges from valid workflow | Canvas shows isolated nodes | Medium |

---

## 10. Accessibility Tests

> **Tool:** jest-axe, Cypress axe plugin, or manual checks

| ID | Test Case | Expected Output | Priority |
|----|-----------|-----------------|----------|
| AC-01 | No axe violations on canvas page load | `expect(results).toHaveNoViolations()` | High |
| AC-02 | All form inputs have associated labels | Each input has `<label>` or `aria-label` | High |
| AC-03 | Simulate button is keyboard focusable | Tab to button, press Enter | Simulation triggers | Medium |
| AC-04 | Error messages are announced to screen readers | Validation error has `role="alert"` | Medium |
| AC-05 | Node forms are keyboard navigable | Tab through all form fields | Focus moves correctly | Medium |
| AC-06 | Sidebar node items have descriptive aria-labels | `aria-label="Add Task Node"` | Medium |

---

## 11. Performance Tests

> **Tool:** React DevTools Profiler, Lighthouse, manual observation

| ID | Test Case | Scenario | Pass Criteria | Priority |
|----|-----------|----------|---------------|----------|
| PF-01 | Canvas renders without lag with 20 nodes | Add 20 nodes | No visible jank, FPS > 30 | Medium |
| PF-02 | Form panel opens instantly | Click node | Form visible < 100ms | Medium |
| PF-03 | Simulation response handled quickly | Small workflow | Result displayed < 500ms after mock response | Medium |
| PF-04 | No memory leaks on repeated node add/delete | Add/delete 50 nodes | Memory stable in DevTools | Low |
| PF-05 | Initial page load time | Cold load | LCP < 2.5s (Lighthouse) | Low |

---

## 12. Test Coverage Targets

| Area | Target Coverage | Notes |
|------|----------------|-------|
| Node Components | ≥ 80% | All 5 node types |
| Node Config Forms | ≥ 90% | Critical user-facing logic |
| Custom Hooks | ≥ 90% | Core state management |
| API Layer / Mocks | ≥ 85% | Request/response handling |
| Utility / Validation | 100% | Pure functions, easy to test |
| Canvas Integration | ≥ 70% | React Flow interactions |
| Sandbox / Simulate | ≥ 85% | End-user feature |
| **Overall** | **≥ 80%** | |

---

## Running Tests

```bash
# Run all unit and integration tests
npm run test

# Run with coverage report
npm run test -- --coverage

# Run in watch mode during development
npm run test -- --watch

# Run E2E tests (Cypress)
npx cypress open

# Run E2E tests headlessly (CI)
npx cypress run

# Run E2E tests (Playwright)
npx playwright test
```

---

## Test File Structure

```
src/
├── components/
│   ├── nodes/
│   │   └── __tests__/
│   │       ├── StartNode.test.tsx
│   │       ├── TaskNode.test.tsx
│   │       ├── ApprovalNode.test.tsx
│   │       ├── AutomatedStepNode.test.tsx
│   │       └── EndNode.test.tsx
│   ├── forms/
│   │   └── __tests__/
│   │       ├── StartNodeForm.test.tsx
│   │       ├── TaskNodeForm.test.tsx
│   │       ├── ApprovalNodeForm.test.tsx
│   │       ├── AutomatedStepNodeForm.test.tsx
│   │       └── EndNodeForm.test.tsx
│   ├── canvas/
│   │   └── __tests__/
│   │       └── Canvas.test.tsx
│   └── sandbox/
│       └── __tests__/
│           └── SimulationPanel.test.tsx
├── hooks/
│   └── __tests__/
│       ├── useWorkflowState.test.ts
│       ├── useNodeForm.test.ts
│       └── useSimulation.test.ts
├── api/
│   └── __tests__/
│       ├── automations.test.ts
│       └── simulate.test.ts
└── utils/
    └── __tests__/
        ├── graphValidation.test.ts
        └── workflowSerializer.test.ts

e2e/  (or cypress/e2e/)
├── onboardingWorkflow.spec.ts
├── leaveApprovalWorkflow.spec.ts
├── nodeConfiguration.spec.ts
└── errorHandling.spec.ts
```

---

*Generated for Tredence Studio — Full Stack Engineering Intern (AI Agentic Platforms) Case Study*
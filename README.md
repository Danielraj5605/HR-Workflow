# FlowForge HR — Workflow Designer

A visual HR workflow designer built with React, TypeScript, and React Flow. Design, validate, and simulate HR workflows with an intuitive drag-and-drop canvas.

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 19 + TypeScript + Vite |
| Flow Canvas | @xyflow/react (React Flow v12) |
| Styling | Tailwind CSS |
| State Management | Zustand |
| Testing | Jest + React Testing Library |
| API Mocking | MSW (Mock Service Worker) |

---

## Project Structure

```
src/
├── api/                      # API integrations
├── components/
│   ├── ai/                   # AI analysis panel
│   ├── canvas/               # Sidebar, WorkflowCanvas, CanvasToolbar
│   ├── forms/                # Node configuration forms
│   ├── nodes/                # Custom React Flow node components
│   └── sandbox/              # Simulation panel & execution log
├── hooks/                    # Custom React hooks
├── mocks/                    # MSW handlers for API mocking
├── types/                    # TypeScript type definitions
└── utils/                    # Utility functions (validation, serialization)
```

---

## Setup

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
cd "D:\Personal Projects\HR Workflow"

# Install dependencies
npm install
```

### Running the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`. In development mode, MSW (Mock Service Worker) is automatically started to mock API responses.

### Building for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

---

## Features

### Workflow Canvas

- **Drag-and-drop** node placement from sidebar
- **5 Node Types**: Start, Task, Approval, Automated Step, End
- **Visual connections** between nodes with React Flow edges
- **Selection** and editing via right panel forms
- **Delete** nodes and edges via keyboard or UI

### Node Configuration Forms

- **StartForm**: Label and metadata configuration
- **TaskForm**: Label, description, assignee, due date, custom fields
- **ApprovalForm**: Approver role, approver name, auto-approve threshold, rejection action
- **AutomatedStepForm**: Dynamic action selection with API-fetched parameters
- **EndForm**: End message and summary toggle

### Simulation Panel

- **Run Simulation** against mock API
- **Step-by-step execution log** with status indicators
- **Validation banner** showing workflow errors/warnings before simulation
- **Cycle detection** and validation errors

### AI Analysis Panel

- Generate AI insights on workflow structure
- Provider-agnostic architecture for LLM integration

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with MSW |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run all Jest tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |

---

## Key Implementation Details

### React Flow Integration

All canvas components must be wrapped in a `ReactFlowProvider`. The project uses a custom `TestWrapper` component for testing that handles this automatically.

### State Management

Workflow state is centralized in a Zustand store (`useWorkflowStore`). All node and edge operations go through this store to ensure consistent state across the application.

### MSW API Mocking

In development mode, MSW intercepts API requests and returns mock data:

- `GET /automations` — Returns available automation actions
- `POST /simulate` — Returns simulated workflow execution steps

### Form Updates

Form components receive a `nodeId` and `data` prop. Changes are written back to the Zustand store via `updateNode`. The form panel reads from the store when a node is selected.

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Base URL for API requests | `/api` |

---

## Data Flow

```
User Action → Form Component → useWorkflowStore.updateNode()
                                        ↓
                              React Flow Canvas Re-renders
                                        ↓
                              Sidebar/CanvasToolbar reflect state
```

---

*Built as part of Tredence Studio — Full Stack Engineering Intern (AI Agentic Platforms) Case Study*

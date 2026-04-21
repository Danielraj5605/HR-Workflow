# FlowForge HR — HR Workflow Designer

> **Tredence Full Stack Engineering Intern — Case Study Submission**

---

## 📌 Basic Information

### Project Title
**FlowForge HR** — Visual HR Workflow Designer

### Short Description / Overview
FlowForge HR is a visual drag-and-drop HR workflow designer that enables HR admins to design, validate, simulate, and analyze workflows through an intuitive node-based canvas interface.

### Purpose of the Project
To simplify complex HR process design by providing a visual, no-code interface where HR teams can model workflows (onboarding, leave approval, document verification), validate them in real-time, simulate execution, and leverage AI for insights — without writing a single line of code.

---

## 🎯 Features

### Key Functionalities
- **Drag-and-Drop Workflow Design** — Build workflows by dragging nodes (Start, Task, Approval, Automated Step, End) onto a canvas
- **Node Configuration** — Each node type has a dedicated, type-safe edit form with relevant fields
- **Real-Time Graph Validation** — Detects cycles, disconnected nodes, and missing start/end nodes instantly
- **Workflow Simulation** — Run workflows via a mock API and view step-by-step execution logs with status, duration, and details
- **AI Workflow Analysis** — Send workflows to an AI provider (Anthropic, Gemini, MiniMax) for issues, suggestions, and plain-English summaries
- **Export / Import** — Save workflows as JSON and reload them later
- **Multi-Provider AI Support** — Choose between Anthropic Claude, Google Gemini, or MiniMax for AI analysis

### Highlights
- Zero-backend prototype with realistic mock API via MSW
- Type-safe node system using discriminated unions
- Minimap and zoom controls for large workflows
- No external state management overhead — Zustand prevents re-render floods during drag operations
- AI layer is purely additive; all core requirements are fulfilled without it

---

## 🛠️ Tech Stack

### Programming Languages
- **TypeScript** — Type-safe frontend logic

### Frameworks / Libraries
- **React 19** (via Vite) — UI framework
- **@xyflow/react** (React Flow v12) — Visual node-based canvas
- **Tailwind CSS v3** — Styling
- **Zustand** — Lightweight state management
- **MSW v2** — Mock API via Service Worker interception
- **Lucide React** — Icon library

### Tools / Platforms
- **Vite** — Build tool and dev server
- **Node.js** — Runtime for development
- **Git** — Version control

---

## 📂 Project Structure

```
src/
├── api/              → Fetch wrappers (automations, simulate, analyze)
├── components/
│   ├── canvas/       → ReactFlow canvas, toolbar, sidebar
│   ├── nodes/        → Custom node components + registry
│   ├── forms/        → Per-node config forms + reusable KeyValueInput
│   ├── sandbox/      → Simulation panel, execution log, validation banner
│   └── ai/           → AI analysis panel + insight cards
├── hooks/            → Zustand store, simulation, validation, AI hooks
├── mocks/            → MSW handlers + mock data
├── types/            → Node types, workflow types, API types
└── utils/            → Graph serializer, cycle detector, validator
```

### Important Files
| File | Role |
|---|---|
| `src/hooks/useWorkflowStore.ts` | Zustand store managing nodes, edges, and simulation state |
| `src/utils/graphSerializer.ts` | Serializes/deserializes workflow to/from JSON |
| `src/utils/validator.ts` | Validates graph structure (cycles, start/end, disconnected) |
| `src/mocks/handlers.ts` | MSW mock handlers for `/automations` and `/simulate` |
| `src/api/analyze.ts` | Direct fetch wrapper for AI providers |

---

## ⚙️ Installation / Setup

### Prerequisites
- **Node.js** v18 or higher
- **npm** v9 or higher

### Step-by-Step Installation

```bash
# 1. Clone the repository
git clone <repository-url>
cd hr-workflow

# 2. Install dependencies
npm install

# 3. (Optional) Copy environment example
cp .env.example .env.local
```

### Environment Setup

Create a `.env.local` file with your chosen AI provider key:

```bash
# Anthropic (Claude)
VITE_ANTHROPIC_API_KEY=sk-ant-...

# OR Google Gemini
VITE_GEMINI_API_KEY=your-gemini-key

# OR MiniMax
VITE_MINMAX_API_KEY=your-minimax-key
```

> **Note:** AI analysis requires an API key. The mock API (simulate, automations) works without any key.

---

## ▶️ Usage

### Start the Development Server

```bash
npm run dev
```

Navigate to **http://localhost:5173/**

### Basic Workflow

1. **Add a Start node** — drag "Start" from the left sidebar onto the canvas
2. **Add a Task node** — drag "Task" onto the canvas
3. **Add an Approval node** — drag "Approval" onto the canvas
4. **Add an End node** — drag "End" onto the canvas
5. **Connect them** — hover over a node's right edge handle (blue dot), then drag to the next node's left handle
6. **Delete** — select any node/edge and press `Delete`

### Configuring Nodes

7. **Click any node** — the right panel switches to the **Config** tab automatically
8. **Start node** — edit title and add optional metadata key-value pairs
9. **Task node** — fill in title, description, assignee name, due date, and custom fields
10. **Approval node** — select approver role (Manager / HRBP / Director), set auto-approve threshold
11. **Automated Step node** — choose an action from the dropdown (fetched from mock API), fill dynamic params
12. **End node** — set end message and toggle the summary flag

### Running Simulation

13. Switch to the **Simulate** tab in the right panel
14. Any validation errors are shown as a red banner
15. Click **Run Simulation** — the mock API returns a step-by-step execution log
16. Each step shows status (completed / pending / skipped), duration, and details

### AI Analysis

17. Switch to the **AI** tab in the right panel
18. Click **Analyze with AI**
19. If API key is set, the AI returns structured JSON with issues, suggestions, and a summary
20. If no key is set, a clear warning is shown

### Export / Import

21. Click the **↓ Download** icon in the canvas toolbar to export the workflow as `workflow.json`
22. Click the **↑ Upload** icon to import a JSON file and restore the workflow
23. Click **Fit View** to center the restored graph

### Canvas Controls

- **Zoom In/Out** — toolbar buttons or scroll wheel
- **Minimap** — bottom-right corner, colored by node type
- **Clear** — trash icon in toolbar resets the canvas

---

## 🗄️ Database

No database is used. Workflows are stored as JSON files (export/import) and managed in-memory via Zustand during the session.

---

## 🔌 API Details

### Mock API Endpoints (via MSW)

#### `GET /automations`
Returns a list of available automation actions.

**Response:**
```json
{
  "automations": [
    { "id": "fetch_doc", "name": "Fetch Document", "params": ["docId"] },
    { "id": "send_notification", "name": "Send Notification", "params": ["recipient", "message"] }
  ]
}
```

#### `POST /simulate`
Accepts a serialized workflow graph and returns a step-by-step execution log.

**Request Body:**
```json
{
  "nodes": [...],
  "edges": [...]
}
```

**Response:**
```json
{
  "executionLog": [
    { "step": 1, "node": "Start", "status": "completed", "duration": "0s" },
    { "step": 2, "node": "Task", "status": "completed", "duration": "2m" }
  ]
}
```

### AI Analysis Endpoint

Direct fetch to provider endpoints (Anthropic, Gemini, MiniMax). No fixed internal endpoint — the provider is selected in the UI and the request is made directly.

---

## 🧪 Testing

### How to Test
1. Open the app and create a workflow following the steps in [Usage](#-usage)
2. Verify validation errors appear when the graph is invalid
3. Run the simulation and inspect the execution log
4. If an API key is configured, run the AI analysis and inspect the returned JSON

### Tools Used
- **Manual browser testing** — Interact with the canvas, forms, and panels
- **MSW** — Intercepts fetch calls for mock API; verified via DevTools Network tab

---

## 🚀 Deployment

### Deployment Steps

```bash
# 1. Build for production
npm run build

# 2. Preview the production build locally
npm run preview
```

### Hosting Platform
Deploy the `dist/` folder to any static hosting platform:
- **Vercel** — `vercel --prod`
- **Netlify** — drag-and-drop `dist/`
- **GitHub Pages** — push and enable Pages in settings

---

## 📸 Screenshots / Demo

Screenshots are not included in this text-based README. To view the application:

1. Run `npm run dev`
2. Open **http://localhost:5173/**
3. Drag nodes from the left sidebar, connect them, and use the right panel to configure, simulate, or analyze

---

## 🤝 Contributing

Contributions are welcome. To get started:

1. **Fork** the repository
2. **Create a feature branch** — `git checkout -b feature/my-feature`
3. **Commit your changes** — `git commit -m 'Add new feature'`
4. **Push to the branch** — `git push origin feature/my-feature`
5. **Open a Pull Request**

When adding new node types:
- Add a new interface in `src/types/`
- Create a form component in `src/components/forms/`
- Register the node in `src/components/nodes/`
- The discriminated union ensures type safety end-to-end

---

## 🐞 Known Issues / Limitations

- **No persistence** — Workflows are lost on page refresh (no localStorage integration yet)
- **Single-user only** — No collaborative editing or user authentication
- **Mock API only** — No real backend integration; simulation is deterministic and preset
- **AI requires API key** — Without a key, the AI tab shows a clear warning but core features remain fully functional
- **Browser support** — Tested primarily on Chrome/Edge; Firefox compatibility may vary

---

## 🔮 Future Enhancements

- **LocalStorage persistence** — Auto-save workflows between sessions
- **Collaborative editing** — Real-time multi-user workflow design via WebSockets
- **Custom node types** — Allow users to define their own node types via a UI
- **Backend integration** — Replace MSW mock with actual REST API
- **Workflow versioning** — Track changes and support rollback
- **Notifications** — Push notifications for pending approvals in real workflows
- **Analytics dashboard** — Visualize workflow performance metrics (avg completion time, bottleneck nodes)

---

## 👤 Author / Credits

### Author
**Danielraj5605**

### Acknowledgments
- **Tredence** — For the Full Stack Engineering Intern case study opportunity
- **React Flow** — For the excellent node-based canvas library
- **MSW** — For realistic browser-level API mocking

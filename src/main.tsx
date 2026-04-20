// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

async function prepare() {
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser');
    await worker.start({
      onUnhandledRequest: 'bypass',   // let all non-mocked requests pass through (Vite proxy + static files)
      serviceWorker: {
        url: '/mockServiceWorker.js',
      },
    });

    // Expose the workflow store on window for dev/testing convenience
    const { useWorkflowStore } = await import('./hooks/useWorkflowStore');
    (window as Record<string, unknown>).__workflowStore = useWorkflowStore;
  }
}

prepare().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});

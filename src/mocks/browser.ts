// src/mocks/browser.ts
import { setupWorker } from 'msw/browser';
import { automationsHandler } from './handlers/automations.handler';
import { simulateHandler } from './handlers/simulate.handler';

export const worker = setupWorker(
  automationsHandler,
  simulateHandler
);

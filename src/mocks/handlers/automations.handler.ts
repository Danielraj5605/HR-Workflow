// src/mocks/handlers/automations.handler.ts
import { http, HttpResponse } from 'msw';
import { automationsData } from '../data/automations.data';

export const automationsHandler = http.get('/automations', () => {
  return HttpResponse.json(automationsData);
});

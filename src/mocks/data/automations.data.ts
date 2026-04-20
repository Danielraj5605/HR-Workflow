// src/mocks/data/automations.data.ts
import type { AutomationAction } from '../../types/api';

export const automationsData: AutomationAction[] = [
  { id: 'send_email',       label: 'Send Email',          params: ['to', 'subject'] },
  { id: 'generate_doc',     label: 'Generate Document',   params: ['template', 'recipient'] },
  { id: 'notify_slack',     label: 'Notify Slack',         params: ['channel', 'message'] },
  { id: 'create_jira',      label: 'Create Jira Ticket',   params: ['project', 'title'] },
  { id: 'update_hris',      label: 'Update HRIS Record',   params: ['employeeId', 'field', 'value'] },
  { id: 'schedule_meeting', label: 'Schedule Meeting',     params: ['attendees', 'agenda', 'date'] },
];

import { describe, it, expect } from 'vitest';
import { generateJsonExport, generateIcsExport } from '../exportUtils';

describe('exportUtils', () => {
  it('generates valid JSON string with app version and data', () => {
    const mockData = { settings: { lang: 'sv' }, items: [1, 2] };
    const jsonStr = generateJsonExport(mockData);
    const parsed = JSON.parse(jsonStr);

    expect(parsed.version).toBe('1.0.0');
    expect(parsed.exportedAt).toBeDefined();
    expect(parsed.payload).toEqual(mockData);
  });

  it('generates valid iCalendar RFC 5545 string', () => {
    const mockEvents = [
      {
        title: 'Språkfika Mölndal',
        date: '2026-08-15T14:00:00Z',
        description: 'Välkommen på språkfika',
      },
    ];
    const icsStr = generateIcsExport(mockEvents);

    expect(icsStr).toContain('BEGIN:VCALENDAR');
    expect(icsStr).toContain('END:VCALENDAR');
    expect(icsStr).toContain('SUMMARY:Språkfika Mölndal');
    expect(icsStr).toContain('DESCRIPTION:Välkommen på språkfika');
    expect(icsStr).toContain('BEGIN:VEVENT');
  });

  it('handles empty events for ICS export gracefully', () => {
    const icsStr = generateIcsExport([]);
    expect(icsStr).toContain('BEGIN:VCALENDAR');
    expect(icsStr).toContain('END:VCALENDAR');
  });
});

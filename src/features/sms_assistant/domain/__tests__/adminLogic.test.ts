import { describe, it, expect } from 'vitest';
import { 
  normalizePhone, 
  isValidPhone, 
  isPhoneInList, 
  addPhoneToList, 
  removePhoneFromList, 
  filterPendingAlerts,
  classifyLogLevel,
  filterLogs,
  LogEntry
} from '../adminLogic';

describe('adminLogic helpers', () => {
  it('normalizes Swedish phone numbers correctly', () => {
    expect(normalizePhone('+46 70 123 45 67')).toBe('0701234567');
    expect(normalizePhone('0046 73 610 89 97')).toBe('0736108997');
    expect(normalizePhone('0701234567')).toBe('0701234567');
  });

  it('validates Swedish phone number formats', () => {
    expect(isValidPhone('0701234567')).toBe(true);
    expect(isValidPhone('+46701234567')).toBe(true);
    expect(isValidPhone('123')).toBe(false);
    expect(isValidPhone('')).toBe(false);
  });

  it('checks if phone is in list regardless of formatting', () => {
    const list = ['0701234567', '0739998877'];
    expect(isPhoneInList(list, '+46701234567')).toBe(true);
    expect(isPhoneInList(list, '0700000000')).toBe(false);
  });

  it('adds new phone to list uniquely', () => {
    const list = ['0701234567'];
    const updated = addPhoneToList(list, '+46736108997');
    expect(updated).toHaveLength(2);
    expect(updated).toContain('0736108997');

    const duplicate = addPhoneToList(updated, '0701234567');
    expect(duplicate).toHaveLength(2);
  });

  it('removes phone from list', () => {
    const list = ['0701234567', '0736108997'];
    const updated = removePhoneFromList(list, '+46701234567');
    expect(updated).toEqual(['0736108997']);
  });

  it('filters pending alerts properly', () => {
    const alerts = [
      { id: '1', status: 'pending' },
      { id: '2', status: 'active' },
      { id: '3', status: 'pending_review' },
      { id: '4', status: 'rejected' }
    ];
    const pending = filterPendingAlerts(alerts);
    expect(pending).toHaveLength(2);
    expect(pending.map(p => p.id)).toEqual(['1', '3']);
  });

  it('classifies log levels correctly based on keywords or explicit level', () => {
    expect(classifyLogLevel({ text: 'Inbjudan skapad' })).toBe('INFO');
    expect(classifyLogLevel({ text: 'Fel vid anslutning till API' })).toBe('ERROR');
    expect(classifyLogLevel({ text: 'Varning för obehörig åtkomst' })).toBe('WARN');
    expect(classifyLogLevel({ text: 'Standard meddelande', level: 'ERROR' })).toBe('ERROR');
  });

  it('filters log entries by search text and log level', () => {
    const logs: LogEntry[] = [
      { text: 'Inbjudan #101 publicerad', isUser: false },
      { text: 'Fel: Nätverksavbrott vid sändning', isUser: false },
      { text: 'Varning: Ogiltigt format', isUser: false },
      { text: 'Sms skickades av admin', isUser: true }
    ];

    expect(filterLogs(logs, '', 'ALLA')).toHaveLength(4);
    expect(filterLogs(logs, '', 'ERROR')).toHaveLength(1);
    expect(filterLogs(logs, '', 'WARN')).toHaveLength(1);
    expect(filterLogs(logs, 'inbjudan', 'ALLA')).toHaveLength(1);
    expect(filterLogs(logs, 'nätverk', 'ERROR')).toHaveLength(1);
    expect(filterLogs(logs, 'nätverk', 'INFO')).toHaveLength(0);
  });
});

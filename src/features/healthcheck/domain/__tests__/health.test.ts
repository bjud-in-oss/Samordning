import { describe, it, expect } from 'vitest';
import { getSystemHealth } from '../health';

describe('Healthcheck Logic', () => {
  it('returns ok status with valid timestamp', () => {
    const health = getSystemHealth();
    expect(health.status).toBe('ok');
    expect(health.version).toBe('1.0.0');
    expect(typeof health.timestamp).toBe('number');
  });
});

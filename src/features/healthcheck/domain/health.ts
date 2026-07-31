export interface SystemHealth {
  status: 'ok' | 'degraded' | 'down';
  version: string;
  timestamp: number;
}

export function getSystemHealth(): SystemHealth {
  return {
    status: 'ok',
    version: '1.0.0',
    timestamp: Date.now(),
  };
}

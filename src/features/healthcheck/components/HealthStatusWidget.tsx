import React from 'react';
import { getSystemHealth } from '../domain/health';

export const HealthStatusWidget: React.FC = () => {
  const health = getSystemHealth();

  return (
    <div className="flex items-center gap-2 text-xs text-slate-500 py-1 px-2 rounded bg-slate-100 w-fit">
      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      <span>Systemstatus: {health.status.toUpperCase()} (v{health.version})</span>
    </div>
  );
};

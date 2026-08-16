import React from "react";
import { Check, X } from "lucide-react";

interface PendingAlertsQueueProps {
  pendingAlerts: any[];
  onFetchPending: () => void;
  onApprove: (id: string, trustSender?: boolean) => void;
  onReject: (id: string) => void;
}

export function PendingAlertsQueue({
  pendingAlerts,
  onFetchPending,
  onApprove,
  onReject
}: PendingAlertsQueueProps) {
  return (
    <div className="bg-white border-b border-brand-ink/10 px-4 py-3 shrink-0 z-10">
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-xs font-bold uppercase tracking-wider text-brand-accent flex items-center gap-1.5">
          <span>Väntande förslag ({pendingAlerts.length})</span>
        </span>
        <button
          onClick={onFetchPending}
          className="text-[10px] font-mono text-brand-ink/60 hover:text-brand-ink underline cursor-pointer"
        >
          Uppdatera
        </button>
      </div>

      {pendingAlerts.length === 0 ? (
        <p className="text-xs font-mono text-brand-ink/40 italic">Inga väntande förslag i kö.</p>
      ) : (
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {pendingAlerts.map(item => (
            <div
              key={item.id}
              className="bg-brand-bg rounded-xl p-3 border border-brand-ink/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left"
            >
              <div className="space-y-0.5 text-xs font-sans">
                <div className="font-mono text-[10px] font-bold text-brand-accent uppercase tracking-wider">
                  #{item.id} • {item.area} • {item.category || "Vara en vän"}
                </div>
                <p className="font-serif italic text-brand-ink font-medium leading-snug">
                  {item.scrubbedText || item.rawText}
                </p>
                <div className="font-mono text-[10px] text-brand-ink/60">
                  Tid: {item.time || "Ej angiven"} | Arrangör: {item.responsibleParty || "Församlingen"}
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                <button
                  type="button"
                  onClick={() => onApprove(item.id, false)}
                  className="px-2.5 py-1.5 bg-brand-accent hover:bg-brand-accent/90 text-white font-mono text-[10px] uppercase font-bold tracking-wider rounded-lg transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
                  title="Godkänn förslaget och publicera i flödet"
                >
                  <Check size={12} />
                  <span>Godkänn</span>
                </button>
                <button
                  type="button"
                  onClick={() => onApprove(item.id, true)}
                  className="px-2.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-mono text-[10px] uppercase font-bold tracking-wider rounded-lg transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
                  title="Godkänn och lita på avsändaren i framtiden"
                >
                  <Check size={12} />
                  <span>Godkänn & Lita på</span>
                </button>
                <button
                  type="button"
                  onClick={() => onReject(item.id)}
                  className="px-2.5 py-1.5 bg-rose-700 hover:bg-rose-800 text-white font-mono text-[10px] uppercase font-bold tracking-wider rounded-lg transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
                >
                  <X size={12} />
                  <span>Avböj</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

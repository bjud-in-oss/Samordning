import React from "react";
import { ShieldAlert } from "lucide-react";
import { ActiveAlert } from "../../mission_router";

interface AdminModerationQueueProps {
  pendingAlerts: ActiveAlert[];
  handleModerate: (id: string, status: "active" | "rejected") => void;
}

export function AdminModerationQueue({ pendingAlerts, handleModerate }: AdminModerationQueueProps) {
  if (pendingAlerts.length === 0) return null;

  return (
    <div className="bg-amber-50/90 rounded-2xl p-5 border border-amber-200/80 shadow-xs text-left space-y-4">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
          <ShieldAlert size={16} className="text-amber-600" />
          Modereringskö ({pendingAlerts.length} väntande inbjudan)
        </span>
        <span className="text-[10px] font-mono text-amber-800/70">Endast synligt för admin</span>
      </div>

      <div className="space-y-3">
        {pendingAlerts.map(item => (
          <div key={item.id} className="bg-white rounded-xl p-4 border border-amber-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                ID #{item.id} • Väntar godkännande
              </span>
              <span className="font-mono text-[10px] text-brand-ink/50">{item.time}</span>
            </div>

            <div>
              <h4 className="font-serif italic text-lg font-medium text-brand-ink">
                {item.area}
              </h4>
              <p className="text-xs text-brand-ink/80 font-light mt-1">
                {item.scrubbedText || item.rawText}
              </p>
              <p className="text-[10px] text-brand-ink/50 mt-1 font-mono">
                Avsändare: {item.responsibleParty} ({item.contactValue})
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-brand-ink/5 text-xs font-mono">
              <button
                type="button"
                onClick={() => handleModerate(item.id, "active")}
                className="px-3 py-1.5 bg-brand-accent hover:bg-brand-accent/90 text-white rounded-lg transition-colors cursor-pointer flex items-center gap-1 font-semibold"
              >
                <span>✓ Godkänn (.ja)</span>
              </button>
              <button
                type="button"
                onClick={() => handleModerate(item.id, "rejected")}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors cursor-pointer flex items-center gap-1 font-semibold"
              >
                <span>✕ Avvisa (.nej)</span>
              </button>

              {item.contactValue && item.contactValue !== "0736108997" && (
                <div className="flex items-center gap-1 ml-auto">
                  <a
                    href={`tel:${item.contactValue}`}
                    className="px-2.5 py-1.5 bg-brand-paper hover:bg-brand-ink/10 text-brand-ink rounded-lg transition-colors text-[10px]"
                  >
                    📞 Ring
                  </a>
                  <a
                    href={`sms:${item.contactValue}?body=${encodeURIComponent(`Hej! Angående inbjudan #${item.id}: `)}`}
                    className="px-2.5 py-1.5 bg-brand-paper hover:bg-brand-ink/10 text-brand-ink rounded-lg transition-colors text-[10px]"
                  >
                    💬 SMS
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

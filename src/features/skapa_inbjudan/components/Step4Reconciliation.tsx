import React from "react";
import { CheckCircle2, Calendar, RefreshCw } from "lucide-react";

interface Step4ReconciliationProps {
  isSubmitted: boolean;
  saving: boolean;
  onConfirmSent: () => void;
  onRetryStep3: () => void;
  onDownloadIcs: () => void;
  onSuccess: () => void;
}

export function Step4Reconciliation({
  isSubmitted,
  saving,
  onConfirmSent,
  onRetryStep3,
  onDownloadIcs,
  onSuccess
}: Step4ReconciliationProps) {
  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-amber-100 text-amber-800">
          <RefreshCw size={22} />
        </div>
        <div>
          <h3 className="font-serif text-lg font-bold text-brand-ink leading-tight">
            4. SMS-returavstämning
          </h3>
          <span className="font-mono text-[11px] text-brand-ink/50 uppercase block">
            Avstämning
          </span>
        </div>
      </div>

      {!isSubmitted ? (
        <>
          <p className="text-sm font-serif italic text-brand-ink leading-relaxed">
            Fick du iväg meddelandet via din SMS-app?
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              disabled={saving}
              onClick={onConfirmSent}
              className="py-3 px-4 bg-brand-accent hover:bg-brand-accent/90 text-white font-mono text-xs font-bold uppercase tracking-wider rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 size={16} />
              <span>{saving ? "Sparar..." : "Ja, skickat!"}</span>
            </button>

            <button
              type="button"
              onClick={onRetryStep3}
              className="py-3 px-4 bg-brand-paper hover:bg-brand-ink/10 text-brand-ink border border-brand-ink/15 font-mono text-xs font-medium rounded-2xl transition-all cursor-pointer text-center"
            >
              Nej, försök igen
            </button>
          </div>
        </>
      ) : (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="bg-brand-paper rounded-2xl p-4 border border-brand-accent/30 text-brand-ink text-xs font-mono space-y-1">
            <span className="font-bold uppercase block text-brand-ink">
              Tack! Din inbjudan har registrerats!
            </span>
            <p className="font-sans text-brand-ink/80 font-light">
              Inbjudan har sparats i dina lokaldata och väntar på granskning innan den publiceras i flödet.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={onDownloadIcs}
              className="w-full py-3 bg-brand-accent hover:bg-brand-accent/90 text-white font-mono text-xs uppercase font-bold tracking-wider rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calendar size={16} />
              <span>Lägg till i kalender (.ics)</span>
            </button>

            <button
              type="button"
              onClick={onSuccess}
              className="w-full py-2.5 bg-brand-paper hover:bg-brand-ink/10 text-brand-ink border border-brand-ink/15 font-mono text-xs uppercase font-semibold rounded-2xl transition-all cursor-pointer text-center"
            >
              Klar / Tillbaka till flödet
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

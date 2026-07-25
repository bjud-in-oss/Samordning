// [CURRENT SUBDIRECTORY/CYCLE] | [src/features/skapa_inbjudan/4_Produce] - Smart Pre-flight Review Modal

import React from "react";
import { AlertTriangle, CheckCircle2, ArrowRight, X, FileText, UserCheck } from "lucide-react";
import { AiReviewProposal } from "../domain/types";

interface AiReviewModalProps {
  proposal: AiReviewProposal;
  onClose: () => void;
  onAutoFill?: (extracted: { time?: string; location?: string }) => void;
  onPublishAnyway: () => void;
  sending?: boolean;
}

export function AiReviewModal({
  proposal,
  onClose,
  onAutoFill,
  onPublishAnyway,
  sending
}: AiReviewModalProps) {
  const { missingFields, extractedFromText, organizerNotice, reasonCopy, hasPrivacyFlag } = proposal;

  const hasExtracted = Boolean(extractedFromText?.time || extractedFromText?.location);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-brand-ink/10 space-y-5 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-brand-ink/40 hover:text-brand-ink p-1 rounded-full cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-2xl ${hasPrivacyFlag ? "bg-amber-100 text-amber-800" : "bg-brand-accent/10 text-brand-accent"}`}>
            {hasPrivacyFlag ? <AlertTriangle size={24} /> : <FileText size={24} />}
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-brand-ink leading-tight">
              {hasPrivacyFlag ? "Granskning innan utskick" : "Tips för en komplett inbjudan"}
            </h3>
            <span className="font-mono text-[11px] text-brand-ink/50 uppercase block">
              Skrivassistans
            </span>
          </div>
        </div>

        <p className="text-xs text-brand-ink/80 leading-relaxed font-light">
          För att deltagarna enkelt ska kunna planera och delta rekommenderar vi att inbjudan innehåller så tydliga detaljer som möjligt.
        </p>

        {/* Missing Fields List */}
        {missingFields.length > 0 && (
          <div className="bg-brand-paper/60 rounded-2xl p-4 border border-brand-ink/10 space-y-2">
            <span className="font-mono text-[10px] uppercase font-semibold text-brand-ink/60 block">
              Följande uppgifter saknas:
            </span>
            <ul className="space-y-1.5 text-xs font-mono text-brand-ink">
              {missingFields.map((field, idx) => (
                <li key={idx} className="flex items-center gap-2 text-amber-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0" />
                  <span>{field}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Organizer / Contact Notice */}
        {organizerNotice && (
          <div className="bg-sky-50 rounded-2xl p-3.5 border border-sky-200 text-xs text-sky-900 space-y-1.5">
            <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase font-semibold text-sky-800">
              <UserCheck size={14} className="text-sky-700 shrink-0" />
              <span>Arrangör & Trygghet</span>
            </div>
            <p className="leading-relaxed font-light">{organizerNotice}</p>
          </div>
        )}

        {/* Extracted Auto-fill Recommendation */}
        {hasExtracted && onAutoFill && (
          <div className="bg-emerald-50 rounded-2xl p-3.5 border border-emerald-200 text-xs font-mono space-y-2">
            <div className="flex items-center gap-2 text-emerald-900 font-semibold">
              <CheckCircle2 size={16} className="text-emerald-700 shrink-0" />
              <span>Hittade detaljer i din beskrivning:</span>
            </div>
            <p className="text-emerald-800 text-[11px] font-light">
              {extractedFromText?.time && `Tid: "${extractedFromText.time}" `}
              {extractedFromText?.location && `Mötesplats: "${extractedFromText.location}"`}
            </p>
            <button
              type="button"
              onClick={() => onAutoFill(extractedFromText!)}
              className="w-full py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
            >
              <span>Komplettera fälten automatiskt</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}

        {/* Privacy / Content Note */}
        {reasonCopy && (
          <div className="bg-amber-50 rounded-2xl p-3.5 border border-amber-200 text-xs text-amber-900 space-y-1">
            <span className="font-mono text-[10px] uppercase font-semibold block text-amber-800">
              Innehållsnotis
            </span>
            <p className="leading-relaxed font-light">{reasonCopy}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 px-4 bg-brand-accent hover:bg-brand-accent/90 text-white rounded-2xl font-mono text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors shadow-md text-center"
          >
            Justera inbjudan
          </button>

          <button
            type="button"
            disabled={sending}
            onClick={onPublishAnyway}
            className="w-full py-3 px-4 bg-brand-paper hover:bg-brand-ink/5 text-brand-ink border border-brand-ink/15 rounded-2xl font-mono text-xs font-medium cursor-pointer transition-colors text-center disabled:opacity-50"
          >
            {sending ? "Sänder..." : "Sänd ändå"}
          </button>
        </div>
      </div>
    </div>
  );
}


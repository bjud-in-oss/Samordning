import React from "react";
import { FileText, CheckCircle2, ArrowRight } from "lucide-react";
import { AiReviewProposal } from "../domain/types";

interface Step1AiReviewProps {
  aiProposal: AiReviewProposal;
  onNext: () => void;
}

export function Step1AiReview({ aiProposal, onNext }: Step1AiReviewProps) {
  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-brand-accent/10 text-brand-accent">
          <FileText size={22} />
        </div>
        <div>
          <h3 className="font-serif text-lg font-bold text-brand-ink leading-tight">
            1. AI-granskning av inbjudan
          </h3>
          <span className="font-mono text-[11px] text-brand-ink/50 uppercase block">
            Rekonciliering & förslag
          </span>
        </div>
      </div>

      {aiProposal.missingFields.length > 0 ? (
        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 space-y-2">
          <span className="font-mono text-[10px] uppercase font-bold text-amber-900 block">
            Saknade detaljer i inbjudan:
          </span>
          <ul className="space-y-1 text-xs font-mono text-amber-900">
            {aiProposal.missingFields.map((f, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="bg-brand-paper rounded-2xl p-4 border border-brand-accent/30 text-brand-ink text-xs font-mono flex items-center gap-2">
          <CheckCircle2 size={18} className="text-brand-accent shrink-0" />
          <span>Alla viktiga fält är ifyllda och redo för publicering!</span>
        </div>
      )}

      {aiProposal.reasonCopy && (
        <div className="bg-amber-50 rounded-2xl p-3.5 border border-amber-200 text-xs text-amber-900">
          <p className="leading-relaxed font-light">{aiProposal.reasonCopy}</p>
        </div>
      )}

      <div className="pt-2 flex justify-end gap-2">
        <button
          type="button"
          onClick={onNext}
          className="w-full py-3 bg-brand-accent hover:bg-brand-accent/90 text-white font-mono text-xs uppercase font-bold tracking-wider rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Fortsätt till nästa steg</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

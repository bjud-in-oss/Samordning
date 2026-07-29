import React from "react";
import { ShieldCheck, ArrowRight } from "lucide-react";

interface Step2PrivacyProps {
  consentConfirmed: boolean;
  setConsentConfirmed: (val: boolean) => void;
  onNext: () => void;
}

export function Step2Privacy({ consentConfirmed, setConsentConfirmed, onNext }: Step2PrivacyProps) {
  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-sky-100 text-sky-800">
          <ShieldCheck size={22} />
        </div>
        <div>
          <h3 className="font-serif text-lg font-bold text-brand-ink leading-tight">
            2. Integritetsbekräftelse
          </h3>
          <span className="font-mono text-[11px] text-brand-ink/50 uppercase block">
            Skydd av personuppgifter
          </span>
        </div>
      </div>

      <p className="text-xs text-brand-ink/80 leading-relaxed font-light">
        För att upprätthålla tryggheten och följa integritetspolicyn måste alla inbjudningar respektera andras personliga uppgifter.
      </p>

      <label className="flex items-start gap-3 cursor-pointer p-4 bg-brand-paper/60 rounded-2xl border border-brand-ink/10">
        <input
          type="checkbox"
          checked={consentConfirmed}
          onChange={e => setConsentConfirmed(e.target.checked)}
          className="mt-0.5 rounded border-brand-ink/30 text-emerald-800 focus:ring-emerald-800 shrink-0"
        />
        <span className="text-xs text-brand-ink leading-relaxed font-medium">
          Jag bekräftar att jag inte delar andras personuppgifter (som namn, kontaktinfo, etc) i inbjudan utan deras uttryckliga godkännande. Jag förstår att min inbjudan granskas innan publicering.
        </span>
      </label>

      <div className="pt-2 flex justify-end gap-2">
        <button
          type="button"
          disabled={!consentConfirmed}
          onClick={onNext}
          className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white font-mono text-xs uppercase font-bold tracking-wider rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Bekräfta och fortsätt</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

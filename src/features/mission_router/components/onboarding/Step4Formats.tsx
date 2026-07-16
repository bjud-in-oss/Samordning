// [CURRENT SUBDIRECTORY/CYCLE] | [4_Produce]

import React from "react";
import { Check } from "lucide-react";
import { TRANSLATIONS, UiLanguage } from "../../translations";

interface Step4FormatsProps {
  formats: ("physical" | "telephone")[];
  setFormats: React.Dispatch<React.SetStateAction<("physical" | "telephone")[]>>;
  spiritualTips: boolean;
  setSpiritualTips: (tips: boolean) => void;
  gdprAccepted: boolean;
  setGdprAccepted: (accepted: boolean) => void;
  uiLanguage: UiLanguage;
}

export default function Step4Formats({
  formats,
  setFormats,
  spiritualTips,
  setSpiritualTips,
  gdprAccepted,
  setGdprAccepted,
  uiLanguage
}: Step4FormatsProps) {
  const t = TRANSLATIONS[uiLanguage];

  const toggleFormat = (format: "physical" | "telephone") => {
    setFormats(prev =>
      prev.includes(format) ? prev.filter(f => f !== format) : [...prev, format]
    );
  };

  return (
    <div id="step-4-container" className="bg-white rounded-2xl p-6 md:p-8 border border-brand-ink/5 space-y-6 shadow-xs animate-in fade-in duration-200">
      <div className="flex flex-col items-start pb-2 border-b border-brand-ink/5">
        <span className="font-mono text-[9px] uppercase tracking-wider text-brand-accent bg-brand-paper px-2.5 py-1 rounded">
          Steg 4 av 4
        </span>
        <p className="text-brand-ink/70 text-xs leading-relaxed font-light mt-2">
          {t.step4Subtitle}
        </p>
      </div>

      {/* Three main toggles / option cards */}
      <div className="space-y-3">
        {/* Format Physical card */}
        <button
          id="format-physical-btn"
          type="button"
          onClick={() => toggleFormat("physical")}
          className={`w-full flex items-start p-5 rounded-xl border text-left transition-all cursor-pointer duration-200 ${
            formats.includes("physical")
              ? "border-brand-accent bg-brand-paper/40 text-brand-ink font-medium"
              : "border-brand-ink/5 bg-brand-bg hover:border-brand-accent/20 text-brand-ink/80"
          }`}
        >
          <div
            className={`w-5 h-5 rounded border flex items-center justify-center mr-4 shrink-0 mt-0.5 transition-colors ${
              formats.includes("physical")
                ? "bg-brand-accent border-brand-accent text-white"
                : "border-brand-ink/10 bg-white"
            }`}
          >
            {formats.includes("physical") && <Check size={12} strokeWidth={2.5} />}
          </div>
          <div>
            <div className="font-serif italic text-sm text-brand-ink font-medium mb-1">
              {t.formatPhysicalTitle}
            </div>
            <div className="text-[11px] text-brand-ink/70 font-light leading-relaxed">
              {t.formatPhysicalDesc}
            </div>
          </div>
        </button>

        {/* Format Telephone card */}
        <button
          id="format-telephone-btn"
          type="button"
          onClick={() => toggleFormat("telephone")}
          className={`w-full flex items-start p-5 rounded-xl border text-left transition-all cursor-pointer duration-200 ${
            formats.includes("telephone")
              ? "border-brand-accent bg-brand-paper/40 text-brand-ink font-medium"
              : "border-brand-ink/5 bg-brand-bg hover:border-brand-accent/20 text-brand-ink/80"
          }`}
        >
          <div
            className={`w-5 h-5 rounded border flex items-center justify-center mr-4 shrink-0 mt-0.5 transition-colors ${
              formats.includes("telephone")
                ? "bg-brand-accent border-brand-accent text-white"
                : "border-brand-ink/10 bg-white"
            }`}
          >
            {formats.includes("telephone") && <Check size={12} strokeWidth={2.5} />}
          </div>
          <div>
            <div className="font-serif italic text-sm text-brand-ink font-medium mb-1">
              {t.formatDigitalTitle}
            </div>
            <div className="text-[11px] text-brand-ink/70 font-light leading-relaxed">
              {t.formatDigitalDesc}
            </div>
          </div>
        </button>

        {/* Spiritual tips card */}
        <button
          id="spiritual-tips-btn"
          type="button"
          onClick={() => setSpiritualTips(!spiritualTips)}
          className={`w-full flex items-start p-5 rounded-xl border text-left transition-all cursor-pointer duration-200 ${
            spiritualTips
              ? "border-brand-accent bg-brand-paper/40 text-brand-ink font-medium"
              : "border-brand-ink/5 bg-brand-bg hover:border-brand-accent/20 text-brand-ink/80"
          }`}
        >
          <div
            className={`w-5 h-5 rounded border flex items-center justify-center mr-4 shrink-0 mt-0.5 transition-colors ${
              spiritualTips
                ? "bg-brand-accent border-brand-accent text-white"
                : "border-brand-ink/10 bg-white"
            }`}
          >
            {spiritualTips && <Check size={12} strokeWidth={2.5} />}
          </div>
          <div>
            <div className="font-serif italic text-sm text-brand-ink font-medium mb-1">
              {t.formatSpiritualTitle}
            </div>
            <div className="text-[11px] text-brand-ink/70 font-light leading-relaxed">
              {t.formatSpiritualDesc}
            </div>
          </div>
        </button>
      </div>

      {/* Mandatory legal GDPR agreement checkbox */}
      <div id="gdpr-consent-card" className="bg-brand-paper/35 rounded-2xl p-6 border border-brand-accent/20 space-y-4">
        <label className="flex items-start cursor-pointer select-none">
          <input
            id="gdpr-checkbox"
            type="checkbox"
            checked={gdprAccepted}
            onChange={e => setGdprAccepted(e.target.checked)}
            className="w-4 h-4 rounded border-brand-ink/25 text-brand-accent mr-4 mt-1 cursor-pointer accent-brand-accent shrink-0"
          />
          <div className="text-[10px] sm:text-[11px] leading-relaxed text-brand-ink/80 font-light">
            Jag samtycker till att mina anpassade val sparas i min webbläsare för att tjänsten ska kunna skicka relevanta aviseringar. Jag förstår att ingen personlig historik eller personuppgifter sparas centralt och att jag när som helst kan radera mina inställningar genom att inaktivera aviseringar.
          </div>
        </label>
        {!gdprAccepted && (
          <div className="text-xs text-brand-error font-mono uppercase tracking-wider animate-in fade-in duration-150">
            ⚠ Du måste godkänna villkoren för att dina val ska sparas och kunna ta emot aviseringar.
          </div>
        )}
      </div>
    </div>
  );
}

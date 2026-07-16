// [CURRENT SUBDIRECTORY/CYCLE] | [4_Produce]

import React from "react";
import { Check } from "lucide-react";
import { TRANSLATIONS, UiLanguage } from "../../translations";

const LANGUAGE_OPTIONS = [
  { code: "Svenska", label: "Svenska / Swedish" },
  { code: "English", label: "English / English" },
  { code: "Español", label: "Español / Spanish" },
  { code: "Kiswahili", label: "Kiswahili / Swahili" },
  { code: "Tiếng Việt", label: "Tiếng Việt / Vietnamese" }
];

interface Step2LanguageProps {
  selectedLanguages: string[];
  setSelectedLanguages: React.Dispatch<React.SetStateAction<string[]>>;
  uiLanguage: UiLanguage;
}

export default function Step2Language({
  selectedLanguages,
  setSelectedLanguages,
  uiLanguage
}: Step2LanguageProps) {
  const t = TRANSLATIONS[uiLanguage];

  const toggleLanguage = (lang: string) => {
    setSelectedLanguages(prev =>
      prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
    );
  };

  return (
    <div id="step-2-container" className="bg-white rounded-2xl p-6 md:p-8 border border-brand-ink/5 space-y-6 shadow-xs animate-in fade-in duration-200">
      <div className="flex flex-col items-start pb-2 border-b border-brand-ink/5">
        <span className="font-mono text-[9px] uppercase tracking-wider text-brand-accent bg-brand-paper px-2.5 py-1 rounded">
          Steg 2 av 4
        </span>
        <p className="text-brand-ink/70 text-xs leading-relaxed font-light mt-2">
          {t.step2Subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {LANGUAGE_OPTIONS.map(lang => {
          const isSelected = selectedLanguages.includes(lang.code);
          return (
            <button
              key={lang.code}
              id={`language-btn-${lang.code.replace(/\s+/g, "-")}`}
              type="button"
              onClick={() => toggleLanguage(lang.code)}
              className={`flex items-center justify-between p-4 rounded-xl border text-left transition-all cursor-pointer min-h-[58px] duration-200 ${
                isSelected
                  ? "border-brand-accent bg-brand-paper/40 text-brand-ink font-medium"
                  : "border-brand-ink/5 bg-brand-bg hover:border-brand-accent/20 text-brand-ink/80"
              }`}
            >
              <span className="font-sans text-sm font-medium text-brand-ink">{lang.label}</span>
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-colors ${
                  isSelected
                    ? "bg-brand-accent border-brand-accent text-white"
                    : "border-brand-ink/10 bg-white"
                }`}
              >
                {isSelected && <Check size={12} strokeWidth={2.5} />}
              </div>
            </button>
          );
        })}

        {/* "Inget språkstöd" option */}
        <button
          type="button"
          id="no-language-support-btn"
          onClick={() => setSelectedLanguages([])}
          className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all cursor-pointer min-h-[58px] duration-200 ${
            selectedLanguages.length === 0
              ? "border-brand-accent bg-brand-paper/40 text-brand-ink font-semibold"
              : "border-brand-ink/5 bg-brand-bg text-brand-ink/80"
          }`}
        >
          <div>
            <span className="font-serif italic text-sm sm:text-base font-medium text-brand-ink leading-tight">Inget språkstöd</span>
            <p className="text-[10px] text-brand-ink/65 font-light mt-0.5">Töm alla språkval (inga specifika språkkrav)</p>
          </div>
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-colors ${
              selectedLanguages.length === 0
                ? "bg-brand-accent border-brand-accent text-white"
                : "border-brand-ink/10 bg-white"
            }`}
          >
            {selectedLanguages.length === 0 && <Check size={12} strokeWidth={2.5} />}
          </div>
        </button>
      </div>
    </div>
  );
}

import React from "react";
import { TRANSLATIONS, UiLanguage } from "../features/mission_router";

interface IntroScreenProps {
  uiLanguage: UiLanguage;
  onAccept: () => void;
  onCustomize: () => void;
}

export function IntroScreen({ uiLanguage, onAccept, onCustomize }: IntroScreenProps) {
  return (
    <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center p-6 text-brand-ink font-sans">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-brand-ink/5 space-y-8">
        <p className="font-serif italic text-brand-ink text-lg leading-relaxed">
          {TRANSLATIONS[uiLanguage].introScreenText}
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onAccept}
            className="flex-1 py-3.5 px-5 bg-brand-accent text-white font-medium text-xs sm:text-sm rounded-xl transition-all duration-200 shadow-sm active:scale-[0.99] hover:bg-brand-accent/90 cursor-pointer text-center"
          >
            {TRANSLATIONS[uiLanguage].introScreenBtnOk || "OK, uppfattat"}
          </button>
          <button
            onClick={onCustomize}
            className="flex-1 py-3.5 px-5 bg-brand-paper border border-brand-ink/10 text-brand-ink font-medium text-xs sm:text-sm rounded-xl transition-all duration-200 shadow-sm active:scale-[0.99] hover:bg-brand-ink/5 cursor-pointer text-center"
          >
            {TRANSLATIONS[uiLanguage].introScreenBtnCustomize || "⚙️ Anpassa notiser"}
          </button>
        </div>
      </div>
    </div>
  );
}

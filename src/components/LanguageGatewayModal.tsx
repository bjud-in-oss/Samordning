import React from "react";
import { UiLanguage } from "../features/mission_router";

interface LanguageGatewayModalProps {
  onSelectLanguage: (lang: UiLanguage) => void;
}

export function LanguageGatewayModal({ onSelectLanguage }: LanguageGatewayModalProps) {
  return (
    <div id="language-gateway-container" className="min-h-screen bg-brand-bg flex flex-col items-center justify-center p-6 text-brand-ink font-sans">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-5xl font-serif italic text-brand-ink tracking-tight">
            Inbjudan till dig
          </h1>
        </div>

        <div className="w-24 h-24 bg-white text-brand-accent rounded-full flex items-center justify-center mx-auto border border-brand-ink/5 transition-transform hover:scale-105 duration-300">
          <span className="text-3xl">🇸🇪</span>
        </div>

        <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-brand-accent">
          Välj ditt språk för att fortsätta • Choose language
        </p>

        <div className="grid grid-cols-1 gap-2.5 pt-2">
          {[
            { code: "sv", label: "Svenska" },
            { code: "en", label: "English" },
            { code: "es", label: "Español" },
            { code: "sw", label: "Kiswahili" },
            { code: "vi", label: "Tiếng Việt" }
          ].map(lang => (
            <button
              key={lang.code}
              id={`gateway-lang-btn-${lang.code}`}
              onClick={() => onSelectLanguage(lang.code as UiLanguage)}
              className="w-full py-3.5 px-6 bg-white hover:bg-brand-paper text-brand-ink font-medium text-sm rounded-xl border border-brand-ink/5 hover:border-brand-accent transition-all duration-200 shadow-xs active:scale-[0.99] flex items-center justify-between cursor-pointer"
            >
              <span className="tracking-wide">{lang.label}</span>
              <span className="font-mono text-[10px] font-semibold text-brand-accent uppercase tracking-wider">
                {lang.code}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

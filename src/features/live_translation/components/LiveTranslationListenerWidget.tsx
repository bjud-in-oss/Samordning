import type { ChangeEvent } from "react";
import { Headphones, Radio, CheckCircle2, AlertCircle } from "lucide-react";
import { ALL_LANGUAGES } from "../domain/languages";
import type { SupportedLanguage } from "../domain/types";
import { useLiveTranslationListener } from "../hooks/useLiveTranslationListener";

export interface LiveTranslationListenerWidgetProps {
  initialLanguage?: SupportedLanguage;
  onLanguageChange?: (language: SupportedLanguage) => void;
}

export function LiveTranslationListenerWidget({
  initialLanguage = "sv",
  onLanguageChange,
}: LiveTranslationListenerWidgetProps) {
  const {
    selectedLanguage,
    isListening,
    connStatus,
    packetCount,
    setLanguage,
    toggleListening,
  } = useLiveTranslationListener({ initialLanguage, onLanguageChange });

  const handleLanguageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as SupportedLanguage);
  };

  return (
    <div id="live-translation-listener" className="bg-brand-paper dark:bg-brand-dark-paper border border-brand-accent/20 rounded-2xl p-6 shadow-sm max-w-lg mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-brand-accent/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-brand-accent/10 text-brand-accent rounded-xl">
            <Headphones className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-brand-dark dark:text-brand-light">Direktöversättning</h2>
            <p className="text-xs text-neutral-500">Lyssna på simultantolkning i din mobil</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-medium">
          {connStatus === "connected" ? (
            <span className="flex items-center gap-1 text-sky-700 bg-sky-50 dark:bg-sky-950/30 px-2.5 py-1 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" /> Ansluten
            </span>
          ) : connStatus === "connecting" ? (
            <span className="flex items-center gap-1 text-amber-600 bg-amber-50 dark:bg-amber-950/30 px-2.5 py-1 rounded-full">
              <Radio className="w-3.5 h-3.5 animate-pulse" /> Ansluter...
            </span>
          ) : (
            <span className="flex items-center gap-1 text-rose-600 bg-rose-50 dark:bg-rose-950/30 px-2.5 py-1 rounded-full">
              <AlertCircle className="w-3.5 h-3.5" /> Frånkopplad
            </span>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="target-language-select" className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
          Välj Målspråk
        </label>
        <select
          id="target-language-select"
          aria-label="Välj Målspråk"
          value={selectedLanguage}
          onChange={handleLanguageChange}
          className="w-full h-11 px-3.5 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl text-sm font-medium focus:ring-2 focus:ring-brand-accent focus:outline-none"
        >
          {ALL_LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.flag} {lang.name} ({lang.code.toUpperCase()})
            </option>
          ))}
        </select>
      </div>

      <div className="pt-2">
        <button
          type="button"
          onClick={toggleListening}
          className={`w-full h-14 rounded-xl font-bold flex items-center justify-center gap-3 transition-all text-base shadow-sm ${
            isListening
              ? "bg-rose-600 hover:bg-rose-700 text-white"
              : "bg-brand-accent hover:bg-brand-accent/90 text-white"
          }`}
        >
          <Headphones className={`w-5 h-5 ${isListening ? "animate-pulse" : ""}`} />
          {isListening ? "Pausa tolkning" : "Börja lyssna nu"}
        </button>
      </div>

      {isListening && (
        <div className="text-center text-xs text-neutral-500 flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping" />
          <span>Strömmar tolkning ({packetCount} paket mottagna)</span>
        </div>
      )}

      <p className="text-center text-xs text-neutral-400">
        Ingen mikrofon eller app krävs – du deltar uteslutande som lyssnare.
      </p>
    </div>
  );
}

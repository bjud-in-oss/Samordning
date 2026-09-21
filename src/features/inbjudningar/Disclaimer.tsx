// [CURRENT SUBDIRECTORY/CYCLE] | [4_Produce]

import React from "react";
import { UiLanguage, TRANSLATIONS } from "../mission_router";

interface DisclaimerProps {
  uiLanguage: UiLanguage;
  onShowIntro?: () => void;
  onAdminTrigger?: () => void;
  isOnline?: boolean;
  isSyncing?: boolean;
}

export default function Disclaimer({
  uiLanguage,
  onShowIntro,
  onAdminTrigger,
  isOnline = true,
  isSyncing = false
}: DisclaimerProps) {
  return (
    <div className="w-full max-w-2xl mx-auto px-6 py-8 text-center text-brand-ink/40 flex flex-col items-center gap-2">
      <p className="text-[10px] leading-relaxed font-mono uppercase tracking-wider">
        {uiLanguage === "sv" ? "Detta är en fristående, inofficiell tjänst utan sponsring från Utby församling." : "This is an independent, unofficial service without sponsorship from the Utby ward."}
      </p>
      {onShowIntro && (
        <button 
          onClick={onShowIntro}
          className="text-[10px] font-mono uppercase tracking-wider underline opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
        >
          {uiLanguage === "sv" ? "Läs mer om integritet" : "Read more about privacy"}
        </button>
      )}

      <div className="flex items-center gap-3 mt-4">
        {/* Status dot in footer */}
        <div className="flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity text-[10px] font-mono uppercase tracking-wider">
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${
              isSyncing
                ? "bg-brand-ocean animate-pulse"
                : isOnline
                ? "bg-brand-accent"
                : "bg-brand-error"
            }`}
            title={
              isSyncing
                ? TRANSLATIONS[uiLanguage].syncSyncing
                : TRANSLATIONS[uiLanguage].syncSynced
            }
          />
          <span>
            {isSyncing
              ? (uiLanguage === "sv" ? "Synkar..." : "Syncing...")
              : isOnline
              ? (uiLanguage === "sv" ? "Ansluten" : "Online")
              : (uiLanguage === "sv" ? "Offline" : "Offline")}
          </span>
        </div>

        {onAdminTrigger && (
          <>
            <span className="opacity-20">•</span>
            <button
              onClick={onAdminTrigger}
              className="text-xs font-medium text-brand-ink/70 hover:text-brand-ink transition-colors underline underline-offset-4 decoration-brand-ink/20 hover:decoration-brand-ink"
            >
              Admin
            </button>
          </>
        )}
      </div>
    </div>
  );
}

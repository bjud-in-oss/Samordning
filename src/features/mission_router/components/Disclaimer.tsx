// [CURRENT SUBDIRECTORY/CYCLE] | [4_Produce]

import React from "react";
import { UiLanguage } from "../translations";

interface DisclaimerProps {
  uiLanguage: UiLanguage;
  onShowIntro?: () => void;
}

export default function Disclaimer({ uiLanguage, onShowIntro }: DisclaimerProps) {
  return (
    <div className="w-full max-w-2xl mx-auto px-6 py-8 text-center text-brand-ink/40 flex flex-col items-center gap-2">
      <p className="text-[10px] leading-relaxed font-mono uppercase tracking-wider">
        {uiLanguage === "sv" ? "Detta är en fristående, inofficiell tjänst utan sponsring från Utby församling." : "This is an independent, unofficial service without sponsorship from the Utby ward."}
      </p>
      {onShowIntro && (
        <button 
          onClick={onShowIntro}
          className="text-[10px] font-mono uppercase tracking-wider underline opacity-70 hover:opacity-100 transition-opacity"
        >
          {uiLanguage === "sv" ? "Läs mer om integritet" : "Read more about privacy"}
        </button>
      )}
    </div>
  );
}

// [CURRENT SUBDIRECTORY/CYCLE] | [4_Produce]
import React, { useState, useEffect } from "react";

interface SettingsTickerProps {
  savedTags?: {
    primaryArea?: string;
    limitedAreas?: string[];
    languages?: string[];
    targetGroups?: string[];
  };
  onClick: () => void;
}

export default function SettingsTicker({ savedTags, onClick }: SettingsTickerProps) {
  const [tickerIndex, setTickerIndex] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex(prev => (prev + 1) % 3);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const getTickerText = () => {
    if (tickerIndex === 0) {
      const areaText = savedTags?.primaryArea || (savedTags?.limitedAreas?.length ? savedTags.limitedAreas.join(", ") : "Alla områden");
      return `• i [${areaText}]`;
    } else if (tickerIndex === 1) {
      const langText = savedTags?.languages?.length ? savedTags.languages.join(", ") : "Svenska";
      return `• på [${langText}]`;
    } else {
      const targetText = savedTags?.targetGroups?.length && !savedTags.targetGroups.includes("all") ? savedTags.targetGroups.join(", ") : "Alla";
      return `• för [${targetText}]`;
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-transparent border-0 p-0 font-mono text-xs text-brand-accent/90 hover:text-brand-accent transition-opacity duration-300 cursor-pointer truncate max-w-[180px] sm:max-w-[260px] text-left focus:outline-none font-normal"
      title="Klicka för att anpassa inställningar"
    >
      {getTickerText()}
    </button>
  );
}

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

  // Build list of individual ticker items for 1-at-a-time rotation
  const items: string[] = [];

  // 1. Areas
  if (savedTags?.limitedAreas && savedTags.limitedAreas.length > 0) {
    savedTags.limitedAreas.forEach(area => {
      items.push(`• i [${area}]`);
    });
  } else if (savedTags?.primaryArea) {
    items.push(`• i [${savedTags.primaryArea}]`);
  } else {
    items.push(`• i [Alla områden]`);
  }

  // 2. Languages
  if (savedTags?.languages && savedTags.languages.length > 0) {
    savedTags.languages.forEach(lang => {
      items.push(`• översätta [${lang}]`);
    });
  } else {
    items.push(`• översätta [Svenska]`);
  }

  // 3. Target Groups
  if (savedTags?.targetGroups && savedTags.targetGroups.length > 0 && !savedTags.targetGroups.includes("all")) {
    items.push(`• för [${savedTags.targetGroups.join(", ")}]`);
  } else {
    items.push(`• för [Alla]`);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex(prev => (prev + 1) % items.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [items.length]);

  const currentText = items[tickerIndex % items.length] || items[0];

  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-transparent border-0 shadow-none p-0 font-mono text-xs text-brand-accent/90 hover:text-brand-accent transition-opacity duration-300 cursor-pointer truncate max-w-[180px] sm:max-w-[260px] text-left focus:outline-none font-normal"
      title="Klicka för att anpassa inställningar"
    >
      {currentText}
    </button>
  );
}


import React from "react";

export interface SavedFilterTags {
  limitAreas?: boolean;
  limitedAreas?: string[];
  primaryArea?: string;
  enabledCategories?: string[];
  languages?: string[];
  organizations?: string[];
}

interface StreamFilterStatusProps {
  savedTags?: SavedFilterTags | null;
  pushEnabled?: boolean;
  onOpenSettings?: () => void;
  onEnableAndOpenSettings?: () => void;
}

export function StreamFilterStatus({
  savedTags,
  pushEnabled = false,
  onOpenSettings,
  onEnableAndOpenSettings
}: StreamFilterStatusProps) {
  // Check if specific areas are customized
  const hasLimitedAreas = Boolean(
    savedTags?.limitAreas &&
    Array.isArray(savedTags?.limitedAreas) &&
    savedTags.limitedAreas.length > 0
  );

  const handleCardClick = () => {
    if (!pushEnabled) {
      if (onEnableAndOpenSettings) {
        onEnableAndOpenSettings();
      } else if (onOpenSettings) {
        onOpenSettings();
      }
    } else if (onOpenSettings) {
      onOpenSettings();
    }
  };

  // When push is OFF (Funktionen är AV - Plats 1 i flödet, utan 'AVISERINGAR AV'-tagg)
  if (!pushEnabled) {
    return (
      <div
        onClick={handleCardClick}
        className="bg-brand-paper/90 rounded-3xl p-6 border border-brand-accent/20 shadow-sm relative overflow-hidden text-left hover:border-brand-accent/40 hover:bg-brand-paper transition-all cursor-pointer group space-y-2.5"
      >
        <h2 className="font-serif italic text-xl sm:text-2xl font-medium text-brand-ink group-hover:text-brand-accent transition-colors">
          Välj att ta emot inbjudningar
        </h2>

        <p className="text-xs sm:text-sm text-brand-ink/80 font-sans leading-relaxed">
          Du ser direkt när någon behöver ditt stöd. Du är helt anonym och ingen kan se dina val eller begränsningar. Du kan när som helst välja var du vill vara tillgänglig.
        </p>

        <p className="text-[10px] font-mono italic text-brand-ink/40 pt-2 border-t border-brand-ink/5">
          (Klicka för att anpassa områden och inställningar)
        </p>
      </div>
    );
  }

  // When push is ON (Funktionen är PÅ - Plats 3 i flödet, Index 2)
  return (
    <div
      onClick={handleCardClick}
      className="bg-brand-paper/90 rounded-3xl p-5 border border-brand-accent/20 shadow-sm relative overflow-hidden text-left hover:border-brand-accent/40 hover:bg-brand-paper transition-all cursor-pointer group space-y-2"
    >
      <div className="absolute top-0 right-0 bg-brand-accent text-white font-mono text-[9px] uppercase font-bold tracking-wider px-3 py-1 rounded-tr-3xl rounded-bl-xl shadow-2xs">
        {hasLimitedAreas ? "Anpassat urval" : "Begränsa din tillgänglighet"}
      </div>

      <div className="flex items-start justify-between gap-3 pr-32">
        <h2 className="font-serif italic text-xl font-medium text-brand-ink group-hover:text-brand-accent transition-colors">
          {hasLimitedAreas ? "Dina valda områden" : "Tillgänglig i hela församlingens område"}
        </h2>
      </div>

      <div className="text-xs text-brand-ink/80 space-y-2 font-sans leading-relaxed">
        {hasLimitedAreas ? (
          <>
            <p>Du tar emot inbjudningar för dina valda platser i församlingsområdet.</p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {savedTags?.limitedAreas?.map((area: string, idx: number) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded-full bg-white border border-brand-ink/10 font-mono text-[11px] text-brand-ink font-medium"
                >
                  {area}
                </span>
              ))}
            </div>
          </>
        ) : (
          <p>
            Du tar emot inbjudningar från hela församlingsområdet. Klicka på kortet eller kugghjulet om du vill snäva av dina platser.
          </p>
        )}
      </div>

      <p className="text-[10px] font-mono italic text-brand-ink/40 mt-3 border-t border-brand-ink/5 pt-2">
        (Endast synligt för dig)
      </p>
    </div>
  );
}

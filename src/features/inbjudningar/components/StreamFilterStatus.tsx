import React from "react";
import { SlidersHorizontal } from "lucide-react";
import type { SavedFilterTags } from "../domain/schema";

export type { SavedFilterTags };

interface StreamFilterStatusProps {
  savedTags?: SavedFilterTags | null;
  pushEnabled?: boolean;
  onOpenSettings?: () => void;
}

export function StreamFilterStatus({
  savedTags,
  pushEnabled = false,
  onOpenSettings
}: StreamFilterStatusProps) {
  // Check if specific areas are customized
  const hasLimitedAreas = Boolean(
    savedTags?.limitAreas &&
    Array.isArray(savedTags?.limitedAreas) &&
    savedTags.limitedAreas.length > 0
  );

  // When push is OFF (Funktionen är AV - Plats 1 i flödet)
  if (!pushEnabled) {
    return (
      <div
        onClick={onOpenSettings}
        className="bg-brand-accent/[0.08] rounded-3xl p-6 border border-brand-accent/25 shadow-xs relative overflow-hidden text-left hover:border-brand-accent/45 hover:bg-brand-accent/[0.12] transition-all cursor-pointer group space-y-2.5"
      >
        <div className="flex items-center gap-2.5 text-brand-accent font-medium">
          <SlidersHorizontal className="w-4 h-4 transition-transform group-hover:scale-110" />
          <span className="font-mono text-[10px] uppercase tracking-wider font-semibold">
            Dina prioriteringar:
          </span>
        </div>

        <h2 className="font-serif italic text-xl sm:text-2xl font-medium text-brand-ink group-hover:text-brand-accent transition-colors">
          Anpassa din tillgänglighet
        </h2>

        <p className="text-xs sm:text-sm text-brand-ink/85 font-sans leading-relaxed">
          Du ser direkt när någon behöver ditt stöd. Du är helt anonym och ingen kan se dina val eller begränsningar. Du kan när som helst välja var du vill vara tillgänglig.
        </p>
      </div>
    );
  }

  // When push is ON (Funktionen är PÅ - Plats 3 i flödet, Index 2)
  return (
    <div
      onClick={onOpenSettings}
      className="bg-brand-accent/[0.08] rounded-3xl p-5 border border-brand-accent/25 shadow-xs relative overflow-hidden text-left hover:border-brand-accent/45 hover:bg-brand-accent/[0.12] transition-all cursor-pointer group space-y-2"
    >
      <div className="absolute top-0 right-0 bg-brand-accent text-white font-mono text-[9px] uppercase font-bold tracking-wider px-3 py-1 rounded-tr-3xl rounded-bl-xl shadow-2xs">
        {hasLimitedAreas ? "Anpassat urval" : "Begränsa din tillgänglighet"}
      </div>

      <div className="flex items-center gap-2 text-brand-accent font-medium">
        <SlidersHorizontal className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
        <span className="font-mono text-[10px] uppercase tracking-wider font-semibold">
          Inställningar & Filter
        </span>
      </div>

      <div className="flex items-start justify-between gap-3 pr-32">
        <h2 className="font-serif italic text-xl font-medium text-brand-ink group-hover:text-brand-accent transition-colors">
          {hasLimitedAreas ? "Dina valda områden" : "Tillgänglig i hela församlingens område"}
        </h2>
      </div>

      <div className="text-xs text-brand-ink/85 space-y-2 font-sans leading-relaxed">
        {hasLimitedAreas ? (
          <>
            <p>Du tar emot inbjudningar för dina valda platser i församlingsområdet.</p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {savedTags?.limitedAreas?.map((area: string, idx: number) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded-full bg-white border border-brand-accent/20 font-mono text-[11px] text-brand-ink font-medium shadow-2xs"
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

      <p className="text-[10px] font-mono italic text-brand-accent/80 mt-3 border-t border-brand-accent/15 pt-2">
        (Endast synligt för dig)
      </p>
    </div>
  );
}

import React from "react";

interface StreamFilterStatusProps {
  savedTags: any;
  onOpenSettings?: () => void;
}

export function StreamFilterStatus({ savedTags, onOpenSettings }: StreamFilterStatusProps) {
  return (
    <div
      onClick={onOpenSettings}
      className="bg-white rounded-3xl p-5 border border-brand-ink/10 shadow-xs relative overflow-hidden text-left hover:border-brand-accent/40 transition-all cursor-pointer group"
    >
      <div className="absolute top-0 right-0 bg-brand-accent text-white font-mono text-[9px] uppercase font-bold tracking-wider px-3 py-1 rounded-tr-3xl rounded-bl-xl shadow-2xs">
        AKTIVT FILTER
      </div>

      <div className="flex items-start justify-between gap-3 mb-2 pr-28">
        <h2 className="font-serif italic text-2xl font-medium text-brand-ink group-hover:text-brand-accent transition-colors">
          Om ditt flöde
        </h2>
      </div>

      <div className="text-xs text-brand-ink/80 space-y-1 font-sans leading-relaxed">
        {(!savedTags || (
          (!savedTags.limitedAreas || savedTags.limitedAreas.length === 0) &&
          (!savedTags.primaryArea) &&
          (!savedTags.enabledCategories || savedTags.enabledCategories.length === 0) &&
          (!savedTags.languages || savedTags.languages.length === 0) &&
          (!savedTags.organizations || savedTags.organizations.length === 0)
        )) ? (
          <p className="font-light italic text-brand-ink/70">
            Inget val – visar alla områden, alla kategorier, alla språk och alla organisationer.
          </p>
        ) : (
          <div className="space-y-1 font-mono text-[11px]">
            {(savedTags?.limitedAreas?.length > 0 || savedTags?.primaryArea) && (
              <p><span className="font-semibold text-brand-ink">Områden:</span> {savedTags?.limitedAreas?.length > 0 ? savedTags.limitedAreas.join(", ") : savedTags.primaryArea}</p>
            )}
            {savedTags?.enabledCategories?.length > 0 && (
              <p><span className="font-semibold text-brand-ink">Kategorier:</span> {savedTags.enabledCategories.join(", ")}</p>
            )}
            {savedTags?.languages?.length > 0 && (
              <p><span className="font-semibold text-brand-ink">Språk:</span> {savedTags.languages.join(", ")}</p>
            )}
            {savedTags?.organizations?.length > 0 && (
              <p><span className="font-semibold text-brand-ink">Organisationer:</span> {savedTags.organizations.join(", ")}</p>
            )}
          </div>
        )}
      </div>

      <p className="text-[10px] font-mono italic text-brand-ink/40 mt-3 border-t border-brand-ink/5 pt-2">
        (Endast synligt för dig)
      </p>
    </div>
  );
}

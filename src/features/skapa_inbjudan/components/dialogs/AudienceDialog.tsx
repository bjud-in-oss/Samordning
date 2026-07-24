// [CURRENT SUBDIRECTORY/CYCLE] | [src/features/skapa_inbjudan/4_Produce] - Audience Selection Dialog

import React from "react";
import { Check } from "lucide-react";
import { AUDIENCE_OPTIONS } from "../../domain/constants";

interface AudienceDialogProps {
  tempAudience: string[];
  setTempAudience: (aud: string[]) => void;
  onClose: () => void;
  onSave: (aud: string[]) => void;
}

export function AudienceDialog({
  tempAudience,
  setTempAudience,
  onClose,
  onSave
}: AudienceDialogProps) {
  const toggleAudience = (aud: string) => {
    if (aud === "Alla målgrupper") {
      setTempAudience(["Alla målgrupper"]);
      return;
    }
    const filtered = tempAudience.filter(a => a !== "Alla målgrupper");
    if (filtered.includes(aud)) {
      const next = filtered.filter(a => a !== aud);
      setTempAudience(next.length === 0 ? ["Alla målgrupper"] : next);
    } else {
      setTempAudience([...filtered, aud]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-brand-ink/10 pb-2">
        <span className="font-mono text-xs uppercase font-semibold text-brand-ink">
          Målgrupp (Vilka riktar sig aktiviteten till?)
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {AUDIENCE_OPTIONS.map(opt => {
          const selected = tempAudience.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => toggleAudience(opt)}
              className={`p-3 rounded-2xl border font-mono text-xs text-left transition-all cursor-pointer flex items-center justify-between ${
                selected
                  ? "bg-brand-accent text-white border-brand-accent font-semibold"
                  : "bg-white border-brand-ink/10 text-brand-ink hover:border-brand-accent/50"
              }`}
            >
              <span>{opt}</span>
              {selected && <Check size={14} className="text-white shrink-0" />}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-end gap-2 pt-2 border-t border-brand-ink/10">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-white border border-brand-ink/15 text-brand-ink rounded-xl font-mono text-xs uppercase"
        >
          Ångra
        </button>
        <button
          type="button"
          onClick={() => onSave(tempAudience)}
          className="px-5 py-2 bg-brand-accent text-white rounded-xl font-mono text-xs uppercase font-semibold"
        >
          Spara
        </button>
      </div>
    </div>
  );
}

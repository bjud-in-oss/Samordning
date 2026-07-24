// [CURRENT SUBDIRECTORY/CYCLE] | [src/features/skapa_inbjudan/4_Produce] - Area Selection Dialog

import React from "react";
import { Check } from "lucide-react";
import { GOTEBORG_AREAS } from "../../../anpassa/mapData";

interface AreaDialogProps {
  tempAreas: string[];
  setTempAreas: (areas: string[]) => void;
  onClose: () => void;
  onSave: (areas: string[]) => void;
}

export function AreaDialog({
  tempAreas,
  setTempAreas,
  onClose,
  onSave
}: AreaDialogProps) {
  const toggleArea = (areaName: string) => {
    if (tempAreas.includes(areaName)) {
      setTempAreas(tempAreas.filter(a => a !== areaName));
    } else {
      setTempAreas([...tempAreas, areaName]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-brand-ink/10 pb-2">
        <span className="font-mono text-xs uppercase font-semibold text-brand-ink">
          Välj vilka områden som ska bjudas in (Flerwektorsval)
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
        {GOTEBORG_AREAS.map(areaName => {
          const selected = tempAreas.includes(areaName);
          return (
            <button
              key={areaName}
              type="button"
              onClick={() => toggleArea(areaName)}
              className={`p-3 rounded-2xl border font-mono text-xs text-left transition-all cursor-pointer flex items-center justify-between ${
                selected
                  ? "bg-brand-accent text-white border-brand-accent font-semibold"
                  : "bg-white border-brand-ink/10 text-brand-ink hover:border-brand-accent/50"
              }`}
            >
              <span>{areaName}</span>
              {selected && <Check size={14} className="text-white shrink-0" />}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-brand-ink/10">
        <button
          type="button"
          onClick={() => setTempAreas([...GOTEBORG_AREAS])}
          className="font-mono text-xs text-brand-accent hover:underline cursor-pointer"
        >
          Välj alla områden
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white border border-brand-ink/15 text-brand-ink rounded-xl font-mono text-xs uppercase"
          >
            Ångra
          </button>
          <button
            type="button"
            onClick={() => onSave(tempAreas)}
            className="px-5 py-2 bg-brand-accent text-white rounded-xl font-mono text-xs uppercase font-semibold"
          >
            Spara
          </button>
        </div>
      </div>
    </div>
  );
}

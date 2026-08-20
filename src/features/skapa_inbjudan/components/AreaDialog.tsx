// [CURRENT SUBDIRECTORY/CYCLE] | [src/features/skapa_inbjudan/4_Produce] - Area Selection Dialog

import React from "react";
import { Check, CheckSquare, XCircle } from "lucide-react";
import { GOTEBORG_AREAS } from "../domain/constants";

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

  const handleSelectAll = () => {
    setTempAreas([...GOTEBORG_AREAS]);
  };

  const handleClear = () => {
    setTempAreas([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-brand-ink/10 pb-2 gap-2">
        <span className="font-mono text-xs uppercase font-semibold text-brand-ink">
          Välj vilka områden som ska bjudas in
        </span>
        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            type="button"
            onClick={handleSelectAll}
            className="px-2.5 py-1 bg-brand-accent/10 hover:bg-brand-accent/20 text-brand-accent rounded-lg font-semibold cursor-pointer transition-colors flex items-center gap-1"
          >
            <CheckSquare size={13} />
            <span>Välj alla</span>
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="px-2.5 py-1 bg-brand-paper hover:bg-brand-ink/10 text-brand-ink/70 hover:text-brand-ink rounded-lg cursor-pointer transition-colors border border-brand-ink/10 flex items-center gap-1"
          >
            <XCircle size={13} />
            <span>Rensa</span>
          </button>
        </div>
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
                  ? "bg-brand-accent text-white border-brand-accent font-semibold shadow-xs"
                  : "bg-white border-brand-ink/10 text-brand-ink hover:border-brand-accent/50"
              }`}
            >
              <span>{areaName}</span>
              {selected && <Check size={14} className="text-white shrink-0" />}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-end gap-2 pt-2 border-t border-brand-ink/10">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-white border border-brand-ink/15 text-brand-ink rounded-xl font-mono text-xs uppercase cursor-pointer hover:bg-brand-paper"
        >
          Ångra
        </button>
        <button
          type="button"
          onClick={() => onSave(tempAreas)}
          className="px-5 py-2 bg-brand-accent text-white rounded-xl font-mono text-xs uppercase font-semibold cursor-pointer hover:bg-brand-accent/90"
        >
          Spara
        </button>
      </div>
    </div>
  );
}

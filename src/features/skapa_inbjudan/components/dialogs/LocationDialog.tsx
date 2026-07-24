// [CURRENT SUBDIRECTORY/CYCLE] | [src/features/skapa_inbjudan/4_Produce] - Location Selection Dialog with POI & KML Matcher

import React from "react";
import { Check } from "lucide-react";
import { POI_LOCATIONS } from "../../domain/constants";

interface LocationDialogProps {
  tempLocation: string;
  setTempLocation: (val: string) => void;
  selectedAreas: string[];
  setSelectedAreas: (val: string[]) => void;
  onClose: () => void;
  onSave: (loc: string) => void;
}

export function LocationDialog({
  tempLocation,
  setTempLocation,
  selectedAreas,
  setSelectedAreas,
  onClose,
  onSave
}: LocationDialogProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-brand-ink/10 pb-2">
        <span className="font-mono text-xs uppercase font-semibold text-brand-ink">
          Mötesplats: (Var ses vi?)
        </span>
      </div>

      <div className="space-y-3">
        <div>
          <label className="font-mono text-[10px] uppercase text-brand-ink/60 block mb-1">
            Skriv fri adress, platsnamn eller lokal:
          </label>
          <input
            type="text"
            value={tempLocation}
            onChange={e => {
              const val = e.target.value;
              setTempLocation(val);
              // Auto match against POI districts if selectedAreas is empty
              const matchedPoi = POI_LOCATIONS.find(poi =>
                val.toLowerCase().includes(poi.split(" ")[0].toLowerCase())
              );
              if (matchedPoi && selectedAreas.length === 0) {
                setSelectedAreas([matchedPoi]);
              }
            }}
            placeholder="t.ex. Utby kyrka, Utbyvägen 10 eller Slottsskogen"
            className="w-full px-4 py-2.5 bg-white border border-brand-ink/15 rounded-xl font-mono text-xs text-brand-ink focus:outline-none focus:border-brand-accent"
          />
        </div>

        <div>
          <label className="font-mono text-[10px] uppercase text-brand-ink/60 block mb-2">
            Eller välj snabbt bland kända område/platser (KML POI):
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
            {POI_LOCATIONS.map(poi => (
              <button
                key={poi}
                type="button"
                onClick={() => {
                  setTempLocation(poi);
                  if (selectedAreas.length === 0) {
                    setSelectedAreas([poi]);
                  }
                }}
                className={`p-2.5 rounded-xl border font-mono text-xs text-left transition-all cursor-pointer flex items-center justify-between ${
                  tempLocation === poi
                    ? "bg-brand-accent text-white border-brand-accent font-semibold"
                    : "bg-white border-brand-ink/10 text-brand-ink hover:border-brand-accent/50"
                }`}
              >
                <span>{poi}</span>
                {tempLocation === poi && <Check size={14} className="text-white shrink-0" />}
              </button>
            ))}
          </div>
        </div>
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
          onClick={() => onSave(tempLocation)}
          className="px-5 py-2 bg-brand-accent text-white rounded-xl font-mono text-xs uppercase font-semibold"
        >
          Klar
        </button>
      </div>
    </div>
  );
}

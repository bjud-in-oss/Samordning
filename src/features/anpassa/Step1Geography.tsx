// [CURRENT SUBDIRECTORY/CYCLE] | [4_Produce]

import React, { useState } from "react";
import { Check, MapPin, X } from "lucide-react";
import { GOTEBORG_AREAS, MAP_DISTRICTS, AREA_TO_DISTRICT_MAP, DISTRICT_NAME_MAPPING } from "./mapData";
import { UiLanguage } from "../mission_router/translations";

interface Step1GeographyProps {
  primaryArea?: string;
  setPrimaryArea: (area: string | undefined) => void;
  limitAreas: boolean;
  setLimitAreas: (limit: boolean) => void;
  limitedAreas: string[];
  setLimitedAreas: React.Dispatch<React.SetStateAction<string[]>>;
  isInline?: boolean;
  uiLanguage?: UiLanguage;
}

export default function Step1Geography({
  primaryArea,
  setPrimaryArea,
  limitAreas,
  setLimitAreas,
  limitedAreas,
  setLimitedAreas,
  isInline = false,
  uiLanguage = "sv"
}: Step1GeographyProps) {
  const [modalArea, setModalArea] = useState<string | null>(null);

  const toggleArea = (area: string) => {
    setLimitedAreas(prev => {
      const isSelected = prev.includes(area);
      const next = isSelected ? prev.filter(a => a !== area) : [...prev, area];
      if (next.length > 0) {
        setPrimaryArea(next[0]);
      } else {
        setPrimaryArea(undefined);
      }
      return next;
    });
  };

  const isAreaSelected = (area: string) => {
    return limitedAreas.includes(area) || primaryArea === area;
  };

  return (
    <div className="space-y-6 text-left">
      {!isInline && (
        <div className="space-y-1.5 pb-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-brand-accent font-semibold">
            Steg 1 av 4
          </span>
          <h3 className="font-serif italic text-xl font-medium text-brand-ink">Dina områden</h3>
          <p className="text-brand-ink/70 text-xs leading-relaxed font-light">
            {uiLanguage === "sv" 
              ? "Vilka områden brukar du träffa andra i?"
              : "Which areas do you usually meet others in?"}
          </p>
        </div>
      )}

      {/* Area Grid selector (Multi-select) */}
      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {GOTEBORG_AREAS.map(area => {
            const selected = isAreaSelected(area);
            return (
              <div
                key={area}
                id={`area-item-${area.replace(/\s+/g, "-")}`}
                className={`flex items-center justify-between p-4 rounded-xl border text-left transition-all min-h-[58px] duration-200 ${
                  selected
                    ? "border-brand-accent bg-brand-paper/40 text-brand-ink font-semibold"
                    : "border-brand-ink/5 bg-brand-bg text-brand-ink/80 hover:border-brand-accent/20"
                }`}
              >
                <div 
                  onClick={() => toggleArea(area)}
                  className="flex-1 cursor-pointer flex flex-col justify-center"
                >
                  <span className="font-serif italic text-sm sm:text-base font-medium text-brand-ink leading-tight">{area}</span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalArea(area);
                    }}
                    className="p-1.5 rounded-lg text-brand-ink/40 hover:text-brand-accent hover:bg-white transition-all cursor-pointer"
                    title="Visa gräns på karta"
                  >
                    <MapPin size={16} />
                  </button>
                  <div
                    onClick={() => toggleArea(area)}
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border cursor-pointer transition-colors ${
                      selected
                        ? "bg-brand-accent border-brand-accent text-white"
                        : "border-brand-ink/10 bg-white"
                    }`}
                  >
                    {selected && <Check size={12} strokeWidth={2.5} />}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Option for "Alla områden" */}
          <button
            type="button"
            id="all-areas-btn"
            onClick={() => {
              setLimitAreas(false);
              setPrimaryArea(undefined);
              setLimitedAreas([]);
            }}
            className={`flex items-center justify-between p-4 rounded-xl border text-left transition-all min-h-[58px] duration-200 ${
              !limitAreas && limitedAreas.length === 0
                ? "border-brand-accent bg-brand-paper/40 text-brand-ink font-semibold"
                : "border-brand-ink/5 bg-brand-bg text-brand-ink/80 hover:border-brand-accent/20"
            }`}
          >
            <div className="flex-1 flex flex-col justify-center">
              <span className="font-serif italic text-sm sm:text-base font-medium text-brand-ink leading-tight">Alla områden</span>
              <span className="text-[10px] text-brand-ink/65 font-light mt-1">Visa alla inbjudningar i hela regionen</span>
            </div>
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-colors ${
                !limitAreas && limitedAreas.length === 0
                  ? "bg-brand-accent border-brand-accent text-white"
                  : "border-brand-ink/10 bg-white"
              }`}
            >
              {!limitAreas && limitedAreas.length === 0 && <Check size={12} strokeWidth={2.5} />}
            </div>
          </button>

          {/* Option for "Inget område" */}
          <button
            type="button"
            id="no-area-btn"
            onClick={() => {
              setPrimaryArea(undefined);
              setLimitedAreas([]);
            }}
            className={`flex items-center justify-between p-4 rounded-xl border text-left transition-all min-h-[58px] duration-200 ${
              limitedAreas.length === 0 && primaryArea === undefined
                ? "border-brand-accent bg-brand-paper/40 text-brand-ink font-semibold"
                : "border-brand-ink/5 bg-brand-bg text-brand-ink/80 hover:border-brand-accent/20"
            }`}
          >
            <div className="flex-1 flex flex-col justify-center">
              <span className="font-serif italic text-sm sm:text-base font-medium text-brand-ink leading-tight">Inget område</span>
              <span className="text-[10px] text-brand-ink/65 font-light mt-1">Inget särskilt område valt</span>
            </div>
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-colors ${
                limitedAreas.length === 0 && primaryArea === undefined
                  ? "bg-brand-accent border-brand-accent text-white"
                  : "border-brand-ink/10 bg-white"
              }`}
            >
              {limitedAreas.length === 0 && primaryArea === undefined && <Check size={12} strokeWidth={2.5} />}
            </div>
          </button>
        </div>
      </div>

      {/* Full-screen Leaflet Modal */}
      {modalArea && (
        <div className="fixed inset-0 z-50 bg-brand-ink/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 bg-brand-paper flex items-center justify-between border-b border-brand-ink/5">
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-brand-accent" />
                <h3 className="font-serif italic text-lg font-medium text-brand-ink">
                  Gränskarta • {modalArea}
                </h3>
              </div>
              <button
                onClick={() => setModalArea(null)}
                className="p-1.5 rounded-lg hover:bg-brand-ink/5 text-brand-ink/60 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 flex-1 overflow-hidden min-h-[320px] relative">
              <div className="w-full h-full min-h-[300px] bg-brand-bg rounded-xl border border-brand-ink/5 flex items-center justify-center relative overflow-hidden">
                <iframe
                  title={`Karta över ${modalArea}`}
                  className="w-full h-full min-h-[300px] border-0 rounded-xl"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(modalArea + ", Göteborg")}&z=12&output=embed`}
                  loading="lazy"
                />
              </div>
            </div>

            <div className="p-4 bg-brand-bg border-t border-brand-ink/5 flex justify-end">
              <button
                onClick={() => setModalArea(null)}
                className="px-5 py-2 bg-brand-ink text-white font-mono text-xs uppercase tracking-wider rounded-xl hover:opacity-90 transition-opacity cursor-pointer"
              >
                Stäng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

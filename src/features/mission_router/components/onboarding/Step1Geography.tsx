// [CURRENT SUBDIRECTORY/CYCLE] | [4_Produce]

import React, { useState, useEffect, useRef } from "react";
import { Check } from "lucide-react";
import L from "leaflet";
import { MAP_DISTRICTS, GOTEBORG_AREAS, AREA_TO_DISTRICT_MAP, MapDistrict } from "../../domain/mapData";
import { TRANSLATIONS, UiLanguage } from "../../translations";

interface Step1GeographyProps {
  primaryArea: string | undefined;
  setPrimaryArea: (area: string | undefined) => void;
  limitAreas: boolean;
  setLimitAreas: (limit: boolean) => void;
  limitedAreas: string[];
  setLimitedAreas: React.Dispatch<React.SetStateAction<string[]>>;
  uiLanguage: UiLanguage;
}

interface MapModalProps {
  area: string;
  onClose: () => void;
}

// Helper to find KML district for area
const getKmlDistrictForArea = (area: string): MapDistrict | undefined => {
  const kmlName = AREA_TO_DISTRICT_MAP[area];
  if (kmlName) {
    return MAP_DISTRICTS.find(d => d.name === kmlName);
  }
  return undefined;
};

function MapModal({ area, onClose }: MapModalProps) {
  const modalMapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const district = getKmlDistrictForArea(area);

  useEffect(() => {
    if (!modalMapRef.current) return;

    const map = L.map(modalMapRef.current, {
      zoomControl: true,
      attributionControl: false,
      dragging: true,
      touchZoom: true,
      scrollWheelZoom: true
    }).setView([57.7088, 11.9745], 11);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 19
    }).addTo(map);

    mapInstanceRef.current = map;

    if (district && district.coordinates.length > 0) {
      const polygon = L.polygon(district.coordinates, {
        color: "#0d9488", // Teal 600
        weight: 3,
        fill: false,
        fillOpacity: 0
      }).addTo(map);

      const timer = setTimeout(() => {
        if (mapInstanceRef.current) {
          map.flyToBounds(polygon.getBounds(), {
            padding: [40, 40],
            duration: 1.0,
            animate: true
          });
        }
      }, 100);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [area, district]);

  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-0 md:p-6">
      <div className="relative w-full h-full md:max-w-4xl md:h-[80vh] bg-white md:rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-250">
        <div className="absolute top-4 right-4 z-[10000]">
          <button
            type="button"
            onClick={onClose}
            className="bg-white/95 hover:bg-white text-slate-800 font-bold px-4 py-2.5 rounded-xl border border-slate-200 shadow-lg transition-all active:scale-95 cursor-pointer text-sm"
          >
            Stäng karta
          </button>
        </div>

        <div ref={modalMapRef} className="flex-1 w-full h-full bg-slate-100 z-10"></div>

        <div className="absolute bottom-4 left-4 right-4 bg-slate-900/95 text-slate-100 backdrop-blur-sm px-5 py-3.5 rounded-2xl z-[10000] border border-slate-800/50 shadow-xl text-xs md:text-sm font-mono flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">Valt område</span>
            <span className="font-bold text-white text-sm mt-0.5">{area}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">KML-distrikt</span>
            <span className="font-medium text-teal-400 mt-0.5">
              {district ? district.name : "Okänt"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Step1Geography({
  primaryArea,
  setPrimaryArea,
  limitAreas,
  setLimitAreas,
  limitedAreas,
  setLimitedAreas,
  uiLanguage
}: Step1GeographyProps) {
  const [modalArea, setModalArea] = useState<string | null>(null);
  const t = TRANSLATIONS[uiLanguage];

  const toggleLimitedArea = (area: string) => {
    setLimitedAreas(prev =>
      prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]
    );
  };

  return (
    <div id="step-1-container" className="bg-white rounded-2xl p-6 md:p-8 border border-brand-ink/5 space-y-6 shadow-xs animate-in fade-in duration-200">
      <div className="flex flex-col items-start pb-2 border-b border-brand-ink/5">
        <span className="font-mono text-[9px] uppercase tracking-wider text-brand-accent bg-brand-paper px-2.5 py-1 rounded">
          Steg 1 av 4
        </span>
        <p className="text-brand-ink/70 text-xs leading-relaxed font-light mt-2">
          {t.step1Subtitle}
        </p>
      </div>

      {/* Area Grid selector (Single select for Primary area) */}
      <div className="space-y-3">
        <h4 className="font-serif italic text-sm text-brand-ink font-medium">Primärt bevakningsområde:</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {GOTEBORG_AREAS.map(area => {
            const isSelected = primaryArea === area;
            return (
              <div
                key={area}
                id={`primary-area-item-${area.replace(/\s+/g, "-")}`}
                className={`flex items-center justify-between p-4 rounded-xl border text-left transition-all min-h-[58px] duration-200 ${
                  isSelected
                    ? "border-brand-accent bg-brand-paper/40 text-brand-ink font-semibold"
                    : "border-brand-ink/5 bg-brand-bg text-brand-ink/80"
                }`}
              >
                <div 
                  onClick={() => {
                    setPrimaryArea(area);
                    if (limitAreas && limitedAreas.length === 0) {
                      setLimitedAreas([area]);
                    }
                  }}
                  className="flex-1 cursor-pointer flex flex-col justify-center"
                >
                  <span className="font-serif italic text-sm sm:text-base font-medium text-brand-ink leading-tight">{area}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalArea(area);
                    }}
                    className="font-mono text-[9px] text-brand-accent hover:opacity-100 opacity-60 underline mt-1 self-start cursor-pointer"
                  >
                    Visa gräns
                  </button>
                </div>
                
                <div
                  onClick={() => {
                    setPrimaryArea(area);
                    if (limitAreas && limitedAreas.length === 0) {
                      setLimitedAreas([area]);
                    }
                  }}
                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-brand-accent border-brand-accent text-white"
                      : "border-brand-ink/10 bg-white"
                  }`}
                >
                  {isSelected && <Check size={12} strokeWidth={2.5} />}
                </div>
              </div>
            );
          })}

          {/* "Inget område" choice */}
          <button
            type="button"
            id="no-area-btn"
            onClick={() => {
              setPrimaryArea(undefined);
              setLimitAreas(true);
              setLimitedAreas([]);
            }}
            className={`flex items-center justify-between p-4 rounded-xl border text-left transition-all min-h-[58px] duration-200 ${
              primaryArea === undefined
                ? "border-brand-accent bg-brand-paper/40 text-brand-ink font-semibold"
                : "border-brand-ink/5 bg-brand-bg text-brand-ink/80"
            }`}
          >
            <div className="flex-1 flex flex-col justify-center">
              <span className="font-serif italic text-sm sm:text-base font-medium text-brand-ink leading-tight">Inget område</span>
              <span className="text-[10px] text-brand-ink/65 font-light mt-1">Bevaka inga geografiska områden</span>
            </div>
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-colors ${
                primaryArea === undefined
                  ? "bg-brand-accent border-brand-accent text-white"
                  : "border-brand-ink/10 bg-white"
              }`}
            >
              {primaryArea === undefined && <Check size={12} strokeWidth={2.5} />}
            </div>
          </button>
        </div>
      </div>

      {/* Additional areas expander (only visible if primaryArea is chosen) */}
      {primaryArea && (
        <div className="pt-4 border-t border-brand-ink/5 space-y-4">
          <label className="flex items-start p-4 rounded-xl bg-brand-bg hover:bg-brand-paper/50 transition-colors cursor-pointer select-none border border-brand-ink/5">
            <input
              id="limit-areas-checkbox"
              type="checkbox"
              checked={limitAreas}
              onChange={e => {
                setLimitAreas(e.target.checked);
                if (e.target.checked && limitedAreas.length === 0) {
                  setLimitedAreas([primaryArea]);
                }
              }}
              className="w-4 h-4 rounded border-brand-ink/20 text-brand-accent mr-4 mt-1 cursor-pointer accent-brand-accent shrink-0"
            />
            <div>
              <div className="font-serif italic text-sm text-brand-ink font-medium">
                Bevaka endast specifika områden
              </div>
              <div className="text-[11px] text-brand-ink/70 mt-1 leading-normal font-light">
                Få endast aviseringar för specifika områden du bockar för nedan. Om omarkerad bevakar du automatiskt ALLA områden i hela församlingen.
              </div>
            </div>
          </label>

          {limitAreas && (
            <div className="pt-2 pl-2 animate-in fade-in duration-200">
              <h5 className="font-serif italic text-xs text-brand-ink mb-3 font-medium">Välj områden att bevaka:</h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {GOTEBORG_AREAS.map(area => {
                  const isChecked = limitedAreas.includes(area) || primaryArea === area;
                  const isPrimary = primaryArea === area;
                  return (
                    <button
                      key={area}
                      id={`limited-area-btn-${area.replace(/\s+/g, "-")}`}
                      type="button"
                      disabled={isPrimary}
                      onClick={() => toggleLimitedArea(area)}
                      className={`flex items-center justify-between p-3 rounded-lg border text-left transition-all text-xs ${
                        isChecked
                          ? "border-brand-accent bg-brand-paper/20 text-brand-ink font-medium"
                          : "border-brand-ink/5 bg-brand-bg hover:border-brand-accent/10 text-brand-ink/70"
                      } ${isPrimary ? "opacity-75 cursor-not-allowed" : ""}`}
                    >
                      <span className="flex items-center gap-1.5">
                        {area}
                        {isPrimary && <span className="text-[9px] font-mono text-brand-accent uppercase">(Primärt)</span>}
                      </span>
                      <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                        isChecked ? "bg-brand-accent border-brand-accent text-white" : "border-brand-ink/15 bg-white"
                      }`}>
                        {isChecked && <Check size={10} strokeWidth={3} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Full-screen Leaflet Modal */}
      {modalArea && (
        <MapModal 
          area={modalArea} 
          onClose={() => setModalArea(null)} 
        />
      )}
    </div>
  );
}

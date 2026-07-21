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
  isInline?: boolean;
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
  uiLanguage,
  isInline
}: Step1GeographyProps) {
  const [modalArea, setModalArea] = useState<string | null>(null);

  const toggleArea = (area: string) => {
    setLimitedAreas(prev => {
      const isSelected = prev.includes(area);
      const next = isSelected ? prev.filter(a => a !== area) : [...prev, area];
      // Keep primaryArea synced to the first item or undefined
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
    <div id="step-1-container" className={`bg-white rounded-2xl ${isInline ? "p-0 space-y-4" : "p-6 md:p-8 space-y-6"} border border-brand-ink/5 shadow-xs animate-in fade-in duration-200`}>
      
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
            );
          })}

          {/* "Inget område" choice */}
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
        <MapModal 
          area={modalArea} 
          onClose={() => setModalArea(null)} 
        />
      )}
    </div>
  );
}

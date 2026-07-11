import React, { useState, useEffect, useRef } from "react";
import { Check, Bell } from "lucide-react";
import L from "leaflet";
import { MAP_DISTRICTS, DISTRICT_NAME_MAPPING, MapDistrict, GOTEBORG_AREAS, AREA_TO_DISTRICT_MAP } from "../domain/mapData";
import { TRANSLATIONS, UiLanguage } from "../translations";

// [CURRENT SUBDIRECTORY/CYCLE] | [4_Produce]

const LANGUAGE_OPTIONS = [
  { code: "Svenska", label: "Svenska / Swedish" },
  { code: "English", label: "English / English" },
  { code: "Español", label: "Español / Spanish" },
  { code: "Kiswahili", label: "Kiswahili / Swahili" },
  { code: "Tiếng Việt", label: "Tiếng Việt / Vietnamese" }
];

interface OnboardingFormProps {
  onSave: (tags: {
    areas: string[];
    languages: string[];
    organization: string;
    formats: ("physical" | "telephone")[];
    alwaysNotify: boolean;
    spiritualTips: boolean;
  }) => void;
  savedTags?: {
    areas: string[];
    languages?: string[];
    organization?: string;
    formats: ("physical" | "telephone")[];
    alwaysNotify: boolean;
    spiritualTips: boolean;
  };
  pushEnabled: boolean;
  onEnablePush: () => void;
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

    // Initialize Leaflet Map
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
      // Draw district polygon (fillOpacity: 0, Teal 600 line)
      const polygon = L.polygon(district.coordinates, {
        color: "#0d9488", // Teal 600
        weight: 3,
        fill: false,
        fillOpacity: 0
      }).addTo(map);

      // Smooth flight with slight delay
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

  // Handle map removal on unmount (critical to prevent memory leaks)
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
        {/* Modal Header */}
        <div className="absolute top-4 right-4 z-[10000]">
          <button
            type="button"
            onClick={onClose}
            className="bg-white/95 hover:bg-white text-slate-800 font-bold px-4 py-2.5 rounded-xl border border-slate-200 shadow-lg transition-all active:scale-95 cursor-pointer text-sm"
          >
            Stäng karta
          </button>
        </div>

        {/* Map Container */}
        <div ref={modalMapRef} className="flex-1 w-full h-full bg-slate-100 z-10"></div>

        {/* Bottom Banner */}
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

export default function OnboardingForm({
  onSave,
  savedTags,
  pushEnabled,
  onEnablePush,
  uiLanguage
}: OnboardingFormProps) {
  const [selectedAreas, setSelectedAreas] = useState<string[]>(
    savedTags?.areas || ["Kortedala Norra"]
  );
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(
    savedTags?.languages || ["Svenska"]
  );
  const [organization, setOrganization] = useState<string>(
    savedTags?.organization || "bror"
  );
  const [formats, setFormats] = useState<("physical" | "telephone")[]>(
    savedTags?.formats || ["physical"]
  );
  const [alwaysNotify, setAlwaysNotify] = useState<boolean>(
    savedTags?.alwaysNotify ?? true
  );
  const [spiritualTips, setSpiritualTips] = useState<boolean>(
    savedTags?.spiritualTips ?? false
  );

  const [modalArea, setModalArea] = useState<string | null>(null);

  const t = TRANSLATIONS[uiLanguage];

  // Keep the latest onSave callback in a ref to avoid infinite re-renders
  const onSaveRef = useRef(onSave);
  useEffect(() => {
    onSaveRef.current = onSave;
  }, [onSave]);

  // Auto-save on any change to preference state
  useEffect(() => {
    onSaveRef.current({
      areas: selectedAreas,
      languages: selectedLanguages,
      organization,
      formats,
      alwaysNotify,
      spiritualTips
    });
  }, [selectedAreas, selectedLanguages, organization, formats, alwaysNotify, spiritualTips]);

  const toggleArea = (area: string) => {
    setSelectedAreas(prev =>
      prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]
    );
  };

  const toggleLanguage = (lang: string) => {
    setSelectedLanguages(prev =>
      prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
    );
  };

  const toggleFormat = (format: "physical" | "telephone") => {
    setFormats(prev =>
      prev.includes(format) ? prev.filter(f => f !== format) : [...prev, format]
    );
  };

  const introText = uiLanguage === "sv" || !t.onboardingIntro
    ? "Genom att anpassa valen nedan får du en diskret avisering (notis) direkt i din telefon eller dator så fort någon i församlingen delar en ny inbjudan eller aktivitet i något av dina valda områden. Du kan enkelt läsa detaljerna och tacka ja via SMS."
    : t.onboardingIntro;

  const pushBoxTitle = "Prenumerera på notiser";
  const pushBoxSubtitle = "Du får då en diskret avisering direkt i din telefon när det finns en inbjudan till dig.";
  const disclaimerText = "Ingen historik sparas";

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-12">
      
      {/* 1. NOTISPRENUMERATION (Aviseringsrutan flyttad ALLRA HÖGST UPP) */}
      <div className="bg-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-teal-400 font-bold text-xs tracking-wider uppercase">
            <Bell size={16} />
            <span>{pushBoxTitle}</span>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-slate-50">{pushBoxTitle}</h3>
          <p className="text-slate-300 text-xs md:text-sm leading-relaxed max-w-md">
            {pushBoxSubtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={onEnablePush}
          disabled={pushEnabled}
          className={`px-5 py-3.5 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer ${
            pushEnabled
              ? "bg-emerald-600/20 text-emerald-300 border border-emerald-500/20"
              : "bg-teal-600 hover:bg-teal-700 text-white shadow-sm active:scale-[0.98]"
          }`}
        >
          {pushEnabled ? t.pushBtnActive : t.pushBtnInactive}
        </button>
      </div>

      {/* Intro Text */}
      <div className="bg-slate-50 rounded-3xl p-6 md:p-8 border border-slate-100">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-2">
          {t.onboardingHeader}
        </h2>
        <p className="text-slate-600 text-xs md:text-sm leading-relaxed">
          {introText}
        </p>
      </div>

      {/* Steg 1: Geografiskt val */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            {t.step1Title}
          </span>
          <h3 className="text-xl font-bold text-slate-950 mt-2 mb-1">
            {t.step1Subtitle}
          </h3>
        </div>

        {/* Text-based geographical areas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {GOTEBORG_AREAS.map(area => {
            const isSelected = selectedAreas.includes(area);
            return (
              <div
                key={area}
                className={`flex items-center justify-between p-4 rounded-2xl border-2 text-left transition-all min-h-[58px] ${
                  isSelected
                    ? "border-teal-600/70 bg-teal-50/30 text-teal-950"
                    : "border-slate-100 bg-slate-50/40 text-slate-700"
                }`}
              >
                <div 
                  onClick={() => toggleArea(area)}
                  className="flex-1 cursor-pointer flex flex-col justify-center"
                >
                  <span className="text-sm sm:text-base font-bold text-slate-800 leading-tight">{area}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalArea(area);
                    }}
                    className="text-[11px] text-teal-600 hover:text-teal-700 hover:underline font-semibold mt-1 self-start cursor-pointer"
                  >
                    Visa gräns
                  </button>
                </div>
                
                <div
                  onClick={() => toggleArea(area)}
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border cursor-pointer ${
                    isSelected
                      ? "bg-teal-600 border-teal-600 text-white"
                      : "border-slate-300 bg-white"
                  }`}
                >
                  {isSelected && <Check size={14} strokeWidth={3} />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Steg 2: Organisation & Språk */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            {t.step2Title}
          </span>
          <h3 className="text-xl font-bold text-slate-950 mt-2 mb-1">
            {t.step2Subtitle}
          </h3>
        </div>

        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
          <h4 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-teal-600 rounded-full"></span>
            {t.step2OrgHeader}
          </h4>
          <p className="text-slate-600 text-xs md:text-sm leading-relaxed">
            {t.step2OrgText}
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="text-base font-bold text-slate-900">{t.orgChoiceLabel}</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setOrganization("bror")}
              className={`flex items-center justify-between p-4 rounded-2xl border-2 text-left transition-all cursor-pointer min-h-[58px] ${
                organization === "bror"
                  ? "border-teal-600/70 bg-teal-50/30 text-teal-950"
                  : "border-slate-100 bg-slate-50/40 hover:border-slate-200 text-slate-700"
              }`}
            >
              <span className="text-base font-semibold text-slate-800">{t.orgBror}</span>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border ${
                  organization === "bror"
                    ? "bg-teal-600 border-teal-600 text-white"
                    : "border-slate-300 bg-white"
                }`}
              >
                {organization === "bror" && <Check size={14} strokeWidth={3} />}
              </div>
            </button>

            <button
              type="button"
              onClick={() => setOrganization("syster")}
              className={`flex items-center justify-between p-4 rounded-2xl border-2 text-left transition-all cursor-pointer min-h-[58px] ${
                organization === "syster"
                  ? "border-teal-600/70 bg-teal-50/30 text-teal-950"
                  : "border-slate-100 bg-slate-50/40 hover:border-slate-200 text-slate-700"
              }`}
            >
              <span className="text-base font-semibold text-slate-800">{t.orgSyster}</span>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border ${
                  organization === "syster"
                    ? "bg-teal-600 border-teal-600 text-white"
                    : "border-slate-300 bg-white"
                }`}
              >
                {organization === "syster" && <Check size={14} strokeWidth={3} />}
              </div>
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <h4 className="text-base font-bold text-slate-900">{t.step2LangHeader}</h4>
            <p className="text-xs text-slate-500">{t.step2LangSubtitle}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {LANGUAGE_OPTIONS.map(lang => {
              const isSelected = selectedLanguages.includes(lang.code);
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => toggleLanguage(lang.code)}
                  className={`flex items-center justify-between p-4 rounded-2xl border-2 text-left transition-all cursor-pointer min-h-[58px] ${
                    isSelected
                      ? "border-teal-600/70 bg-teal-50/30 text-teal-950"
                      : "border-slate-100 bg-slate-50/40 hover:border-slate-200 text-slate-700"
                  }`}
                >
                  <span className="text-base font-semibold text-slate-800">{lang.label}</span>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border ${
                      isSelected
                        ? "bg-teal-600 border-teal-600 text-white"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    {isSelected && <Check size={14} strokeWidth={3} />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Steg 3: Hur vill du hjälpa */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
        <div className="mb-5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            {t.step3Title}
          </span>
          <h3 className="text-xl font-bold text-slate-950 mt-2 mb-1">
            {t.step3Subtitle}
          </h3>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => toggleFormat("physical")}
            className={`w-full flex items-start p-5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
              formats.includes("physical")
                ? "border-teal-600/70 bg-teal-50/30 text-teal-950"
                : "border-slate-100 bg-slate-50/40 hover:border-slate-200 text-slate-700"
            }`}
          >
            <div
              className={`w-6 h-6 rounded border flex items-center justify-center mr-4 shrink-0 mt-0.5 ${
                formats.includes("physical")
                  ? "bg-teal-600 border-teal-600 text-white"
                  : "border-slate-300 bg-white"
              }`}
            >
              {formats.includes("physical") && <Check size={14} strokeWidth={3} />}
            </div>
            <div>
              <div className="text-base font-bold text-slate-800 leading-none mb-1">
                {t.formatPhysicalTitle}
              </div>
              <div className="text-xs md:text-sm text-slate-500 leading-relaxed">
                {t.formatPhysicalDesc}
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => toggleFormat("telephone")}
            className={`w-full flex items-start p-5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
              formats.includes("telephone")
                ? "border-teal-600/70 bg-teal-50/30 text-teal-950"
                : "border-slate-100 bg-slate-50/40 hover:border-slate-200 text-slate-700"
            }`}
          >
            <div
              className={`w-6 h-6 rounded border flex items-center justify-center mr-4 shrink-0 mt-0.5 ${
                formats.includes("telephone")
                  ? "bg-teal-600 border-teal-600 text-white"
                  : "border-slate-300 bg-white"
              }`}
            >
              {formats.includes("telephone") && <Check size={14} strokeWidth={3} />}
            </div>
            <div>
              <div className="text-base font-bold text-slate-800 leading-none mb-1">
                {t.formatDigitalTitle}
              </div>
              <div className="text-xs md:text-sm text-slate-500 leading-relaxed">
                {t.formatDigitalDesc}
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Steg 4: Detaljerade Inställningar */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
        <div className="mb-5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            {t.step4Title}
          </span>
          <h3 className="text-xl font-bold text-slate-950 mt-2 mb-1">
            {t.step4Subtitle}
          </h3>
        </div>

        <div className="space-y-4">
          <label className="flex items-start p-4 rounded-2xl bg-slate-50/50 hover:bg-slate-100/70 transition-colors cursor-pointer select-none">
            <input
              type="checkbox"
              checked={alwaysNotify}
              onChange={e => setAlwaysNotify(e.target.checked)}
              className="w-5 h-5 rounded border-slate-300 text-teal-600 mr-4 mt-0.5 cursor-pointer accent-teal-600 shrink-0"
            />
            <div>
              <div className="text-base font-bold text-slate-800 leading-tight">
                {t.notifyOptionTitle}
              </div>
              <div className="text-xs text-slate-500 mt-1 leading-normal">
                {t.notifyOptionDesc}
              </div>
            </div>
          </label>

          <label className="flex items-start p-4 rounded-2xl bg-slate-50/50 hover:bg-slate-100/70 transition-colors cursor-pointer select-none">
            <input
              type="checkbox"
              checked={spiritualTips}
              onChange={e => setSpiritualTips(e.target.checked)}
              className="w-5 h-5 rounded border-slate-300 text-teal-600 mr-4 mt-0.5 cursor-pointer accent-teal-600 shrink-0"
            />
            <div>
              <div className="text-base font-bold text-slate-800 leading-tight">
                {t.spiritualOptionTitle}
              </div>
              <div className="text-xs text-slate-500 mt-1 leading-normal">
                {t.spiritualOptionDesc}
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Footnote / Disclaimer */}
      <div className="text-center text-[11px] text-slate-400 font-medium">
        <span>{disclaimerText}</span>
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

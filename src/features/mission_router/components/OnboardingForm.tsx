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
  onDisablePush: () => void;
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
  onDisablePush,
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

  // Admin Management State
  const [adminsInput, setAdminsInput] = useState<string>("");
  const [adminsSaving, setAdminsSaving] = useState<boolean>(false);
  const [adminsMessage, setAdminsMessage] = useState<string | null>(null);

  useEffect(() => {
    // Fetch initial admins
    fetch("/api/admins")
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.admins)) {
          setAdminsInput(data.admins.join(", "));
        }
      })
      .catch(err => console.error("Failed to fetch admins", err));
  }, []);

  const handleSaveAdmins = async () => {
    setAdminsSaving(true);
    setAdminsMessage(null);
    try {
      const parsedAdmins = adminsInput
        .split(",")
        .map(num => num.trim())
        .filter(Boolean);

      const res = await fetch("/api/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ admins: parsedAdmins })
      });

      if (!res.ok) throw new Error("Kunde inte spara.");
      
      setAdminsMessage("Samordnare sparade!");
      setTimeout(() => setAdminsMessage(null), 3000);
    } catch (err) {
      setAdminsMessage("Ett fel uppstod vid sparande.");
    } finally {
      setAdminsSaving(false);
    }
  };

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
      
      {/* 1. NOTISPRENUMERATION (Aviseringsrutan flyttad ALLRA HÖGST UPP med iOS Toggle) */}
      <div className="bg-brand-ink rounded-2xl p-6 md:p-8 text-brand-bg shadow-sm flex items-center justify-between gap-6">
        <div className="space-y-1.5 flex-1 pr-4">
          <div className="flex items-center gap-2 text-brand-paper font-mono text-[10px] tracking-wider uppercase">
            <Bell size={12} className="text-brand-accent" />
            <span>{pushBoxTitle}</span>
          </div>
          <p className="text-brand-paper/80 text-[11px] md:text-xs leading-normal font-light">
            {pushBoxSubtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (pushEnabled) {
              onDisablePush();
            } else {
              onEnablePush();
            }
          }}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            pushEnabled ? "bg-brand-accent" : "bg-brand-bg/20"
          }`}
          aria-label="Toggle push notifications"
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
              pushEnabled ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Intro Text */}
      <div className="bg-brand-paper/50 rounded-2xl p-6 md:p-8 border border-brand-ink/5">
        <h2 className="font-serif italic text-lg sm:text-xl text-brand-ink tracking-tight mb-2 font-medium">
          {t.onboardingHeader}
        </h2>
        <p className="text-brand-ink/70 text-xs md:text-sm leading-relaxed font-light">
          {introText}
        </p>
      </div>

      {/* Steg 1: Geografiskt val */}
      <div className="bg-white rounded-2xl p-6 md:p-8 border border-brand-ink/5 space-y-6 shadow-xs">
        <div className="flex flex-col items-start">
          <span className="font-mono text-[9px] uppercase tracking-wider text-brand-accent bg-brand-paper px-2.5 py-1 rounded">
            {t.step1Title}
          </span>
          <h3 className="font-serif italic text-lg sm:text-xl text-brand-ink mt-3 mb-1 font-medium">
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
                className={`flex items-center justify-between p-4 rounded-xl border text-left transition-all min-h-[58px] duration-200 ${
                  isSelected
                    ? "border-brand-accent bg-brand-paper/40 text-brand-ink"
                    : "border-brand-ink/5 bg-brand-bg text-brand-ink/80"
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
        </div>
      </div>

      {/* Steg 2: Organisation & Språk */}
      <div className="bg-white rounded-2xl p-6 md:p-8 border border-brand-ink/5 space-y-6 shadow-xs">
        <div className="flex flex-col items-start">
          <span className="font-mono text-[9px] uppercase tracking-wider text-brand-accent bg-brand-paper px-2.5 py-1 rounded">
            {t.step2Title}
          </span>
          <h3 className="font-serif italic text-lg sm:text-xl text-brand-ink mt-3 mb-1 font-medium">
            {t.step2Subtitle}
          </h3>
        </div>

        <div className="bg-brand-paper/40 rounded-xl p-5 border border-brand-ink/5">
          <h4 className="font-serif italic text-sm text-brand-ink mb-1.5 flex items-center gap-2 font-medium">
            <span className="w-1.5 h-1.5 bg-brand-accent rounded-full"></span>
            {t.step2OrgHeader}
          </h4>
          <p className="text-brand-ink/70 text-xs md:text-sm leading-relaxed font-light">
            {t.step2OrgText}
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="font-serif italic text-base text-brand-ink font-medium">{t.orgChoiceLabel}</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setOrganization("bror")}
              className={`flex items-center justify-between p-4 rounded-xl border text-left transition-all cursor-pointer min-h-[58px] duration-200 ${
                organization === "bror"
                  ? "border-brand-accent bg-brand-paper/40 text-brand-ink"
                  : "border-brand-ink/5 bg-brand-bg hover:border-brand-accent/20 text-brand-ink/80"
              }`}
            >
              <span className="font-sans text-sm font-medium text-brand-ink">{t.orgBror}</span>
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-colors ${
                  organization === "bror"
                    ? "bg-brand-accent border-brand-accent text-white"
                    : "border-brand-ink/10 bg-white"
                }`}
              >
                {organization === "bror" && <Check size={12} strokeWidth={2.5} />}
              </div>
            </button>

            <button
              type="button"
              onClick={() => setOrganization("syster")}
              className={`flex items-center justify-between p-4 rounded-xl border text-left transition-all cursor-pointer min-h-[58px] duration-200 ${
                organization === "syster"
                  ? "border-brand-accent bg-brand-paper/40 text-brand-ink"
                  : "border-brand-ink/5 bg-brand-bg hover:border-brand-accent/20 text-brand-ink/80"
              }`}
            >
              <span className="font-sans text-sm font-medium text-brand-ink">{t.orgSyster}</span>
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-colors ${
                  organization === "syster"
                    ? "bg-brand-accent border-brand-accent text-white"
                    : "border-brand-ink/10 bg-white"
                }`}
              >
                {organization === "syster" && <Check size={12} strokeWidth={2.5} />}
              </div>
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <h4 className="font-serif italic text-base text-brand-ink font-medium">{t.step2LangHeader}</h4>
            <p className="font-mono text-[9px] text-brand-accent uppercase tracking-wider mt-0.5">{t.step2LangSubtitle}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {LANGUAGE_OPTIONS.map(lang => {
              const isSelected = selectedLanguages.includes(lang.code);
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => toggleLanguage(lang.code)}
                  className={`flex items-center justify-between p-4 rounded-xl border text-left transition-all cursor-pointer min-h-[58px] duration-200 ${
                    isSelected
                      ? "border-brand-accent bg-brand-paper/40 text-brand-ink"
                      : "border-brand-ink/5 bg-brand-bg hover:border-brand-accent/20 text-brand-ink/80"
                  }`}
                >
                  <span className="font-sans text-sm font-medium text-brand-ink">{lang.label}</span>
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-colors ${
                      isSelected
                        ? "bg-brand-accent border-brand-accent text-white"
                        : "border-brand-ink/10 bg-white"
                    }`}
                  >
                    {isSelected && <Check size={12} strokeWidth={2.5} />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Steg 3: Hur vill du hjälpa */}
      <div className="bg-white rounded-2xl p-6 md:p-8 border border-brand-ink/5 shadow-xs">
        <div className="mb-5 flex flex-col items-start">
          <span className="font-mono text-[9px] uppercase tracking-wider text-brand-accent bg-brand-paper px-2.5 py-1 rounded">
            {t.step3Title}
          </span>
          <h3 className="font-serif italic text-lg sm:text-xl text-brand-ink mt-3 mb-1 font-medium">
            {t.step3Subtitle}
          </h3>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => toggleFormat("physical")}
            className={`w-full flex items-start p-5 rounded-xl border text-left transition-all cursor-pointer duration-200 ${
              formats.includes("physical")
                ? "border-brand-accent bg-brand-paper/40 text-brand-ink"
                : "border-brand-ink/5 bg-brand-bg hover:border-brand-accent/20 text-brand-ink/80"
            }`}
          >
            <div
              className={`w-5 h-5 rounded border flex items-center justify-center mr-4 shrink-0 mt-0.5 transition-colors ${
                formats.includes("physical")
                  ? "bg-brand-accent border-brand-accent text-white"
                  : "border-brand-ink/10 bg-white"
              }`}
            >
              {formats.includes("physical") && <Check size={12} strokeWidth={2.5} />}
            </div>
            <div>
              <div className="font-serif italic text-base text-brand-ink font-medium mb-1">
                {t.formatPhysicalTitle}
              </div>
              <div className="text-xs md:text-sm text-brand-ink/70 font-light leading-relaxed">
                {t.formatPhysicalDesc}
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => toggleFormat("telephone")}
            className={`w-full flex items-start p-5 rounded-xl border text-left transition-all cursor-pointer duration-200 ${
              formats.includes("telephone")
                ? "border-brand-accent bg-brand-paper/40 text-brand-ink"
                : "border-brand-ink/5 bg-brand-bg hover:border-brand-accent/20 text-brand-ink/80"
            }`}
          >
            <div
              className={`w-5 h-5 rounded border flex items-center justify-center mr-4 shrink-0 mt-0.5 transition-colors ${
                formats.includes("telephone")
                  ? "bg-brand-accent border-brand-accent text-white"
                  : "border-brand-ink/10 bg-white"
              }`}
            >
              {formats.includes("telephone") && <Check size={12} strokeWidth={2.5} />}
            </div>
            <div>
              <div className="font-serif italic text-base text-brand-ink font-medium mb-1">
                {t.formatDigitalTitle}
              </div>
              <div className="text-xs md:text-sm text-brand-ink/70 font-light leading-relaxed">
                {t.formatDigitalDesc}
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Steg 4: Detaljerade Inställningar */}
      <div className="bg-white rounded-2xl p-6 md:p-8 border border-brand-ink/5 shadow-xs">
        <div className="mb-5 flex flex-col items-start">
          <span className="font-mono text-[9px] uppercase tracking-wider text-brand-accent bg-brand-paper px-2.5 py-1 rounded">
            {t.step4Title}
          </span>
          <h3 className="font-serif italic text-lg sm:text-xl text-brand-ink mt-3 mb-1 font-medium">
            {t.step4Subtitle}
          </h3>
        </div>

        <div className="space-y-4">
          <label className="flex items-start p-4 rounded-xl bg-brand-bg hover:bg-brand-paper/50 transition-colors cursor-pointer select-none border border-brand-ink/5">
            <input
              type="checkbox"
              checked={alwaysNotify}
              onChange={e => setAlwaysNotify(e.target.checked)}
              className="w-4 h-4 rounded border-brand-ink/20 text-brand-accent mr-4 mt-1 cursor-pointer accent-brand-accent shrink-0"
            />
            <div>
              <div className="font-serif italic text-base text-brand-ink font-medium">
                {t.notifyOptionTitle}
              </div>
              <div className="text-xs text-brand-ink/70 mt-1 leading-normal font-light">
                {t.notifyOptionDesc}
              </div>
            </div>
          </label>

          <label className="flex items-start p-4 rounded-xl bg-brand-bg hover:bg-brand-paper/50 transition-colors cursor-pointer select-none border border-brand-ink/5">
            <input
              type="checkbox"
              checked={spiritualTips}
              onChange={e => setSpiritualTips(e.target.checked)}
              className="w-4 h-4 rounded border-brand-ink/20 text-brand-accent mr-4 mt-1 cursor-pointer accent-brand-accent shrink-0"
            />
            <div>
              <div className="font-serif italic text-base text-brand-ink font-medium">
                {t.spiritualOptionTitle}
              </div>
              <div className="text-xs text-brand-ink/70 mt-1 leading-normal font-light">
                {t.spiritualOptionDesc}
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Administrations-panel för samordningsgruppen */}
      <div className="bg-brand-paper/50 rounded-2xl p-6 border border-brand-ink/5 space-y-4">
        <div>
          <h4 className="font-serif italic text-sm text-brand-ink flex items-center gap-2 font-medium">
            <span className="w-1.5 h-1.5 bg-brand-error rounded-full animate-pulse"></span>
            Administratörer (SMS-Moderering)
          </h4>
          <p className="font-mono text-[9px] text-brand-accent uppercase tracking-wider mt-1 leading-normal">
            Kommaseparerade telefonnummer till samordnare som ska få larm och moderera webbinlägg via SMS.
          </p>
        </div>

        <div className="space-y-2.5">
          <input
            type="text"
            value={adminsInput}
            onChange={e => setAdminsInput(e.target.value)}
            placeholder="0700000000, 0731112222"
            className="w-full px-4 py-2.5 bg-white border border-brand-ink/10 rounded-xl text-brand-ink placeholder-brand-ink/30 text-xs focus:outline-none focus:border-brand-accent transition-colors"
          />
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={handleSaveAdmins}
              disabled={adminsSaving}
              className="px-4 py-2 bg-brand-ink hover:opacity-90 text-white font-mono text-[9px] uppercase tracking-wider rounded-lg transition-all cursor-pointer disabled:opacity-50"
            >
              {adminsSaving ? "Sparar..." : "Spara samordnare"}
            </button>
            {adminsMessage && (
              <span className="font-mono text-[10px] text-brand-accent uppercase tracking-wider animate-in fade-in duration-200">
                {adminsMessage}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footnote / Disclaimer */}
      <div className="text-center text-[10px] font-mono text-brand-accent uppercase tracking-wider">
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

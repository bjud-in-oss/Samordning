// [CURRENT SUBDIRECTORY/CYCLE] | [4_Produce]

import React, { useState, useEffect, useRef } from "react";
import { Check, Bell, Info, ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import L from "leaflet";
import { MAP_DISTRICTS, DISTRICT_NAME_MAPPING, MapDistrict, GOTEBORG_AREAS, AREA_TO_DISTRICT_MAP } from "../domain/mapData";
import { TRANSLATIONS, UiLanguage } from "../translations";

const LANGUAGE_OPTIONS = [
  { code: "Svenska", label: "Svenska / Swedish" },
  { code: "English", label: "English / English" },
  { code: "Español", label: "Español / Spanish" },
  { code: "Kiswahili", label: "Kiswahili / Swahili" },
  { code: "Tiếng Việt", label: "Tiếng Việt / Vietnamese" }
];

const ORGANIZATIONS = [
  "Missionärerna",
  "Församlingsmissionen",
  "Biskopsrådet",
  "Äldstekvorumet",
  "Hjälpföreningen",
  "Unga Män (UM)",
  "Unga Kvinnor (UK)",
  "Primär",
  "Söndagsskolan",
  "Aktivitetskommittén",
  "Unga vuxna (UV)",
  "Ensamstående vuxna (EV)",
  "Institutet",
  "Seminariet",
  "Staven"
];

const ORG_INFO: Record<string, string> = {
  "Missionärerna": "Heltidsmissionärer verksamma i området.",
  "Församlingsmissionen": "Lokalt samordnad medlemsmission.",
  "Biskopsrådet": "Ledarskapets officiella kallelser.",
  "Äldstekvorumet": "Vuxna bröder med fokus på stöd & tjänande.",
  "Hjälpföreningen": "Vuxna systrar med fokus på omsorg & gemenskap.",
  "Unga Män (UM)": "Ungdomsverksamhet för unga män (12-18 år).",
  "Unga Kvinnor (UK)": "Ungdomsverksamhet för unga kvinnor (12-18 år).",
  "Primär": "Barnverksamhet (upp till 11 år).",
  "Söndagsskolan": "Söndagens undervisningsverksamhet.",
  "Aktivitetskommittén": "Församlingens gemensamma fester och sociala aktiviteter.",
  "Unga vuxna (UV)": "Gemenskap för ensamstående vuxna i åldern 18-30 år.",
  "Ensamstående vuxna (EV)": "Gemenskap för ensamstående vuxna över 30 år.",
  "Institutet": "Religionsundervisning för unga vuxna.",
  "Seminariet": "Daglig religionsundervisning för tonåringar.",
  "Staven": "Regional ledning och regionala aktiviteter."
};

interface OnboardingFormProps {
  onSave: (tags: {
    areas: string[];
    primaryArea?: string;
    limitAreas?: boolean;
    limitedAreas?: string[];
    limitOrganizations?: boolean;
    limitedOrganizations?: string[];
    languages: string[];
    organization: string;
    formats: ("physical" | "telephone")[];
    alwaysNotify: boolean;
    spiritualTips: boolean;
  }) => void;
  savedTags?: {
    areas: string[];
    primaryArea?: string;
    limitAreas?: boolean;
    limitedAreas?: string[];
    limitOrganizations?: boolean;
    limitedOrganizations?: string[];
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
  onClose?: () => void;
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

// Helper to dynamically filter organizations based on primary group to avoid clutter
const getHiddenOrgsForGroup = (primaryOrg: string): string[] => {
  if (primaryOrg === "bror") {
    return ["Hjälpföreningen", "Unga Kvinnor (UK)"];
  }
  if (primaryOrg === "syster") {
    return ["Äldstekvorumet", "Unga Män (UM)"];
  }
  return [];
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

export default function OnboardingForm({
  onSave,
  savedTags,
  pushEnabled,
  onEnablePush,
  onDisablePush,
  uiLanguage,
  onClose
}: OnboardingFormProps) {
  // Wizard active step (1 to 4)
  const [currentStep, setCurrentStep] = useState<number>(1);

  const [primaryArea, setPrimaryArea] = useState<string | undefined>(
    savedTags?.primaryArea === undefined ? "Kortedala Norra" : (savedTags.primaryArea || undefined)
  );
  const [limitAreas, setLimitAreas] = useState<boolean>(
    savedTags?.limitAreas ?? false
  );
  const [limitedAreas, setLimitedAreas] = useState<string[]>(
    savedTags?.limitedAreas || []
  );
  const [limitOrganizations, setLimitOrganizations] = useState<boolean>(
    savedTags?.limitOrganizations ?? true
  );
  const [limitedOrganizations, setLimitedOrganizations] = useState<string[]>(
    savedTags?.limitedOrganizations || ORGANIZATIONS
  );
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(
    savedTags?.languages || ["Svenska"]
  );
  const [organization, setOrganization] = useState<string>(
    savedTags?.organization || "bror"
  );
  const [formats, setFormats] = useState<("physical" | "telephone")[]>(
    savedTags?.formats || ["physical", "telephone"]
  );
  const [alwaysNotify, setAlwaysNotify] = useState<boolean>(
    savedTags?.alwaysNotify ?? true
  );
  const [spiritualTips, setSpiritualTips] = useState<boolean>(
    savedTags?.spiritualTips ?? true
  );
  const [gdprAccepted, setGdprAccepted] = useState<boolean>(true);

  const [modalArea, setModalArea] = useState<string | null>(null);
  const [infoOrg, setInfoOrg] = useState<string | null>(null);

  const t = TRANSLATIONS[uiLanguage];

  const onSaveRef = useRef(onSave);
  useEffect(() => {
    onSaveRef.current = onSave;
  }, [onSave]);

  // Auto-save on any change to preference state (only if GDPR is accepted)
  useEffect(() => {
    if (!gdprAccepted) return;

    // Filter out hidden organizations from saving if we limit organizations
    const hiddenOrgs = getHiddenOrgsForGroup(organization);
    const filteredLimitedOrgs = limitedOrganizations.filter(org => !hiddenOrgs.includes(org));

    onSaveRef.current({
      areas: limitAreas ? (primaryArea ? [primaryArea, ...limitedAreas.filter(a => a !== primaryArea)] : limitedAreas) : GOTEBORG_AREAS,
      primaryArea,
      limitAreas,
      limitedAreas,
      limitOrganizations,
      limitedOrganizations: filteredLimitedOrgs,
      languages: selectedLanguages,
      organization,
      formats,
      alwaysNotify,
      spiritualTips
    });
  }, [
    primaryArea,
    limitAreas,
    limitedAreas,
    limitOrganizations,
    limitedOrganizations,
    selectedLanguages,
    organization,
    formats,
    alwaysNotify,
    spiritualTips,
    gdprAccepted
  ]);

  const toggleLimitedArea = (area: string) => {
    setLimitedAreas(prev =>
      prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]
    );
  };

  const toggleLimitedOrg = (org: string) => {
    setLimitedOrganizations(prev =>
      prev.includes(org) ? prev.filter(o => o !== org) : [...prev, org]
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

  const pushBoxTitle = uiLanguage === "sv" ? "Prenumerera på aviseringar" : t.pushHeader;
  const pushBoxSubtitle = uiLanguage === "sv"
    ? "Du får då en diskret avisering direkt i din telefon när det finns en inbjudan till dig."
    : t.pushSubtitle;

  const hiddenOrgs = getHiddenOrgsForGroup(organization);
  const visibleOrganizations = ORGANIZATIONS.filter(org => !hiddenOrgs.includes(org));

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-12">
      
      {/* Push Subscription Box (Always Visible at the top of settings) */}
      <div id="notification-subscription-box" className="bg-brand-ink rounded-2xl p-6 md:p-8 text-brand-bg shadow-sm flex items-center justify-between gap-6">
        <div className="space-y-1.5 flex-1 pr-4">
          <div className="flex items-center gap-2 text-brand-paper font-mono text-[10px] tracking-wider uppercase">
            <Bell size={12} className="text-brand-accent animate-pulse" />
            <span>{pushBoxTitle}</span>
          </div>
          <p className="text-brand-paper/80 text-[11px] md:text-xs leading-normal font-light">
            {pushBoxSubtitle}
          </p>
        </div>

        <button
          id="push-toggle-button"
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

      {/* Intro Text / Header */}
      <div id="welcome-intro-card" className="bg-brand-paper/50 rounded-2xl p-6 border border-brand-ink/5">
        <h2 className="font-serif italic text-lg sm:text-xl text-brand-ink tracking-tight mb-2 font-medium">
          {t.onboardingHeader}
        </h2>
        <p className="text-brand-ink/70 text-xs md:text-sm leading-relaxed font-light">
          {t.onboardingIntro}
        </p>
      </div>

      {/* Progress & Wizard Step Indicators */}
      <div className="bg-white rounded-2xl p-4 border border-brand-ink/5 flex flex-col space-y-3">
        <div className="flex items-center justify-between gap-1 px-1">
          {[1, 2, 3, 4].map(stepNum => {
            const isActive = stepNum === currentStep;
            const isCompleted = stepNum < currentStep;
            return (
              <button
                key={stepNum}
                type="button"
                onClick={() => setCurrentStep(stepNum)}
                className={`flex-1 h-2.5 rounded-full transition-all cursor-pointer ${
                  isActive
                    ? "bg-brand-accent"
                    : isCompleted
                    ? "bg-brand-accent/50"
                    : "bg-brand-ink/10 hover:bg-brand-ink/20"
                }`}
                title={`Gå till steg ${stepNum}`}
              />
            );
          })}
        </div>
        <div className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-brand-accent font-semibold text-center pt-1">
          {currentStep === 1 && t.step1Title}
          {currentStep === 2 && t.step2Title}
          {currentStep === 3 && t.step3Title}
          {currentStep === 4 && t.step4Title}
        </div>
      </div>

      {/* Step Contents */}
      <div className="transition-all duration-300">
        
        {/* STEP 1: GEOGRAPHY */}
        {currentStep === 1 && (
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
          </div>
        )}

        {/* STEP 2: LANGUAGES */}
        {currentStep === 2 && (
          <div id="step-2-container" className="bg-white rounded-2xl p-6 md:p-8 border border-brand-ink/5 space-y-6 shadow-xs animate-in fade-in duration-200">
            <div className="flex flex-col items-start pb-2 border-b border-brand-ink/5">
              <span className="font-mono text-[9px] uppercase tracking-wider text-brand-accent bg-brand-paper px-2.5 py-1 rounded">
                Steg 2 av 4
              </span>
              <p className="text-brand-ink/70 text-xs leading-relaxed font-light mt-2">
                {t.step2Subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {LANGUAGE_OPTIONS.map(lang => {
                const isSelected = selectedLanguages.includes(lang.code);
                return (
                  <button
                    key={lang.code}
                    id={`language-btn-${lang.code.replace(/\s+/g, "-")}`}
                    type="button"
                    onClick={() => toggleLanguage(lang.code)}
                    className={`flex items-center justify-between p-4 rounded-xl border text-left transition-all cursor-pointer min-h-[58px] duration-200 ${
                      isSelected
                        ? "border-brand-accent bg-brand-paper/40 text-brand-ink font-medium"
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

              {/* "Inget språkstöd" option */}
              <button
                type="button"
                id="no-language-support-btn"
                onClick={() => setSelectedLanguages([])}
                className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all cursor-pointer min-h-[58px] duration-200 ${
                  selectedLanguages.length === 0
                    ? "border-brand-accent bg-brand-paper/40 text-brand-ink font-semibold"
                    : "border-brand-ink/5 bg-brand-bg text-brand-ink/80"
                }`}
              >
                <div>
                  <span className="font-serif italic text-sm sm:text-base font-medium text-brand-ink leading-tight">Inget språkstöd</span>
                  <p className="text-[10px] text-brand-ink/65 font-light mt-0.5">Töm alla språkval (inga specifika språkkrav)</p>
                </div>
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-colors ${
                    selectedLanguages.length === 0
                      ? "bg-brand-accent border-brand-accent text-white"
                      : "border-brand-ink/10 bg-white"
                  }`}
                >
                  {selectedLanguages.length === 0 && <Check size={12} strokeWidth={2.5} />}
                </div>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: ORGANIZATIONS */}
        {currentStep === 3 && (
          <div id="step-3-container" className="bg-white rounded-2xl p-6 md:p-8 border border-brand-ink/5 space-y-6 shadow-xs animate-in fade-in duration-200">
            <div className="flex flex-col items-start pb-2 border-b border-brand-ink/5">
              <span className="font-mono text-[9px] uppercase tracking-wider text-brand-accent bg-brand-paper px-2.5 py-1 rounded">
                Steg 3 av 4
              </span>
              <p className="text-brand-ink/70 text-xs leading-relaxed font-light mt-2">
                {t.step3Subtitle}
              </p>
            </div>

            {/* Primary membership group */}
            <div className="space-y-3">
              <h4 className="font-serif italic text-base text-brand-ink font-medium">{t.orgChoiceLabel}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  id="org-choice-brother"
                  type="button"
                  onClick={() => {
                    setOrganization("bror");
                    // Ensure the brother/sister specific items are kept in check with hidden items
                    const newHidden = getHiddenOrgsForGroup("bror");
                    setLimitedOrganizations(prev => prev.filter(o => !newHidden.includes(o)));
                  }}
                  className={`flex items-center justify-between p-4 rounded-xl border text-left transition-all cursor-pointer min-h-[58px] duration-200 ${
                    organization === "bror"
                      ? "border-brand-accent bg-brand-paper/40 text-brand-ink font-medium"
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
                  id="org-choice-sister"
                  type="button"
                  onClick={() => {
                    setOrganization("syster");
                    // Ensure the brother/sister specific items are kept in check with hidden items
                    const newHidden = getHiddenOrgsForGroup("syster");
                    setLimitedOrganizations(prev => prev.filter(o => !newHidden.includes(o)));
                  }}
                  className={`flex items-center justify-between p-4 rounded-xl border text-left transition-all cursor-pointer min-h-[58px] duration-200 ${
                    organization === "syster"
                      ? "border-brand-accent bg-brand-paper/40 text-brand-ink font-medium"
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

            {/* Checklist of collaborating groups with hidden options filtered out */}
            <div className="pt-4 border-t border-brand-ink/5 space-y-4">
              <label className="flex items-start p-4 rounded-xl bg-brand-bg hover:bg-brand-paper/50 transition-colors cursor-pointer select-none border border-brand-ink/5">
                <input
                  id="limit-orgs-checkbox"
                  type="checkbox"
                  checked={limitOrganizations}
                  onChange={e => {
                    setLimitOrganizations(e.target.checked);
                    if (e.target.checked && limitedOrganizations.length === 0) {
                      setLimitedOrganizations(visibleOrganizations);
                    }
                  }}
                  className="w-4 h-4 rounded border-brand-ink/20 text-brand-accent mr-4 mt-1 cursor-pointer accent-brand-accent shrink-0"
                />
                <div>
                  <div className="font-serif italic text-sm text-brand-ink font-medium">
                    Anpassa samarbetande grupper
                  </div>
                  <div className="text-[11px] text-brand-ink/70 mt-1 leading-normal font-light">
                    Klicka för att välja exakt vilka samarbetande grupper i församlingen du vill motta aviseringar från. Om omarkerat bevakar du samtliga.
                  </div>
                </div>
              </label>

              {limitOrganizations && (
                <div className="pt-2 animate-in fade-in duration-200 space-y-3">
                  <h4 className="font-serif italic text-xs text-brand-ink mb-2 font-medium">Bocka för grupper du vill bevaka:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {visibleOrganizations.map(org => {
                      const isChecked = limitedOrganizations.includes(org);
                      return (
                        <div
                          key={org}
                          id={`limited-org-item-${org.replace(/\s+/g, "-")}`}
                          className={`flex items-center justify-between p-3 rounded-lg border text-left transition-all text-xs ${
                            isChecked
                              ? "border-brand-accent bg-brand-paper/20 text-brand-ink"
                              : "border-brand-ink/5 bg-brand-bg"
                          }`}
                        >
                          <div 
                            onClick={() => toggleLimitedOrg(org)}
                            className="flex-1 cursor-pointer font-medium text-brand-ink pr-2"
                          >
                            {org}
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => setInfoOrg(infoOrg === org ? null : org)}
                              className="p-1 text-brand-accent/60 hover:text-brand-accent cursor-pointer rounded-full hover:bg-brand-paper transition-all"
                              aria-label={`Visa information om ${org}`}
                            >
                              <Info size={14} />
                            </button>
                            <div 
                              onClick={() => toggleLimitedOrg(org)}
                              className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 cursor-pointer ${
                                isChecked ? "bg-brand-accent border-brand-accent text-white" : "border-brand-ink/15 bg-white"
                              }`}
                            >
                              {isChecked && <Check size={10} strokeWidth={3} />}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {infoOrg && (
                    <div id="org-handbook-tooltip" className="p-4 bg-brand-paper border border-brand-accent/25 rounded-xl animate-in slide-in-from-top-2 duration-150 text-xs">
                      <div className="font-serif italic font-semibold text-brand-ink flex items-center gap-1.5 mb-1">
                        <Info size={12} className="text-brand-accent" />
                        <span>Beskrivning: {infoOrg}</span>
                      </div>
                      <p className="text-brand-ink/80 font-light leading-relaxed">
                        {ORG_INFO[infoOrg] || "Ospecificerad organisation i församlingen."}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 4: FORMATS & OTHER SETTINGS */}
        {currentStep === 4 && (
          <div id="step-4-container" className="bg-white rounded-2xl p-6 md:p-8 border border-brand-ink/5 space-y-6 shadow-xs animate-in fade-in duration-200">
            <div className="flex flex-col items-start pb-2 border-b border-brand-ink/5">
              <span className="font-mono text-[9px] uppercase tracking-wider text-brand-accent bg-brand-paper px-2.5 py-1 rounded">
                Steg 4 av 4
              </span>
              <p className="text-brand-ink/70 text-xs leading-relaxed font-light mt-2">
                {t.step4Subtitle}
              </p>
            </div>

            {/* Three main toggles / option cards */}
            <div className="space-y-3">
              {/* Format Physical card */}
              <button
                id="format-physical-btn"
                type="button"
                onClick={() => toggleFormat("physical")}
                className={`w-full flex items-start p-5 rounded-xl border text-left transition-all cursor-pointer duration-200 ${
                  formats.includes("physical")
                    ? "border-brand-accent bg-brand-paper/40 text-brand-ink font-medium"
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
                  <div className="font-serif italic text-sm text-brand-ink font-medium mb-1">
                    {t.formatPhysicalTitle}
                  </div>
                  <div className="text-[11px] text-brand-ink/70 font-light leading-relaxed">
                    {t.formatPhysicalDesc}
                  </div>
                </div>
              </button>

              {/* Format Telephone card */}
              <button
                id="format-telephone-btn"
                type="button"
                onClick={() => toggleFormat("telephone")}
                className={`w-full flex items-start p-5 rounded-xl border text-left transition-all cursor-pointer duration-200 ${
                  formats.includes("telephone")
                    ? "border-brand-accent bg-brand-paper/40 text-brand-ink font-medium"
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
                  <div className="font-serif italic text-sm text-brand-ink font-medium mb-1">
                    {t.formatDigitalTitle}
                  </div>
                  <div className="text-[11px] text-brand-ink/70 font-light leading-relaxed">
                    {t.formatDigitalDesc}
                  </div>
                </div>
              </button>

              {/* Spiritual tips card */}
              <button
                id="spiritual-tips-btn"
                type="button"
                onClick={() => setSpiritualTips(prev => !prev)}
                className={`w-full flex items-start p-5 rounded-xl border text-left transition-all cursor-pointer duration-200 ${
                  spiritualTips
                    ? "border-brand-accent bg-brand-paper/40 text-brand-ink font-medium"
                    : "border-brand-ink/5 bg-brand-bg hover:border-brand-accent/20 text-brand-ink/80"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded border flex items-center justify-center mr-4 shrink-0 mt-0.5 transition-colors ${
                    spiritualTips
                      ? "bg-brand-accent border-brand-accent text-white"
                      : "border-brand-ink/10 bg-white"
                  }`}
                >
                  {spiritualTips && <Check size={12} strokeWidth={2.5} />}
                </div>
                <div>
                  <div className="font-serif italic text-sm text-brand-ink font-medium mb-1">
                    {t.formatSpiritualTitle}
                  </div>
                  <div className="text-[11px] text-brand-ink/70 font-light leading-relaxed">
                    {t.formatSpiritualDesc}
                  </div>
                </div>
              </button>
            </div>

            {/* Mandatory legal GDPR agreement checkbox */}
            <div id="gdpr-consent-card" className="bg-brand-paper/35 rounded-2xl p-6 border border-brand-accent/20 space-y-4">
              <label className="flex items-start cursor-pointer select-none">
                <input
                  id="gdpr-checkbox"
                  type="checkbox"
                  checked={gdprAccepted}
                  onChange={e => setGdprAccepted(e.target.checked)}
                  className="w-4 h-4 rounded border-brand-ink/25 text-brand-accent mr-4 mt-1 cursor-pointer accent-brand-accent shrink-0"
                />
                <div className="text-[10px] sm:text-[11px] leading-relaxed text-brand-ink/80 font-light">
                  Jag samtycker till att mina anpassade val sparas i min webbläsare för att tjänsten ska kunna skicka relevanta aviseringar. Jag förstår att ingen personlig historik eller personuppgifter sparas centralt och att jag när som helst kan radera mina inställningar genom att inaktivera aviseringar.
                </div>
              </label>
              {!gdprAccepted && (
                <div className="text-xs text-brand-error font-mono uppercase tracking-wider animate-in fade-in duration-150">
                  ⚠ Du måste godkänna villkoren för att dina val ska sparas och kunna ta emot aviseringar.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer wizard navigation panel */}
      <div className="bg-brand-paper/45 border border-brand-ink/5 p-4 rounded-2xl flex items-center justify-between gap-4">
        <button
          type="button"
          disabled={currentStep === 1}
          onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl border border-brand-ink/10 font-medium text-xs sm:text-sm cursor-pointer transition-all active:scale-95 ${
            currentStep === 1 ? "opacity-30 cursor-not-allowed" : "bg-white hover:bg-slate-50 text-brand-ink"
          }`}
        >
          <ArrowLeft size={16} />
          <span>Bakåt</span>
        </button>

        {currentStep < 4 ? (
          <button
            type="button"
            onClick={() => setCurrentStep(prev => Math.min(4, prev + 1))}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-ink hover:bg-brand-ink/90 text-brand-bg font-medium text-xs sm:text-sm cursor-pointer transition-all active:scale-95 ml-auto"
          >
            <span>Nästa</span>
            <ArrowRight size={16} />
          </button>
        ) : (
          <button
            type="button"
            disabled={!gdprAccepted}
            onClick={() => {
              if (onClose) {
                onClose();
              }
            }}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-accent hover:opacity-95 text-white font-medium text-xs sm:text-sm cursor-pointer transition-all active:scale-95 ml-auto ${
              !gdprAccepted ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <ShieldCheck size={16} />
            <span>Klart!</span>
          </button>
        )}
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

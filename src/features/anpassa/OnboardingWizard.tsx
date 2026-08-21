import React from "react";
import { X, Check, MapPin, Users, Globe, Bell } from "lucide-react";
import { useOnboardingState } from "./hooks/useOnboardingState";
import { UiLanguage } from "../mission_router";
import { GOTEBORG_AREAS } from "./mapData";

const CATEGORIES = [
  "Barn & Familj",
  "Ungdom",
  "Senior",
  "Stöd & Omsorg",
  "Musik & Kultur",
  "Gudstjänst & Bön",
  "Öppen Gemenskap"
];

const AVAILABLE_LANGUAGES = [
  { code: "sv", label: "Svenska" },
  { code: "en", label: "Engelska" },
  { code: "ar", label: "Arabiska" },
  { code: "fa", label: "Persiska" },
  { code: "uk", label: "Ukrainska" },
  { code: "es", label: "Spanska" }
];

interface OnboardingWizardProps {
  onSave: (tags: any) => void;
  savedTags?: any;
  pushEnabled: boolean;
  onEnablePush: () => void;
  onDisablePush: () => void;
  uiLanguage: UiLanguage;
  onClose?: () => void;
}

export default function OnboardingWizard({
  onSave,
  savedTags,
  pushEnabled,
  onEnablePush,
  onDisablePush,
  uiLanguage,
  onClose,
}: OnboardingWizardProps) {
  const {
    primaryArea,
    setPrimaryArea,
    limitAreas,
    setLimitAreas,
    limitedAreas,
    setLimitedAreas,
    targetGroups,
    toggleTargetGroup,
    formats,
    toggleFormat,
    allowDigital,
    setAllowDigital,
    spiritualTips,
    setSpiritualTips,
    selectedLanguages,
    toggleLanguage,
    showMoreSettings,
    setShowMoreSettings,
  } = useOnboardingState({ onSave, savedTags });

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-24 relative animate-in fade-in duration-200 text-left">
      {!pushEnabled && (
        <div className="bg-brand-paper/90 border border-brand-accent/25 rounded-2xl p-4 text-brand-ink text-xs sm:text-sm font-sans flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <Bell size={18} className="text-brand-accent shrink-0" />
            <p className="font-medium text-brand-ink">
              Mottagning av inbjudningar är avstängt
            </p>
          </div>
          <button
            type="button"
            onClick={onEnablePush}
            className="w-full sm:w-auto px-4 py-2 bg-brand-accent hover:bg-brand-accent/90 text-white font-medium text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
          >
            <span>Slå på &apos;Ta emot inbjudningar&apos;</span>
          </button>
        </div>
      )}

      <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-brand-ink/5 shadow-xs">
        <div>
          <h2 className="font-serif italic text-2xl font-medium text-brand-ink tracking-tight">
            Välj var du vill ta emot inbjudningar
          </h2>
          <p className="text-brand-ink/70 text-xs sm:text-sm font-light mt-1">
            Välj vilka inbjudningar och notiser du vill ta del av. Alla ändringar sparas automatiskt.
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 text-brand-ink/50 hover:text-brand-ink hover:bg-brand-ink/5 rounded-full transition-all cursor-pointer"
            aria-label="Stäng"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <div className="bg-white p-6 rounded-2xl border border-brand-ink/5 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-brand-ink/5">
          <MapPin size={18} className="text-brand-accent shrink-0" />
          <h3 className="font-sans font-medium text-base text-brand-ink">
            Ditt närområde
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-brand-ink/70 font-light">
          Välj det område du känner dig mest hemma i eller vill finnas till hands för:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {GOTEBORG_AREAS.map(area => (
            <button
              key={area}
              onClick={() => setPrimaryArea(area)}
              className={`p-3 rounded-xl border text-left text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-between ${
                primaryArea === area
                  ? "bg-brand-paper border-brand-accent text-brand-ink font-medium shadow-xs"
                  : "border-brand-ink/5 bg-white text-brand-ink/70 hover:border-brand-ink/20"
              }`}
            >
              <span>{area}</span>
              {primaryArea === area && <Check size={16} className="text-brand-accent" />}
            </button>
          ))}
        </div>

        <div className="pt-4 border-t border-brand-ink/5">
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={limitAreas}
              onChange={(e) => setLimitAreas(e.target.checked)}
              className="w-4 h-4 rounded text-brand-accent border-brand-ink/20 focus:ring-brand-accent cursor-pointer"
            />
            <span className="text-xs sm:text-sm text-brand-ink/90 font-medium">
              Begränsa mig endast till specifika områden i församlingen
            </span>
          </label>

          {limitAreas && (
            <div className="mt-4 pt-3 border-t border-brand-ink/5 space-y-3">
              <p className="text-xs text-brand-ink/60 font-light">
                Välj de områden där du kan tänka dig att delta eller hjälpa till:
              </p>
              <div className="flex flex-wrap gap-2">
                {GOTEBORG_AREAS.map(area => {
                  const isSelected = limitedAreas.includes(area);
                  return (
                    <button
                      key={area}
                      onClick={() => {
                        if (isSelected) {
                          setLimitedAreas(limitedAreas.filter(a => a !== area));
                        } else {
                          setLimitedAreas([...limitedAreas, area]);
                        }
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer border ${
                        isSelected
                          ? "bg-brand-accent text-white border-brand-accent shadow-xs"
                          : "bg-white text-brand-ink/70 border-brand-ink/10 hover:border-brand-ink/20"
                      }`}
                    >
                      {area}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="text-center pt-2">
        <button
          onClick={() => setShowMoreSettings(!showMoreSettings)}
          className="text-xs font-mono text-brand-accent hover:underline cursor-pointer"
        >
          {showMoreSettings ? "Visa färre inställningar" : "Visa fler inställningar (kategorier, språk)"}
        </button>
      </div>

      {showMoreSettings && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-2xl border border-brand-ink/5 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-brand-ink/5">
              <Users size={18} className="text-brand-accent shrink-0" />
              <h3 className="font-sans font-medium text-base text-brand-ink">
                Målgrupper du vill engagera dig för
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => {
                const isSelected = targetGroups.includes(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => toggleTargetGroup(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer border ${
                      isSelected
                        ? "bg-brand-accent text-white border-brand-accent shadow-xs"
                        : "bg-white text-brand-ink/70 border-brand-ink/10 hover:border-brand-ink/20"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-brand-ink/5 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-brand-ink/5">
              <Globe size={18} className="text-brand-accent shrink-0" />
              <h3 className="font-sans font-medium text-base text-brand-ink">
                Språk du behärskar
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_LANGUAGES.map(lang => {
                const isSelected = selectedLanguages.includes(lang.code);
                return (
                  <button
                    key={lang.code}
                    onClick={() => toggleLanguage(lang.code)}
                    className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer border ${
                      isSelected
                        ? "bg-brand-accent text-white border-brand-accent shadow-xs"
                        : "bg-white text-brand-ink/70 border-brand-ink/10 hover:border-brand-ink/20"
                    }`}
                  >
                    {lang.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {onClose && (
        <div className="flex justify-end pt-4">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-brand-accent text-white font-medium text-xs sm:text-sm rounded-xl hover:opacity-90 transition-all cursor-pointer shadow-sm flex items-center gap-2"
          >
            <Check size={16} />
            <span>Spara val</span>
          </button>
        </div>
      )}
    </div>
  );
}

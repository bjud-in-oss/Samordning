// [src/features/anpassa/OnboardingWizard.tsx] - Onboarding Wizard Preferences Component

import React from "react";
import { MapPin, Check, X, Sparkles, Settings } from "lucide-react";
import { UiLanguage } from "../mission_router";
import Step1Geography from "./Step1Geography";
import { MoreSettingsSection } from "./components/MoreSettingsSection";
import { TargetGroupsSection } from "./components/TargetGroupsSection";
import { useOnboardingState, OnboardingStateSavedTags } from "./hooks/useOnboardingState";

interface OnboardingWizardProps {
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
    targetGroups?: string[];
    allowDigital?: boolean;
  }) => void;
  savedTags?: OnboardingStateSavedTags;
  pushEnabled: boolean;
  onEnablePush: () => void;
  onDisablePush: () => void;
  uiLanguage: UiLanguage;
  onClose?: () => void;
}

export default function OnboardingWizard({
  onSave,
  savedTags,
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
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-brand-ink/5 shadow-xs">
        <div>
          <h2 className="font-serif italic text-2xl font-medium text-brand-ink tracking-tight flex items-center gap-2.5">
            <Sparkles size={22} className="text-brand-accent shrink-0" />
            Anpassa dina val
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
            1. Dina områden
          </h3>
        </div>
        <p className="text-brand-ink/70 text-xs font-light leading-relaxed">
          {uiLanguage === "sv" 
            ? "Vilka områden brukar du träffa andra i?" 
            : "Which areas do you usually meet others in?"}
        </p>
        <Step1Geography
          primaryArea={primaryArea}
          setPrimaryArea={setPrimaryArea}
          limitAreas={limitAreas}
          setLimitAreas={setLimitAreas}
          limitedAreas={limitedAreas}
          setLimitedAreas={setLimitedAreas}
          uiLanguage={uiLanguage}
          isInline={true}
        />
      </div>

      <TargetGroupsSection
        targetGroups={targetGroups}
        toggleTargetGroup={toggleTargetGroup}
      />

      <div className="pt-2 flex justify-center">
        <button
          type="button"
          onClick={() => setShowMoreSettings((prev) => !prev)}
          className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-brand-paper border border-brand-ink/10 text-brand-ink text-xs font-mono uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-xs"
        >
          <Settings size={14} className="text-brand-accent" />
          <span>{showMoreSettings ? "⚙️ Dölj extra inställningar" : "⚙️ Visa fler inställningar"}</span>
        </button>
      </div>

      {showMoreSettings && (
        <MoreSettingsSection
          formats={formats}
          toggleFormat={toggleFormat}
          allowDigital={allowDigital}
          setAllowDigital={setAllowDigital}
          spiritualTips={spiritualTips}
          setSpiritualTips={setSpiritualTips}
          selectedLanguages={selectedLanguages}
          toggleLanguage={toggleLanguage}
          uiLanguage={uiLanguage}
        />
      )}

      {onClose && (
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 bg-brand-accent text-white font-medium text-xs sm:text-sm rounded-xl hover:opacity-90 transition-all cursor-pointer shadow-sm flex items-center gap-2"
          >
            <Check size={16} />
            <span>Klar</span>
          </button>
        </div>
      )}
    </div>
  );
}

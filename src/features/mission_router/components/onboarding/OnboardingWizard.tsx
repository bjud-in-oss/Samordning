// [CURRENT SUBDIRECTORY/CYCLE] | [4_Produce]

import React, { useState, useEffect, useRef } from "react";
import { Bell, ArrowLeft, ArrowRight, ShieldCheck, X } from "lucide-react";
import { GOTEBORG_AREAS } from "../../domain/mapData";
import { TRANSLATIONS, UiLanguage } from "../../translations";
import Step1Geography from "./Step1Geography";
import Step2Language from "./Step2Language";
import Step3Organizations, { getHiddenOrgsForGroup, ORGANIZATIONS } from "./Step3Organizations";
import Step4Formats from "./Step4Formats";

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

export default function OnboardingWizard({
  onSave,
  savedTags,
  pushEnabled,
  onEnablePush,
  onDisablePush,
  uiLanguage,
  onClose
}: OnboardingWizardProps) {
  // Wizard active step (1 to 4)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Core preferences states (SSOT) - Defaulting to empty/undefined from start
  const [primaryArea, setPrimaryArea] = useState<string | undefined>(
    savedTags?.primaryArea
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
    savedTags?.languages || []
  );
  const [organization, setOrganization] = useState<string>(
    savedTags?.organization || ""
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

  const notificationsLabel = {
    sv: "Välj inbjudningar som notiser",
    en: "Choose invitations as notifications",
    es: "Elige invitaciones como notificaciones",
    sw: "Chagua mialiko kama arifa",
    vi: "Chọn lời mời làm thông báo"
  }[uiLanguage] || "Mina notifieringar";

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-32 relative">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 text-brand-ink/50 hover:text-brand-ink hover:bg-brand-ink/5 rounded-full transition-all"
          aria-label="Stäng inställningar"
        >
          <X size={20} />
        </button>
      )}
      
      {/* Header */}
      <div className="flex flex-col space-y-3 bg-white p-6 rounded-2xl border border-brand-ink/5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-ink/10 pb-4">
          <h2 className="font-sans text-xl text-brand-ink font-semibold tracking-tight flex items-center gap-2">
            <Bell size={18} className="text-brand-accent shrink-0" />
            {notificationsLabel}
          </h2>
        </div>
        
        <p className="text-brand-ink/75 text-xs sm:text-sm leading-relaxed font-light">
          När en inbjudan matchar dina preferenser får du en diskret avisering direkt i din telefon samtidigt som din integritet skyddas. Avsändaren kan inte se att du fått dennes meddelande annat än genom att du svarar med ett personligt SMS endast mellan er två.
        </p>
      </div>

      {/* Step Contents */}
      <div className="transition-all duration-300">
        {currentStep === 1 && (
          <Step1Geography
            primaryArea={primaryArea}
            setPrimaryArea={setPrimaryArea}
            limitAreas={limitAreas}
            setLimitAreas={setLimitAreas}
            limitedAreas={limitedAreas}
            setLimitedAreas={setLimitedAreas}
            uiLanguage={uiLanguage}
          />
        )}

        {currentStep === 2 && (
          <Step2Language
            selectedLanguages={selectedLanguages}
            setSelectedLanguages={setSelectedLanguages}
            uiLanguage={uiLanguage}
          />
        )}

        {currentStep === 3 && (
          <Step3Organizations
            organization={organization}
            setOrganization={setOrganization}
            limitOrganizations={limitOrganizations}
            setLimitOrganizations={setLimitOrganizations}
            limitedOrganizations={limitedOrganizations}
            setLimitedOrganizations={setLimitedOrganizations}
            uiLanguage={uiLanguage}
          />
        )}

        {currentStep === 4 && (
          <Step4Formats
            formats={formats}
            setFormats={setFormats}
            spiritualTips={spiritualTips}
            setSpiritualTips={setSpiritualTips}
            gdprAccepted={gdprAccepted}
            setGdprAccepted={setGdprAccepted}
            uiLanguage={uiLanguage}
          />
        )}
      </div>

      {/* Spacer to prevent fixed bottom bar from covering content */}
      <div className="h-24"></div>

      {/* Fixerad bottenrad (Navigation) */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-50">
        <div className="bg-white/95 backdrop-blur-md border border-brand-ink/10 p-4 rounded-2xl shadow-xl flex items-center justify-between gap-4">
          <button
            type="button"
            disabled={currentStep === 1}
            onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-xs sm:text-sm transition-all active:scale-95 ${
              currentStep === 1
                ? "bg-transparent text-transparent border-transparent cursor-default pointer-events-none select-none"
                : "bg-brand-bg hover:bg-brand-paper border border-brand-ink/10 text-brand-ink cursor-pointer"
            }`}
          >
            <ArrowLeft size={16} />
            <span>Bakåt</span>
          </button>

          {/* Centered fraction indicator */}
          <span className="font-mono text-xs font-semibold text-brand-accent">
            {currentStep}/4
          </span>

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(prev => Math.min(4, prev + 1))}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-ink hover:bg-brand-ink/90 text-brand-bg font-medium text-xs sm:text-sm cursor-pointer transition-all active:scale-95"
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
              className={`flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-accent hover:opacity-95 text-white font-medium text-xs sm:text-sm cursor-pointer transition-all active:scale-95 ${
                !gdprAccepted ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <ShieldCheck size={16} />
              <span>Klart!</span>
            </button>
          )}
        </div>
      </div>

    </div>
  );
}

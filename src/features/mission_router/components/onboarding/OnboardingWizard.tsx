// [CURRENT SUBDIRECTORY/CYCLE] | [4_Produce]

import React, { useState, useEffect, useRef } from "react";
import { Bell, ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
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

  // Core preferences states (SSOT)
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

  const pushBoxTitle = uiLanguage === "sv" ? "Prenumerera på aviseringar" : t.pushHeader;
  const pushBoxSubtitle = uiLanguage === "sv"
    ? "Du får då en diskret avisering direkt i din telefon när det finns en inbjudan till dig."
    : t.pushSubtitle;

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

    </div>
  );
}

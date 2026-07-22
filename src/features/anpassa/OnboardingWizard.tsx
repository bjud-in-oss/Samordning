// [CURRENT SUBDIRECTORY/CYCLE] | [4_Produce]

import React, { useState, useEffect, useRef } from "react";
import { MapPin, Users, PhoneCall, Globe, Check, X, Smartphone, Sparkles, Shield, Settings } from "lucide-react";
import { GOTEBORG_AREAS } from "./mapData";
import { TRANSLATIONS, UiLanguage } from "../mission_router/translations";
import Step1Geography from "./Step1Geography";

const TARGET_GROUPS = [
  { id: "all", label: "Alla målgrupper" },
  { id: "family", label: "Barn & Familj" },
  { id: "youth", label: "Ungdom (12–17 år)" },
  { id: "young_adults", label: "Unga Vuxna (18–35 år)" },
  { id: "women", label: "Kvinnor" },
  { id: "men", label: "Män" }
];

const LANGUAGE_OPTIONS = [
  { code: "Svenska", label: "Svenska" },
  { code: "English", label: "English" },
  { code: "Español", label: "Español" },
  { code: "Kiswahili", label: "Kiswahili" },
  { code: "Tiếng Việt", label: "Tiếng Việt" }
];

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
    targetGroups?: string[];
    allowDigital?: boolean;
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
  // Preference States
  const [primaryArea, setPrimaryArea] = useState<string | undefined>(savedTags?.primaryArea);
  const [limitAreas, setLimitAreas] = useState<boolean>(savedTags?.limitAreas ?? false);
  const [limitedAreas, setLimitedAreas] = useState<string[]>(savedTags?.limitedAreas || []);
  
  const [targetGroups, setTargetGroups] = useState<string[]>(
    savedTags?.targetGroups || ["all"]
  );

  const [formats, setFormats] = useState<("physical" | "telephone")[]>(
    savedTags?.formats || ["physical", "telephone"]
  );
  const [allowDigital, setAllowDigital] = useState<boolean>(
    savedTags?.allowDigital ?? true
  );
  const [spiritualTips, setSpiritualTips] = useState<boolean>(
    savedTags?.spiritualTips ?? true
  );

  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(
    savedTags?.languages || ["Svenska"]
  );

  const [organization, setOrganization] = useState<string>(
    savedTags?.organization || ""
  );
  const [limitOrganizations, setLimitOrganizations] = useState<boolean>(
    savedTags?.limitOrganizations ?? false
  );
  const [limitedOrganizations, setLimitedOrganizations] = useState<string[]>(
    savedTags?.limitedOrganizations || []
  );
  const [alwaysNotify, setAlwaysNotify] = useState<boolean>(
    savedTags?.alwaysNotify ?? true
  );

  const [showMoreSettings, setShowMoreSettings] = useState<boolean>(false);

  const onSaveRef = useRef(onSave);
  useEffect(() => {
    onSaveRef.current = onSave;
  }, [onSave]);

  // Reactive auto-save
  useEffect(() => {
    onSaveRef.current({
      areas: limitAreas ? (primaryArea ? [primaryArea, ...limitedAreas.filter(a => a !== primaryArea)] : limitedAreas) : GOTEBORG_AREAS,
      primaryArea,
      limitAreas,
      limitedAreas,
      limitOrganizations,
      limitedOrganizations,
      languages: selectedLanguages,
      organization,
      formats,
      alwaysNotify,
      spiritualTips,
      targetGroups,
      allowDigital
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
    targetGroups,
    allowDigital
  ]);

  const toggleTargetGroup = (groupId: string) => {
    setTargetGroups(prev => {
      if (groupId === "all") {
        return ["all"];
      }
      const filtered = prev.filter(g => g !== "all");
      if (filtered.includes(groupId)) {
        const next = filtered.filter(g => g !== groupId);
        return next.length === 0 ? ["all"] : next;
      } else {
        return [...filtered, groupId];
      }
    });
  };

  const toggleLanguage = (langCode: string) => {
    setSelectedLanguages(prev =>
      prev.includes(langCode) ? prev.filter(l => l !== langCode) : [...prev, langCode]
    );
  };

  const toggleFormat = (format: "physical" | "telephone") => {
    setFormats(prev =>
      prev.includes(format) ? prev.filter(f => f !== format) : [...prev, format]
    );
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-24 relative animate-in fade-in duration-200">
      {/* Header Bar */}
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

      {/* Sektion 1: Dina områden */}
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

      {/* Sektion 2: Inbjudningar du vill se */}
      <div className="bg-white p-6 rounded-2xl border border-brand-ink/5 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-brand-ink/5">
          <Users size={18} className="text-brand-accent shrink-0" />
          <h3 className="font-sans font-medium text-base text-brand-ink">
            2. Inbjudningar du vill se
          </h3>
        </div>
        <p className="text-brand-ink/70 text-xs font-light leading-relaxed">
          Välj vilka målgrupper du vill ta emot inbjudningar för.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {TARGET_GROUPS.map(group => {
            const isSelected = targetGroups.includes(group.id);
            return (
              <button
                key={group.id}
                type="button"
                onClick={() => toggleTargetGroup(group.id)}
                className={`flex items-center justify-between p-3.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? "border-brand-accent bg-brand-paper text-brand-ink"
                    : "border-brand-ink/10 bg-brand-bg hover:border-brand-accent/30 text-brand-ink/70"
                }`}
              >
                <span>{group.label}</span>
                {isSelected && <Check size={14} className="text-brand-accent shrink-0 ml-1" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Toggle button for extra/deep settings */}
      <div className="pt-2 flex justify-center">
        <button
          type="button"
          onClick={() => setShowMoreSettings(prev => !prev)}
          className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-brand-paper border border-brand-ink/10 text-brand-ink text-xs font-mono uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-xs"
        >
          <Settings size={14} className="text-brand-accent" />
          <span>{showMoreSettings ? "⚙️ Dölj extra inställningar" : "⚙️ Visa fler inställningar"}</span>
        </button>
      </div>

      {showMoreSettings && (
        <>
          {/* Sektion 3: Deltagandesätt */}
          <div className="bg-white p-6 rounded-2xl border border-brand-ink/5 shadow-xs space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center gap-2.5 pb-3 border-b border-brand-ink/5">
              <PhoneCall size={18} className="text-brand-accent shrink-0" />
              <h3 className="font-sans font-medium text-base text-brand-ink">
                3. Deltagandesätt
              </h3>
            </div>
            <p className="text-brand-ink/70 text-xs font-light leading-relaxed">
              Ange på vilka sätt du är tillgänglig att delta när en inbjudan skickas ut.
            </p>
            <div className="space-y-3">
              {/* Fysiskt */}
              <label className="flex items-center justify-between p-3.5 bg-brand-bg rounded-xl border border-brand-ink/5 cursor-pointer hover:border-brand-ink/10 transition-all">
                <span className="text-xs font-medium text-brand-ink">Fysiskt på plats</span>
                <input
                  type="checkbox"
                  checked={formats.includes("physical")}
                  onChange={() => toggleFormat("physical")}
                  className="accent-brand-accent h-4 w-4 rounded cursor-pointer"
                />
              </label>

              {/* Digital / Telefon */}
              <label className="flex items-center justify-between p-3.5 bg-brand-bg rounded-xl border border-brand-ink/5 cursor-pointer hover:border-brand-ink/10 transition-all">
                <div>
                  <span className="text-xs font-medium text-brand-ink block">Digitalt & Telefon (Kaskadnotis Nivå 3)</span>
                  <span className="text-[10px] text-brand-ink/60 font-light block mt-0.5">
                    Tillåt kontakt via telefon eller videomöte vid brådskande förfrågningar.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={allowDigital}
                  onChange={(e) => setAllowDigital(e.target.checked)}
                  className="accent-brand-accent h-4 w-4 rounded cursor-pointer shrink-0 ml-2"
                />
              </label>

              {/* Andliga tankar */}
              <label className="flex items-center justify-between p-3.5 bg-brand-bg rounded-xl border border-brand-ink/5 cursor-pointer hover:border-brand-ink/10 transition-all">
                <span className="text-xs font-medium text-brand-ink">Andliga tankar & Korta budskap</span>
                <input
                  type="checkbox"
                  checked={spiritualTips}
                  onChange={(e) => setSpiritualTips(e.target.checked)}
                  className="accent-brand-accent h-4 w-4 rounded cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Sektion 4: Språk */}
          <div className="bg-white p-6 rounded-2xl border border-brand-ink/5 shadow-xs space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center gap-2.5 pb-3 border-b border-brand-ink/5">
              <Globe size={18} className="text-brand-accent shrink-0" />
              <h3 className="font-sans font-medium text-base text-brand-ink">
                4. Språk
              </h3>
            </div>
            <p className="text-brand-ink/70 text-xs font-light leading-relaxed">
              {uiLanguage === "sv" 
                ? "Vilka språk förstår du eller kan hjälpa till att översätta på?" 
                : "Which languages do you understand or can help translate in?"}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {LANGUAGE_OPTIONS.map(lang => {
                const isSelected = selectedLanguages.includes(lang.code);
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => toggleLanguage(lang.code)}
                    className={`flex items-center justify-between p-3.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? "border-brand-accent bg-brand-paper text-brand-ink"
                        : "border-brand-ink/10 bg-brand-bg hover:border-brand-accent/30 text-brand-ink/70"
                    }`}
                  >
                    <span>{lang.label}</span>
                    {isSelected && <Check size={14} className="text-brand-accent shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Done Button */}
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

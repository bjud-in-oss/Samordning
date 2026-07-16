// [CURRENT SUBDIRECTORY/CYCLE] | [4_Produce]

import React, { useState } from "react";
import { Check, Info } from "lucide-react";
import { TRANSLATIONS, UiLanguage } from "../../translations";

export const ORGANIZATIONS = [
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

export const getHiddenOrgsForGroup = (primaryOrg: string): string[] => {
  if (primaryOrg === "bror") {
    return ["Hjälpföreningen", "Unga Kvinnor (UK)"];
  }
  if (primaryOrg === "syster") {
    return ["Äldstekvorumet", "Unga Män (UM)"];
  }
  return [];
};

interface Step3OrganizationsProps {
  organization: string;
  setOrganization: (org: string) => void;
  limitOrganizations: boolean;
  setLimitOrganizations: (limit: boolean) => void;
  limitedOrganizations: string[];
  setLimitedOrganizations: React.Dispatch<React.SetStateAction<string[]>>;
  uiLanguage: UiLanguage;
}

export default function Step3Organizations({
  organization,
  setOrganization,
  limitOrganizations,
  setLimitOrganizations,
  limitedOrganizations,
  setLimitedOrganizations,
  uiLanguage
}: Step3OrganizationsProps) {
  const [infoOrg, setInfoOrg] = useState<string | null>(null);
  const t = TRANSLATIONS[uiLanguage];

  const hiddenOrgs = getHiddenOrgsForGroup(organization);
  const visibleOrganizations = ORGANIZATIONS.filter(org => !hiddenOrgs.includes(org));

  const toggleLimitedOrg = (org: string) => {
    setLimitedOrganizations(prev =>
      prev.includes(org) ? prev.filter(o => o !== org) : [...prev, org]
    );
  };

  return (
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
  );
}

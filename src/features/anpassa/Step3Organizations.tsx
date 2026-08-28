// [src/features/anpassa/Step3Organizations.tsx] - Step 3 Organizations Component

import React, { useState } from "react";
import { Check, Info } from "lucide-react";
import { UiLanguage } from "../mission_router";
import { ORGANIZATIONS, ORG_INFO, getHiddenOrgsForGroup } from "./domain/orgData";

export { ORGANIZATIONS, getHiddenOrgsForGroup };

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
}: Step3OrganizationsProps) {
  const [infoOrg, setInfoOrg] = useState<string | null>(null);

  const orgOptions = [
    { id: "Äldstekvorum (Män)", label: "Äldstekvorum (Män)", info: "Vuxna bröder med fokus på stöd & tjänande." },
    { id: "Hjälpförening (Kvinnor)", label: "Hjälpförening (Kvinnor)", info: "Vuxna systrar med fokus på omsorg & gemenskap." },
    { id: "Unga Män (Ungdomar)", label: "Unga Män (Ungdomar)", info: "Ungdomsverksamhet för unga män (12-18 år)." },
    { id: "Unga Kvinnor (Ungdomar)", label: "Unga Kvinnor (Ungdomar)", info: "Ungdomsverksamhet för unga kvinnor (12-18 år)." }
  ];

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
        <h3 className="font-serif italic text-base sm:text-lg text-brand-ink font-medium mt-3">
          Bli notifierad från grupper som samarbetar (välj en för dig):
        </h3>
        <p className="text-brand-ink/70 text-xs leading-relaxed font-light mt-1.5">
          Här kan du ta del av öppna inbjudningar från följande grupper och de unga missionärerna i kyrkan.
        </p>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {orgOptions.map(option => {
            const isSelected = organization === option.id;
            return (
              <div
                key={option.id}
                id={`org-choice-item-${option.id.replace(/\s+/g, "-")}`}
                className={`flex items-center justify-between p-4 rounded-xl border text-left transition-all min-h-[58px] duration-200 ${
                  isSelected
                    ? "border-brand-accent bg-brand-paper/40 text-brand-ink font-medium"
                    : "border-brand-ink/5 bg-brand-bg hover:border-brand-accent/20 text-brand-ink/80"
                }`}
              >
                <div 
                  onClick={() => {
                    setOrganization(option.id);
                    const newHidden = getHiddenOrgsForGroup(option.id);
                    setLimitedOrganizations(prev => prev.filter(o => !newHidden.includes(o)));
                  }}
                  className="flex-1 cursor-pointer flex flex-col justify-center pr-2"
                >
                  <span className="font-sans text-xs sm:text-sm font-medium text-brand-ink">{option.label}</span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setInfoOrg(infoOrg === option.id ? null : option.id)}
                    className="p-1 text-brand-accent/60 hover:text-brand-accent cursor-pointer rounded-full hover:bg-brand-paper transition-all"
                    aria-label={`Visa information om ${option.label}`}
                  >
                    <Info size={14} />
                  </button>
                  <div
                    onClick={() => {
                      setOrganization(option.id);
                      const newHidden = getHiddenOrgsForGroup(option.id);
                      setLimitedOrganizations(prev => prev.filter(o => !newHidden.includes(o)));
                    }}
                    className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-brand-accent border-brand-accent text-white"
                        : "border-brand-ink/10 bg-white"
                    }`}
                  >
                    {isSelected && <Check size={12} strokeWidth={2.5} />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {infoOrg && orgOptions.some(o => o.id === infoOrg) && (
          <div id="org-main-tooltip" className="p-4 bg-brand-paper border border-brand-accent/25 rounded-xl animate-in slide-in-from-top-2 duration-150 text-xs">
            <div className="font-serif italic font-semibold text-brand-ink flex items-center gap-1.5 mb-1">
              <Info size={12} className="text-brand-accent" />
              <span>Beskrivning: {infoOrg}</span>
            </div>
            <p className="text-brand-ink/80 font-light leading-relaxed">
              {orgOptions.find(o => o.id === infoOrg)?.info || ""}
            </p>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-brand-ink/5 space-y-4">
        <label className="flex items-start p-4 rounded-xl bg-brand-bg hover:bg-brand-paper/50 transition-colors cursor-pointer select-none border border-brand-ink/5">
          <input
            id="limit-orgs-checkbox"
            type="checkbox"
            checked={limitOrganizations}
            onChange={e => {
              const checked = e.target.checked;
              setLimitOrganizations(checked);
              if (checked) {
                setLimitedOrganizations(visibleOrganizations);
              } else {
                setLimitedOrganizations([]);
              }
            }}
            className="w-4 h-4 rounded border-brand-ink/20 text-brand-accent mr-4 mt-1 cursor-pointer accent-brand-accent shrink-0"
          />
          <div>
            <div className="font-serif italic text-sm text-brand-ink font-medium">
              Begränsa notiser från övriga grupper
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

            {infoOrg && ORG_INFO[infoOrg] && (
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

import React from "react";
import { PhoneCall, Globe, Check } from "lucide-react";
import { UiLanguage } from "../../mission_router";

const LANGUAGE_OPTIONS = [
  { code: "Svenska", label: "Svenska" },
  { code: "English", label: "English" },
  { code: "Español", label: "Español" },
  { code: "Kiswahili", label: "Kiswahili" },
  { code: "Tiếng Việt", label: "Tiếng Việt" }
];

interface MoreSettingsSectionProps {
  formats: ("physical" | "telephone")[];
  toggleFormat: (format: "physical" | "telephone") => void;
  allowDigital: boolean;
  setAllowDigital: (val: boolean) => void;
  spiritualTips: boolean;
  setSpiritualTips: (val: boolean) => void;
  selectedLanguages: string[];
  toggleLanguage: (langCode: string) => void;
  uiLanguage: UiLanguage;
}

export function MoreSettingsSection({
  formats,
  toggleFormat,
  allowDigital,
  setAllowDigital,
  spiritualTips,
  setSpiritualTips,
  selectedLanguages,
  toggleLanguage,
  uiLanguage
}: MoreSettingsSectionProps) {
  return (
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
          <label className="flex items-center justify-between p-3.5 bg-brand-bg rounded-xl border border-brand-ink/5 cursor-pointer hover:border-brand-ink/10 transition-all">
            <span className="text-xs font-medium text-brand-ink">Fysiskt på plats</span>
            <input
              type="checkbox"
              checked={formats.includes("physical")}
              onChange={() => toggleFormat("physical")}
              className="accent-brand-accent h-4 w-4 rounded cursor-pointer"
            />
          </label>

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
  );
}

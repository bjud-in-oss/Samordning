import React, { useState, useEffect } from "react";
import { Check, Heart, HelpCircle, Bell, Info } from "lucide-react";
import { SubscriptionRecord } from "../types";
import { TRANSLATIONS, UiLanguage } from "../translations";

// [CURRENT SUBDIRECTORY/CYCLE] | [4_Produce]

// Sorterade geografiskt (Norr -> Söder)
const GOTEBORG_AREAS = [
  "Angered",
  "Kortedala",
  "Gamlestaden",
  "Hisingen",
  "Biskopsgården",
  "Lundby",
  "Partille",
  "Örgryte",
  "Johanneberg",
  "Majorna",
  "Mölndal",
  "Frölunda",
  "Torslanda",
  "Askim",
  "Härryda"
];

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
    formats: ("physical" | "telephone")[];
    alwaysNotify: boolean;
    spiritualTips: boolean;
  }) => void;
  savedTags?: {
    areas: string[];
    languages?: string[];
    formats: ("physical" | "telephone")[];
    alwaysNotify: boolean;
    spiritualTips: boolean;
  };
  pushEnabled: boolean;
  onEnablePush: () => void;
  uiLanguage: UiLanguage;
}

export default function OnboardingForm({
  onSave,
  savedTags,
  pushEnabled,
  onEnablePush,
  uiLanguage
}: OnboardingFormProps) {
  const [selectedAreas, setSelectedAreas] = useState<string[]>(
    savedTags?.areas || ["Kortedala"]
  );
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(
    savedTags?.languages || ["Svenska"]
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

  const [feedback, setFeedback] = useState<string | null>(null);

  const t = TRANSLATIONS[uiLanguage];

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
      prev.includes(format)
        ? prev.filter(f => f !== format)
        : [...prev, format]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      areas: selectedAreas,
      languages: selectedLanguages,
      formats,
      alwaysNotify,
      spiritualTips
    });
    setFeedback(t.saveFeedback);
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto pb-12">
      {/* Onboarding Intro */}
      <div className="bg-amber-50/65 rounded-3xl p-6 md:p-8 border border-amber-100/80">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center shrink-0">
            <Heart size={26} className="fill-amber-800/10" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
              {t.onboardingHeader}
            </h2>
            <p className="text-sm text-slate-600 font-medium">
              {t.onboardingSubtitle}
            </p>
          </div>
        </div>
        <p className="text-slate-700 text-sm md:text-base leading-relaxed">
          {t.onboardingIntro}
        </p>
      </div>

      {/* Val 1: Områden (Geografiskt sorterat Norr -> Söder) */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
        <div className="mb-5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            {t.step1Title}
          </span>
          <h3 className="text-xl font-bold text-slate-950 mt-2 mb-1">
            {t.step1Subtitle}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {GOTEBORG_AREAS.map(area => {
            const isSelected = selectedAreas.includes(area);
            return (
              <button
                key={area}
                type="button"
                onClick={() => toggleArea(area)}
                className={`flex items-center justify-between p-4 rounded-2xl border-2 text-left transition-all cursor-pointer min-h-[58px] ${
                  isSelected
                    ? "border-teal-600/70 bg-teal-50/30 text-teal-950"
                    : "border-slate-100 bg-slate-50/40 hover:border-slate-200 text-slate-700"
                }`}
                style={{ contentVisibility: "auto" }}
              >
                <span className="text-base font-semibold text-slate-800">{area}</span>
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border ${
                    isSelected
                      ? "bg-teal-600 border-teal-600 text-white"
                      : "border-slate-300 bg-white"
                  }`}
                >
                  {isSelected && <Check size={14} strokeWidth={3} />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* NYTT Steg 2: Samarbetande organisationer & Språkstöd (Sekundära språk) */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            {t.step2Title}
          </span>
          <h3 className="text-xl font-bold text-slate-950 mt-2 mb-1">
            {t.step2Subtitle}
          </h3>
        </div>

        {/* Pedagogiska organisationstexter */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
          <h4 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-teal-600 rounded-full"></span>
            {t.step2OrgHeader}
          </h4>
          <p className="text-slate-600 text-xs md:text-sm leading-relaxed">
            {t.step2OrgText}
          </p>
        </div>

        {/* Multi-select för Sekundära språk */}
        <div className="space-y-3">
          <div>
            <h4 className="text-base font-bold text-slate-900">{t.step2LangHeader}</h4>
            <p className="text-xs text-slate-500">{t.step2LangSubtitle}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {LANGUAGE_OPTIONS.map(lang => {
              const isSelected = selectedLanguages.includes(lang.code);
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => toggleLanguage(lang.code)}
                  className={`flex items-center justify-between p-4 rounded-2xl border-2 text-left transition-all cursor-pointer min-h-[58px] ${
                    isSelected
                      ? "border-teal-600/70 bg-teal-50/30 text-teal-950"
                      : "border-slate-100 bg-slate-50/40 hover:border-slate-200 text-slate-700"
                  }`}
                >
                  <span className="text-base font-semibold text-slate-800">{lang.label}</span>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border ${
                      isSelected
                        ? "bg-teal-600 border-teal-600 text-white"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    {isSelected && <Check size={14} strokeWidth={3} />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Val 3: Hur vill du hjälpa? */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
        <div className="mb-5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            {t.step3Title}
          </span>
          <h3 className="text-xl font-bold text-slate-950 mt-2 mb-1">
            {t.step3Subtitle}
          </h3>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => toggleFormat("physical")}
            className={`w-full flex items-start p-5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
              formats.includes("physical")
                ? "border-teal-600/70 bg-teal-50/30 text-teal-950"
                : "border-slate-100 bg-slate-50/40 hover:border-slate-200 text-slate-700"
            }`}
          >
            <div
              className={`w-6 h-6 rounded border flex items-center justify-center mr-4 shrink-0 mt-0.5 ${
                formats.includes("physical")
                  ? "bg-teal-600 border-teal-600 text-white"
                  : "border-slate-300 bg-white"
              }`}
            >
              {formats.includes("physical") && <Check size={14} strokeWidth={3} />}
            </div>
            <div>
              <div className="text-base font-bold text-slate-800 leading-none mb-1">
                {t.formatPhysicalTitle}
              </div>
              <div className="text-xs md:text-sm text-slate-500 leading-relaxed">
                {t.formatPhysicalDesc}
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => toggleFormat("telephone")}
            className={`w-full flex items-start p-5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
              formats.includes("telephone")
                ? "border-teal-600/70 bg-teal-50/30 text-teal-950"
                : "border-slate-100 bg-slate-50/40 hover:border-slate-200 text-slate-700"
            }`}
          >
            <div
              className={`w-6 h-6 rounded border flex items-center justify-center mr-4 shrink-0 mt-0.5 ${
                formats.includes("telephone")
                  ? "bg-teal-600 border-teal-600 text-white"
                  : "border-slate-300 bg-white"
              }`}
            >
              {formats.includes("telephone") && <Check size={14} strokeWidth={3} />}
            </div>
            <div>
              <div className="text-base font-bold text-slate-800 leading-none mb-1">
                {t.formatDigitalTitle}
              </div>
              <div className="text-xs md:text-sm text-slate-500 leading-relaxed">
                {t.formatDigitalDesc}
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Val 4 & 5: Aviseringar */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
        <div className="mb-5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            {t.step4Title}
          </span>
          <h3 className="text-xl font-bold text-slate-950 mt-2 mb-1">
            {t.step4Subtitle}
          </h3>
        </div>

        <div className="space-y-4">
          <label className="flex items-start p-4 rounded-2xl bg-slate-50/50 hover:bg-slate-100/70 transition-colors cursor-pointer select-none">
            <input
              type="checkbox"
              checked={alwaysNotify}
              onChange={e => setAlwaysNotify(e.target.checked)}
              className="w-5 h-5 rounded border-slate-300 text-teal-600 mr-4 mt-0.5 cursor-pointer accent-teal-600 shrink-0"
            />
            <div>
              <div className="text-base font-bold text-slate-800 leading-tight">
                {t.notifyOptionTitle}
              </div>
              <div className="text-xs text-slate-500 mt-1 leading-normal">
                {t.notifyOptionDesc}
              </div>
            </div>
          </label>

          <label className="flex items-start p-4 rounded-2xl bg-slate-50/50 hover:bg-slate-100/70 transition-colors cursor-pointer select-none">
            <input
              type="checkbox"
              checked={spiritualTips}
              onChange={e => setSpiritualTips(e.target.checked)}
              className="w-5 h-5 rounded border-slate-300 text-teal-600 mr-4 mt-0.5 cursor-pointer accent-teal-600 shrink-0"
            />
            <div>
              <div className="text-base font-bold text-slate-800 leading-tight">
                {t.spiritualOptionTitle}
              </div>
              <div className="text-xs text-slate-500 mt-1 leading-normal">
                {t.spiritualOptionDesc}
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* iPhone / iOS Guide Box */}
      <div className="bg-blue-50/40 rounded-3xl p-6 border border-blue-100 flex gap-4 items-start">
        <div className="w-10 h-10 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center shrink-0">
          <Info size={22} />
        </div>
        <div className="text-slate-700 text-sm leading-relaxed space-y-1">
          <h4 className="font-bold text-slate-900">{t.iosTipHeader}</h4>
          <p>{t.iosTipBody}</p>
        </div>
      </div>

      {/* Spara & Aktivera Web Push */}
      <div className="bg-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-teal-400 font-bold text-xs tracking-wider uppercase mb-1">
            <Bell size={16} />
            <span>{t.pushHeader}</span>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-slate-50">{t.pushHeader}</h3>
          <p className="text-slate-300 text-xs md:text-sm mt-1 leading-relaxed max-w-md">
            {t.pushSubtitle}
          </p>
        </div>

        <div className="flex flex-col gap-3 shrink-0 sm:min-w-[200px]">
          <button
            type="button"
            onClick={onEnablePush}
            disabled={pushEnabled}
            className={`px-5 py-3.5 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
              pushEnabled
                ? "bg-emerald-600/20 text-emerald-300 border border-emerald-500/20"
                : "bg-teal-600 hover:bg-teal-700 text-white shadow-sm active:scale-[0.98]"
            }`}
          >
            {pushEnabled ? t.pushBtnActive : t.pushBtnInactive}
          </button>

          <button
            type="submit"
            className="px-5 py-3 bg-white/10 hover:bg-white/15 border border-white/10 rounded-2xl font-semibold text-xs text-white transition-all active:scale-[0.98] cursor-pointer"
          >
            {t.saveBtn}
          </button>
        </div>
      </div>

      {feedback && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-4 rounded-2xl text-center font-semibold text-sm shadow-sm">
          {feedback}
        </div>
      )}
    </form>
  );
}

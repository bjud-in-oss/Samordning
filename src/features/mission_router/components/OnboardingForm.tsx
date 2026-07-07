import React, { useState, useEffect } from "react";
import { Check, ShieldCheck, HelpCircle, Bell } from "lucide-react";
import { SubscriptionRecord } from "../types";

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

interface OnboardingFormProps {
  onSave: (tags: {
    areas: string[];
    formats: ("physical" | "telephone")[];
    alwaysNotify: boolean;
    spiritualTips: boolean;
  }) => void;
  savedTags?: {
    areas: string[];
    formats: ("physical" | "telephone")[];
    alwaysNotify: boolean;
    spiritualTips: boolean;
  };
  pushEnabled: boolean;
  onEnablePush: () => void;
}

export default function OnboardingForm({
  onSave,
  savedTags,
  pushEnabled,
  onEnablePush
}: OnboardingFormProps) {
  const [selectedAreas, setSelectedAreas] = useState<string[]>(
    savedTags?.areas || ["Kortedala"]
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

  const toggleArea = (area: string) => {
    setSelectedAreas(prev =>
      prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]
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
      formats,
      alwaysNotify,
      spiritualTips
    });
    setFeedback("Dina inställningar sparades tillfälligt och anonymt!");
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto pb-12">
      {/* Onboarding Intro */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
              Anonym Volontär-Onboarding
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              Inga namn, inga lösenord, ingen permanent lagring.
            </p>
          </div>
        </div>
        <p className="text-slate-600 text-sm md:text-base leading-relaxed">
          Välkommen till en 100 % säker samordningstjänst. Genom att registrera
          dig nedan får du direkta larm (Web Push-notiser) till din enhet så fort
          ett missionärspar i dina valda områden behöver stöd.
        </p>
      </div>

      {/* Val 1: Områden (Geografiskt sorterat Norr -> Söder) */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Steg 1 av 4
          </span>
          <h3 className="text-xl font-bold text-slate-950 mt-2 mb-1">
            Välj dina stödområden
          </h3>
          <p className="text-slate-500 text-sm">
            Klicka på alla områden där du har möjlighet att stötta. Sorterat från Norr till Söder.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {GOTEBORG_AREAS.map(area => {
            const isSelected = selectedAreas.includes(area);
            return (
              <button
                key={area}
                type="button"
                onClick={() => toggleArea(area)}
                className={`flex items-center justify-between p-4 md:p-5 rounded-2xl border-2 text-left transition-all cursor-pointer min-h-[64px] ${
                  isSelected
                    ? "border-blue-600 bg-blue-50 text-blue-950"
                    : "border-slate-100 bg-slate-50/50 hover:border-slate-200 text-slate-700"
                }`}
                style={{ contentVisibility: "auto" }}
              >
                <span className="text-base md:text-lg font-bold">{area}</span>
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border ${
                    isSelected
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "border-slate-300 bg-white"
                  }`}
                >
                  {isSelected && <Check size={16} strokeWidth={3} />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Val 2: Hur vill du hjälpa? */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Steg 2 av 4
          </span>
          <h3 className="text-xl font-bold text-slate-950 mt-2 mb-1">
            Hur vill du hjälpa till?
          </h3>
          <p className="text-slate-500 text-sm">
            Välj de format som passar dig bäst.
          </p>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => toggleFormat("physical")}
            className={`w-full flex items-start p-5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
              formats.includes("physical")
                ? "border-blue-600 bg-blue-50 text-blue-950"
                : "border-slate-100 bg-slate-50/50 hover:border-slate-200 text-slate-700"
            }`}
          >
            <div
              className={`w-6 h-6 rounded border flex items-center justify-center mr-4 shrink-0 mt-0.5 ${
                formats.includes("physical")
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "border-slate-300 bg-white"
              }`}
            >
              {formats.includes("physical") && <Check size={14} strokeWidth={3} />}
            </div>
            <div>
              <div className="text-base md:text-lg font-bold leading-none mb-1">
                Fysiskt på plats
              </div>
              <div className="text-xs md:text-sm text-slate-500 leading-relaxed">
                Jag kan möta upp missionärer ute i staden för att närvara vid möten eller lektioner.
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => toggleFormat("telephone")}
            className={`w-full flex items-start p-5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
              formats.includes("telephone")
                ? "border-blue-600 bg-blue-50 text-blue-950"
                : "border-slate-100 bg-slate-50/50 hover:border-slate-200 text-slate-700"
            }`}
          >
            <div
              className={`w-6 h-6 rounded border flex items-center justify-center mr-4 shrink-0 mt-0.5 ${
                formats.includes("telephone")
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "border-slate-300 bg-white"
              }`}
            >
              {formats.includes("telephone") && <Check size={14} strokeWidth={3} />}
            </div>
            <div>
              <div className="text-base md:text-lg font-bold leading-none mb-1">
                Via telefon / video
              </div>
              <div className="text-xs md:text-sm text-slate-500 leading-relaxed">
                Jag deltar gärna digitalt hemifrån via telefon, Zoom eller FaceTime.
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Val 3 & 4: Tidsflexibilitet & Extrakanaler */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Steg 3 & 4 av 4
          </span>
          <h3 className="text-xl font-bold text-slate-950 mt-2 mb-1">
            Inställningar & Extrakanaler
          </h3>
          <p className="text-slate-500 text-sm">
            Finjustera dina aviseringar.
          </p>
        </div>

        <div className="space-y-4">
          <label className="flex items-start p-4 rounded-2xl bg-slate-50 hover:bg-slate-100/70 transition-colors cursor-pointer select-none">
            <input
              type="checkbox"
              checked={alwaysNotify}
              onChange={e => setAlwaysNotify(e.target.checked)}
              className="w-6 h-6 rounded border-slate-300 text-blue-600 mr-4 mt-0.5 cursor-pointer accent-blue-600 shrink-0"
            />
            <div>
              <div className="text-base font-bold text-slate-900 leading-tight">
                Skicka larm alltid, jag avgör i stunden
              </div>
              <div className="text-xs text-slate-500 mt-1 leading-normal">
                Standardval. Du får larm för alla passande möten, och klickar bara på larmet om du råkar ha tid just då.
              </div>
            </div>
          </label>

          <label className="flex items-start p-4 rounded-2xl bg-slate-50 hover:bg-slate-100/70 transition-colors cursor-pointer select-none">
            <input
              type="checkbox"
              checked={spiritualTips}
              onChange={e => setSpiritualTips(e.target.checked)}
              className="w-6 h-6 rounded border-slate-300 text-blue-600 mr-4 mt-0.5 cursor-pointer accent-blue-600 shrink-0"
            />
            <div>
              <div className="text-base font-bold text-slate-900 leading-tight">
                Prenumerera på "Veckans andliga tips"
              </div>
              <div className="text-xs text-slate-500 mt-1 leading-normal">
                Få ett trevligt andligt tips skickat som en tyst push-notis en gång i veckan.
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Spara & Aktivera Web Push */}
      <div className="bg-slate-950 rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-blue-400 font-bold text-sm tracking-wider uppercase mb-1">
            <Bell size={18} />
            <span>Notisinställningar</span>
          </div>
          <h3 className="text-xl md:text-2xl font-black">Aktivera Notiser</h3>
          <p className="text-slate-400 text-sm mt-1 leading-relaxed max-w-md">
            För att kunna ta emot larm i realtid krävs att din webbläsare har Web Push aktiverat.
          </p>
        </div>

        <div className="flex flex-col gap-3 shrink-0">
          <button
            type="button"
            onClick={onEnablePush}
            disabled={pushEnabled}
            className={`px-6 py-4 rounded-2xl font-extrabold text-base transition-all flex items-center justify-center gap-2 ${
              pushEnabled
                ? "bg-emerald-600/25 text-emerald-400 border border-emerald-500/30"
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 active:scale-[0.98]"
            }`}
          >
            {pushEnabled ? "✓ Notiser Aktiva" : "Aktivera Web Push"}
          </button>

          <button
            type="submit"
            className="px-6 py-3 bg-white/10 hover:bg-white/15 border border-white/10 rounded-2xl font-bold text-sm text-white transition-all active:scale-[0.98]"
          >
            Spara inställningar
          </button>
        </div>
      </div>

      {feedback && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl text-center font-bold text-base shadow-sm">
          {feedback}
        </div>
      )}
    </form>
  );
}

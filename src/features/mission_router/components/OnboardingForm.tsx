import React, { useState, useEffect } from "react";
import { Check, Heart, HelpCircle, Bell, Info } from "lucide-react";
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
    setFeedback("Dina inställningar sparades tryggt och anonymt!");
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
              Anmälan som stödmedlem
            </h2>
            <p className="text-sm text-slate-600 font-medium">
              Ett varmt, helt anonymt sätt att hjälpa våra unga missionärer.
            </p>
          </div>
        </div>
        <p className="text-slate-700 text-sm md:text-base leading-relaxed">
          Välkommen till vår trygga och enkla samordningstjänst. Genom att fylla i dina val underlättar du för våra missionärer att snabbt hitta en vuxen stödmedlem. Du får en mjuk avisering (notis) i din telefon eller dator så fort en förfrågan skapas i något av dina valda områden.
        </p>
      </div>

      {/* Val 1: Områden (Geografiskt sorterat Norr -> Söder) */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
        <div className="mb-5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            Steg 1 av 4
          </span>
          <h3 className="text-xl font-bold text-slate-950 mt-2 mb-1">
            Välj områden där du kan hjälpa till
          </h3>
          <p className="text-slate-500 text-sm">
            Klicka på de områden i Göteborg där du har möjlighet att stötta. Sorterat geografiskt från norr till söder.
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

      {/* Val 2: Hur vill du hjälpa? */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
        <div className="mb-5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            Steg 2 av 4
          </span>
          <h3 className="text-xl font-bold text-slate-950 mt-2 mb-1">
            Hur vill du delta?
          </h3>
          <p className="text-slate-500 text-sm">
            Välj de format som passar din livssituation bäst.
          </p>
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
                Via telefon / video
              </div>
              <div className="text-xs md:text-sm text-slate-500 leading-relaxed">
                Jag deltar gärna via telefon eller videosamtal på Zoom eller WhatsApp.
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Val 3 & 4: Inställningar */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
        <div className="mb-5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            Steg 3 & 4 av 4
          </span>
          <h3 className="text-xl font-bold text-slate-950 mt-2 mb-1">
            Anpassa dina aviseringar
          </h3>
          <p className="text-slate-500 text-sm">
            Finjustera hur och när du vill bli meddelad.
          </p>
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
                Skicka aviseringar direkt till min enhet
              </div>
              <div className="text-xs text-slate-500 mt-1 leading-normal">
                Du får ett vänligt meddelande när ett missionsbehov uppstår i dina valda områden. Du avgör helt i stunden om du har möjlighet att delta eller ej.
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
                Prenumerera på veckovisa andliga tankar
              </div>
              <div className="text-xs text-slate-500 mt-1 leading-normal">
                Få en kort, upplyftande tanke skickad som en tyst notis en gång i veckan.
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
          <h4 className="font-bold text-slate-900">Viktigt tips för iPhone/iOS-användare:</h4>
          <p>
            Denna tjänst fungerar bäst i din mobiltelefon. Om du använder en iPhone måste du först trycka på Dela-knappen (fyrkanten med en pil uppåt) i webbläsaren och välja <strong className="text-slate-900">"Lägg till på hemskärmen"</strong>. Öppna sedan appen från din hemskärm för att kunna aktivera aviseringarna.
          </p>
        </div>
      </div>

      {/* Spara & Aktivera Web Push */}
      <div className="bg-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-teal-400 font-bold text-xs tracking-wider uppercase mb-1">
            <Bell size={16} />
            <span>Meddelandeinställningar</span>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-slate-50">Slå på aviseringar</h3>
          <p className="text-slate-300 text-xs md:text-sm mt-1 leading-relaxed max-w-md">
            För att kunna ta emot förfrågningar i samma sekund som de skapas behöver du godkänna aviseringar.
          </p>
        </div>

        <div className="flex flex-col gap-3 shrink-0 sm:min-w-[200px]">
          <button
            type="button"
            onClick={onEnablePush}
            disabled={pushEnabled}
            className={`px-5 py-3.5 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
              pushEnabled
                ? "bg-emerald-600/20 text-emerald-300 border border-emerald-500/20"
                : "bg-teal-600 hover:bg-teal-700 text-white shadow-sm active:scale-[0.98]"
            }`}
          >
            {pushEnabled ? "✓ Notiser aktiverade" : "Aktivera aviseringar"}
          </button>

          <button
            type="submit"
            className="px-5 py-3 bg-white/10 hover:bg-white/15 border border-white/10 rounded-2xl font-semibold text-xs text-white transition-all active:scale-[0.98]"
          >
            Spara inställningar
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

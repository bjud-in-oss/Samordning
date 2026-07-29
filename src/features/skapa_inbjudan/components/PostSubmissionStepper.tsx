// [CURRENT SUBDIRECTORY/CYCLE] | [src/features/skapa_inbjudan/4_Produce] - Sequential 4-Step Post-Submission Component

import React, { useState } from "react";
import { Sparkles, ShieldCheck, Smartphone, CheckCircle, Calendar, Copy, ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";

interface PostSubmissionStepperProps {
  activityText: string;
  selectedTime: string;
  locationName: string;
  selectedAreas: string[];
  selectedAudience: string[];
  selectedOrganization: string;
  organizerPersonName: string;
  category: string;
  formattedText: string;
  onClose: () => void;
  onCompletePublish: () => Promise<void>;
  sending: boolean;
}

export function PostSubmissionStepper({
  activityText,
  selectedTime,
  locationName,
  selectedAreas,
  selectedAudience,
  selectedOrganization,
  organizerPersonName,
  category,
  formattedText,
  onClose,
  onCompletePublish,
  sending
}: PostSubmissionStepperProps) {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [consentGiven, setConsentGiven] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [isFinalConfirmed, setIsFinalConfirmed] = useState<boolean>(false);

  // Missing fields analysis for Step 1
  const missing: string[] = [];
  if (!activityText.trim()) missing.push("Beskrivning av aktivitet");
  if (!selectedTime.trim()) missing.push("Tid & datum");
  if (!locationName.trim()) missing.push("Mötesplats");
  if (!selectedOrganization.trim()) missing.push("Arrangör");

  const smsPayload = `#WEBB
Kategori: ${category}
Tid: ${selectedTime || "18:00"}
Mötesplats: ${locationName || "Kapellet"}
Bjud in från områden: ${selectedAreas.join(", ") || "Göteborg"}
Målgrupp: ${selectedAudience.join(", ") || "Alla"}
Avsändare: ${selectedOrganization}${organizerPersonName ? ` (${organizerPersonName})` : ""}
Aktivitet: ${activityText}`;

  const smsHref = `sms:0736108997?body=${encodeURIComponent(smsPayload)}`;

  const handleCopyText = () => {
    navigator.clipboard.writeText(formattedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadIcs = () => {
    const title = `Inbjudan: ${category} (${selectedAreas.join(", ") || "Göteborg"})`;
    const desc = activityText || formattedText;
    const loc = locationName || "Kapellet";

    const now = new Date();
    const dtStamp = now.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    
    let dtStart = dtStamp;
    let dtEnd = dtStamp;
    try {
      const start = new Date();
      start.setHours(18, 0, 0, 0);
      dtStart = start.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
      const end = new Date(start.getTime() + 2 * 3600 * 1000);
      dtEnd = end.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    } catch (e) {}

    const icsData = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Ge Stöd till Missionärerna//Inbjudan//SV",
      "BEGIN:VEVENT",
      `UID:inv-${Date.now()}@samordning`,
      `DTSTAMP:${dtStamp}`,
      `DTSTART:${dtStart}`,
      `DTEND:${dtEnd}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${desc.replace(/\n/g, "\\n")}`,
      `LOCATION:${loc}`,
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([icsData], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "inbjudan.ics";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const openGoogleCalendar = () => {
    const title = encodeURIComponent(`Inbjudan: ${category}`);
    const details = encodeURIComponent(activityText || formattedText);
    const loc = encodeURIComponent(locationName || "Kapellet");
    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${loc}`;
    window.open(googleUrl, "_blank");
  };

  const handleFinalYes = async () => {
    setIsFinalConfirmed(true);
    // Save to local registrations
    if (typeof localStorage !== "undefined") {
      try {
        const stored = localStorage.getItem("my_registrations");
        const list = stored ? JSON.parse(stored) : [];
        const newReg = {
          id: `reg-${Date.now()}`,
          category,
          locationName,
          selectedTime,
          activityText,
          createdAt: new Date().toISOString()
        };
        localStorage.setItem("my_registrations", JSON.stringify([newReg, ...list]));
      } catch (e) {
        console.warn("Could not save to my_registrations", e);
      }
    }
    await onCompletePublish();
  };

  return (
    <div className="fixed inset-0 z-50 bg-brand-ink/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-brand-ink/10 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Progress Bar & Header */}
        <div className="space-y-3 border-b border-brand-ink/10 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-brand-accent/10 text-brand-accent font-bold">
                Steg {currentStep} av 4
              </span>
              <h2 className="font-serif italic text-lg font-bold text-brand-ink">
                {currentStep === 1 && "1. AI-Rekonciliering"}
                {currentStep === 2 && "2. Integritetsbekräftelse"}
                {currentStep === 3 && "3. SMS & Delning"}
                {currentStep === 4 && "4. SMS-Retur & Kalender"}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-brand-ink/40 hover:text-brand-ink text-xs font-mono uppercase cursor-pointer"
            >
              Stäng ✕
            </button>
          </div>

          {/* Stepper indicators */}
          <div className="grid grid-cols-4 gap-1.5 h-1.5 bg-brand-paper rounded-full overflow-hidden">
            <div className={`h-full transition-all ${currentStep >= 1 ? "bg-brand-accent" : "bg-transparent"}`} />
            <div className={`h-full transition-all ${currentStep >= 2 ? "bg-brand-accent" : "bg-transparent"}`} />
            <div className={`h-full transition-all ${currentStep >= 3 ? "bg-brand-accent" : "bg-transparent"}`} />
            <div className={`h-full transition-all ${currentStep >= 4 ? "bg-brand-accent" : "bg-transparent"}`} />
          </div>
        </div>

        {/* STEP 1: AI-Rekonciliering */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-brand-paper rounded-2xl border border-brand-accent/20">
              <Sparkles className="text-brand-accent shrink-0 mt-0.5" size={20} />
              <div className="space-y-1">
                <h3 className="font-serif italic font-semibold text-brand-ink text-base">
                  Vad du inte tänkt på
                </h3>
                <p className="text-xs text-brand-ink/80 font-light leading-relaxed">
                  AI har granskat din inbjudan för att säkerställa att allt känns komplett och varmt innan den skickas.
                </p>
              </div>
            </div>

            {missing.length > 0 ? (
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-2 text-xs">
                <span className="font-bold text-amber-900 font-mono">OBS: Följande fält saknar innehåll:</span>
                <ul className="list-disc list-inside text-amber-800 space-y-1">
                  {missing.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
                <p className="text-[11px] text-amber-900/70 italic mt-1">
                  Du kan ändå gå vidare om du vill fylla i detta senare.
                </p>
              </div>
            ) : (
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center gap-2 text-xs text-emerald-900 font-medium">
                <CheckCircle size={16} className="text-emerald-600 shrink-0" />
                <span>Alla viktiga fält är ifyllda! Inbjudan ser jättefin ut.</span>
              </div>
            )}

            <div className="p-3 bg-brand-paper/50 rounded-xl border border-brand-ink/5 font-mono text-[11px] space-y-1 text-brand-ink/80">
              <span className="text-[9px] uppercase tracking-wider text-brand-ink/50 block font-bold">Kategori & Område:</span>
              <p>{category} • {selectedAreas.join(", ") || locationName || "Göteborg"}</p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setCurrentStep(2)}
                className="w-full py-3 bg-brand-accent hover:opacity-90 text-white font-mono text-xs uppercase font-bold tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Gå till Integritet</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Integritet */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-brand-paper rounded-2xl border border-brand-ink/10">
              <ShieldCheck className="text-emerald-700 shrink-0 mt-0.5" size={22} />
              <div className="space-y-1">
                <h3 className="font-serif italic font-semibold text-brand-ink text-base">
                  Personuppgifter & Ansvar
                </h3>
                <p className="text-xs text-brand-ink/80 font-light leading-relaxed">
                  För att skydda allas integritet granskas alla nya inbjudningar innan de syns offentligt.
                </p>
              </div>
            </div>

            <label className="flex items-start gap-3 p-4 bg-brand-paper/80 rounded-2xl border border-brand-accent/20 cursor-pointer">
              <input
                type="checkbox"
                checked={consentGiven}
                onChange={e => setConsentGiven(e.target.checked)}
                className="mt-0.5 rounded border-brand-ink/30 text-brand-accent focus:ring-brand-accent shrink-0"
              />
              <span className="text-xs text-brand-ink font-light leading-relaxed">
                "Jag bekräftar att jag inte delar andras personuppgifter (som namn eller kontaktinfo) i inbjudan utan deras godkännande."
              </span>
            </label>

            <div className="flex justify-between gap-2 pt-2">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2.5 bg-brand-paper text-brand-ink font-mono text-xs uppercase rounded-xl hover:bg-brand-ink/10 transition-colors cursor-pointer flex items-center gap-1"
              >
                <ArrowLeft size={14} />
                <span>Bakåt</span>
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                disabled={!consentGiven}
                className="flex-1 py-3 bg-brand-accent hover:opacity-90 disabled:opacity-40 text-white font-mono text-xs uppercase font-bold tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Gå till SMS & Delning</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SMS & Delning */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="space-y-1 text-center">
              <h3 className="font-serif italic text-lg font-bold text-brand-ink">
                Skicka inbjudan via SMS
              </h3>
              <p className="text-xs text-brand-ink/70 font-light">
                Öppna din SMS-app för att skicka inbjudan direkt, eller kopiera texten.
              </p>
            </div>

            <div className="p-3 bg-brand-paper rounded-2xl border border-brand-ink/10 font-mono text-[11px] text-brand-ink/80 whitespace-pre-wrap max-h-36 overflow-y-auto">
              {smsPayload}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <a
                href={smsHref}
                className="py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs uppercase font-bold tracking-wider rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer text-center"
              >
                <Smartphone size={16} />
                <span>Öppna SMS-app</span>
              </a>
              <button
                type="button"
                onClick={handleCopyText}
                className="py-3 bg-brand-paper hover:bg-brand-ink/10 border border-brand-ink/10 text-brand-ink font-mono text-xs uppercase font-bold tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Copy size={16} />
                <span>{copied ? "Kopierad!" : "Kopiera text"}</span>
              </button>
            </div>

            <div className="flex justify-between gap-2 pt-2 border-t border-brand-ink/10">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-4 py-2.5 bg-brand-paper text-brand-ink font-mono text-xs uppercase rounded-xl hover:bg-brand-ink/10 transition-colors cursor-pointer flex items-center gap-1"
              >
                <ArrowLeft size={14} />
                <span>Bakåt</span>
              </button>
              <button
                onClick={() => setCurrentStep(4)}
                className="flex-1 py-3 bg-brand-accent hover:opacity-90 text-white font-mono text-xs uppercase font-bold tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Nästa: Bekräfta & Kalender</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: SMS-Retur & Kalender */}
        {currentStep === 4 && (
          <div className="space-y-5 text-center">
            {!isFinalConfirmed ? (
              <>
                <div className="w-12 h-12 bg-brand-accent/10 text-brand-accent rounded-full flex items-center justify-center mx-auto">
                  <Smartphone size={24} />
                </div>

                <div className="space-y-1">
                  <h3 className="font-serif italic text-xl font-bold text-brand-ink">
                    Fick du iväg meddelandet?
                  </h3>
                  <p className="text-xs text-brand-ink/70 font-light">
                    Bekräfta att du skickat SMS:et så sparas inbjudan under dina anmälningar.
                  </p>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <button
                    onClick={handleFinalYes}
                    disabled={sending}
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs uppercase font-bold tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <CheckCircle size={18} />
                    <span>{sending ? "Sparar inbjudan..." : "Ja, skickat!"}</span>
                  </button>
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="w-full py-2.5 bg-brand-paper hover:bg-brand-ink/10 text-brand-ink font-mono text-xs uppercase rounded-xl transition-all cursor-pointer"
                  >
                    Nej, gå tillbaka till SMS
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle size={28} />
                </div>

                <div className="space-y-1">
                  <h3 className="font-serif italic text-xl font-bold text-brand-ink">
                    Tack! Din inbjudan är insänd
                  </h3>
                  <p className="text-xs text-brand-ink/70 font-light leading-relaxed">
                    Din inbjudan har placerats i väntrummet för granskning och finns sparad under dina anmälningar.
                  </p>
                </div>

                {/* Calendar actions */}
                <div className="p-4 bg-brand-paper rounded-2xl border border-brand-accent/20 space-y-3">
                  <span className="font-mono text-[10px] uppercase font-bold text-brand-accent block tracking-wider">
                    Spara i din kalender
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={downloadIcs}
                      className="py-2.5 bg-white hover:bg-brand-paper border border-brand-ink/10 text-brand-ink font-mono text-xs uppercase font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Calendar size={14} className="text-brand-accent" />
                      <span>.ICS-fil</span>
                    </button>
                    <button
                      type="button"
                      onClick={openGoogleCalendar}
                      className="py-2.5 bg-white hover:bg-brand-paper border border-brand-ink/10 text-brand-ink font-mono text-xs uppercase font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ExternalLink size={14} className="text-brand-accent" />
                      <span>Google Cal</span>
                    </button>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="w-full py-3 bg-brand-accent hover:opacity-90 text-white font-mono text-xs uppercase font-bold tracking-wider rounded-xl transition-all shadow-md cursor-pointer"
                >
                  Visa mina inbjudningar
                </button>
              </>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

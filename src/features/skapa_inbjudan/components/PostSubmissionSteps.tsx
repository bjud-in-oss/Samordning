// [CURRENT SUBDIRECTORY/CYCLE] | [src/features/skapa_inbjudan/4_Produce] - Post-Submission Sequential Cards Component

import React, { useState } from "react";
import { ShieldCheck, Send, CheckCircle2, Copy, Calendar, ArrowRight, RotateCcw } from "lucide-react";
import { washAnnouncementText } from "../../mission_router";

interface PostSubmissionStepsProps {
  formattedText: string;
  selectedTime: string;
  locationName: string;
  selectedOrganization: string;
  organizerPersonName: string;
  activityText: string;
  selectedAreas: string[];
  selectedAudience: string[];
  onFinished: () => void;
  onCancel: () => void;
}

export function PostSubmissionSteps({
  formattedText,
  selectedTime,
  locationName,
  selectedOrganization,
  organizerPersonName,
  activityText,
  selectedAreas,
  selectedAudience,
  onFinished,
  onCancel
}: PostSubmissionStepsProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [copied, setCopied] = useState<boolean>(false);
  const [sentChoice, setSentChoice] = useState<"yes" | "no" | null>(null);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const cleanedActivity = washAnnouncementText(activityText);
  const organizerDisplay = `${selectedOrganization}${organizerPersonName ? ` (${organizerPersonName})` : ""}`;
  
  const smsBody = `#WEBB
Kategori: Vara en vän
Tid: ${selectedTime || "Ospecificerad tid"}
Mötesplats: ${locationName || "Göteborg"}
Bjud in från områden: ${selectedAreas.join(", ") || "Göteborg"}
Målgrupp: ${selectedAudience.join(", ") || "Alla"}
Avsändare: ${organizerDisplay}
Aktivitet: ${cleanedActivity}`;

  const smsHref = `sms:0736108997?body=${encodeURIComponent(smsBody)}`;

  const handleCopyText = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(formattedText || smsBody);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (e) {
      console.error("Clipboard copy failed", e);
    }
  };

  const handleConfirmSent = async () => {
    setSentChoice("yes");

    // Save to localStorage under "my_applications" and "my_pending_proposals"
    const proposalId = `prop-${Date.now()}`;
    const newRecord = {
      id: proposalId,
      time: selectedTime || "Ospecificerad tid",
      locationName: locationName || "Göteborg",
      area: selectedAreas.join(", ") || locationName || "Göteborg",
      category: "Vara en vän",
      responsibleParty: organizerDisplay,
      scrubbedText: cleanedActivity,
      createdAt: new Date().toISOString(),
      status: "pending_review"
    };

    if (typeof localStorage !== "undefined") {
      try {
        // my_applications
        const storedApps = localStorage.getItem("my_applications");
        const appList = storedApps ? JSON.parse(storedApps) : [];
        localStorage.setItem("my_applications", JSON.stringify([newRecord, ...appList]));

        // my_pending_proposals
        const storedProps = localStorage.getItem("my_pending_proposals");
        const propList = storedProps ? JSON.parse(storedProps) : [];
        localStorage.setItem("my_pending_proposals", JSON.stringify([newRecord, ...propList]));
      } catch (err) {
        console.error("Error saving to localStorage", err);
      }
    }

    // Submit to server simulation
    try {
      await fetch("/api/sim/sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "0700000000",
          body: smsBody
        })
      });
    } catch (err) {
      console.error("Server submission error", err);
    }

    setIsSaved(true);
  };

  const handleDownloadCalendarIcs = () => {
    const title = `Inbjudan: ${cleanedActivity.substring(0, 30)}`;
    const description = `${cleanedActivity}\nArrangör: ${organizerDisplay}\nPlats: ${locationName}`;
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//LiveCard//Inbjudan//SV",
      "BEGIN:VEVENT",
      `SUMMARY:${title}`,
      `DESCRIPTION:${description.replace(/\n/g, "\\n")}`,
      `LOCATION:${locationName}`,
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "inbjudan.ics";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-3xl p-6 border-2 border-brand-accent/30 shadow-xl space-y-6 max-w-xl mx-auto animate-in fade-in zoom-in-95 duration-200 text-left">
      {/* Step Indicator Header */}
      <div className="flex items-center justify-between border-b border-brand-ink/10 pb-3">
        <span className="font-mono text-xs uppercase font-bold text-brand-accent tracking-wider">
          Steg {step} av 3
        </span>
        <div className="flex items-center gap-1.5">
          <span className={`w-2.5 h-2.5 rounded-full ${step >= 1 ? "bg-brand-accent" : "bg-brand-ink/20"}`} />
          <span className={`w-2.5 h-2.5 rounded-full ${step >= 2 ? "bg-brand-accent" : "bg-brand-ink/20"}`} />
          <span className={`w-2.5 h-2.5 rounded-full ${step >= 3 ? "bg-brand-accent" : "bg-brand-ink/20"}`} />
        </div>
      </div>

      {/* STEP 1: Privacy Confirmation */}
      {step === 1 && (
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-accent/10 rounded-2xl flex items-center justify-center text-brand-accent shrink-0">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-brand-ink">
                1. Integritetsbekräftelse
              </h3>
              <p className="font-mono text-xs text-brand-ink/60">
                Garant för trygga och respektfulla inbjudningar
              </p>
            </div>
          </div>

          <div className="p-4 bg-brand-paper/80 rounded-2xl border border-brand-ink/10 space-y-3 text-xs leading-relaxed text-brand-ink">
            <p>
              Jag bekräftar att jag inte delar andras personuppgifter (som namn, telefonnummer, adresser) i inbjudan utan deras uttryckliga medgivande.
            </p>
            <p className="text-[11px] text-brand-ink/60 font-mono italic">
              Alla inbjudningar granskas av ansvariga innan de visas för hela församlingen.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 border border-brand-ink/15 text-brand-ink font-mono text-xs uppercase font-semibold rounded-xl hover:bg-brand-paper transition-all cursor-pointer"
            >
              Avbryt
            </button>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-5 py-2.5 bg-brand-accent hover:bg-brand-accent/90 text-white font-mono text-xs uppercase font-bold tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span>Godkänn och fortsätt</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: SMS & Share */}
      {step === 2 && (
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-accent/10 rounded-2xl flex items-center justify-center text-brand-accent shrink-0">
              <Send size={22} />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-brand-ink">
                2. SMS & Delning
              </h3>
              <p className="font-mono text-xs text-brand-ink/60">
                Skicka via din enhet eller kopiera texten
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <a
              href={smsHref}
              onClick={() => setTimeout(() => setStep(3), 800)}
              className="w-full p-4 bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs uppercase font-bold rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send size={16} />
              <span>Öppna SMS-appen för att skicka</span>
            </a>

            <button
              type="button"
              onClick={handleCopyText}
              className="w-full p-3.5 bg-brand-paper hover:bg-brand-paper/80 border border-brand-ink/15 text-brand-ink font-mono text-xs uppercase font-semibold rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Copy size={16} className="text-brand-accent" />
              <span>{copied ? "Text kopierad till urklipp!" : "Kopiera direktlänk / SMS-text"}</span>
            </button>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-brand-ink/10">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-3.5 py-2 text-brand-ink/60 font-mono text-xs hover:text-brand-ink transition-colors cursor-pointer"
            >
              Bakåt
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="px-5 py-2.5 bg-brand-accent hover:bg-brand-accent/90 text-white font-mono text-xs uppercase font-bold tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span>Vidare till bekräftelse</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Return & Calendar */}
      {step === 3 && (
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-accent/10 rounded-2xl flex items-center justify-center text-brand-accent shrink-0">
              <CheckCircle2 size={22} />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-brand-ink">
                3. SMS-Retur & Kalender
              </h3>
              <p className="font-mono text-xs text-brand-ink/60">
                Bekräfta sändningen och spara händelsen
              </p>
            </div>
          </div>

          {sentChoice === null ? (
            <div className="space-y-4 p-5 bg-brand-paper/80 rounded-2xl border border-brand-ink/10 text-center">
              <p className="font-serif italic text-base text-brand-ink font-medium">
                Fick du iväg meddelandet?
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleConfirmSent}
                  className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs uppercase font-bold rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={16} />
                  <span>Ja, skickat!</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSentChoice("no")}
                  className="w-full sm:w-auto px-6 py-3 bg-brand-paper border border-brand-ink/20 hover:bg-brand-ink/5 text-brand-ink font-mono text-xs uppercase font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <RotateCcw size={16} />
                  <span>Nej, jag ångrade mig</span>
                </button>
              </div>
            </div>
          ) : sentChoice === "yes" ? (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 space-y-2">
                <div className="flex items-center gap-2 font-bold font-mono text-xs uppercase">
                  <CheckCircle2 size={18} className="text-emerald-600" />
                  <span>Inbjudan sparad!</span>
                </div>
                <p className="text-xs font-light leading-relaxed">
                  Din inbjudan har sparats under <strong>Mina anmälningar</strong> på din enhet och skickats in för granskning.
                </p>
              </div>

              {/* Calendar Action Button */}
              <button
                type="button"
                onClick={handleDownloadCalendarIcs}
                className="w-full p-3.5 bg-brand-accent hover:bg-brand-accent/90 text-white font-mono text-xs uppercase font-bold rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calendar size={18} />
                <span>Lägg till i kalender (.ics)</span>
              </button>

              <div className="pt-3 border-t border-brand-ink/10 flex justify-end">
                <button
                  type="button"
                  onClick={onFinished}
                  className="px-6 py-2.5 bg-brand-ink text-white font-mono text-xs uppercase font-bold rounded-xl transition-all cursor-pointer"
                >
                  Färdig (Gå till flödet)
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 p-5 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 text-center">
              <p className="text-xs font-mono font-semibold uppercase">
                Ingen inbjudan har skickats eller sparats.
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSentChoice(null)}
                  className="px-4 py-2 bg-brand-paper border border-amber-300 text-amber-900 font-mono text-xs uppercase font-semibold rounded-xl hover:bg-amber-100 transition-all cursor-pointer"
                >
                  Försök igen
                </button>
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 bg-amber-700 text-white font-mono text-xs uppercase font-bold rounded-xl hover:bg-amber-800 transition-all cursor-pointer"
                >
                  Gå tillbaka till redigering
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

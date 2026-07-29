// [src/features/skapa_inbjudan/components/PostSubmissionStepper.tsx] - 4-Step Post Submission Stepper

import React, { useState } from "react";
import { X, CheckCircle2, AlertTriangle, FileText, Send, Copy, QrCode, Calendar, Check, ArrowRight, ShieldCheck, RefreshCw } from "lucide-react";
import { AiReviewProposal } from "../domain/types";
import { GATEWAY_NUMBER } from "../domain/constants";
import { washAnnouncementText } from "../../mission_router";

interface PostSubmissionStepperProps {
  activityText: string;
  selectedTime: string;
  locationName: string;
  selectedOrganization: string;
  organizerPersonName: string;
  selectedAreas: string[];
  selectedAudience: string[];
  consentConfirmed: boolean;
  setConsentConfirmed: (val: boolean) => void;
  formattedText: string;
  aiProposal: AiReviewProposal;
  onClose: () => void;
  onSuccess: () => void;
}

export function PostSubmissionStepper({
  activityText,
  selectedTime,
  locationName,
  selectedOrganization,
  organizerPersonName,
  selectedAreas,
  selectedAudience,
  consentConfirmed,
  setConsentConfirmed,
  formattedText,
  aiProposal,
  onClose,
  onSuccess
}: PostSubmissionStepperProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [copied, setCopied] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  const isMobile = typeof window !== "undefined" && /Mobi|Android/i.test(navigator.userAgent);
  const smsBody = encodeURIComponent(`#WEBB\n${formattedText}`);
  const smsHref = `sms:${GATEWAY_NUMBER}?body=${smsBody}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(smsHref)}`;

  const handleCopyText = () => {
    navigator.clipboard.writeText(`#WEBB\n${formattedText}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadIcs = () => {
    const now = new Date();
    const formatICSDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    };
    
    const startTime = new Date(now.getTime() + 2 * 3600 * 1000);
    const endTime = new Date(startTime.getTime() + 3600 * 1000);

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Ge Stod//NONSGML v1.0//SV",
      "BEGIN:VEVENT",
      `SUMMARY:${washAnnouncementText(activityText) || "Inbjudan"}`,
      `DESCRIPTION:${formattedText.replace(/\n/g, "\\n")}`,
      `LOCATION:${locationName || selectedAreas.join(", ") || "Göteborg"}`,
      `DTSTART:${formatICSDate(startTime)}`,
      `DTEND:${formatICSDate(endTime)}`,
      `STATUS:CONFIRMED`,
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "inbjudan.ics");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleConfirmSent = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/sim/sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "0700000000",
          body: `#WEBB\n${formattedText}`
        })
      });

      const newProposal = {
        id: `prop-${Date.now()}`,
        category: selectedAudience[0] || "Vara en vän",
        area: selectedAreas.join(", ") || locationName || "Göteborg",
        locationName,
        time: selectedTime,
        scrubbedText: washAnnouncementText(activityText),
        responsibleParty: selectedOrganization + (organizerPersonName ? ` (${organizerPersonName})` : ""),
        createdAt: new Date().toISOString(),
        status: "pending"
      };

      if (typeof localStorage !== "undefined") {
        const stored = localStorage.getItem("my_pending_proposals");
        const list = stored ? JSON.parse(stored) : [];
        localStorage.setItem("my_pending_proposals", JSON.stringify([newProposal, ...list.filter((p: any) => p.id !== newProposal.id)]));
      }

      setIsSubmitted(true);
    } catch (e) {
      console.error("Fel vid sparande av inbjudan:", e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200 text-left">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-brand-ink/10 space-y-5 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-brand-ink/40 hover:text-brand-ink p-1 rounded-full cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Stepper Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-wider text-brand-ink/60">
            <span>Steg {currentStep} av 4</span>
            <span>
              {currentStep === 1 && "1. AI-rekonciliering"}
              {currentStep === 2 && "2. Integritet"}
              {currentStep === 3 && "3. SMS & QR-kod"}
              {currentStep === 4 && "4. SMS-returavstämning"}
            </span>
          </div>
          <div className="h-1.5 w-full bg-brand-paper rounded-full overflow-hidden flex">
            <div
              className="bg-emerald-800 transition-all duration-300 h-full"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* STEG 1: AI-rekonciliering */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-brand-accent/10 text-brand-accent">
                <FileText size={22} />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-brand-ink leading-tight">
                  1. AI-granskning av inbjudan
                </h3>
                <span className="font-mono text-[11px] text-brand-ink/50 uppercase block">
                  Rekonciliering & förslag
                </span>
              </div>
            </div>

            {aiProposal.missingFields.length > 0 ? (
              <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 space-y-2">
                <span className="font-mono text-[10px] uppercase font-bold text-amber-900 block">
                  Saknade detaljer i inbjudan:
                </span>
                <ul className="space-y-1 text-xs font-mono text-amber-900">
                  {aiProposal.missingFields.map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 text-emerald-900 text-xs font-mono flex items-center gap-2">
                <CheckCircle2 size={18} className="text-emerald-700 shrink-0" />
                <span>Alla viktiga fält är ifyllda och redo för publicering!</span>
              </div>
            )}

            {aiProposal.reasonCopy && (
              <div className="bg-amber-50 rounded-2xl p-3.5 border border-amber-200 text-xs text-amber-900">
                <p className="leading-relaxed font-light">{aiProposal.reasonCopy}</p>
              </div>
            )}

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-mono text-xs uppercase font-bold tracking-wider rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Fortsätt till nästa steg</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* STEG 2: Integritetsbekräftelse */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-sky-100 text-sky-800">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-brand-ink leading-tight">
                  2. Integritetsbekräftelse
                </h3>
                <span className="font-mono text-[11px] text-brand-ink/50 uppercase block">
                  Skydd av personuppgifter
                </span>
              </div>
            </div>

            <p className="text-xs text-brand-ink/80 leading-relaxed font-light">
              För att upprätthålla tryggheten och följa integritetspolicyn måste alla inbjudningar respektera andras personliga uppgifter.
            </p>

            <label className="flex items-start gap-3 cursor-pointer p-4 bg-brand-paper/60 rounded-2xl border border-brand-ink/10">
              <input
                type="checkbox"
                checked={consentConfirmed}
                onChange={e => setConsentConfirmed(e.target.checked)}
                className="mt-0.5 rounded border-brand-ink/30 text-emerald-800 focus:ring-emerald-800 shrink-0"
              />
              <span className="text-xs text-brand-ink leading-relaxed font-medium">
                Jag bekräftar att jag inte delar andras personuppgifter (som namn, kontaktinfo, etc) i inbjudan utan deras uttryckliga godkännande. Jag förstår att min inbjudan granskas innan publicering.
              </span>
            </label>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                disabled={!consentConfirmed}
                onClick={() => setCurrentStep(3)}
                className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white font-mono text-xs uppercase font-bold tracking-wider rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Bekräfta och fortsätt</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* STEG 3: SMS-länk, kopiera-knapp och QR-kod */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-800">
                <Send size={22} />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-brand-ink leading-tight">
                  3. SMS & Delning
                </h3>
                <span className="font-mono text-[11px] text-brand-ink/50 uppercase block">
                  Skicka till mottagaren
                </span>
              </div>
            </div>

            {isMobile ? (
              <a
                href={smsHref}
                className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white font-mono text-xs uppercase tracking-wider rounded-2xl transition-all flex items-center justify-center gap-2 font-bold shadow-md cursor-pointer"
              >
                <Send size={15} />
                <span>Öppna SMS-app för insändning ({GATEWAY_NUMBER})</span>
              </a>
            ) : (
              <div className="p-4 bg-brand-paper/50 rounded-2xl border border-brand-ink/10 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left shadow-xs">
                <img src={qrUrl} alt="SMS QR Code" className="w-28 h-28 rounded-xl border border-brand-ink/10 shrink-0 bg-white p-1" />
                <div className="space-y-1.5 text-xs text-brand-ink/80 font-light leading-relaxed">
                  <span className="font-mono text-xs uppercase font-semibold text-brand-ink block">
                    Skanna med mobil för att skicka
                  </span>
                  <p>
                    QR-Koden öppnar din SMS-app med din inbjudan i ett färdigt SMS till numret {GATEWAY_NUMBER}.
                  </p>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleCopyText}
              className="w-full py-2.5 bg-brand-paper hover:bg-brand-ink/10 border border-brand-ink/15 text-brand-ink font-mono text-xs uppercase font-semibold tracking-wider rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {copied ? <Check size={14} className="text-emerald-800" /> : <Copy size={14} />}
              <span>{copied ? "Text kopierad till urklipp!" : "Kopiera SMS-text / direktlänk"}</span>
            </button>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-mono text-xs uppercase font-bold tracking-wider rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Fortsätt till SMS-avstämning</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* STEG 4: SMS-returavstämning */}
        {currentStep === 4 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-amber-100 text-amber-800">
                <RefreshCw size={22} />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-brand-ink leading-tight">
                  4. SMS-returavstämning
                </h3>
                <span className="font-mono text-[11px] text-brand-ink/50 uppercase block">
                  Avstämning
                </span>
              </div>
            </div>

            {!isSubmitted ? (
              <>
                <p className="text-sm font-serif italic text-brand-ink leading-relaxed">
                  Fick du iväg meddelandet via din SMS-app?
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    disabled={saving}
                    onClick={handleConfirmSent}
                    className="py-3 px-4 bg-emerald-800 hover:bg-emerald-900 text-white font-mono text-xs font-bold uppercase tracking-wider rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <CheckCircle2 size={16} />
                    <span>{saving ? "Sparar..." : "Ja, skickat!"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="py-3 px-4 bg-brand-paper hover:bg-brand-ink/10 text-brand-ink border border-brand-ink/15 font-mono text-xs font-medium rounded-2xl transition-all cursor-pointer text-center"
                  >
                    Nej, försök igen
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 text-emerald-900 text-xs font-mono space-y-1">
                  <span className="font-bold uppercase block text-emerald-950">
                    Tack! Din inbjudan har registrerats!
                  </span>
                  <p className="font-sans text-emerald-800 font-light">
                    Inbjudan har sparats i dina lokaldata och väntar på granskning innan den publiceras i flödet.
                  </p>
                </div>

                <div className="pt-2 flex flex-col gap-2.5">
                  <button
                    type="button"
                    onClick={downloadIcs}
                    className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-mono text-xs uppercase font-bold tracking-wider rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Calendar size={16} />
                    <span>Lägg till i kalender (.ics)</span>
                  </button>

                  <button
                    type="button"
                    onClick={onSuccess}
                    className="w-full py-2.5 bg-brand-paper hover:bg-brand-ink/10 text-brand-ink border border-brand-ink/15 font-mono text-xs uppercase font-semibold rounded-2xl transition-all cursor-pointer text-center"
                  >
                    Klar / Tillbaka till flödet
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

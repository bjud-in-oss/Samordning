// [src/features/skapa_inbjudan/components/SubmissionSuccessModal.tsx] - Clean Confirmation & Calendar Dialog

import React from "react";
import { CheckCircle2, Calendar, ArrowRight, ShieldCheck } from "lucide-react";
import { washAnnouncementText } from "@/src/features/mission_router";

interface SubmissionSuccessModalProps {
  activityText: string;
  selectedTime: string;
  locationName: string;
  selectedAreas: string[];
  formattedText: string;
  isAdmin?: boolean;
  onClose: () => void;
}

export function SubmissionSuccessModal({
  activityText,
  selectedTime,
  locationName,
  selectedAreas,
  formattedText,
  isAdmin = false,
  onClose
}: SubmissionSuccessModalProps) {
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

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150 text-left">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-brand-ink/10 space-y-5 relative">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-brand-accent/10 text-brand-accent">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-brand-ink leading-tight">
              {isAdmin ? "Inbjudan har publicerats!" : "Tack! Din inbjudan har registrerats!"}
            </h3>
            <span className="font-mono text-[11px] text-brand-ink/60 uppercase block">
              {isAdmin ? "Direktpublicerad i flödet" : "Sparad & väntar på granskning"}
            </span>
          </div>
        </div>

        <p className="text-xs text-brand-ink/80 leading-relaxed font-light">
          {isAdmin
            ? "Eftersom du är inloggad som administratör har inbjudan publicerats direkt i anslagsflödet för alla medlemmar."
            : "Inbjudan har sparats i dina lokaldata och skickats in för granskning innan den publiceras i det gemensamma flödet."}
        </p>

        <div className="p-4 bg-brand-paper/60 rounded-2xl border border-brand-ink/5 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-ink">
            <ShieldCheck size={16} className="text-brand-accent" />
            <span>{washAnnouncementText(activityText) || "Inbjudan"}</span>
          </div>
          <div className="text-[11px] text-brand-ink/70 font-mono">
            {selectedTime && <div>Tid: {selectedTime}</div>}
            {locationName && <div>Plats: {locationName}</div>}
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <button
            type="button"
            onClick={downloadIcs}
            className="w-full py-3 bg-brand-paper hover:bg-brand-ink/10 text-brand-ink font-mono text-xs uppercase font-semibold tracking-wider rounded-2xl transition-all border border-brand-ink/10 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Calendar size={15} className="text-brand-accent" />
            <span>Lägg till i kalender (.ics)</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 bg-brand-accent hover:bg-brand-accent/90 text-white font-mono text-xs uppercase font-bold tracking-wider rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Klar / Tillbaka till flödet</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

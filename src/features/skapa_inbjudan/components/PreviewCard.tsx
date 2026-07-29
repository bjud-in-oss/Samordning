// [src/features/skapa_inbjudan/components/PreviewCard.tsx] - Live Tile Component

import React from "react";
import { Clock, MapPin, Users, Globe, ShieldCheck, Send } from "lucide-react";
import { washAnnouncementText } from "../../mission_router";
import { ActiveDialogType } from "../domain/types";

interface PreviewCardProps {
  selectedTime: string;
  locationName: string;
  selectedAreas: string[];
  selectedAudience: string[];
  selectedOrganization: string;
  organizerPersonName: string;
  activityText: string;
  isRecurring: boolean;
  hasReminder: boolean;
  reminderTime: string;
  onOpenDialog?: (dialog: ActiveDialogType) => void;
  onCancel?: () => void;
  onSend?: () => void;
  sending?: boolean;
}

export function PreviewCard({
  selectedTime,
  locationName,
  selectedAreas,
  selectedAudience,
  selectedOrganization,
  organizerPersonName,
  activityText,
  isRecurring,
  hasReminder,
  reminderTime,
  onOpenDialog,
  onCancel,
  onSend,
  sending = false
}: PreviewCardProps) {
  return (
    <div className="bg-white rounded-3xl p-6 border border-brand-ink/10 shadow-md space-y-4 relative overflow-hidden text-left">
      {/* Dark green folded badge in top right corner - edge to edge */}
      <div className="absolute top-0 right-0 bg-emerald-800 text-white font-mono text-[9px] uppercase font-bold tracking-wider px-3 py-1 rounded-tr-3xl rounded-bl-xl shadow-2xs">
        SKRIV INBJUDAN
      </div>

      {/* Överst: Etiketten "BESKRIV DIN INBJUDAN" i kapitäler ovanför huvudtexten */}
      <button
        type="button"
        onClick={() => onOpenDialog?.("activity")}
        className="w-full text-left p-2 -m-2 rounded-2xl hover:bg-brand-paper/80 transition-all border border-transparent hover:border-brand-accent/30 group cursor-pointer"
      >
        <div className="space-y-1">
          <span className="font-mono text-[10px] uppercase font-bold text-brand-ink/60 tracking-wider block">
            BESKRIV DIN INBJUDAN
          </span>
          <h3 className="text-lg sm:text-xl font-serif font-semibold leading-tight text-brand-ink break-words whitespace-pre-wrap">
            {activityText ? washAnnouncementText(activityText) : "Ingen aktivitet angiven än"}
          </h3>
        </div>
      </button>

      {/* Rad 1 (2 kolumner): "VÄLJ TID & DATUM" (vänster) och "VAR SES NI?" (höger) */}
      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-brand-ink/10 font-mono text-xs">
        {/* Time & Date */}
        <button
          type="button"
          onClick={() => onOpenDialog?.("time")}
          className="w-full text-left p-2.5 rounded-xl hover:bg-brand-paper/80 transition-all border border-transparent hover:border-brand-accent/30 flex flex-col justify-between cursor-pointer bg-brand-paper/30"
        >
          <div className="flex items-center gap-1.5 mb-1">
            <Clock size={14} className="text-emerald-800 shrink-0" />
            <span className="font-mono text-[9px] uppercase text-brand-ink/60 tracking-wider font-bold">
              VÄLJ TID & DATUM
            </span>
          </div>
          <div className="break-words font-semibold text-brand-ink text-xs">
            <span>{selectedTime || "Klicka för tid"}</span>
            {isRecurring && <span className="text-[9px] text-brand-accent block font-normal">(Varje vecka)</span>}
            {hasReminder && <span className="text-[9px] text-amber-700 block font-normal">({reminderTime})</span>}
          </div>
        </button>

        {/* Location */}
        <button
          type="button"
          onClick={() => onOpenDialog?.("location")}
          className="w-full text-left p-2.5 rounded-xl hover:bg-brand-paper/80 transition-all border border-transparent hover:border-brand-accent/30 flex flex-col justify-between cursor-pointer bg-brand-paper/30"
        >
          <div className="flex items-center gap-1.5 mb-1">
            <MapPin size={14} className="text-emerald-800 shrink-0" />
            <span className="font-mono text-[9px] uppercase text-brand-ink/60 tracking-wider font-bold">
              VAR SES NI?
            </span>
          </div>
          <div className="break-words font-semibold text-brand-ink text-xs">
            <span>{locationName || "Klicka för plats"}</span>
          </div>
        </button>
      </div>

      {/* Rad 2 (2 kolumner): "DELTAGARE HEMMA" (vänster) och "GRUPPER" (höger) */}
      <div className="grid grid-cols-2 gap-3 font-mono text-xs">
        <button
          type="button"
          onClick={() => onOpenDialog?.("area")}
          className="w-full text-left p-2.5 rounded-xl hover:bg-brand-paper/80 transition-all border border-transparent hover:border-brand-accent/30 flex flex-col justify-between cursor-pointer bg-brand-paper/30"
        >
          <div className="flex items-center gap-1.5 mb-1">
            <Globe size={14} className="text-emerald-800 shrink-0" />
            <span className="font-mono text-[9px] uppercase text-brand-ink/60 tracking-wider font-bold">
              DELTAGARE HEMMA
            </span>
          </div>
          <div className="break-words font-semibold text-brand-ink text-xs">
            <span>{selectedAreas.length > 0 ? selectedAreas.join(", ") : "Inga valda"}</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onOpenDialog?.("audience")}
          className="w-full text-left p-2.5 rounded-xl hover:bg-brand-paper/80 transition-all border border-transparent hover:border-brand-accent/30 flex flex-col justify-between cursor-pointer bg-brand-paper/30"
        >
          <div className="flex items-center gap-1.5 mb-1">
            <Users size={14} className="text-emerald-800 shrink-0" />
            <span className="font-mono text-[9px] uppercase text-brand-ink/60 tracking-wider font-bold">
              GRUPPER
            </span>
          </div>
          <div className="break-words font-semibold text-brand-ink text-xs">
            <span>{selectedAudience.length > 0 ? selectedAudience.join(", ") : "Inga valda"}</span>
          </div>
        </button>
      </div>

      {/* Rad 3: "VEM HÅLLER I DET?" (full bredd) */}
      <div className="font-mono text-xs">
        <button
          type="button"
          onClick={() => onOpenDialog?.("organization")}
          className="w-full text-left p-2.5 rounded-xl hover:bg-brand-paper/80 transition-all border border-transparent hover:border-brand-accent/30 flex flex-col justify-between cursor-pointer bg-brand-paper/30"
        >
          <div className="flex items-center gap-1.5 mb-1">
            <ShieldCheck size={14} className="text-emerald-800 shrink-0" />
            <span className="font-mono text-[9px] uppercase text-brand-ink/60 tracking-wider font-bold">
              VEM HÅLLER I DET?
            </span>
          </div>
          <div className="break-words font-semibold text-brand-ink text-xs">
            <span>
              {selectedOrganization
                ? `${selectedOrganization}${organizerPersonName ? ` (${organizerPersonName})` : ""}`
                : "Ej angiven"}
            </span>
          </div>
        </button>
      </div>

      {/* Action buttons inside the Tile corners */}
      <div className="pt-3 border-t border-brand-ink/10 flex items-center justify-between gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-brand-paper hover:bg-brand-ink/10 text-brand-ink font-mono text-xs uppercase tracking-wider font-semibold rounded-xl transition-all cursor-pointer"
          >
            Avbryt
          </button>
        )}
        {onSend && (
          <button
            type="button"
            onClick={onSend}
            disabled={sending}
            className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-mono text-xs uppercase tracking-wider font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50 ml-auto"
          >
            <Send size={14} />
            <span>{sending ? "Granskar & skickar..." : "Sänd"}</span>
          </button>
        )}
      </div>
    </div>
  );
}




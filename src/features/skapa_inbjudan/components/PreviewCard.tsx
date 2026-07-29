// [CURRENT SUBDIRECTORY/CYCLE] | [src/features/skapa_inbjudan/4_Produce] - Live Invitation Preview Card Component

import React from "react";
import { Clock, MapPin, Users, Globe, ShieldCheck } from "lucide-react";
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
  onOpenDialog
}: PreviewCardProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs uppercase font-semibold text-brand-ink/80">
          Klicka på fälten i kortet för att komponera din inbjudan:
        </span>
        <span className="font-mono text-[10px] text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full font-medium shrink-0">
          Direktredigering
        </span>
      </div>

      <div className="bg-white rounded-3xl p-6 border-2 border-brand-accent/20 shadow-md space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-brand-accent text-white font-mono text-[9px] uppercase font-bold tracking-wider px-3 py-1 rounded-bl-xl">
          LIVECARD
        </div>

        {/* Title / Activity - Clickable */}
        <button
          type="button"
          onClick={() => onOpenDialog?.("activity")}
          className="w-full text-left p-2 -m-2 rounded-2xl hover:bg-brand-paper/80 transition-all border border-transparent hover:border-brand-accent/30 group cursor-pointer"
        >
          <div className="space-y-0.5">
            <span className="font-mono text-[10px] uppercase text-brand-ink/50 tracking-wider block font-medium">
              {activityText ? "AKTIVITET" : "Beskriv din inbjudan"}
            </span>
            <h3 className="text-lg sm:text-xl font-serif font-semibold leading-tight text-brand-ink break-words whitespace-pre-wrap">
              {activityText ? washAnnouncementText(activityText) : "Ingen aktivitet angiven än"}
            </h3>
          </div>
        </button>

        {/* Info Grid - Clickable Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-brand-ink/10 font-mono text-xs">
          {/* Time & Date */}
          <button
            type="button"
            onClick={() => onOpenDialog?.("time")}
            className="w-full text-left p-2.5 rounded-xl hover:bg-brand-paper/80 transition-all border border-transparent hover:border-brand-accent/30 flex items-start gap-3 cursor-pointer"
          >
            <Clock size={18} className="text-brand-accent shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0 space-y-0.5">
              <span className="font-mono text-[10px] uppercase text-brand-ink/50 tracking-wider block font-medium">
                {selectedTime ? "TID & DATUM" : "Välj tid & datum"}
              </span>
              <div className="break-words whitespace-pre-wrap font-semibold text-brand-ink">
                <span>{selectedTime || "Ej vald"}</span>
                {isRecurring && <span className="text-[10px] text-brand-accent block font-normal">(Upprepas varje vecka)</span>}
                {hasReminder && <span className="text-[10px] text-amber-700 block font-normal">(Påminnelse: {reminderTime})</span>}
              </div>
            </div>
          </button>

          {/* Location */}
          <button
            type="button"
            onClick={() => onOpenDialog?.("location")}
            className="w-full text-left p-2.5 rounded-xl hover:bg-brand-paper/80 transition-all border border-transparent hover:border-brand-accent/30 flex items-start gap-3 cursor-pointer"
          >
            <MapPin size={18} className="text-brand-accent shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0 space-y-0.5">
              <span className="font-mono text-[10px] uppercase text-brand-ink/50 tracking-wider block font-medium">
                {locationName ? "MÖTESPLATS" : "Var ses ni?"}
              </span>
              <div className="break-words whitespace-pre-wrap font-semibold text-brand-ink">
                <span>{locationName || "Ej vald"}</span>
              </div>
            </div>
          </button>

          {/* Invite from (Areas) */}
          <button
            type="button"
            onClick={() => onOpenDialog?.("area")}
            className="w-full text-left p-2.5 rounded-xl hover:bg-brand-paper/80 transition-all border border-transparent hover:border-brand-accent/30 flex items-start gap-3 cursor-pointer"
          >
            <Globe size={18} className="text-brand-accent shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0 space-y-0.5">
              <span className="font-mono text-[10px] uppercase text-brand-ink/50 tracking-wider block font-medium">
                {selectedAreas.length > 0 ? "BJUD IN FRÅN" : "Var hör deltagarna hemma?"}
              </span>
              <div className="break-words whitespace-pre-wrap font-semibold text-brand-ink">
                <span>{selectedAreas.length > 0 ? selectedAreas.join(", ") : "Inga valda"}</span>
              </div>
            </div>
          </button>

          {/* Audience */}
          <button
            type="button"
            onClick={() => onOpenDialog?.("audience")}
            className="w-full text-left p-2.5 rounded-xl hover:bg-brand-paper/80 transition-all border border-transparent hover:border-brand-accent/30 flex items-start gap-3 cursor-pointer"
          >
            <Users size={18} className="text-brand-accent shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0 space-y-0.5">
              <span className="font-mono text-[10px] uppercase text-brand-ink/50 tracking-wider block font-medium">
                {selectedAudience.length > 0 ? "MÅLGRUPP" : "Vilka grupper bjuds in?"}
              </span>
              <div className="break-words whitespace-pre-wrap font-semibold text-brand-ink">
                <span>{selectedAudience.length > 0 ? selectedAudience.join(", ") : "Inga valda"}</span>
              </div>
            </div>
          </button>
        </div>

        {/* Organizer Badge - Clickable */}
        <div className="pt-2 border-t border-brand-ink/10 text-xs font-mono">
          <button
            type="button"
            onClick={() => onOpenDialog?.("organization")}
            className="w-full text-left p-2 rounded-xl hover:bg-brand-paper/80 transition-all border border-transparent hover:border-brand-accent/30 flex items-start gap-3 cursor-pointer"
          >
            <ShieldCheck size={18} className="text-emerald-700 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0 space-y-0.5">
              <span className="font-mono text-[10px] uppercase text-brand-ink/50 tracking-wider block font-medium">
                {selectedOrganization ? "ARRANGÖR" : "Vem håller i det?"}
              </span>
              <div className="break-words whitespace-pre-wrap font-semibold text-brand-ink">
                <span>
                  {selectedOrganization ? `${selectedOrganization}${organizerPersonName ? ` (${organizerPersonName})` : ""}` : "Ej angiven"}
                </span>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}



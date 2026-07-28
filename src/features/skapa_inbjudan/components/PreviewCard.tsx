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
  activeDialog?: ActiveDialogType;
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
  activeDialog,
  onOpenDialog
}: PreviewCardProps) {
  const isEditing = activeDialog !== null && activeDialog !== undefined;

  return (
    <div className="space-y-2">
      <div className={`bg-white rounded-3xl p-6 border-2 border-brand-accent/20 shadow-md space-y-4 relative overflow-hidden transition-all duration-300 ${
        isEditing ? "opacity-30 blur-[1px] scale-[0.99] pointer-events-none" : "opacity-100 blur-none scale-100"
      }`}>
        <div className="absolute top-0 right-0 bg-brand-accent text-white font-mono text-[9px] uppercase font-bold tracking-wider px-3 py-1 rounded-bl-xl">
          SKRIV INBJUDAN
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
        <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-2 border-t border-brand-ink/10 font-mono text-xs">
          {/* Time & Date */}
          <button
            type="button"
            onClick={() => onOpenDialog?.("time")}
            className="w-full text-left p-2 sm:p-2.5 rounded-xl hover:bg-brand-paper/80 transition-all border border-transparent hover:border-brand-accent/30 flex items-start gap-2 sm:gap-3 cursor-pointer"
          >
            <Clock size={16} className="text-brand-accent shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0 space-y-0.5">
              <span className="font-mono text-[9px] sm:text-[10px] uppercase text-brand-ink/50 tracking-wider block font-medium truncate">
                {selectedTime ? "TID & DATUM" : "Välj tid & datum"}
              </span>
              <div className="break-words whitespace-pre-wrap font-semibold text-brand-ink text-xs">
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
            className="w-full text-left p-2 sm:p-2.5 rounded-xl hover:bg-brand-paper/80 transition-all border border-transparent hover:border-brand-accent/30 flex items-start gap-2 sm:gap-3 cursor-pointer"
          >
            <MapPin size={16} className="text-brand-accent shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0 space-y-0.5">
              <span className="font-mono text-[9px] sm:text-[10px] uppercase text-brand-ink/50 tracking-wider block font-medium truncate">
                {locationName ? "MÖTESPLATS" : "Var ses ni?"}
              </span>
              <div className="break-words whitespace-pre-wrap font-semibold text-brand-ink text-xs">
                <span>{locationName || "Ej vald"}</span>
              </div>
            </div>
          </button>

          {/* Invite from (Areas) */}
          <button
            type="button"
            onClick={() => onOpenDialog?.("area")}
            className="w-full text-left p-2 sm:p-2.5 rounded-xl hover:bg-brand-paper/80 transition-all border border-transparent hover:border-brand-accent/30 flex items-start gap-2 sm:gap-3 cursor-pointer"
          >
            <Globe size={16} className="text-brand-accent shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0 space-y-0.5">
              <span className="font-mono text-[9px] sm:text-[10px] uppercase text-brand-ink/50 tracking-wider block font-medium truncate">
                {selectedAreas.length > 0 ? "BJUD IN FRÅN" : "Deltagare hemma"}
              </span>
              <div className="break-words whitespace-pre-wrap font-semibold text-brand-ink text-xs">
                <span>{selectedAreas.length > 0 ? selectedAreas.join(", ") : "Inga valda"}</span>
              </div>
            </div>
          </button>

          {/* Audience */}
          <button
            type="button"
            onClick={() => onOpenDialog?.("audience")}
            className="w-full text-left p-2 sm:p-2.5 rounded-xl hover:bg-brand-paper/80 transition-all border border-transparent hover:border-brand-accent/30 flex items-start gap-2 sm:gap-3 cursor-pointer"
          >
            <Users size={16} className="text-brand-accent shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0 space-y-0.5">
              <span className="font-mono text-[9px] sm:text-[10px] uppercase text-brand-ink/50 tracking-wider block font-medium truncate">
                {selectedAudience.length > 0 ? "MÅLGRUPP" : "Grupper"}
              </span>
              <div className="break-words whitespace-pre-wrap font-semibold text-brand-ink text-xs">
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



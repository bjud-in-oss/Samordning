// [CURRENT SUBDIRECTORY/CYCLE] | [src/features/skapa_inbjudan/4_Produce] - Live Invitation Preview Card Component

import React from "react";
import { Clock, MapPin, Users, Globe, ShieldCheck, Sparkles, Edit3 } from "lucide-react";
import { washAnnouncementText } from "../../mission_router/domain/parser";
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
        <div className="absolute top-0 right-0 bg-brand-accent text-white font-mono text-[9px] uppercase font-bold tracking-wider px-3 py-1 rounded-bl-xl flex items-center gap-1">
          <Edit3 size={10} />
          <span>LIVECARD</span>
        </div>

        {/* Title / Activity - Clickable */}
        <button
          type="button"
          onClick={() => onOpenDialog?.("activity")}
          className="w-full text-left p-2 -m-2 rounded-2xl hover:bg-brand-paper/80 transition-all border border-transparent hover:border-brand-accent/30 group cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-brand-accent shrink-0" />
            <h3 className={`text-lg sm:text-xl font-serif font-semibold leading-tight ${activityText ? "text-brand-ink" : "text-brand-ink/40 italic font-normal"}`}>
              {activityText ? washAnnouncementText(activityText) : "Ingen aktivitet angiven än...*"}
            </h3>
          </div>
        </button>

        {/* Info Grid - Clickable Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-brand-ink/10 font-mono text-xs">
          {/* Time & Date */}
          <button
            type="button"
            onClick={() => onOpenDialog?.("time")}
            className="w-full text-left p-2.5 rounded-xl hover:bg-brand-paper/80 transition-all border border-transparent hover:border-brand-accent/30 flex items-start gap-2.5 cursor-pointer"
          >
            <Clock size={16} className="text-brand-accent shrink-0 mt-0.5" />
            <div className="truncate">
              <span className={`block font-semibold ${selectedTime ? "text-brand-ink" : "text-brand-ink/40 italic font-normal"}`}>
                {selectedTime || "Ej vald*"}
              </span>
              {isRecurring && <span className="text-[10px] text-brand-accent block">(Upprepas varje vecka)</span>}
              {hasReminder && <span className="text-[10px] text-amber-700 block">(Påminnelse: {reminderTime})</span>}
            </div>
          </button>

          {/* Location */}
          <button
            type="button"
            onClick={() => onOpenDialog?.("location")}
            className="w-full text-left p-2.5 rounded-xl hover:bg-brand-paper/80 transition-all border border-transparent hover:border-brand-accent/30 flex items-start gap-2.5 cursor-pointer"
          >
            <MapPin size={16} className="text-brand-accent shrink-0 mt-0.5" />
            <div className="truncate">
              <span className={`block font-semibold ${locationName ? "text-brand-ink" : "text-brand-ink/40 italic font-normal"}`}>
                {locationName || "Ej vald*"}
              </span>
            </div>
          </button>

          {/* Invite from (Areas) */}
          <button
            type="button"
            onClick={() => onOpenDialog?.("area")}
            className="w-full text-left p-2.5 rounded-xl hover:bg-brand-paper/80 transition-all border border-transparent hover:border-brand-accent/30 flex items-start gap-2.5 cursor-pointer"
          >
            <Globe size={16} className="text-brand-accent shrink-0 mt-0.5" />
            <div className="truncate">
              <span className={`block font-semibold ${selectedAreas.length > 0 ? "text-brand-ink" : "text-brand-ink/40 italic font-normal"}`}>
                {selectedAreas.length > 0 ? selectedAreas.join(", ") : "Inga valda"}
              </span>
            </div>
          </button>

          {/* Audience */}
          <button
            type="button"
            onClick={() => onOpenDialog?.("audience")}
            className="w-full text-left p-2.5 rounded-xl hover:bg-brand-paper/80 transition-all border border-transparent hover:border-brand-accent/30 flex items-start gap-2.5 cursor-pointer"
          >
            <Users size={16} className="text-brand-accent shrink-0 mt-0.5" />
            <div className="truncate">
              <span className={`block font-semibold ${selectedAudience.length > 0 ? "text-brand-ink" : "text-brand-ink/40 italic font-normal"}`}>
                {selectedAudience.length > 0 ? selectedAudience.join(", ") : "Inga valda*"}
              </span>
            </div>
          </button>
        </div>

        {/* Organizer Badge - Clickable */}
        <div className="pt-2 border-t border-brand-ink/10 flex items-center justify-between text-xs font-mono">
          <button
            type="button"
            onClick={() => onOpenDialog?.("organization")}
            className="w-full text-left p-2 rounded-xl hover:bg-brand-paper/80 transition-all border border-transparent hover:border-brand-accent/30 flex items-center justify-between gap-2 cursor-pointer"
          >
            <span className="text-brand-ink/50 text-[11px]">Arrangör:</span>
            <div className="flex items-center gap-1.5 bg-brand-paper px-3 py-1 rounded-full border border-brand-ink/10 text-brand-ink font-medium">
              <ShieldCheck size={14} className="text-emerald-700 shrink-0" />
              <span className={selectedOrganization ? "text-brand-ink" : "text-brand-ink/40 italic font-normal"}>
                {selectedOrganization ? `${selectedOrganization}${organizerPersonName ? ` (${organizerPersonName})` : ""}` : "Ej angiven*"}
              </span>
            </div>
          </button>
        </div>
      </div>

      <span className="font-mono text-[10px] text-brand-ink/50 block text-right">
        * = obligatorisk uppgift
      </span>
    </div>
  );
}


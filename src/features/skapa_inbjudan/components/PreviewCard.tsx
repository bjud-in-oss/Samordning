// [CURRENT SUBDIRECTORY/CYCLE] | [src/features/skapa_inbjudan/4_Produce] - Live Invitation Preview Card Component

import React from "react";
import { Clock, MapPin, Users, Globe, ShieldCheck } from "lucide-react";
import { washAnnouncementText } from "../../mission_router/domain/parser";

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
  reminderTime
}: PreviewCardProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs uppercase font-semibold text-brand-ink/70">
          Förhandsgranskning av inbjudan:
        </span>
        <span className="font-mono text-[10px] text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full font-medium">
          Slutgiltigt kort
        </span>
      </div>

      <div className="bg-white rounded-3xl p-6 border-2 border-brand-accent/20 shadow-md space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-brand-accent text-white font-mono text-[9px] uppercase font-bold tracking-wider px-3 py-1 rounded-bl-xl">
          LIVECARD
        </div>

        {/* Title / Activity */}
        <div className="space-y-1">
          <span className="font-mono text-[10px] uppercase text-brand-ink/40 tracking-wider block">
            Aktivitet
          </span>
          <h3 className="text-xl font-serif text-brand-ink font-semibold leading-tight">
            {activityText ? washAnnouncementText(activityText) : "Ingen aktivitet angiven än..."}
          </h3>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-brand-ink/10 font-mono text-xs">
          <div className="flex items-center gap-2 text-brand-ink/80">
            <Clock size={16} className="text-brand-accent shrink-0" />
            <div>
              <span className="text-brand-ink/40 text-[10px] uppercase block">Tid & Datum</span>
              <span className="font-semibold">{selectedTime || "Ej vald"}</span>
              {isRecurring && <span className="text-[10px] text-brand-accent block">(Upprepas varje vecka)</span>}
              {hasReminder && <span className="text-[10px] text-amber-700 block">(Påminnelse: {reminderTime})</span>}
            </div>
          </div>

          <div className="flex items-center gap-2 text-brand-ink/80">
            <MapPin size={16} className="text-brand-accent shrink-0" />
            <div>
              <span className="text-brand-ink/40 text-[10px] uppercase block">Mötesplats</span>
              <span className="font-semibold">{locationName || "Ej vald"}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-brand-ink/80">
            <Globe size={16} className="text-brand-accent shrink-0" />
            <div>
              <span className="text-brand-ink/40 text-[10px] uppercase block">Bjud in från</span>
              <span className="font-semibold">
                {selectedAreas.length > 0 ? selectedAreas.join(", ") : "Inga valda"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-brand-ink/80">
            <Users size={16} className="text-brand-accent shrink-0" />
            <div>
              <span className="text-brand-ink/40 text-[10px] uppercase block">Målgrupp</span>
              <span className="font-semibold">
                {selectedAudience.length > 0 ? selectedAudience.join(", ") : "Alla"}
              </span>
            </div>
          </div>
        </div>

        {/* Organizer Badge */}
        <div className="pt-2 border-t border-brand-ink/10 flex items-center justify-between text-xs font-mono">
          <span className="text-brand-ink/50 text-[11px]">Arrangör:</span>
          <div className="flex items-center gap-1.5 bg-brand-paper px-3 py-1 rounded-full border border-brand-ink/10 text-brand-ink font-medium">
            <ShieldCheck size={14} className="text-emerald-700" />
            <span>
              {selectedOrganization || "Ej angiven"}
              {organizerPersonName ? ` (${organizerPersonName})` : ""}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

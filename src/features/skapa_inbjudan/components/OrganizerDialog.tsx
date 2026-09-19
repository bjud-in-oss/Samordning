// [CURRENT SUBDIRECTORY/CYCLE] | [src/features/skapa_inbjudan/4_Produce] - Organizer Selection Dialog with Reassurance Copy

import React from "react";
import { Check } from "lucide-react";
import { ORGANIZATIONS } from "../domain/constants";

interface OrganizerDialogProps {
  tempOrg: string;
  setTempOrg: (org: string) => void;
  organizerPersonName: string;
  setOrganizerPersonName: (name: string) => void;
  showPersonNameModal: boolean;
  setShowPersonNameModal: (show: boolean) => void;
  onClose: () => void;
  onSave: (org: string) => void;
}

export function OrganizerDialog({
  tempOrg,
  setTempOrg,
  organizerPersonName,
  setOrganizerPersonName,
  showPersonNameModal,
  setShowPersonNameModal,
  onClose,
  onSave
}: OrganizerDialogProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-brand-ink/10 pb-2">
        <span className="font-mono text-xs uppercase font-semibold text-brand-ink">
          Arrangör: (Vem håller i aktiviteten?)
        </span>
      </div>

      <p className="text-xs text-brand-ink/80 leading-relaxed font-light p-3.5 bg-amber-50/90 border border-amber-200/80 rounded-2xl">
        Aktiviteten skickas som ett förslag till de ansvariga ledarna för den valda gruppen. Du behöver inte vara orolig om du klickar på en organisation – de granskar förslaget, godkänner det och hör av sig om det finns några frågor.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {ORGANIZATIONS.map(org => {
          const selected = tempOrg === org;
          return (
            <button
              key={org}
              type="button"
              onClick={() => setTempOrg(org)}
              className={`p-3 rounded-2xl border font-mono text-xs text-left transition-all cursor-pointer flex items-center justify-between ${
                selected
                  ? "bg-brand-accent text-white border-brand-accent font-semibold"
                  : "bg-white border-brand-ink/10 text-brand-ink hover:border-brand-accent/50"
              }`}
            >
              <span>{org}</span>
              {selected && <Check size={14} className="text-white shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* Optional Individual Contact Name */}
      <div className="pt-2 border-t border-brand-ink/10">
        {!showPersonNameModal && !organizerPersonName ? (
          <button
            type="button"
            onClick={() => setShowPersonNameModal(true)}
            className="font-mono text-xs text-brand-accent hover:underline cursor-pointer"
          >
            + Lägg till kontaktperson / privatnamn (valfritt)
          </button>
        ) : (
          <div className="space-y-1.5">
            <label className="font-mono text-[10px] uppercase text-brand-ink/60 block">
              Kontaktperson (namn):
            </label>
            <input
              type="text"
              value={organizerPersonName}
              onChange={e => setOrganizerPersonName(e.target.value)}
              placeholder="t.ex. Bror Andersson eller Syster Karlsson"
              className="w-full px-4 py-2 bg-white border border-brand-ink/15 rounded-xl font-mono text-xs text-brand-ink focus:outline-none focus:border-brand-accent"
            />
          </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-2 pt-2 border-t border-brand-ink/10">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-white border border-brand-ink/15 text-brand-ink rounded-xl font-mono text-xs uppercase"
        >
          Ångra
        </button>
        <button
          type="button"
          onClick={() => onSave(tempOrg)}
          className="px-5 py-2 bg-brand-accent text-white rounded-xl font-mono text-xs uppercase font-semibold"
        >
          Spara
        </button>
      </div>
    </div>
  );
}

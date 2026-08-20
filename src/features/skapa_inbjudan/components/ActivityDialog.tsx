// [CURRENT SUBDIRECTORY/CYCLE] | [src/features/skapa_inbjudan/4_Produce] - Activity Selection Dialog

import React from "react";

interface ActivityDialogProps {
  tempActivity: string;
  setTempActivity: (val: string) => void;
  onClose: () => void;
  onSave: (act: string) => void;
}

export function ActivityDialog({
  tempActivity,
  setTempActivity,
  onClose,
  onSave
}: ActivityDialogProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-brand-ink/10 pb-2">
        <span className="font-mono text-xs uppercase font-semibold text-brand-ink">
          Vad ska vi göra? (Aktivitetsbeskrivning)
        </span>
      </div>

      <div className="space-y-2">
        <textarea
          rows={3}
          value={tempActivity}
          onChange={e => setTempActivity(e.target.value)}
          placeholder="t.ex. Grillning, spelkväll, vandring i Änggårdsbergen eller fika med samtal..."
          className="w-full p-3 bg-white border border-brand-ink/15 rounded-xl font-mono text-xs text-brand-ink focus:outline-none focus:border-brand-accent resize-none"
        />
        <p className="font-mono text-[10px] text-brand-ink/50">
          Tips: Håll beskrivningen kort, välkomnande och tydlig.
        </p>
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
          onClick={() => onSave(tempActivity)}
          className="px-5 py-2 bg-brand-accent text-white rounded-xl font-mono text-xs uppercase font-semibold"
        >
          Klar
        </button>
      </div>
    </div>
  );
}

// [CURRENT SUBDIRECTORY/CYCLE] | [src/features/skapa_inbjudan/4_Produce] - Time Selection Dialog

import React from "react";
import { Clock } from "lucide-react";
import { QUICK_TIMES } from "../../domain/constants";

interface TimeDialogProps {
  tempTime: string;
  setTempTime: (val: string) => void;
  isRecurring: boolean;
  setIsRecurring: (val: boolean) => void;
  hasReminder: boolean;
  setHasReminder: (val: boolean) => void;
  reminderTime: string;
  setReminderTime: (val: string) => void;
  onClose: () => void;
  onSave: (time: string) => void;
}

export function TimeDialog({
  tempTime,
  setTempTime,
  isRecurring,
  setIsRecurring,
  hasReminder,
  setHasReminder,
  reminderTime,
  setReminderTime,
  onClose,
  onSave
}: TimeDialogProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-brand-ink/10 pb-2">
        <span className="font-mono text-xs uppercase font-semibold text-brand-ink">
          Tid & Datum för aktiviteten
        </span>
      </div>

      <div className="space-y-3">
        <div>
          <label className="font-mono text-[10px] uppercase text-brand-ink/60 block mb-1">
            Skriv datum & klockslag (frikod):
          </label>
          <input
            type="text"
            value={tempTime}
            onChange={e => setTempTime(e.target.value)}
            placeholder="t.ex. Lördag 14 okt kl 15:00 eller Imorgon kl 18"
            className="w-full px-4 py-2.5 bg-white border border-brand-ink/15 rounded-xl font-mono text-xs text-brand-ink focus:outline-none focus:border-brand-accent"
          />
        </div>

        <div>
          <label className="font-mono text-[10px] uppercase text-brand-ink/60 block mb-2">
            Eller välj snabbval:
          </label>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_TIMES.map(qt => (
              <button
                key={qt}
                type="button"
                onClick={() => setTempTime(qt)}
                className={`px-3 py-1.5 rounded-xl border font-mono text-xs transition-all cursor-pointer ${
                  tempTime === qt
                    ? "bg-brand-accent text-white border-brand-accent font-semibold"
                    : "bg-white border-brand-ink/10 text-brand-ink hover:border-brand-accent/50"
                }`}
              >
                {qt}
              </button>
            ))}
          </div>
        </div>

        {/* Recurring & Reminder Switches */}
        <div className="pt-2 border-t border-brand-ink/10 space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isRecurring}
              onChange={e => setIsRecurring(e.target.checked)}
              className="rounded border-brand-ink/30 text-brand-accent focus:ring-brand-accent"
            />
            <span className="font-mono text-xs text-brand-ink">Aktiviteten återkommer varje vecka</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={hasReminder}
              onChange={e => setHasReminder(e.target.checked)}
              className="rounded border-brand-ink/30 text-brand-accent focus:ring-brand-accent"
            />
            <span className="font-mono text-xs text-brand-ink">Skicka påminnelse innan aktiviteten</span>
          </label>

          {hasReminder && (
            <div className="ml-6 pt-1">
              <select
                value={reminderTime}
                onChange={e => setReminderTime(e.target.value)}
                className="px-3 py-1.5 bg-white border border-brand-ink/15 rounded-xl font-mono text-xs text-brand-ink focus:outline-none focus:border-brand-accent"
              >
                <option value="30 minuter innan">30 minuter innan</option>
                <option value="1 timme innan">1 timme innan</option>
                <option value="2 timmar innan">2 timmar innan</option>
                <option value="Dagen innan kl 18:00">Dagen innan kl 18:00</option>
              </select>
            </div>
          )}
        </div>
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
          onClick={() => onSave(tempTime)}
          className="px-5 py-2 bg-brand-accent text-white rounded-xl font-mono text-xs uppercase font-semibold"
        >
          Klar
        </button>
      </div>
    </div>
  );
}

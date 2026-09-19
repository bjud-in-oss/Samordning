// [CURRENT SUBDIRECTORY/CYCLE] | [src/features/skapa_inbjudan/4_Produce] - AI Flag Moderation Modal Component

import React from "react";
import { AlertTriangle } from "lucide-react";

interface AiFlagModalProps {
  open: boolean;
  message: string;
  onClose: () => void;
  onConfirmOverride: () => void;
}

export function AiFlagModal({
  open,
  message,
  onClose,
  onConfirmOverride
}: AiFlagModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl border border-amber-300">
        <div className="flex items-center gap-3 text-amber-600">
          <AlertTriangle size={24} className="shrink-0" />
          <h3 className="font-mono text-sm uppercase font-bold text-brand-ink">
            Integritet & Granskning
          </h3>
        </div>

        <p className="text-xs text-brand-ink/80 leading-relaxed font-light">
          {message}
        </p>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-brand-ink/10">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white border border-brand-ink/20 text-brand-ink rounded-xl font-mono text-xs uppercase"
          >
            Ändra i formuläret
          </button>
          <button
            type="button"
            onClick={onConfirmOverride}
            className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-mono text-xs uppercase font-semibold"
          >
            Skicka ändå för manuell granskning
          </button>
        </div>
      </div>
    </div>
  );
}

// [src/features/inbjudningar/components/PendingProposalsList.tsx] - Pending Proposals Management Component

import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { ActiveAlert } from "../../mission_router";

export interface PendingProposal {
  id: string;
  time?: string;
  area?: string;
  locationName?: string;
  scrubbedText?: string;
  activityText?: string;
  responsibleParty?: string;
  createdAt?: string;
  status?: string;
}

export interface PendingProposalsListProps {
  activeStreamItems: ActiveAlert[];
}

const STORAGE_KEY = "my_pending_proposals";
const EXPIRY_HOURS = 48;

export function PendingProposalsList({ activeStreamItems }: PendingProposalsListProps) {
  const [proposals, setProposals] = useState<PendingProposal[]>(() => {
    if (typeof localStorage === "undefined") return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (proposals.length === 0) return;

    const now = Date.now();
    const filtered = proposals.filter((prop) => {
      // 1. Filter out already approved/synced items in activeStreamItems
      const isAlreadyActive = activeStreamItems.some(
        (item) =>
          item.id === prop.id ||
          (item.area === prop.area &&
            item.time === prop.time &&
            (item.scrubbedText === prop.activityText || item.scrubbedText === prop.scrubbedText))
      );
      if (isAlreadyActive) return false;

      // 2. Filter out proposals older than 48h
      if (prop.createdAt) {
        const createdTime = new Date(prop.createdAt).getTime();
        if (!isNaN(createdTime) && now - createdTime > EXPIRY_HOURS * 3600 * 1000) {
          return false;
        }
      }
      return true;
    });

    if (filtered.length !== proposals.length) {
      setProposals(filtered);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      } catch (err) {
        console.warn("Kunde inte uppdatera my_pending_proposals", err);
      }
    }
  }, [activeStreamItems, proposals]);

  const handleDelete = (id: string) => {
    const updated = proposals.filter((p) => p.id !== id);
    setProposals(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.warn("Kunde inte ta bort utkast", err);
    }
  };

  const handleClearAll = () => {
    setProposals([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.warn("Kunde inte rensa utkast", err);
    }
  };

  if (proposals.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-brand-ink/60">
          Dina aktiva utkast ({proposals.length})
        </span>
        {proposals.length > 1 && (
          <button
            type="button"
            onClick={handleClearAll}
            className="text-[11px] font-sans text-brand-error hover:underline transition-colors focus:outline-none"
          >
            Rensa alla
          </button>
        )}
      </div>

      {proposals.map((prop) => (
        <div
          key={prop.id}
          className="bg-brand-paper/50 border border-brand-accent/30 rounded-2xl p-5 shadow-2xs space-y-2 text-left relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 bg-brand-accent text-white font-mono text-[9px] uppercase font-bold tracking-wider px-3 py-1 rounded-tr-2xl rounded-bl-xl shadow-2xs flex items-center gap-1.5">
            <span>DIN INBJUDAN • FÖRBEREDS</span>
          </div>

          <div className="flex items-center justify-between pr-56 pt-1">
            <span className="font-mono text-[10px] text-brand-ink/60 font-light">
              {prop.time || "Fast tid ej angiven"}
            </span>
          </div>

          <div>
            <h3 className="font-serif italic text-lg text-brand-ink font-medium">
              {prop.area || prop.locationName || "Hela församlingen"}
            </h3>
            <p className="text-xs text-brand-ink/80 font-light line-clamp-2 mt-1 leading-relaxed">
              {prop.scrubbedText || prop.activityText}
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-brand-ink/10 text-[10px] font-mono text-brand-ink/60 uppercase tracking-wider">
            <span>{prop.responsibleParty || "Församling"}</span>
            <div className="flex items-center gap-3">
              <span className="italic font-sans text-brand-accent font-semibold hidden sm:inline">
                Förbereds för utskick
              </span>
              <button
                type="button"
                onClick={() => handleDelete(prop.id)}
                aria-label="Ta bort utkast"
                title="Ta bort detta utkast"
                className="p-1 rounded-lg text-brand-ink/40 hover:text-brand-error hover:bg-brand-error/10 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-accent"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

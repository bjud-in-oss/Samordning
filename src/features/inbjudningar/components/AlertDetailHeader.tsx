import React from "react";
import { ArrowLeft } from "lucide-react";

interface AlertDetailHeaderProps {
  category?: string;
  onBack: () => void;
  backBtnText: string;
}

export function AlertDetailHeader({ category, onBack, backBtnText }: AlertDetailHeaderProps) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-xs border border-brand-ink/5 flex items-center justify-between">
      <button
        onClick={onBack}
        className="px-4 py-2 hover:bg-brand-paper/50 text-brand-ink/80 hover:text-brand-ink font-mono text-[10px] uppercase tracking-wider rounded-lg transition-all flex items-center gap-2 cursor-pointer"
      >
        <ArrowLeft size={14} />
        <span>{backBtnText}</span>
      </button>
      <div className="flex items-center gap-2">
        <span className="bg-brand-paper text-brand-ink text-[9px] font-mono uppercase tracking-wider px-3 py-1.5 rounded border border-brand-ink/5">
          {category || "Vara en vän"}
        </span>
      </div>
    </div>
  );
}

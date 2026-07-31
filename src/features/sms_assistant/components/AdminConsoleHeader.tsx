import React from "react";
import { ArrowLeft, ShieldCheck, FileText } from "lucide-react";

interface AdminConsoleHeaderProps {
  onSendSms: (text: string) => void;
  onInsertTemplate: () => void;
  onBack?: () => void;
}

export function AdminConsoleHeader({ onSendSms, onInsertTemplate, onBack }: AdminConsoleHeaderProps) {
  return (
    <div className="bg-white px-4 py-3 border-b border-brand-ink/10 flex items-center justify-between shadow-xs shrink-0 z-10 relative">
      <div className="flex items-center gap-3">
        <button 
          onClick={onBack || (() => window.location.href = "/")}
          className="p-2 -ml-2 text-brand-ink/60 hover:text-brand-ink transition-colors flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft size={20} />
          <span className="text-xs font-mono uppercase tracking-wider hidden sm:inline">Webbapp</span>
        </button>
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-brand-accent shrink-0" size={24} />
          <div>
            <h1 className="text-lg font-serif italic text-brand-ink font-medium tracking-tight leading-none flex items-center gap-2">
              <span>SMS Konsol</span>
              <span className="text-[9px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full not-italic font-normal">#PAIR Aktiv</span>
            </h1>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 font-mono text-[10px]">
        <button
          onClick={() => onSendSms(".status")}
          className="px-2.5 py-1 bg-brand-bg hover:bg-brand-ink/5 border border-brand-ink/10 rounded-lg text-brand-ink/80 transition-colors cursor-pointer"
        >
          .status
        </button>
        <button
          onClick={() => onSendSms(".mall")}
          className="px-2.5 py-1 bg-brand-bg hover:bg-brand-ink/5 border border-brand-ink/10 rounded-lg text-brand-ink/80 transition-colors cursor-pointer"
        >
          .mall
        </button>
        <button
          onClick={onInsertTemplate}
          className="px-2.5 py-1 bg-brand-accent/10 hover:bg-brand-accent/20 text-brand-accent rounded-lg transition-colors cursor-pointer flex items-center gap-1"
        >
          <FileText size={12} />
          <span>Infoga 5-raders mall</span>
        </button>
      </div>
    </div>
  );
}

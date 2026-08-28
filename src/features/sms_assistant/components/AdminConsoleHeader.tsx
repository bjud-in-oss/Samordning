import React from "react";
import { ArrowLeft, ShieldCheck, LogOut } from "lucide-react";

interface AdminConsoleHeaderProps {
  onBack?: () => void;
  onLogout?: () => void;
}

export function AdminConsoleHeader({ onBack, onLogout }: AdminConsoleHeaderProps) {
  return (
    <div className="bg-white px-4 py-3 border-b border-brand-ink/10 flex items-center justify-between shadow-xs shrink-0 z-10 relative">
      <div className="flex items-center gap-3">
        <button 
          onClick={onBack || (() => window.location.href = "/")}
          className="p-2 -ml-2 text-brand-ink/60 hover:text-brand-ink transition-colors flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft size={20} />
          <span className="text-xs font-mono uppercase tracking-wider hidden sm:inline">Anslagstavla</span>
        </button>
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-brand-primary shrink-0" size={24} />
          <div>
            <h1 className="text-lg font-serif font-medium text-brand-ink tracking-tight leading-none flex items-center gap-2">
              <span>Administrationspanel</span>
              <span className="text-[10px] font-mono bg-brand-primary/10 text-brand-primary border border-brand-primary/20 px-2 py-0.5 rounded-full not-italic font-medium">Inloggad</span>
            </h1>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {onLogout && (
          <button
            onClick={onLogout}
            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut size={14} />
            <span>Logga ut som admin</span>
          </button>
        )}
      </div>
    </div>
  );
}

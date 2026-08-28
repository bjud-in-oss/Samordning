import React from "react";
import { Settings, Plus } from "lucide-react";

interface AppHeaderProps {
  currentView: "stream" | "settings";
  onToggleSettings: () => void;
  pushEnabled: boolean;
  isToggling: boolean;
  onTogglePush: () => void;
  onCreateInvitation: () => void;
}

export function AppHeader({
  currentView,
  onToggleSettings,
  pushEnabled,
  isToggling,
  onTogglePush,
  onCreateInvitation
}: AppHeaderProps) {
  return (
    <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-brand-ink/10 w-full shadow-xs">
      <div className="max-w-xl mx-auto px-4 py-3 flex items-center justify-between gap-2 overflow-hidden select-none">
        {/* VÄNSTER SIDA: Text "Ta emot inbjudningar" + Switch dockad direkt intill med gemensam klickyta */}
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            type="button"
            disabled={isToggling}
            onClick={onTogglePush}
            className="flex items-center gap-2.5 text-left cursor-pointer group hover:opacity-80 transition-opacity focus:outline-none disabled:opacity-50"
            title={pushEnabled ? "Klicka för att stänga av inbjudningar" : "Klicka för att ta emot inbjudningar"}
          >
            <h1 className="font-serif italic text-base sm:text-lg font-medium tracking-tight text-brand-ink truncate">
              Ta emot inbjudningar
            </h1>

            {/* iOS Style Switch for Push Notifications */}
            <div
              className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                pushEnabled ? 'bg-brand-accent' : 'bg-brand-ink/20'
              }`}
            >
              <span className="sr-only">Ta emot inbjudningar</span>
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  pushEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </div>
          </button>
        </div>

        {/* HÖGER SIDA: Samlad styrpanel med inställningskugghjul och Bjud in-knapp */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Diskret ⚙️-kugghjul direkt intill som fäller ut/stänger inställningar */}
          <button
            type="button"
            onClick={onToggleSettings}
            className={`p-1.5 text-brand-ink/70 hover:text-brand-ink hover:bg-brand-paper rounded-xl transition-all cursor-pointer ${
              currentView === 'settings' ? 'bg-brand-paper text-brand-ink' : ''
            }`}
            title="Anpassa inställningar"
          >
            <Settings size={18} />
          </button>

          {/* Knappen "Bjud in" längst till höger */}
          <button
            type="button"
            onClick={onCreateInvitation}
            className="px-3.5 py-1.5 bg-brand-accent hover:bg-brand-accent/90 text-white font-mono text-xs uppercase font-bold tracking-wider rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
            title="Skapa ny inbjudan"
          >
            <Plus size={15} className="stroke-[2.5]" />
            <span>Bjud in</span>
          </button>
        </div>
      </div>
    </div>
  );
}

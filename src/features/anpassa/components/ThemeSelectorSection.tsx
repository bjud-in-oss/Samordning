import React, { useState, useEffect } from "react";
import { Palette, Check, Eye } from "lucide-react";

export interface ThemeOption {
  id: string;
  name: string;
  category: "standard" | "accessibility" | "season";
  description: string;
  previewColors: {
    bg: string;
    primary: string;
    accent: string;
    text: string;
  };
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: "default",
    name: "Varm församling",
    category: "standard",
    description: "Klassisk mjuk och varm ton för daglig användning",
    previewColors: {
      bg: "#fdfcf9",
      primary: "#5e6c5c",
      accent: "#2d6a7f",
      text: "#1c1c1a",
    },
  },
  {
    id: "high-contrast",
    name: "Högkontrast",
    category: "accessibility",
    description: "Maximerad kontrast för ökad läsbarhet och tillgänglighet",
    previewColors: {
      bg: "#ffffff",
      primary: "#000000",
      accent: "#002b55",
      text: "#000000",
    },
  },
  {
    id: "autumn",
    name: "Säsong: Höst",
    category: "season",
    description: "Varma jordnära bärnstens- och hösttoner",
    previewColors: {
      bg: "#faf6f0",
      primary: "#8c4a27",
      accent: "#5a6e3e",
      text: "#2c1e19",
    },
  },
  {
    id: "spring",
    name: "Säsong: Vår",
    category: "season",
    description: "Friska, ljusgröna och spirande vårteman",
    previewColors: {
      bg: "#f6fbf7",
      primary: "#2d6e3e",
      accent: "#2e8b78",
      text: "#182b1d",
    },
  },
  {
    id: "winter",
    name: "Säsong: Vinter",
    category: "season",
    description: "Krispiga nordiska skymnings- och isblå nyanser",
    previewColors: {
      bg: "#f4f8fc",
      primary: "#27567b",
      accent: "#1f4f73",
      text: "#132230",
    },
  },
];

export function ThemeSelectorSection() {
  const [currentTheme, setCurrentTheme] = useState<string>("default");

  useEffect(() => {
    const saved = localStorage.getItem("app_theme") || "default";
    setCurrentTheme(saved);
  }, []);

  const handleSelectTheme = (themeId: string) => {
    setCurrentTheme(themeId);
    try {
      localStorage.setItem("app_theme", themeId);
      document.documentElement.setAttribute("data-theme", themeId);
    } catch {
      // Ignorera eventuella storage-fel
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-brand-ink/5 shadow-xs space-y-4 animate-in fade-in duration-200">
      <div className="flex items-center gap-2.5 pb-3 border-b border-brand-ink/5">
        <Palette size={18} className="text-brand-accent shrink-0" />
        <h3 className="font-sans font-medium text-base text-brand-ink">
          Färgtema & Kontrast
        </h3>
      </div>
      <p className="text-brand-ink/70 text-xs font-light leading-relaxed">
        Välj ett dynamiskt färgtema eller högkontrastläge. Ändringen appliceras direkt på hela applikationen via centrala CSS-variabler.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {THEME_OPTIONS.map((theme) => {
          const isSelected = currentTheme === theme.id;
          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => handleSelectTheme(theme.id)}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2.5 relative ${
                isSelected
                  ? "border-brand-accent bg-brand-paper/70 ring-1 ring-brand-accent/30 shadow-xs"
                  : "border-brand-ink/10 bg-brand-bg hover:border-brand-accent/40"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  {theme.category === "accessibility" && (
                    <Eye size={13} className="text-brand-accent shrink-0" />
                  )}
                  <span className="text-xs font-semibold text-brand-ink">
                    {theme.name}
                  </span>
                </div>
                {isSelected && (
                  <span className="flex items-center gap-1 text-[11px] font-medium text-brand-accent">
                    <Check size={14} />
                    Aktiv
                  </span>
                )}
              </div>

              <p className="text-[11px] text-brand-ink/65 font-light leading-tight">
                {theme.description}
              </p>

              {/* Färgprover */}
              <div className="flex items-center gap-1.5 pt-1 border-t border-brand-ink/5">
                <div
                  className="w-4 h-4 rounded-full border border-black/10 shadow-2xs"
                  style={{ backgroundColor: theme.previewColors.bg }}
                  title="Bakgrund"
                />
                <div
                  className="w-4 h-4 rounded-full border border-black/10 shadow-2xs"
                  style={{ backgroundColor: theme.previewColors.primary }}
                  title="Primärfärg"
                />
                <div
                  className="w-4 h-4 rounded-full border border-black/10 shadow-2xs"
                  style={{ backgroundColor: theme.previewColors.accent }}
                  title="Accent"
                />
                <div
                  className="w-4 h-4 rounded-full border border-black/10 shadow-2xs"
                  style={{ backgroundColor: theme.previewColors.text }}
                  title="Text"
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

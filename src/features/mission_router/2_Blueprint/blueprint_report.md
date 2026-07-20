[CURRENT SUBDIRECTORY/CYCLE] | [src/features/mission_router/2_Blueprint]

# BLUEPRINT: Åtgärdsplan för Bounce-back & Typografi

## 1. Analys av Bounce-back på "Anpassa"-knappen
**Hypotes & Grundorsak:**
Problemet ligger inte i DOM:ens event bubbling längre. Istället orsakas det av hur `OnboardingWizard`-komponenten hanterar sitt interna tillstånd.
- När användaren klickar på "Anpassa" sätts `currentView = 'settings'` i `App.tsx`.
- Detta gör att `<OnboardingWizard>` mountas/renderas.
- Inuti `OnboardingWizard` finns en `useEffect` (rad 99) som automatiskt triggar `onSaveRef.current(...)` så fort komponenten renderas och preferenserna är satta.
- I `App.tsx` har `onSave`-propen definierats så här:
  ```tsx
  onSave={(tags) => {
    handleSaveTags(tags);
    setCurrentView('stream'); // <-- HÄR ÄR FELET!
  }}
  ```
- Resultat: Så fort komponenten mountas sparas default-tagsen *och* `currentView` sätts blixtsnabbt tillbaka till `'stream'`. Vyn blinkar bara till och studsar tillbaka.

**Lösning:**
- I `App.tsx`: Ta bort `setCurrentView('stream')` från `onSave`-callbacken. Auto-save i bakgrunden ska enbart spara state.
- Skicka istället in propen `onClose={() => setCurrentView('stream')}` till `<OnboardingWizard>`. `OnboardingWizard` anropar nämligen `onClose` när användaren klickar på knappen "Klart!" på sista steget.

## 2. Typografi och Designmönster
I dagsläget använder switchens etikett klasserna `text-xs sm:text-sm font-medium text-brand-ink`, vilket ser generiskt och lite "system-default" ut.
Baserat på analys av `App.tsx` har applikationen två väldigt distinkta typografiska mönster:
- **Inbjudande / Deskriptiv:** `font-serif italic text-brand-ink` (används för rubriker).
- **Tekniska etiketter / Knappar:** `font-mono text-[10px] sm:text-[11px] uppercase tracking-widest` (används för flik-länkar och felmeddelanden).

**Åtgärdsplan för UI (`App.tsx`):**
- **Switch-etikett:** Ändra "Få inbjudningar som notiser" till ett mer redaktionellt/inbjudande formspråk:
  `className="font-serif italic text-[15px] sm:text-base text-brand-ink tracking-tight"`
- **Anpassa-knapp:** Strama upp knappen så den matchar det tekniska formspråket helt och hållet:
  `className="flex items-center justify-center gap-2 px-5 py-4 sm:py-0 bg-white border border-brand-ink/10 rounded-2xl font-mono text-[10px] sm:text-[11px] uppercase tracking-widest text-brand-ink/70 hover:text-brand-ink hover:bg-brand-paper transition-all shadow-sm shrink-0 ..."`

Denna blueprint är redo att överföras till `3_Council_Impact` och `4_Produce` efter godkännande.

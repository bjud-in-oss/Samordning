# 4_Produce

## Genomförda åtgärder
- **Minnesdokumentation**: Skapade `blueprint_spec.md` under `2_Blueprint` och skrev in den nya arkitektoniska regeln: "UI-state får aldrig bindas till auto-save-events...".
- **App.tsx (Data vs Vy)**: I `<OnboardingWizard>`-instansieringen, lät `onSave` endast ansvara för data (bakgrundssparning) medan `onClose` nu exklusivt sköter `setCurrentView('stream')`.
- **OnboardingWizard.tsx**: Stöd för `onClose` fanns delvis, men var odokumenterat (ej i interface). Lade in `onClose` ordentligt och satte in en stängningsknapp (X) längst upp till höger för inställningarna.
- **Typografi (App.tsx)**: Ändrade switch-etiketten till appens signatur (font-serif italic text-brand-ink) och "Anpassa"-knappen till dess kontrasterande form (font-mono uppercase text-xs tracking-widest text-brand-ink/70) för perfekt harmoni.

Bygget är grönt! Auto-save blinkar inte längre bort vyn och allt är enhetligt och vackert!

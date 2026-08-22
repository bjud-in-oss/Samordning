# Steg 3c: Fil-operativ Källkodsspecifikation (Anpassa-panelen)

## 1. Huvudrubrik och underrubrik i panelen (`src/features/anpassa/OnboardingWizard.tsx`)
- **Ta bort stjärnikon & sätt ren huvudrubrik**:
  - Ändra rubrikraden från:
    ```tsx
    <h2 className="font-serif italic text-2xl font-medium text-brand-ink tracking-tight flex items-center gap-2.5">
      <Sparkles size={22} className="text-brand-accent shrink-0" />
      Anpassa din tillgänglighet
    </h2>
    ```
    till:
    ```tsx
    <h2 className="font-serif italic text-2xl font-medium text-brand-ink tracking-tight">
      Anpassa din tillgänglighet
    </h2>
    ```
- **Sätt ny underrubrik**:
  - Ändra paragrafen direkt under till:
    ```tsx
    <p className="text-brand-ink/70 text-xs sm:text-sm font-light mt-1">
      Ställ in var och för vem du vill vara tillgänglig. Du är anonym och kan ändra dig eller ta en paus när du vill.
    </p>
    ```

## 2. Aktiveringsknapp vid inaktivt läge (`!pushEnabled`)
- **Placering högst upp i panelen**:
  - Ersätt den befintliga passiva textrutan med en direkt klickbar aktiveringsknapp:
    ```tsx
    {!pushEnabled && (
      <div className="bg-brand-paper/90 border border-brand-accent/25 rounded-2xl p-4 text-brand-ink text-xs sm:text-sm font-sans flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <p className="font-medium text-brand-ink/90">
          Inbjudningar är för tillfället inaktiverade.
        </p>
        <button
          type="button"
          onClick={onEnablePush}
          className="w-full sm:w-auto px-4 py-2.5 bg-brand-accent text-white font-medium text-xs sm:text-sm rounded-xl hover:opacity-90 transition-all cursor-pointer shadow-xs whitespace-nowrap"
        >
          Slå på &apos;Ta emot inbjudningar&apos;
        </button>
      </div>
    )}
    ```

## 3. Steg 1 – Områdesval (`src/features/anpassa/OnboardingWizard.tsx` & `src/features/anpassa/Step1Geography.tsx`)
- **OnboardingWizard.tsx**:
  - Rubrik: `"1. Dina områden"`
  - Underrubrik:
    ```tsx
    <p className="text-brand-ink/70 text-xs font-light leading-relaxed">
      {uiLanguage === "sv" 
        ? "Vilka områden brukar du träffa andra i eller erbjuda stöd i?" 
        : "Which areas do you usually meet others or offer support in?"}
    </p>
    ```
- **Step1Geography.tsx**:
  - Vid `!isInline`: Uppdatera frågetexten till `"Vilka områden brukar du träffa andra i eller erbjuda stöd i?"`.

## 4. Enhetstester & Verifiering
- Skapa/uppdatera `src/features/anpassa/components/__tests__/OnboardingWizard.test.tsx` med interaktionstester (`fireEvent.click`) på aktiveringsknappen och textverifiering av de nya rubrikerna och formuleringarna.

## 5. Berörda Källkodsfiler i Steg 4 (Strikt domän `anpassa`)
1. `src/features/anpassa/OnboardingWizard.tsx`
2. `src/features/anpassa/Step1Geography.tsx`
3. `src/features/anpassa/components/__tests__/OnboardingWizard.test.tsx`
4. `src/features/anpassa/doc/UI_WORKFLOWS.md`

BESLUT: GODKÄND

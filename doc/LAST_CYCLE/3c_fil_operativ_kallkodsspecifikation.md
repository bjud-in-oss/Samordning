# Steg 3c: Fil-operativ Källkodsspecifikation (Anpassningspanelen)

## 1. Anpassningspanelen (`src/features/anpassa/OnboardingWizard.tsx`)
- **Rubrik**:
  - Byt rubrik längst upp till `"Välj var du vill ta emot inbjudningar"`.
  - Ta bort ikonen `<Sparkles ... />` framför rubriken.
- **Rensa gamla påminnelser**:
  - Ta bort den passiva textrutan med texten `"Slå på 'Ta emot inbjudningar' i toppfältet för att aktivera dina val."`.
- **Aktiv aktiveringsknapp längst upp**:
  - Om `!pushEnabled` visas en aktiv knapp:
    ```tsx
    {!pushEnabled && (
      <button
        type="button"
        onClick={onEnablePush}
        className="w-full bg-brand-accent hover:bg-brand-accent/90 text-white rounded-2xl p-4 text-xs sm:text-sm font-sans font-medium flex items-center justify-between shadow-xs transition-all cursor-pointer group"
      >
        <span className="font-sans">
          Slå på <strong>&apos;Ta emot inbjudningar&apos;</strong>
        </span>
        <span className="text-[11px] uppercase tracking-wider font-mono opacity-90 group-hover:opacity-100 flex items-center gap-1">
          Aktivera nu <ArrowRight size={14} />
        </span>
      </button>
    )}
    ```
- **Interface & Props**:
  - `pushEnabled?: boolean`
  - `onEnablePush?: () => void`
  - `onSave: (tags: OnboardingTags) => void`
  - `onClose: () => void`
  - `initialTags?: OnboardingTags | null`

## 2. Integrationsvy (`src/components/MainViewContent.tsx`)
- Säkerställ att `onEnablePush={() => { if (!pushEnabled) onTogglePush(); }}` skickas till `OnboardingWizard`.

## 3. Tester (`src/features/anpassa/__tests__/OnboardingWizard.test.tsx`)
- Verifiera att knappen visas när `pushEnabled={false}`, att klick anropar `onEnablePush`, och att knappen döljs när `pushEnabled={true}` med interaktionspåståenden (`fireEvent`, `toHaveBeenCalled`).

## 4. Berörda Källkodsfiler i Steg 4
1. `src/features/anpassa/OnboardingWizard.tsx`
2. `src/components/MainViewContent.tsx`
3. `src/features/anpassa/__tests__/OnboardingWizard.test.tsx`

BESLUT: GODKÄND

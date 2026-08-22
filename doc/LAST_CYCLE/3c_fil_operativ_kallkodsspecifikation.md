# Steg 3c: Fil-operativ Källkodsspecifikation (Startsida & Citatkort)

## 1. Ingångskort (`src/features/inbjudningar/components/StreamFilterStatus.tsx`)
- **Rubrikändring i inaktivt läge (`!pushEnabled`)**:
  - Ändra rubriken från `"Välj att ta emot inbjudningar"` till `"Anpassa din tillgänglighet"`.
- **Rensa skiljelinje & förenkla text**:
  - Ta bort klassen `border-t border-brand-ink/5` från paragrafen med klicktexten.
  - Ändra texten från `"(Klicka för att anpassa områden och inställningar)"` till `"(Klicka för att anpassa)"`.
- **Props**: Bevaras oförändrade (`savedTags`, `pushEnabled`, `onOpenSettings`).

## 2. Redaktionellt Citatkort (`src/features/inbjudningar/components/StreamQuoteCard.tsx`)
- **Ny fristående komponent**:
  - Helt ramlös, icke-klickbar, utan bakgrundsskugga.
  - Citat: *”När ni är i era medmänniskors tjänst är ni endast i er Guds tjänst.”* med `font-serif italic text-lg sm:text-xl md:text-2xl text-center leading-relaxed text-brand-ink/90`.
  - Källhänvisning: *Mosiah 2:17* som `font-mono text-xs sm:text-sm text-brand-ink/50 text-center mt-2 tracking-wide`.
  - Struktur:
    ```tsx
    import React from "react";

    export interface StreamQuoteCardProps {
      className?: string;
    }

    export function StreamQuoteCard({ className = "" }: StreamQuoteCardProps) {
      return (
        <div className={`py-6 px-4 text-center select-none ${className}`}>
          <blockquote className="font-serif italic text-lg sm:text-xl md:text-2xl text-brand-ink/90 leading-relaxed max-w-xl mx-auto">
            ”När ni är i era medmänniskors tjänst är ni endast i er Guds tjänst.”
          </blockquote>
          <p className="font-mono text-xs sm:text-sm text-brand-ink/50 mt-2 tracking-wide">
            Mosiah 2:17
          </p>
        </div>
      );
    }
    ```

## 3. Flödesplacering (`src/features/inbjudningar/ActiveStream.tsx`)
- **Import**:
  - Importera `StreamQuoteCard` från `./components/StreamQuoteCard`.
- **Placering**:
  - Placera `<StreamQuoteCard />` direkt under ingångskortet i flödet:
    ```tsx
    {!pushEnabled && (
      <>
        <StreamFilterStatus savedTags={savedTags} pushEnabled={pushEnabled} onOpenSettings={onOpenSettings} />
        <StreamQuoteCard />
      </>
    )}
    ```

## 4. Enhetstester & Verifiering
- `src/features/inbjudningar/components/__tests__/StreamFilterStatus.test.tsx`:
  - Uppdatera förväntad rubrik till `"Anpassa din tillgänglighet"` och klicktext till `"(Klicka för att anpassa)"`.
- `src/features/inbjudningar/components/__tests__/StreamQuoteCard.test.tsx`:
  - Skapa test med rendering och assertion på citattext samt källhänvisning.

## 5. Berörda Källkodsfiler i Steg 4 (Strikt domän `inbjudningar`)
1. `src/features/inbjudningar/components/StreamFilterStatus.tsx`
2. `src/features/inbjudningar/components/StreamQuoteCard.tsx`
3. `src/features/inbjudningar/ActiveStream.tsx`
4. `src/features/inbjudningar/components/__tests__/StreamFilterStatus.test.tsx`
5. `src/features/inbjudningar/components/__tests__/StreamQuoteCard.test.tsx`

BESLUT: GODKÄND

# Steg 4: Producera (TCK-012)

## Genomförda förändringar

1. `src/features/skapa_inbjudan/components/__tests__/PreviewCard.test.tsx` skapades med full täckning och interaktionsassertion för att bekräfta tillstånd, klick och CSS-klasser (`bg-brand-accent`).
2. `src/features/skapa_inbjudan/components/PreviewCard.tsx` uppdaterades med harmoniserad styling (`bg-brand-accent hover:bg-brand-accent/90 text-white`) när `consentConfirmed === true`.
3. Färgkontrast och synlighet är säkrad i samtliga fem teman.

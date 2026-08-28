# Steg 3c: Fil-operativ källkodsspecifikation (TCK-012)

## Berörda källkodsfiler och ändringar

Följande relativa filvägar berörs inom domänen `skapa_inbjudan`:

1. `src/features/skapa_inbjudan/components/__tests__/PreviewCard.test.tsx`
   - Skapa enhetstest som verifierar att knappen "Publicera direkt" / "Ge en inbjudan" har rätt färgklasser (`bg-brand-accent` / `hover:bg-brand-accent/90`) och inte tappar stil vid växling av `consentConfirmed`.
   - Innehåller aktiva interaktions- och assertionspåståenden (`fireEvent`, `click`, `expect`).

2. `src/features/skapa_inbjudan/components/PreviewCard.tsx`
   - Justera klasserna på publiceringsknappen så att `bg-brand-accent hover:bg-brand-accent/90` appliceras vid aktivt samtycke (`consentConfirmed === true`), oavsett om `isAdmin` är aktivt eller inte.
   - Säkerställer att knappen förblir synlig med vit text mot accentbakgrunden.

### Gränssnittsdeklaration:
Inga props tas bort eller ändras.

**BESLUT: GODKÄND**

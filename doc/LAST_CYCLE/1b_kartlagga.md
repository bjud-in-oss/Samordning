# Steg 1b: Kartlägga (TCK-012: Återställ färgmarkering för 'Publicera direkt')

## Svar på GROW-frågor mot kodbasen

1. **State**:
   I `PreviewCard.tsx` styrs publiceringsknappens visuella klasser av uttrycket `!consentConfirmed ? "bg-brand-ink/30 cursor-not-allowed opacity-60" : isAdmin ? "bg-brand-primary hover:bg-brand-primary/90" : "bg-brand-accent hover:bg-brand-accent/90"`. När användaren bockar för integritetsbekräftelsen skiftar `consentConfirmed` till `true`. Om `isAdmin` är aktivt appliceras klassen `bg-brand-primary`.

2. **Contract**:
   I `src/index.css` under `@theme` definieras `--color-primary: var(--color-primary);` men ingen `--color-brand-primary: var(--color-primary);`. Däremot definieras `--color-brand-accent: var(--color-accent);`. Därför känner Tailwind inte igen `bg-brand-primary`, vilket renderar knappen utan bakgrundsfärg (transparent vit text på vit bakgrund). Genom att explicit använda `bg-brand-accent` (eller harmonisera med `bg-brand-accent hover:bg-brand-accent/90 text-white`) i `PreviewCard.tsx` eller definiera `--color-brand-primary` i `index.css` bevaras färgen konsekvent.

3. **Resilience**:
   Både `--color-accent` och `--color-primary` har definierade höga kontrastvärden gentemot vit text i alla 5 teman (`default`, `high-contrast`, `autumn`, `spring`, `winter`), vilket säkrar WCAG AA-nivå och full visuell tydlighet.

```json
{
  "status": "IN_PROGRESS",
  "current_domain": "skapa_inbjudan",
  "next_step": "2a_forandra_utat_vision",
  "ticket_id": "TCK-012",
  "active_skill": "wayfinder",
  "active_vectors": ["Contract", "State"]
}
```

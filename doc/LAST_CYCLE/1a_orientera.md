# Steg 1a: Orientera (TCK-012: Återställ färgmarkering för 'Publicera direkt')

## Sokratiska GROW-frågor (Vektorbaserad analys)

1. **State**: Hur påverkas `consentConfirmed` och knappens visuella tillstånd vid skifte från inaktiverad (`opacity-60 bg-brand-ink/30`) till aktiverad admin-vy?
2. **Contract**: Vilka CSS-klasser och tematiserade tokens (`bg-brand-primary`, `bg-brand-accent`, `bg-primary`) definieras i Tailwind `@theme` och konsumeras i `PreviewCard.tsx` samt `Step2Privacy.tsx` för att garantera att knappen bibehåller solid bakgrundsfärg?
3. **Resilience**: Hur säkerställer vi att färgkontrasten uppfyller WCAG AA och förblir helt intakt i samtliga säsongsteman (default, high-contrast, autumn, spring, winter)?

```json
{
  "status": "IN_PROGRESS",
  "current_domain": "skapa_inbjudan",
  "next_step": "1b_kartlagga",
  "ticket_id": "TCK-012",
  "active_skill": "wayfinder"
}
```

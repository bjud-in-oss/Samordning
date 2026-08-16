# Steg 3a: Helhet, Orkestrering och Integration

### 1. Helhetsnivå
- Systemomfattande designintegration för accentfärger:
  - Definierad färgtoken i Tailwind `@theme`: `var(--color-brand-accent)` (`#5e6c5c`).
  - Ersättning av alla hårdkodade Tailwind `emerald-*` och `green-*` klasser i `src/features/skapa_inbjudan`, `src/features/inbjudningar` och `src/features/sms_assistant` med `brand-accent`, `brand-paper` och `brand-ink` motsvarigheter.
  - Säkra god kontrast (WCAG AA) för text och ikoner mot bakgrunder.

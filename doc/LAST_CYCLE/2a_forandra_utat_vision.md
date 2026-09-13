# Steg 2a: Förändra utåt (Vision & Användarupplevelse)

## Visuell Design och Integration
1. **Hörlursknapp i AppHeader**:
   - Placeras direkt till vänster om inställningskugghjulet i den högra verktygspanelen.
   - Ikonen `Headphones` (storlek 18) renderas med subtil övergångsfärg (`text-brand-ink/70 hover:text-brand-ink hover:bg-brand-paper`).
   - När `currentView === 'translation'` markeras knappen aktiv med `bg-brand-paper text-brand-accent`.
   - Touch-target hålls generös (minst 40–44px klickyta) med `p-1.5` och `rounded-xl`.

2. **Inbäddning av LiveTranslationWidget i MainViewContent**:
   - När direktöversättning aktiveras döljs flödet och formulären temporärt.
   - `LiveTranslationWidget` renderas sömlöst med språkval, ljudkontroller, transportväljare (Cloudflare SFU vs lokal WebSocket) och fördröjningsmätare.
   - Användaren kan när som helst återgå till flödet genom att klicka på hörlursknappen igen eller via eventuell tillbaka-knapp.

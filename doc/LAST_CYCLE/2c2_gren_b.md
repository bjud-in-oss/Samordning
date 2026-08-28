# Steg 2c2: Arkitekturgren B (Global tema-aliasing + domänspecifik harmonisering)

## Förslag i Gren B: Global definiering av brand-primary och lokal harmonisering

Baserat på kraven från Gren A:s utvärdering (2d1) adresserar Gren B risken för framtida användning av `bg-brand-primary`:

1. `PreviewCard.tsx` uppdateras till att använda `bg-brand-accent hover:bg-brand-accent/90` så att komponenten är självständigt robust och fri från externa token-beroenden.
2. `src/index.css` kompletteras med `--color-brand-primary: var(--color-primary);` under `@theme` så att båda namnkonventionerna (`brand-primary` och `brand-accent`) fungerar sömlöst i hela applikationen.

### Fördelar:
- Total bakåt- och framåtkompatibilitet.
- Eliminerar tysta CSS-fel permanent.

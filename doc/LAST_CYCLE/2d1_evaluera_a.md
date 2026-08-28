# Steg 2d1: Evaluera Gren A

## Utvärdering av Gren A

Gren A löser problemet omedelbart och isolerat i `PreviewCard.tsx`.

### Styrkor:
- Enkel och helt säker förändring inom domänen `skapa_inbjudan`.
- Noll risk för sidoeffekter på andra komponenter.

### Kvarvarande osäkerheter & gränssnittskrav för nästa gren:
- Kan andra komponenter i framtiden försöka använda klassen `bg-brand-primary` och råka ut för samma sak?
- Gren B bör analysera huruvida vi även bör komplettera `src/index.css` med aliaset `--color-brand-primary: var(--color-primary);` för fullständig robusthet i hela Tailwind-temat.

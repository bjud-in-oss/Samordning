# Steg 3: Att vända

- **Rannsakning & Förenkling**:
  - Säkerställ att inga externa tunga kalenderbibliotek installeras i onödan. ICS-standarden (RFC 5545) kan genereras typsäkert och rent med en lättviktsfunktion.
  - Säkerställ att alla filer hålls strikt under 250 rader.
  - Förhindra interna importvägar; kommunikation ska gå enbart via `src/features/exportering/index.ts`.
  - Ingen tillståndslagring på disk i Node/RAM, utan klientdriven web-blob nedladdning.

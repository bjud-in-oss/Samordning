# Begränsningar och Affärsregler: inbjudningar (CONSTRAINTS.md)

- **Direktvisning & Larmflöde**: Larm och inbjudningar visas i realtid med prioritering och filterstatus.
- **Filtervalidering via Zod**: Alla tagg- och områdesfilter valideras genom scheman i `domain/schema.ts`.
- **Modereringspolicy**: Endast auktoriserade administratörer kan godkänna eller avvisa inkommande larmförslag.
- **Gränssnittsisolering**: Komponenter konsumerar data uteslutande via domänhooks (`useActiveStream`).
- **Fasadskydd**: Inga interna komponenter eller logikfiler får importeras direkt utanför domänens `index.ts`.

# 4_Produce: Synkronisering & Backend-texttvätt

## Genomförda åtgärder
1. **Central Backend-texttvätt (`washAnnouncementText`)**:
   - Skapades och exporterades från `src/features/mission_router/domain/parser.ts`.
   - Tvättar bort alla parentes-instruktioner `(...)` och hjälptaggar `[.?]`.
   - Tillämpas automatiskt i `server.ts` för alla inkommande meddelanden (#WEBB, SMS, WhatsApp, API).

2. **Symmetrisk 5-raders SMS- & QR-Payload**:
   - `ActiveStream.tsx` genererar nu `#WEBB`-SMS och QR-payload med de 5 nycklarna (`Tid`, `Mötesplats`, `Aktivitet`, `Bjud in från områden`, `Målgrupp`).
   - `#WEBB`-hanteraren i `server.ts` parsar rad för rad för att extrahera dessa nycklar och tillämpar backend-texttvätten.

3. **Uppräkning av `usage_count`**:
   - `usage_count` stegras reaktivt med +1 i `localStorage` vid varje skapad inbjudan.

4. **Svar på `.?` & `.mall`**:
   - `.?` returnerar 5-raders mallen med hjälptext och lista över gällande kommandon.
   - `.mall` returnerar den rena 5-raders mallen för snabb redigering.

5. **Koden kompilera 100% grönt utan varningar eller byggfel.**

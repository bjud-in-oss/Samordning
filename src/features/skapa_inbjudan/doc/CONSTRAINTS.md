# Begränsningar och Affärsregler: skapa_inbjudan (CONSTRAINTS.md)

- **Obligatoriska fält**: En inbjudan kräver tid, plats, aktivitet/beskrivning, organisation och minst 1 målgrupp före publicering.
- **Integritets- och samtyckesspärr**: Samtyckesbocken (`consentConfirmed`) måste vara aktiv för att publicering ska tillåtas.
- **Körtidsvalidering via Zod**: All formulärs- och stegdata valideras deterministiskt via scheman i `domain/schema.ts`.
- **Datalagring & Status**: Godkända inbjudningar persisteras med unikt ID, tidsstämpel och status `approved` eller `pending`.
- **Tillståndsisolering**: Presentationskomponenter anropar enbart domäntjänster och hooks (`useInvitationForm`), aldrig råa nätverksanrop.
- **Fasadskydd**: Endast namngivna element re-exporteras i `index.ts`. Direkt djupimport i domänen är förbjuden.

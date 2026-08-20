# Affärsregler: skapa_inbjudan

1. **Obligatoriska fält**: En inbjudan måste innehålla minst tid, plats och aktivitet/beskrivning före publicering.
2. **Datalagring**: Varje godkänd inbjudan ska sparas strukturerat i backend/lokal lagring med unikt ID, tidsstämpel och status `approved` eller `pending`.
3. **Typdisciplin**: Alla datastrukturer och props ska ha explicita och konkreta TypeScript-typer utan `any`.
4. **Tillstånds- och nätverksisolering**: Presentationskomponenter ska inte utföra direkta `fetch`- eller nätverksanrop, utan förlita sig på hooks och domäntjänster.

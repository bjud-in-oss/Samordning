# Steg 4: Att förlika

Checklista för v5.1 arkitektur:
1. Kodrader: Filstorlekar planeras hållas under 250 rader. (Ja)
2. Ansvarsfördelning: Ren separation mellan beräkningslogik (`domain/`), tester (`__tests__/`) och gränssnitt (`components/`). (Ja)
3. Publik gräns: Exponeras enbart via `src/features/exportering/index.ts`. (Ja)
4. Tester & typsäkerhet: Enhetstester med över 80 % täckning för exportgeneratorer. (Ja)
5. Kodrensning: Inga onödiga beroenden eller föråldrade filer. (Ja)
6. Planering först: Samtliga steg 1–4 sparade i ordning med tidsstämplar före redigering i `src/`. (Ja)
7. Extern konsumtion: Komponent ansluts i `MainViewContent.tsx`. (Ja)

BESLUT: GODKÄND

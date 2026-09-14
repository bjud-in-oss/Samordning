# Steg 1a: Orientera (TCK-SMS-005)

## Ärendebeskrivning
Säkerställ realtidssynkronisering och Firestore-fallback för enhetsparning:
1. Uppdatera pairDeviceToken i src/server/storage.ts att spara både exakt kod och lowercase.
2. Lägg till onSnapshot-lyssnare på paired_devices i initServerStorage().
3. Gör /api/admin/check-pairing async i src/server/routes.ts med direkt Firestore-sökning som fallback.
4. Ta bort den dubblerade /api/admin/check-pairing från src/server/adminMemberRoutes.ts.

## GROW-frågor
1. **State**: Hur garanteras att pairedDevices i minnet alltid speglar Firestore i realtid och hanterar eventuella skillnader i skiftläge vid registrering och sökning?
2. **Contract**: Hur bibehålls strikt kontraktsefterlevnad när /api/admin/check-pairing görs asynkron och dubbletten i adminMemberRoutes.ts avvecklas?
3. **Resilience**: Hur skyddas systemet mot nätverksavbrott eller saknad Firestore-anslutning utan att orsaka ohanterade serverundantag?

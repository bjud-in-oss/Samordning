# Steg 2c1: Gren A – Endast asynkrona Firestore-anrop vid varje request (TCK-011)

## 1. Beskrivning av Gren A
Alla anrop till `activeAlerts`, `adminNumbers` etc. görs asynkront mot Firestore vid varje enskild HTTP-begäran.
- **Fördel**: Inget lokalt tillstånd alls i processen.
- **Nackdel**: Kan addera 50–150ms nätverkslatens på varje begäran och kräver omfattande omskrivning av synkrona anrop i `smsRoutes.ts` och `smsCommands.ts`.

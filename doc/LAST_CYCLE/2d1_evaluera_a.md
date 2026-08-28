# Steg 2d1: Evaluera Gren A (TCK-011)

## 1. Utvärdering
- Att tvinga alla funktioner att bli asynkrona i `storage.ts` kan bryta synkrona gränssnitt som `activeAlerts[id]` och kräva omfattande refaktorisering i `missionaryChatEngine.ts` och `smsCommands.ts`.
- **Coachningsfråga för Gren B**: Kan vi kombinera transparent Firestore-persistens i bakgrunden med realtidslyssnare (`onSnapshot`) / minnescache i RAM så att alla synkrona åtkomster förblir blixtsnabba (0ms) samtidigt som all data sparas och synkas mot Firestore?

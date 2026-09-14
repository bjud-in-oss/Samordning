# Steg 1b: Kartlägga (TCK-SMS-005)

## Svar på GROW-frågor

1. **State**:
   *Svar*: Genom att pairDeviceToken sparar både clean och clean.toLowerCase() i in-memory Set samt persisterar clean till Firestore under paired_devices, och att initServerStorage registrerar en realtids onSnapshot-lyssnare som lägger till både exakt och lowercase-id vid added/modified, hålls tillståndet 100 % konsekvent i alla instanser.

2. **Contract**:
   *Svar*: Den dubblerade ändpunkten i adminMemberRoutes.ts avlägsnas. Huvudrutten i routes.ts görs asynkron och returnerar alltid { paired: boolean, verified: boolean }, vilket exakt matchar useAdminConsole och det överenskomna REST-kontraktet.

3. **Resilience**:
   *Svar*: Parningskontrollen testar först snabbminnet i minnet. Om token saknas görs ett säkert try/catch-skyddat asynkront anrop till Firestore via getDocs(collection(db, "paired_devices")). Om Firestore är onåbar loggas en varning via console.warn och servern svarar defensivt med { paired: false, verified: false } utan att krascha.

```json
{
  "status": "In Progress",
  "current_domain": "Global",
  "next_step": "2a",
  "ticket_id": "TCK-SMS-005",
  "active_skill": "systemarkitekt",
  "active_vectors": ["Resilience"]
}
```

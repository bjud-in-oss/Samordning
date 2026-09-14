# Steg 2a: Förändra utåt (Vision) (TCK-SMS-006)

## Arkitektonisk Vision
Ett självläkande och tyst dataskikt som frikopplar applikationens grundläggande funktioner från externa behörighetskonfigurationer. Oavsett om Firebase Firestore är fullt behörig, begränsad eller offline ska backend fungera transparent med full lokal persistens i RAM och disk.

### Nyckelkomponenter
1. **Unsubscribe vid behörighetsfel**: Reaktiva strömmar (`onSnapshot`) bryts kontrollerat vid första `permission-denied`, vilket eliminerar onödig CPU-belastning och felutskrifter.
2. **Disk- och Minnespersistens**: `data/paired_devices.json` säkerställer lokal persistens för parade administratörsenheter.
3. **Noll-latens parningskontroll**: Förfrågningar till `/api/admin/check-pairing` besvaras med noll-latens från RAM.

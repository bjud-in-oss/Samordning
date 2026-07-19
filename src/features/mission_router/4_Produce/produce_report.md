# 4_Produce

## Genomförda åtgärder
- **server.ts**: 
  - La till anrop till `initWebPush()` vid uppstart så web-push initieras korrekt.
  - Exponerade endpointen `/api/vapid-public-key` som returnerar `publicKey` via funktionen `getVapidPublicKey()`. Detta löser JSON-kraschen (där frontend tidigare fick index.html tillbaka pga Vite-fallback för att endpointen saknades).
- **App.tsx (Frontend)**:
  - Anpassa-knappen är redan frikopplad och ligger säkert bredvid switchen (inte i någon delad label/klickyta).
  - Explicit event-isolering (`e.preventDefault()`, `e.stopPropagation()`) lades på Anpassa-knappen för att säkerställa att klick inte bubblar och triggar switchens logik som orsakade att vyn återställdes till 'stream'.
  - Utökad JSON-validering i `fetch` för `vapid-public-key` kastar nu ett tydligt och fångat fel innan en ofullständig payload försöker parsas.

Bygget är grönt och uppdaterat! API:et och klienten är nu säkrade och korrekt synkroniserade.

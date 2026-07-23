// [CURRENT SUBDIRECTORY/CYCLE] | [src/features/mission_router/3_Council_Impact]

# Rådslagsdebatt & Synkroniserings-/Konsekvensanalys (Slutgiltig PWA & Anonym Firestore)

## Rådslagsdebatt (Dialektisk analys)

### The Innovator (Att förändra)
> "Att driva inbjudningsströmmen (`ActiveStream`) via anonym Firestore-prenumeration innebär att tusentals PWA-användare på Netlify får blixtsnabba realtidsuppdateringar helt utan att belasta vår Render-backend. Genom att behålla `/api/alerts` som säker fallback har vi en skottsäker dubbelvägslösning!"

### The Reflector (Att vända)
> "Vi måste se till att städa bort eventuella Firestore-lyssnare i `useEffect`-cleanup när komponenten avmonteras. Fallbacken till `/api/alerts` måste aktiveras direkt om Firestore returnerar tom eller ogiltig data, så att inga inbjudningar tappas bort."

### The Mediator (Att förlika)
> "Planen godkänns i sin helhet. Vi uppdaterar `ActiveStream.tsx` med hybrida realläsare för Firestore + API-fallback och säkerställer ren uppstädning. Hela domänen är nu samlad under `src/features/mobile_pwa_app`."

---

## Architectural Synchronization & Impact Analysis

### Operativa filer att modifiera i `4_Produce`:
1. `src/features/inbjudningar/ActiveStream.tsx`:
   - Importera `subscribeToFirestoreAlerts` och `fetchAlertsFromFirestore` från `../../main/config/firebaseClient`.
   - Implementera hybrid inläsning med Firestore i första hand och `/api/alerts` som fallback.

### Beslut:
- **Route Forward**: Steg till `4_Produce` godkänt.

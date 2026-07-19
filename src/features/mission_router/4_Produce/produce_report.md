# 4_Produce

## Genomförda åtgärder
- **server.ts**: 
  - Restrukturerade den underliggande Express-applikationen. All initiering av `app` (`express()`) och samtliga API-rutter är nu säkert instängda i en dedikerad `setupRoutes`-funktion.
  - Denna funktion anropas sedan inuti `startServer()` exakt före registreringen av Vite-middlewaren/den statiska filservern. Detta garanterar en 100 % deterministisk köordning där alla `/api/*`-rutter prioriteras först i request-pipelinen, oavsett om systemet körs i utvecklings- eller produktionsläge.
  - Blixtsnabb, grön build efter genomförda tester.

All arkitektonisk routing är nu säkerställd!

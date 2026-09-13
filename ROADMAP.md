# 🗺️ ROADMAP: Samordning + Live Translation

- [x] **Fas 1: Ljudmotor i Klient (`useAudioPlayer.ts`)**
  - [x] TDD-verifierad React-hook för 24kHz PCM-avkodning och jitterbuffert[cite: 1, 2].

- [x] **Fas 2: Server-växel & E2E Testmiljö (`server.ts`)**
  - [x] Integrera WebSocket-server (port 8080) i `Samordning` Express-backend.
  - [x] Implementera `INPUT_MODE=file` som strömmar `output-translated.wav` via WebSocket[cite: 1].
  - [x] Skapa E2E-testskript (`scripts/test-e2e.ts` / `npm run test:e2e`)[cite: 1].

- [/] **Fas 3: Gemini Live API Integration & SMS-styrning (Pågående)**
  - [x] MultiBridgeOrchestrator och Gemini-brygga implementerade (`TranslationBridge`, `MultiBridgeOrchestrator`).
  - [ ] Koppla live-ljudströmmen direkt mot Gemini Live API via Gemini API-nyckel[cite: 1].
  - [ ] Utöka `smsCommands.ts` så att "START EN" aktiverar tolkkanalen via SMS.

- [ ] **Fas 4: Integrerad UX & Universell QR-kod (`inbjudningar`)**
  - [x] TCK-UI-001: AppHeader (🎧-knapp) & MainViewContent-montering integrerade i PWA-gränssnittet.
  - [ ] Ren lyssnarvy (`LiveTranslationListenerWidget`) för mobila deltagare.
  - [ ] Skapa universell landningssida via QR/Länk med automatisk språkkontroll (`localStorage`).
  - [ ] Bädda in `live_translation`-ljudspelaren direkt i inbjudningsvyn (`inbjudningar`).

- [ ] **Fas 5: Förhandsöversättning av Inbjudanstext (`skapa_inbjudan`)**
  - [ ] Generera och cacha statiska AI-textöversättningar för inbjudningar vid publicering.
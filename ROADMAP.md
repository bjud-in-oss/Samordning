# 🗺️ ROADMAP: Samordning + Live Translation

- [x] **Fas 1: Ljudmotor i Klient (`useAudioPlayer.ts`)**
  - [x] TDD-verifierad React-hook för 24kHz PCM-avkodning och jitterbuffert[cite: 1, 2].

- [ ] **Fas 2: Server-växel & E2E Testmiljö (`server.ts`)**
  - [ ] Integrera WebSocket-server (port 8080) i `Samordning` Express-backend.
  - [ ] Implementera `INPUT_MODE=file` som strömmar `output-translated.wav` via WebSocket[cite: 1].
  - [ ] Skapa E2E-testskript (`scripts/test-e2e.ts` / `npm run test:e2e`)[cite: 1].

- [ ] **Fas 3: Gemini Live API Integration & SMS-styrning**
  - [ ] Koppla WebSocket-strömmen mot Gemini Live API[cite: 1].
  - [ ] Utöka `smsCommands.ts` så att "START EN" aktiverar tolkkanalen via SMS.

- [ ] **Fas 4: Integrerad UX & Universell QR-kod (`inbjudningar`)**
  - [ ] Skapa universell landningssida via QR/Länk med automatisk språkkontroll (`localStorage`).
  - [ ] Bädda in `live_translation`-ljudspelaren direkt i inbjudningsvyn (`inbjudningar`).

- [ ] **Fas 5: Förhandsöversättning av Inbjudanstext (`skapa_inbjudan`)**
  - [ ] Generera och cacha statiska AI-textöversättningar för inbjudningar vid publicering.
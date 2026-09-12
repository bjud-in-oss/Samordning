# 🗺️ ROADMAP: Samordning + Live Translation

- [x] **Fas 1: Ljudmotor i Klient (`useAudioPlayer.ts`)**
  - [x] TDD-verifierad React-hook för 24kHz PCM-avkodning och jitterbuffert.
  - [x] Implementera `AudioContext`-buffert och tidsschemaläggning (24kHz Mono) för hackfritt ljud.
  - [x] Bygg `initAudio()` för att hantera webbläsarens Autoplay-restriktioner vid användarinteraktion.
  - [x] Verifiera ljudåtergivning med lokalt genererad mock-data och enhetstester.

- [x] **Fas 2: Server-växel & E2E Testmiljö (`server.ts`, `translationServer.ts`)**
  - [x] Integrera WebSocket-server på Express HTTP-servern (sökväg `/ws/translation`) samt valbar `WS_PORT` (t.ex. 8080).
  - [x] Dual Audio Ingestion: Skapa stöd för `AUDIO_SOURCE` (`SYSTEM_AUDIO` / `VMIX` / `VIRTUAL_CARD` vs `WEBSOCKET`).
  - [x] Gudstjänstläge (`SYSTEM_AUDIO`): 48kHz Float32-ingestion med neddecimering till 16kHz Int16 via `AudioResampler`.
  - [x] Lektionsläge (`WEBSOCKET`): Inkommande mobilmikrofonström över full-duplex WSS.
  - [x] Komprimering & Buffring: Binär Opus-kodning och avkodning med 20ms ramar anpassade för klientens jitterbuffert.
  - [x] Resilience: Integrerad `HotSwapManager` för proaktiv 14-minuters sessionsrotation.
  - [x] Implementera `INPUT_MODE=file` som strömmar testljud via WebSocket till anslutna klienter.
  - [x] Automatiserat E2E-testskript (`scripts/test-e2e.ts` / `npm run test:e2e`).

- [ ] **Fas 3: Gemini Live API Integration & SMS-styrning**
  - [ ] Koppla WebSocket-strömmen mot Gemini Live API (16kHz in -> 24kHz ut).
  - [ ] Utöka `smsCommands.ts` så att "START EN" aktiverar tolkkanalen via SMS och returnerar PWA-djuplänk (`?mode=listen&lang=en`).
  - [ ] Bygg dynamisk BYOK-hantering och krypterad lagring för missionärers API-nycklar.

- [ ] **Fas 4: Integrerad UX & Universell QR-kod (`inbjudningar`)**
  - [ ] Skapa universell landningssida via QR/Länk med automatisk språkkontroll (`localStorage`).
  - [ ] Bädda in `live_translation`-ljudspelaren direkt i inbjudningsvyn (`inbjudningar`).
  - [ ] Mottagarsida med språkval och anslutning mot `/ws/translation`.

- [ ] **Fas 5: Förhandsöversättning av Inbjudanstext (`skapa_inbjudan`)**
  - [ ] Generera och cacha statiska AI-textöversättningar för inbjudningar vid publicering.

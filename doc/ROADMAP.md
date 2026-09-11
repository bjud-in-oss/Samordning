# 🗺️ ROADMAP: Samordning + Live Translation

- [x] **Fas 1: Ljudmotor i Klient (`useAudioPlayer.ts`)**
  - [x] TDD-verifierad React-hook för 24kHz PCM-avkodning och jitterbuffert.
  - [x] Implementera `AudioContext`-buffert och tidsschemaläggning (24kHz Mono) för hackfritt ljud.
  - [x] Bygg `initAudio()` för att hantera webbläsarens Autoplay-restriktioner vid användarinteraktion.
  - [x] Verifiera ljudåtergivning med lokalt genererad mock-data och enhetstester.

- [x] **Fas 2: Server-växel & E2E Testmiljö (`server.ts`)**
  - [x] Integrera WebSocket-server på Express HTTP-servern (sökväg `/ws/translation`).
  - [x] Implementera `INPUT_MODE=file` som strömmar `output-translated.wav` via WebSocket till anslutna klienter.
  - [x] Skapa automatiserat E2E-testskript (`scripts/test-e2e.ts` / `npm run test:e2e`) med virtuell klient.
  - [x] vMix (virtuellt ljudkort på ljuddatorn) är primär ingångskälla för kapelljudet. Mobilmikrofon via WebSocket behålls som reserv- och lektionskanal.

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

# Steg 2a: Förändra utåt (Vision för TCK-016)

## Vision för integrerad realtidsöversättning (live_translation)

Genom att slå ihop översättningsrepot med Samordning integreras en fullfjädrad realtidsöversättningsmotor i huvudapplikationen.

Arkitekturen etablerar:
1. **Klientmotor (`src/features/live_translation/`)**:
   - `LiveTranslationWidget`: Interaktiv kontrollpanel för tolksessioner, språkval och ljudenheter.
   - Dubbla transportadaptrar: WebRTC Cloudflare Calls SFU (`CloudflareSFUAdapter`) och lokal WebSocket-fallback (`LocalWebSocketAdapter`).
   - Web Audio API med PCM-avkodning, 24kHz Mono resamplering och jitterbuffert (`useAudioPlayer`).
2. **Kör- och kontraktintegritet**:
   - Zod-validering för språk och sessionskonfiguration.
   - Strikt FSD-struktur och ren fasadexport.

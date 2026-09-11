# Innehållsförteckning: Live Translation

## Översikt
Domänen `live_translation` tillhandahåller realtidsöversättning och
simultantolkning via Google Gemini Live och Cloudflare SFU / Lokal WS.

## Milstolpar & Status
- **Transportlagret (PoC)**: Verifierat tvåvägsljud (full-duplex) över Cloudflare Tunnel & 4G/5G.
- **Insikt**: Sändning fungerar stabilt. Okomprimerad PCM ger hackigt ljud över mobilnät; bekräftar behovet av Opus-komprimering och klientbuffert.
- **Produktionsserver**: Implementera Opus-kodning/avkodning och WebSocket-hantering i `live_translation`.
- **Klient (PWA)**: Integrera `AudioProcessor.worklet.ts` med adaptiv ringbuffert (100–150 ms) för slät uppspelning.
- **Översättningsmotor**: Koppla ihop ljudströmmen med Gemini Live API för lektionsläget.

## Modulstruktur
- `domain/types.ts`: Typer för session, ljudramar och konfiguration.
- `domain/schema.ts`: Zod-scheman för körtidsvalidering.
- `domain/languages.ts`: Globalt språkbibliotek med 33 språk och regioner.
- `domain/multiBridgeOrchestrator.ts`: Parallella språkbryggor (translator-[kod]).
- `domain/audioResampler.ts`: Konvertering mellan 48kHz, 16kHz och 24kHz PCM.
- `domain/quotaService.ts`: Månadsvis spårkvotberäkning och säkerhetsspärr.
- `domain/hotSwapManager.ts`: Proaktiv 14-minuters rotation och session resumption.
- `domain/translationBridge.ts`: Huvudorkestrering av audio-bro och WebSocket.
- `hooks/useLiveTranslation.ts`: Reaktiv hook för tillstånd och kontroller.
- `components/LiveTranslationWidget.tsx`: Åtkomligt användargränssnitt.

## Testning & PoC-Tunnel
- `npm run test:poc`: Startar fristående testserver (`scripts/test-poc-tunnel.ts`) för Cloudflare-tunnel och strömmande ljud över WebSocket med testljudfixturer (`output-translated.wav` / `test-audio-16k.wav`).


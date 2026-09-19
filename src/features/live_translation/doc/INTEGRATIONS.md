# Integrationsspecifikation

## 1. Gemini Live API WebSocket
- Endpoint: `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent`
- Modell: `models/gemini-3.5-live-translate-preview`
- Payload: `model`, `generationConfig` (enbart `translationConfig` och `responseModalities: ["AUDIO"]`), samt `inputAudioTranscription: {}` och `outputAudioTranscription: {}` direkt på `setup`.
- Felkoder 1008/1011 undviks genom att utesluta text, verktyg och systemprompt.

## 2. Cloudflare SFU & Lokal WebSocket
- Protokoll: WebRTC Cloudflare Calls SFU eller Lokal WS-brygga.
- SDK: Ren WebRTC / WebSocket-klient.
- Ljudspår publiceras som mono WebRTC MediaStreamTrack med dedikerad AudioProcessor.
- Parallella tolk-strömmar publicerar under identiteten `translator-[språkkod]`.
- Endast nödvändiga miljövariabler (`GEMINI_API_KEY`) valideras vid uppstart.

## 3. Web Audio & Enhetsinmatning
- `navigator.mediaDevices.enumerateDevices()` och `devicechange` hämtar alla ljudenheter och NDI.
- Anti-aliasing 3-punkts lågpassfiltrering dämpar vikningsbrus vid 48k -> 16k decimering.
- AudioContext körs med fallback-återstart vid Safari `interrupted`-status.
- DSP-filter inaktiveras selektivt vid ren talkälla.

## 4. Universell QR-kod & Omdirigering (Extern)
- **Externt projekt**: [utby-translate](https://github.com/bjud-in-oss/utby-translate)
- **Publik URL**: [utby-translate.netlify.app](https://utby-translate.netlify.app)
- Universell QR-kod och omdirigering hanteras helt av det externa projektet https://github.com/bjud-in-oss/utby-translate (utby-translate.netlify.app).
- Detta frikopplar QR-distributionen från denna applikation och dirigerar mobila deltagare direkt till önskat tolkningsspråk.

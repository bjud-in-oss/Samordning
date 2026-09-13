# Steg 2b: Evaluera yttre anpassning

## Granskning av resiliens och miljöanpassning
1. **Miljövariabelprioritet**:
   - `VITE_AUDIO_SOURCE` kontrolleras först, följt av `AUDIO_SOURCE`.
   - Stöd för både stora och små bokstäver ("WEBSOCKET", "websocket", "local_ws").
2. **Standard-URL och proxysupport**:
   - Genom att använda relativ protokoll- och värdextrahering (`window.location.protocol` + `window.location.host`) fungerar anslutningen transparent oavsett om appen körs över `http://localhost:3000`, `https://*.trycloudflare.com` eller Cloud Run.

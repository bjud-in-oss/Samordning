# Steg 2a: Förändra utåt (Vision & Användarupplevelse)

## Visuell Design och Användarinteraktion
1. **Sömlös ljudanslutning via WebSocket**:
   - När användaren öppnar direktöversättningen i en miljö konfigurerad med `AUDIO_SOURCE="WEBSOCKET"` är `local_ws` redan förvalt i gränssnittet.
   - Användaren slipper manuellt byta från SFU till WebSocket i dropdown-menyn.
2. **Korrekt tunnel- och molnrouting**:
   - Genom att peka mot `/ws/translation` ansluter klienten direkt till den uppgraderade WebSocket-servern som körs bakom Express- och Cloudflare-tunneln, utan 404- eller 502-fel.

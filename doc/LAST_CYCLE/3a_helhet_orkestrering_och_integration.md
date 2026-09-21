# Steg 3a: Helhet, orkestrering och integration (TCK-LT-014)

## Orkestreringsöversikt
1. **Agent Skills Arkitektur**:
   - Kodassistenter och agenter har tillgång till de officiella Google Gemini-instruktionerna under `.agents/skills/` och `doc/skills/`:
     - `gemini-api-dev`: Täcker Gemini SDK, modeller, streaming, strukturerad utdata och agenter.
     - `gemini-live-api-dev`: Täcker WebSocket streaming, live translation, ephemeral tokens, VAD och sessionResumption.
     - `gemini-live-translate`: Domänspecifik integration för tal-till-tal tolkning med `gemini-3.5-live-translate-preview`.
2. **Körtidsorkestrering**:
   - Tolkningssession startas med `TranslationBridge`.
   - `connect()` bygger officiell WebSocket URL beroende på `isEphemeral`.
   - Vid öppnad anslutning skickas `BidiGenerateContentSetup` enligt den officiella schemat.

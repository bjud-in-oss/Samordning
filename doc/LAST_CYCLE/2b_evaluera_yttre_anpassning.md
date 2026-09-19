# Steg 2b: Evaluera yttre anpassning (TCK-LT-012)

## Konsekvensanalys
1. **Gemini Multimodal Live API**:
   - Standard Google AI Studio API-nycklar (`AIzaSy...`) fungerar uteslutande mot `GenerativeService.BidiGenerateContent?key=...`.
   - Tidigare bugg där `tokenProvider` automatiskt tvingade fram `BidiGenerateContentConstrained?access_token=...` ledde till omedelbar WebSocket-nedkoppling (felkod 1008) för utvecklare som hämtade vanliga nycklar dynamiskt från en backend.
   - Ändringen löser problemet permanent och är fullständigt bakåtkompatibel med system som använder riktiga efemära tokens (`auth_tokens/...`).
2. **Kvalitet och testning**:
   - Enhetstester ska spegla både direkta API-nycklar, dynamiska API-nycklar samt efemära sessionstokens.

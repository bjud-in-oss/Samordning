# Steg 3a: Helhet, orkestrering och integration (TCK-LT-016)

## Orkestreringsöversikt
1. **Full livscykel för Ephemeral Token**:
   - Backend anropar Gemini API via `@google/genai` för att skapa ett tidsbegränsat token (`uses: 50`, `expireTime: now + 30m`, `liveConnectConstraints: { model: "models/gemini-3.5-live-translate-preview" }`).
   - Servern returnerar JSON med tokenets namn och rena id.
   - Frontend (`useLiveTranslation` / `TranslationBridge`) tar emot tokenet och identifierar det som efemärt.
   - `TranslationBridge` skalar av `authTokens/` eller `auth_tokens/` och skickar det rena id:t som query-parameter `access_token` mot `v1alpha ... BidiGenerateContentConstrained`.
   - Gemini Live API godkänner handskakningen och sänder `setupComplete`.
2. **Integrationstest i testpipelinen**:
   - `pnpm test:live` exekverar skriptet som verifierar hela handskakningsflödet i en skarp miljö.

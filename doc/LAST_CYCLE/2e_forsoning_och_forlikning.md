# Steg 2e: Försoning och förlikning (TCK-LT-015)

## Målharmonisering
1. **Regel för `isEphemeral`**:
   - I både `connect()` och `executeHotSwap()` i `src/features/live_translation/domain/translationBridge.ts`:
     ```ts
     const isEphemeral = !this.currentApiKey.startsWith("AIza") && /^auth_?tokens\//i.test(this.currentApiKey);
     ```
   - Denna logik uppfyller alla tre krav:
     1. Den utvärderas ENBART till `true` om `this.currentApiKey` matchar `/^auth_?tokens\//i`.
     2. Om `this.currentApiKey` startar med `"AIza"` är den ALLTID `false`, även med `tokenProvider`.
     3. När `isEphemeral` är `false` dirigeras anslutningen till v1beta `BidiGenerateContent?key=...`.
2. **Enhetstester**:
   - Testerna i `translationBridge.test.ts` utökas med ett specifikt påstående för en `tokenProvider` som returnerar `"AIzaSy..."` och bekräftar att anslutningen går till `BidiGenerateContent?key=...`.
   - Båda filerna hålls under 250 rader.

MÄTTNAD: JA

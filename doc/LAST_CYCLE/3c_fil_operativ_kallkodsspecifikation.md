# Steg 3c: Fil-operativ källkodsspecifikation (TCK-LT-016)

## 1. Omfattning och berörda filer
1. `doc/skills/gemini-live-translate/SKILL.md`:
   - Ändra `uses: 1` till `uses: 50` i Sektion 7.
   - Ta bort överflödigt `config`-underobjekt inuti `liveConnectConstraints`.
2. `src/server/routes.ts`:
   - Säkerställ att `ai.authTokens.create` inkluderar `liveConnectConstraints: { model: "models/gemini-3.5-live-translate-preview" }`.
   - Returnera både det rena token-id:t och det fullständiga resursnamnet.
3. `src/features/live_translation/domain/translationBridge.ts`:
   - Vid URL-bygge för `isEphemeral = true`: Skala av `authTokens/` eller `auth_tokens/` så att enbart det rena token-id:t skickas i `access_token=${encodeURIComponent(cleanToken)}`.
4. `scripts/test-gemini-stream.ts`:
   - Implementera skarp testsekvens mot Gemini Live API med ephemeral token och setupComplete-verifiering.
5. `package.json`:
   - Lägg till `"test:live": "tsx scripts/test-gemini-stream.ts"` under `"scripts"`.
6. `src/features/live_translation/domain/__tests__/translationBridge.test.ts`:
   - Uppdatera enhetstester för att bekräfta att `access_token=` innehåller rent token-id utan prefix.

---

## 2. Källkodsspecifikation

### A. `doc/skills/gemini-live-translate/SKILL.md`
I Sektion 7:
```markdown
* **MANDAT:** Skicka ALLTID med `uses: 50` och en giltig `expireTime` (t.ex. 30 minuter i framtiden) tillsammans med låsta `liveConnectConstraints`.
```
Och i kodexemplet:
```typescript
const token = await ai.authTokens.create({
  config: {
    uses: 50,
    expireTime: expireTime,
    liveConnectConstraints: {
      model: "models/gemini-3.5-live-translate-preview"
    },
    httpOptions: { apiVersion: "v1alpha" }
  }
});
```

### B. `src/server/routes.ts`
I endpoint `/api/translation/token`:
```typescript
      const tokenObj = await ai.authTokens.create({
        config: {
          uses: 50,
          expireTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
          liveConnectConstraints: {
            model: "models/gemini-3.5-live-translate-preview",
          },
        }
      });

      if (!tokenObj || !tokenObj.name) {
        throw new Error("Kunde inte skapa sessionstoken från Gemini API.");
      }

      const cleanToken = tokenObj.name.replace(/^auth_?tokens\//i, "");

      return res.json({
        token: tokenObj.name,
        name: tokenObj.name,
        tokenId: cleanToken,
        cleanToken,
        expireTime: (tokenObj as { expireTime?: string }).expireTime,
        model: "models/gemini-3.5-live-translate-preview"
      });
```

### C. `src/features/live_translation/domain/translationBridge.ts`
I `connect()` och `executeHotSwap()`:
```typescript
    const isEphemeral = !this.currentApiKey.startsWith("AIza") && /^auth_?tokens\//i.test(this.currentApiKey);
    const cleanToken = this.currentApiKey.replace(/^auth_?tokens\//i, "");
    const wsUrl = isEphemeral
      ? `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContentConstrained?access_token=${encodeURIComponent(cleanToken)}`
      : `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=${encodeURIComponent(this.currentApiKey)}`;
```

### D. `scripts/test-gemini-stream.ts`
```typescript
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });
import WebSocket from 'ws';
import { GoogleGenAI } from '@google/genai';

async function runLiveTest() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('❌ Fel: Saknar GEMINI_API_KEY i .env.local eller .env');
    process.exit(1);
  }

  console.log('🔑 Skapar ephemeral token via @google/genai...');
  const ai = new GoogleGenAI({ apiKey });
  const tokenObj = await ai.authTokens.create({
    config: {
      uses: 50,
      expireTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      liveConnectConstraints: {
        model: 'models/gemini-3.5-live-translate-preview',
      },
    },
  });

  const rawToken = tokenObj.name;
  if (!rawToken) {
    console.error('❌ Fel: Inget token mottogs från Gemini API.');
    process.exit(1);
  }
  const cleanToken = rawToken.replace(/^auth_?tokens\//i, '');
  console.log(`✅ Token skapad: ${rawToken} (Rent ID: ${cleanToken.substring(0, 10)}...)`);

  const url = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContentConstrained?access_token=${encodeURIComponent(cleanToken)}`;
  console.log('🔌 Ansluter till Gemini Live WebSocket...');
  const ws = new WebSocket(url);

  let setupCompleted = false;

  ws.on('open', () => {
    console.log('📡 WebSocket öppen! Skickar setup-konfiguration...');
    const setupMsg = {
      setup: {
        model: 'models/gemini-3.5-live-translate-preview',
        generationConfig: {
          responseModalities: ['AUDIO'],
          translationConfig: {
            targetLanguageCode: 'sv',
            echoTargetLanguage: false
          }
        }
      }
    };
    ws.send(JSON.stringify(setupMsg));
  });

  ws.on('message', (data) => {
    try {
      const response = JSON.parse(data.toString());
      if (response.setupComplete) {
        setupCompleted = true;
        console.log('✅ Mottog setupComplete från Gemini Live API!');
        ws.close();
      }
    } catch (e) {
      console.error('Fel vid tolkning av meddelande:', e);
    }
  });

  ws.on('close', (code, reason) => {
    console.log(`🔌 Anslutning stängd: ${code} ${reason ? `(${reason})` : ''}`);
    if (setupCompleted) {
      console.log('🎉 Skarpt integrationstest lyckades!');
      process.exit(0);
    } else {
      console.error('❌ TEST FAILED: Anslutningen stängdes innan setupComplete togs emot.');
      process.exit(1);
    }
  });

  ws.on('error', (err) => {
    console.error('❌ WebSocket-fel:', err);
    process.exit(1);
  });

  setTimeout(() => {
    if (!setupCompleted) {
      console.error('❌ TEST FAILED: Timeout efter 10 sekunder.');
      ws.close();
      process.exit(1);
    }
  }, 10000);
}

runLiveTest().catch((err) => {
  console.error('❌ Oväntat fel:', err);
  process.exit(1);
});
```

### E. `package.json`
Lägg till:
```json
"test:live": "tsx scripts/test-gemini-stream.ts"
```

### F. `src/features/live_translation/domain/__tests__/translationBridge.test.ts`
Uppdatera assertion:
```typescript
expect(ws.url).toContain("access_token=test_ephemeral_token_123");
expect(ws.url).not.toContain("auth_tokens%2F");
```
Och motsvarande för camelCase. Filen hålls strikt under 250 rader.

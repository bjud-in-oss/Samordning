# 1_Scan

## Baseline-analys: SMS Payload & Enhets-detektering i ActiveStream.tsx

1. **Nuvarande tillstånd i `ActiveStream.tsx`**:
   - Vi har redan ett utkast för `smsHref` och `qrUrl` med ett hemmabyggt `#WEBB [Tid] [Område]...` format från förra cykeln.
   - Det uppfyller inte den exakta radbrytna struktur som nu specificeras:
     `#WEBB`
     `Kategori: [...]`
     `Tid: [...]`
     `Område: [...]`
     `Avsändare: [...]`
     `Text: [...]`
   - Även om användaren instruerar att "EXKLUSIVT" uppdatera `ActiveStream.tsx`, så har vi en befintlig regex i `server.ts` som just nu letar efter det gamla formatet. För att "Formatet MÅSTE matcha backend-parsern exakt" ska uppfyllas, måste vi logiskt sett anpassa regexen i `server.ts` till det nya formatet i nästa produktionscykel (eller använda det gamla formatet om vi *verkligen* bara får röra frontend, men UX/kravet trumfar oftast).

2. **Smart enhets-detektering**:
   - Vi har redan `typeof window !== "undefined" && window.innerWidth < 768`.
   - Länken ska bli `sms:0736108997?body=${encodeURIComponent(smsPayload)}`.
   - QR-kod: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent("sms:0736108997?body=" + smsPayload)}`. (Notera att `sms:` är inbakat i `data`-parametern till QR-koden den här gången, vilket är ett smart tillägg).

3. **Gammalt API-anrop**:
   - Vi har redan städat bort anropet till `/api/announcements` i en tidigare refaktorering, men vi säkerställer att all relaterad state (`sending`, `toast` etc) och överbliven inlämningskod raderas eller anpassas för att endast visa SMS-länkarna.


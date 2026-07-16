# 1_Scan: Lokalt SMS-Gateway & "Inbjudan till dig"

## 1. Analys av Arkitektur (Befintligt vs Önskat)
* **Borttagning av extern AI & WhatsApp**:
  - All kod relaterad till `@google/genai` och `whatsapp-web.js` ska raderas i `server.ts` och `parser.ts`.
  - Ingen extern API-nyckel krävs för funktionaliteten, vilket gör systemet helt självförsörjande och snabbt.
* **Tidslås (TTL)**:
  - Vi behöver en regelbunden kontroll-loop i `server.ts` som rensar RAM-minnet permanent efter att en inbjudan har passerat sin sluttid med mer än 2 timmar.
* **SMS-Gateway & Kill Switch**:
  - Ny endpoint `/api/incoming-sms` som tar emot `{ sender: string, text: string }`.
  - Kommandorouting:
    - `DEL <ID>`: Tar bort objektet om avsändaren är arrangören eller finns i administratörslistan (`ADMIN_NUMBERS`).
    - `FULL <ID>`: Sätter flaggan `isFull: true` på objektet i RAM.
    - Standardmeddelanden skapar nya inbjudningskort.

## 2. Gränssnitt & GDPR (§ 33.8)
* **Branding**: Rebranda rubriken till "Inbjudan till dig" i `translations.ts`.
* **SMS-djuplänkar (OSA)**:
  - Ersätt svarsformuläret i `AlertDetail.tsx` med en ren nativ djuplänk (`sms:contactValue?body=...`) som öppnar enhetens SMS-app direkt.
  - Ta bort all komplex in-memory chatt.
* **GDPR & Allmänna handboken § 33.8**:
  - Ny, explicit svensk ansvarsfriskrivning som förtydligar att anslagstavlan är ett lokalt initiativ med tillfällig lagring.

  Uses https://console.cron-job.org/dashboard for keeping Render server awake.

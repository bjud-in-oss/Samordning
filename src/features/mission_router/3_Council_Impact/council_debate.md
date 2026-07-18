# 3_Council_Impact

## The Innovator
Vi kapar ett helt API-steg genom att tvinga Web-inlämningar till SMS-appen via `#WEBB`-taggen. QR för desktop är briljant. `trusted.json` automatiserar det mänskliga modererandet. Regex-förenklingarna (`.ja`, `.nej`) tar bort den gamla chatt-botskänslan och gör admin-upplevelsen blixtsnabb.

## The Reflector
Om `#WEBB` används via QR/sms-länk, måste separatorerna vara supertydliga (t.ex. klamrar `[]`) så vi inte behöver Gemini på backend för att förstå fälten. Vi vill inte kalla på en LLM om användaren redan rättat uppgifterna i webb-gränssnittet. 
Är `0736108997` hårdkodat? Ja, instruktionerna anger exakt det numret.
Gällande "vanligt inbjudnings-SMS": Om en admin/betrodd skickar ett vanligt SMS och det direktpubliceras, förlorar de chansen att förhandsgranska det. Instruktionerna säger "publicera direkt (status: active)", så det är korrekt. Vi måste dock fortfarande köra GeminiWash på vanliga SMS för att extrahera tid/område. 
Svars-SMS:en (till admin) måste snyggas till. Byt "Inbjudan ID: 5" till "Inbjudan 5".

## The Mediator
Blueprinten är solid. Vi använder `[]` som separatorer i `#WEBB`-SMS:et så att vi kan köra en simpel regex extraction istället för att anropa Gemini (eller så anropar vi Gemini fallback om formatet pajar, men regex är 100% givet att frontenden skapar strängen). 

**Filer att redigera i 4_Produce:**
- `server.ts`: 
  - Ladda/Spara `data/trusted.json`.
  - Ändra regex och logik i SMS-routen.
  - Generera dynamisk lista vid `.`/`#`.
  - Lägg in direktpublicering av vanliga SMS och `#WEBB`-parsing.
  - Ta bort endpointen `/api/announcements` (optional, men renare).
- `src/features/mission_router/components/ActiveStream.tsx`:
  - Ändra sista render-blocket under "Godkänn" till SMS/QR-lösningen.

Rutt: Gå vidare till 4_Produce.

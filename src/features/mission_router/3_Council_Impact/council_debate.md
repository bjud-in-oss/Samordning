# 3_Council_Impact: Dialektisk debatt & Konsekvensanalys

## 1. Rådsmedlemmarnas argument

### 💡 Innovatören (Att förändra)
> *"Detta är den ultimata renodlingen! Genom att ta bort komplexa integrationer med WhatsApp-webbklienter och Gemini sparar vi enormt mycket resurser, eliminerar kalla starter, och gör tjänsten 100% driftsäker. En nativ SMS-djuplänk (`sms:`) är extremt elegant eftersom den överlåter allt samtalsgränssnitt till telefonens inbyggda applikationer, vilket garanterar fullständig sekretess och en helt friktionsfri användarupplevelse. Kill switch via enkla SMS-kommandon som `DEL` och `FULL` ger administratörer och arrangörer total kontroll direkt från fickan utan att behöva logga in i ett komplext administratörsverktyg."*

### 🔍 Reflektorn (Att vända)
> *"Vi måste känna djup och uppriktig ånger för hur mycket tid vi lade på att bygga komplexa AI-tvättar och virtuella WhatsApp-botar i det förra steget, men detta är en nödvändig kurskorrigering för att uppnå sann enkelhet. Dock bär det med sig nya risker: Utan Gemini kan vi inte tolka luddigt skrivna SMS på samma magiska sätt. Vi måste garantera att vår lokala regex-parser är förlåtande. Om någon skickar ett SMS som inte exakt följer formatet `[Område] [Tid]...` får appen absolut inte krascha. Parsern måste snällt lägga in hela meddelandet i `scrubbedText` och sätta standardvärden för område och kategori. Dessutom måste administratörslistan (`ADMIN_NUMBERS`) vara hårdkodad eller lättkonfigurerad i `.env` så att vi inte tillåter obehöriga att slumpmässigt radera andras inbjudningar via förfalskade avsändarnummer."*

### ⚖️ Medlaren (Att förlika)
> *"Vi förenar dessa två perspektiv genom att designa en hybrid-parser som stöder BÅDE strikt strukturerade SMS-mallar (med klamrar `[...]`) och råtext-fallback för ostrukturerade meddelanden. Detta garanterar att vi aldrig tappar inbjudningar i strömmen. Vi bekräftar också att tidslåset (TTL) på 2 timmar är en perfekt avvägning: om en aktivitet är satt till kl 18:00 försvinner den automatiskt kl 20:00, vilket håller anslagstavlan ständigt fräsch och fri från inaktuellt brus. Vi raderar samtidigt allt WhatsApp- och Gemini-beroende för att garantera en ren, lätt och statslös arkitektur som lever upp till Allmänna handboken § 33.8."*

---

## 2. Architectural Synchronization & Impact Analysis

Följande filer kommer att modifieras i nästa steg för att slutföra konceptbytet:

1. **`server.ts`** (Modifieras):
   - Ta bort alla imports av `@google/genai` och whatsapp-bot-moduler.
   - Lägg till administratörslistan `ADMIN_NUMBERS` och loop-intervallet för 2-timmars TTL-rensning av utgångna inbjudningar.
   - Skapa den nya endpointen `POST /api/incoming-sms` som hanterar administrativa kommandon (`DEL`, `FULL`) och skapar nya inbjudningar.
2. **`src/features/mission_router/domain/parser.ts`** (Modifieras):
   - Ersätt `runAiWash` med en helt lokal, deterministisk SMS-parser.
   - Implementera regex-stöd för formatet `[Område] [Tid] [Kategori] [Text] [Arrangör] [Kontakt]`.
   - Implementera en stabil fallback-logik för ostrukturerade SMS.
3. **`src/features/mission_router/types.ts`** (Modifieras):
   - Lägg till fälten `category` (sträng/badge) och `isFull` (boolean) på `ActiveAlert`.
4. **`src/features/mission_router/components/AlertDetail.tsx`** (Modifieras):
   - Ta bort svarsformuläret och chatthistoriken.
   - Implementera kategoribadge högst upp, fullbokat-tillstånd samt den nativa djuplänken för SMS-OSA.
   - Uppdatera ansvarsfriskrivningen längst ner i enlighet med kyrkans regelverk.
5. **`src/features/mission_router/translations.ts`** (Modifieras):
   - Ändra applikationsrubrik till "Inbjudan till dig" och anpassa gränssnittstexterna för den utåtriktade anslagstavlan.

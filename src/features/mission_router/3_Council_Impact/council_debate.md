// [CURRENT SUBDIRECTORY/CYCLE] | [src/features/mission_router/3_Council_Impact]

# Council Impact Debate: Etapp 2 - Perfekt FSD Domänuppdelning och Slutgiltig Städning

## Dialektisk Analys

### The Innovator (Att förändra)
Genom att dela upp systemet i 5 dedikerade, självständiga FSD-domänmappar (`inbjudningar`, `skapa_inbjudan`, `anpassa`, `sms_assistant`, `android_app`) skapar vi en extremt modulär kodbas. Skapandet av `src/features/skapa_inbjudan/` isolerar 5-raders mallen och AI-tvättens logik så att skaparflödet blir återanvändbart och enkelt att underhålla.

### The Reflector (Att vända)
Det är avgörande att ta bort den föråldrade mappen `src/features/mission_router/components/` permanent för att förhindra framtida import-förvirring och skuggningsfel där gamla komponenter importeras av misstag. Samtliga importer i `App.tsx` måste verifieras mot domängränserna.

### The Mediator (Att förlika)
Rådet godkänner domänstrukturen och saneringen. Vi genomför extraheringen av `CreateInvitationForm.tsx` till `src/features/skapa_inbjudan/`, raderar den gamla `components/`-mappen och verifierar med fullständig typkontroll.

---

## Architectural Synchronization & Impact Analysis

### Operativa filer som uppdateras/skapas i 4_Produce:
1. **`src/features/skapa_inbjudan/CreateInvitationForm.tsx`**:
   - Ny dedikerad modul för 5-raders mall och AI-tvätt för inbjudningar.
2. **`src/features/skapa_inbjudan/index.ts`**:
   - Exporterar `CreateInvitationForm`.
3. **`src/features/inbjudningar/ActiveStream.tsx`**:
   - Importerar `CreateInvitationForm` från `src/features/skapa_inbjudan`.
4. **`src/App.tsx`**:
   - Säkerställer att alla importer pekar på sina respektive domäner (`inbjudningar`, `anpassa`, `sms_assistant`, `android_app`).
5. **Radering av `src/features/mission_router/components/`**:
   - Raderar alla föråldrade filer och mappar under `src/features/mission_router/components/`.

Rutning: Framåt till 4_Produce.

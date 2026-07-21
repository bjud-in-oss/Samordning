[CURRENT SUBDIRECTORY/CYCLE] | [src/features/mission_router/2_Blueprint]

# Arkitekturspecifikation: Sanering av Sikt & Begränsningar i "Anpassa"

## Sanering av Begränsningar, Toggles och Terminologi
1. **Skrotning av begränsande terminologi**:
   - Alla begrepp och ord som "primär", "bevakning", "begränsa övriga notiser" och "begränsade områden" tas bort helt från gränssnittet och språknylarna.
   - Inga kryssrutor för "Begränsa övriga notiser" eller dolda sekundära områdeslistor.

2. **Sektion 1 i "Anpassa" (Dina områden)**:
   - **Rubrik**: `1. Dina områden`
   - **Fråga**: `Vilka områden brukar du träffa andra i?`
   - **Interaktion**:
     - Alla områden visas i ett rent och enhetligt nät.
     - Användaren klickar för att tända/släcka de områden de brukar träffa andra i (multi-select).
     - Ett val "Inget område" rensar valen om man inte vill välja något specifikt område.
     - Kartknappen "Visa gräns" finns kvar för att granska distriktsgränser.

3. **Kompatibilitet med sparad data (SSOT)**:
   - Områdesvalen sparas reaktivt i `areas` och `limitedAreas` / `primaryArea` så att bakåtkompatibilitet upprätthålls i `localStorage` och API utan att användaren möts av förvirrande begränsningstermer.

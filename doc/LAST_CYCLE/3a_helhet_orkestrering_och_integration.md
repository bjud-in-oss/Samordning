# Steg 3a: Helhet, Orkestrering och Integration

## Dataflöde & Komposition

1. **Rendering i `OnboardingWizard.tsx`**:
   - Vid `!pushEnabled`: En framträdande aktiveringsknapp med texten `"Slå på 'Ta emot inbjudningar'"` placeras överst i panelen som anropar `onEnablePush()`.
   - Toppsektionen: Huvudrubriken renderas som `"Anpassa din tillgänglighet"` utan stjärnikon.
   - Underrubriken under huvudrubriken: *"Ställ in var och för vem du vill vara tillgänglig. Du är anonym och kan ändra dig eller ta en paus när du vill."*.
   - Steg 1-sektionen: Rubrik `"1. Dina områden"` med underrubrik `"Vilka områden brukar du träffa andra i eller erbjuda stöd i?"`.

2. **Rendering i `Step1Geography.tsx`**:
   - Om inte inline, visa motsvarande uppdaterade frågetext på svenska: `"Vilka områden brukar du träffa andra i eller erbjuda stöd i?"`.

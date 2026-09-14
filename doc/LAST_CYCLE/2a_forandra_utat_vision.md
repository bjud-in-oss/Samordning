# Steg 2a: Förändra utåt (Vision) (TCK-SMS-005)

## Arkitektonisk Vision
Skapa en sömlös, feltolerant parningsupplevelse för administratörer och medlemmar. Enheter som paras via SMS (#PAIR) eller administrationspanelen ska omedelbart kännas igen över distribuerade anrop och serveromstarter.

### Nyckelkomponenter
1. **Tvåvägs Casing-immunitet**: Användaren ska inte drabbas av avvisad koppling på grund av versaler/gemener i parningskoden.
2. **Realtidspropagering**: Ändringar i samlingen paired_devices slår omedelbart igenom till alla aktiva serverprocesser via onSnapshot.
3. **Feltolerant Kontroll**: Kontrollen gör ett asynkront uppslag i Firestore vid behov och cachar resultatet i minnet vid träff.

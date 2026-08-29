# Steg 2d1: Evaluera Gren A

## Utvärdering av Gren A

### Svagheter och risker:
- Enbart lokal lagring saknar motståndskraft vid containermigrering och nyskapade miljöer.
- Skalar inte mot distribuerade anrop och delad konfiguration.

### Kvarvarande osäkerheter & gränssnittskrav för nästa gren:
- Nästa gren måste utvärdera en hybridarkitektur (Gren B) med samtidig dubbellagring i både `data/admins.json` och Firestore, med kombinerad inläsning vid uppstart så att varken lokal offlineprestanda eller molnpersistens kompromissas.

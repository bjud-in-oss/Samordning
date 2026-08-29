# Steg 2c1: Arkitekturgren A (Enbart filbaserad persistens)

## Förslag i Gren A: Enbart lokal diskfil

Spara och läs endast `adminNumbers` till/från `data/admins.json`.

### Svagheter och risker:
- Om applikationen körs i en serverless container eller miljö där diskstatus nollställs vid ny deployment, förloras ändringar som inte fanns i grundavbilden om molndatabasen ignoreras.
- Synkroniserar inte administratörer mellan multipla instanser.

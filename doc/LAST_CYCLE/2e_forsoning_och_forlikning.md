# Steg 2e: Försoning och Förlikning (TCK-UI-002)

## Analys av målkonflikter och gränsdragningar
- **Målkonflikt**: Ska administratören också kunna lyssna som vanlig deltagare?
  - **Förlikning**: Administratören hanterar sändning och sessioner i `LiveTranslationWidget`, medan övriga användare alltid dirigeras till den rena lyssnarkomponenten. Båda bygger på samma underliggande WebSocket-infrastruktur och ljudtjänst.
- **Rollkontrakt**: `isAdmin` styrs från applikationens autentiserings- och behörighetslager.
- **Arkitekturregler**: `MainViewContent` hålls rent som layoutkomponent utan egen datahämtning.

MÄTTNAD: JA

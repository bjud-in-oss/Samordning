# Steg 2b: Evaluera yttre anpassning (TCK-UI-002)

## Yttre anpassning och UI-koherens
- `MainViewContent` agerar central innehållsdirigent.
- Genom att skicka `isAdmin` till renderingsbeslutet förblir gränssnittet deklarativt och typstarkt.
- Inga hårdkodade färger eller otillåtna hooks införs i komponenten.

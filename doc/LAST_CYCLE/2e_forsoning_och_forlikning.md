# Steg 2e: Försoning och Förlikning (TCK-SMS-006)

## Målkonflikter och Beslut

1. **Databasövervakning vs Ren terminal**:
   - Beslut: Avbryt omedelbart Firestore-lyssnare om databasen avvisar behörighet. Informera tydligt en gång och övergå sömlöst till lokal disk/RAM-drift.

2. **Parningslatens vs Färskhet**:
   - Beslut: In-memory `pairedDevices` prioriteras alltid först för ögonblicklig respons.

Alla målkonflikter är lösta och kontraktet är låst.

MÄTTNAD: JA

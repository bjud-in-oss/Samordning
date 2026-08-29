# Steg 2a: Förändra utåt (Vision för TCK-015)

## Vision för permanent administratörspersistens

När administratörer registreras i systemet via REST API (`/api/admin/members/add`), SMS-assistenten eller initial seedning, ska behörigheten vara absolut resilient mot container- och serveromstarter.

Arkitekturen etablerar dubbel redundans:
1. **Lokal diskpersistens (`data/admins.json`)**: Ger omedelbar, offline-säker tillgång direkt vid processstart utan nätverksberoende.
2. **Cloud Firestore (`system_config/admins`)**: Möjliggör central molnsynkronisering och delad administratörslista mellan instanser.
3. **Kombinerad inläsning vid boot**: Servern slår samman, normaliserar och deduplicerar nummer från miljövariabler, lokal fil och Firestore.

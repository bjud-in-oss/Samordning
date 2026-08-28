# Steg 2c: Förändra inåt – Refaktorisering (TCK-DOC-MIGRATION)

## 1. Strukturell omdaning och refaktorisering
Med stöd från färdigheten `improve-codebase-architecture` och `codebase-design`:
1. **Namnbyten på disken**:
   - `doc/ADR.md` -> `doc/DECISIONS.md`
   - `src/features/skapa_inbjudan/doc/BUSINESS_RULES.md` -> `CONSTRAINTS.md`
   - `src/features/inbjudningar/doc/BUSINESS_RULES.md` -> `CONSTRAINTS.md`
   - `src/features/anpassa/doc/BUSINESS_RULES.md` -> `CONSTRAINTS.md`
2. **Schema-extrahering**:
   - Skapa/uppdatera `domain/schema.ts` i berörda domäner med strikta Zod-scheman (`InvitationFormSchema`, `AlertItemSchema`, `ThemeSettingsSchema`, etc.).
3. **Kompakthet**:
   - Rensa bort upprepade typdeklarationer från markdown-filerna och behåll endast externa systemhinder, nätverksisolering och affärsorsaker.

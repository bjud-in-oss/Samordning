# RUTINER FÖR SKILL- OCH TICKET-ADAPTERING (v9.6)

**1. Central ticket-logistik & Epik-nedbrytning (doc/TICKETS.md)**
* Skapa och uppdatera alltid `doc/TICKETS.md` i Steg 1a (Orientera).
* Ange `ticket_type` som en av: Task, Bug, Feature, Refactor, Research, Prototype, Grilling, Spike, Docs, Epic.
* Sätt `status` till "Open", "In Progress" eller "Closed".
* Knyt varje enskild ticket till exakt 1 domän under `src/features/` (eller "Global" för tvärgående arkitektur och epiker).
* Vid förfrågningar som berör flera domäner eller hela systemet: Upprätta en övergripande `Epic`-ticket i `doc/TICKETS.md`, skapa numrerade under-tickets per domän, och lås planeringskedjan (1a–3c) exklusivt till den första öppna under-ticketen.

**2. Sokratisk GROW-coachning & Vektorbaserad Mättnadsmodell**
* Tillämpa analys-skills (`wayfinder`, `triage`, `research`, `grilling`) i Steg 1a. Formulera i 1a tre framåtriktade GROW-frågor inriktade på de fyra tillståndsvektorerna:
  * **`State`**: Datatillstånd, persistens och RAM/Firestore-muteringar.
  * **`Contract`**: Komponentgränssnitt, exporter och prop-typer.
  * **`Effects`**: Sidoeffekter, asynkrona anrop och AI-zoner.
  * **`Resilience`**: Felhantering, Zod-validering och kantfall.
* Besvara frågorna mot koden i `1b_kartlagga.md` och deklarera berörda vektorer i nyckeln `"active_vectors"`.
* **Linjärt snabbspår vs. Förgrening:**
  * Om `"active_vectors"` innehåller färre än 2 vektorer (och ändringen ej berör `src/server/`, `domain/ai_zones/` eller fler än 2 filer) godkänns linjär sekvens ($1b \rightarrow 2a \rightarrow 2b \rightarrow 2e \rightarrow 2f$).
  * Om `"active_vectors"` innehåller $\ge 2$ vektorer (eller berör känsliga zoner/flerfil) tvingas dynamisk förgrening ($2c1, 2d1, 2c2, 2d2...$).
* **Sekventiell grenkoppling ($2dN \rightarrow 2c(N+1)$):** Varje utvärderingsfil (t.ex. `2d1_evaluera_a.md`) måste avslutas med avsnittet **"Kvarvarande osäkerheter & gränssnittskrav för nästa gren"**. Detta utgör tvingande indata för nästa gren (`2c2_gren_b.md`). Grenar får inte skapas parallellt utan måste bygga på kritiken från föregående utvärdering.
* Avsluta Steg 2 i `2e_forsoning_och_forlikning.md` med nyckelordet **`MÄTTNAD: JA`** så snart analysen av alla aktiverade vektorer färdigställts utan kvarvarande osäkerhet, följt av `2f_evaluera_syntes.md` (`BESLUT: GÅ_TILL_DESIGN`).
* Tillämpa `to-spec` i Steg 3c och lista alla berörda relativa filvägar i 3c för automatisk snapshotting.
* Tillämpa `tdd` och `implement` i Steg 4. Skapa alla testfiler med aktiva interaktionspåståenden (`fireEvent`, `userEvent`, `click`, `toHaveBeenCalled`) i `src/` innan produktionskod ändras.

**3. JSON-deklaration i Steg 1b (ADR-010 Compliance)**
* Inkludera alltid samtliga sex nycklar i slutet av `1b_kartlagga.md`:
  ```json
  {
    "status": "IN_PROGRESS",
    "current_domain": "inbjudningar",
    "next_step": "2a_forandra_utat_vision",
    "ticket_id": "TCK-001",
    "active_skill": "wayfinder",
    "active_vectors": ["Contract"]
  }
  ```

**4. Mänsklig Token-Gate och Flöde**
* Vid godkänd 3c skapar verifieringsskriptet en slumpmässig kod i `doc/LAST_CYCLE/REQUIRED_TOKEN.txt`.
* Presentera koden för användaren i chatten. Skapa `doc/LAST_CYCLE/APPROVAL.md` först när användaren uppgett koden som bekräftelse.

**5. Anpassning för icke-kodande tickets (Research, Grilling, Spike, Docs)**
* Behandla den analyserade kunskapen eller beslutsunderlaget i Steg 3c som den slutgiltiga artefakten vid icke-kodande insatser.
* Avsluta cykeln direkt vid Steg 3c genom att sätta "BESLUT: GODKÄND" i 3c och uppdatera status till "Closed" i `doc/TICKETS.md`.
# RUTINER FÖR SKILL- OCH TICKET-ADAPTERING (v9.5)

**1. Central ticket-logistik & Epik-nedbrytning (doc/TICKETS.md)**
* Skapa och uppdatera alltid `doc/TICKETS.md` i Steg 1a (Orientera).
* Ange `ticket_type` som en av: Task, Bug, Feature, Refactor, Research, Prototype, Grilling, Spike, Docs, Epic.
* Sätt `status` till "Open", "In Progress" eller "Closed".
* Knyt varje enskild ticket till exakt 1 domän under `src/features/` (eller "Global" för tvärgående arkitektur och epiker).
* Vid förfrågningar som berör flera domäner eller hela systemet: Upprätta en övergripande `Epic`-ticket i `doc/TICKETS.md`, skapa numrerade under-tickets per domän, och lås planeringskedjan (1a–3c) exklusivt till den första öppna under-ticketen.

**2. Sokratisk GROW-coachning och dynamisk Tree Search**
* Tillämpa analys-skills (wayfinder, triage, research, grilling) i Steg 1a–1b. Formulera i 1a tre framåtriktade GROW-frågor om mål, antaganden och hinder. Läs in och besvara frågorna mot koden i 1b.
* Utforska i Steg 2a–2f avvikande arkitekturgrenar i sekvens (`2c1_gren_a.md`, `2c2_gren_b.md`, osv.). Utvärdera varje gren i fristående steg (`2d1_evaluera_a.md`, `2d2_evaluera_b.md`, osv.), där kritiken och coachningsfrågorna från steg N formar nästa gren/iteration N+1.
* Fortsätt skapa nya gren- och utvärderingsfiler (`2c3`, `2d3`...) så länge kritiken avtäcker ytterligare kvalitetstillskott. Avsluta i `2e_forsoning_och_forlikning.md` genom att jämka alternativen till en vinnande syntes, följt av `2f_evaluera_syntes.md` (BESLUT: GÅ_TILL_DESIGN).
* Tillämpa `to-spec` i Steg 3c. Lista alla berörda relativa filvägar i 3c för automatisk snapshotting.
* Tillämpa `tdd` och `implement` i Steg 4. Skapa alla testfiler med aktiva interaktionspåståenden (`fireEvent`, `userEvent`, `click`, `toHaveBeenCalled`) i `src/` innan produktionskod ändras.

**3. JSON-deklaration i Steg 1a (ADR-010 Compliance)**
* Inkludera alltid samtliga fem nycklar i `1a_orientera.md`:
  ```json
  {
    "status": "IN_PROGRESS",
    "current_domain": "inbjudningar",
    "next_step": "1b_kartlagga",
    "ticket_id": "TCK-001",
    "active_skill": "wayfinder"
  }
```

**4. Mänsklig Token-Gate och Flöde**
* Vid godkänd 3c skapar verifieringsskriptet en slumpmässig kod i `doc/LAST_CYCLE/REQUIRED_TOKEN.txt`.
* Presentera koden för användaren i chatten. Skapa `doc/LAST_CYCLE/APPROVAL.md` först när användaren uppgett koden som bekräftelse.

**5. Anpassning för icke-kodande tickets (Research, Grilling, Spike, Docs)**
* Behandla den analyserade kunskapen eller beslutsunderlaget i Steg 3c som den slutgiltiga artefakten vid icke-kodande insatser.
* Avsluta cykeln direkt vid Steg 3c genom att sätta "BESLUT: GODKÄND" i 3c och uppdatera status till "Closed" i `doc/TICKETS.md`.  


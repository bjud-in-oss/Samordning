# 4_Produce

## Genomförda åtgärder
- **Intro-skärm (`App.tsx`)**:
  - Implementerade ett nytt tillstånd: `hasAcceptedIntro` som lagras i `localStorage` (nyckel: `"mission_router_has_accepted_intro"`).
  - Lade in en blockerande introduktionsskärm som visas direkt efter att användaren valt språk (om inte introduktionen redan är accepterad).
  - Utformningen använder appens inbjudande `font-serif italic` för maximal läsbarhet och en tydlig bekräftelseknapp.
- **Översättningar (`translations.ts`)**:
  - Utökade `TranslationDict` med `introScreenText` och `introScreenBtn`.
  - Applicerade de exakta, manuellt översatta introduktionstexterna för samtliga fem språk: Svenska (`sv`), Engelska (`en`), Spanska (`es`), Swahili (`sw`) och Vietnamesiska (`vi`). Inga fallbacks till engelska finns kvar.
- **Ux-förbättringar för Inbjudningar (`ActiveStream.tsx`)**:
  - Ändrade ledtexten "Kategori" till "Huvudtema" som är mer passande för syftet.
  - Förfinade texten under QR-koden till "Skanna med din mobilkamera för att skicka texten med SMS till publicering".
  - Uppdaterade GDPR-checkrutan till den nya balanserade utformningen som förklarar att inbjudan granskas manuellt samt inhämtar ett aktivt åtagande om att inte sprida personuppgifter utan medgivande, för både svenska och engelska.

Alla frontend-ändringar är på plats och applikationen har verifierats felfri i byggsteget.

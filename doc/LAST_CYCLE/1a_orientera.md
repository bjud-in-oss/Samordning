# Steg 1a: Orientera (Ny Helhetscykel: Flöde, Layout och Varmare Terminologi)

## 1. Bakgrund och Mål
Denna cykel etablerar en sammanhållen och varmare användarupplevelse för domänerna `inbjudningar`, `anpassa` och `skapa_inbjudan` med fokus på:
1. **Appens identitet**: `<title>` sätts till `"Andlighet, Vänskap och Stöd"`.
2. **Fast toppfält**: Toppraden förankras fast längst upp (`sticky top-0 z-50`) med `backdrop-blur-sm` och gemensam klickyta för texten `"Ta emot inbjudningar"` och switchen.
3. **Förklaringskort (AV)**: Placeras på Index 0 (Plats 1) i flödet, döljer grå tagg, använder mjuk pappersinramning utan hårda balkar. Klick på kortet slår automatiskt på funktionen (`pushEnabled = true`) och öppnar anpassningspanelen.
4. **Statuskort (PÅ)**: Placeras på Index 2 (kort 3 i flödet), behåller samma mjuka pappersinramning och presenterar församlingsöversikt eller valda områden.
5. **Anpassningspanel**: Rubriken ändras till `"Välj var du vill ta emot inbjudningar"` (utan stjärnikon). Om panelen är öppen och funktionen är avstängd visas en aktiv interaktiv knapp: `"Slå på 'Ta emot inbjudningar'"` som aktiverar funktionen direkt.
6. **Varmare terminologi**: Skapandeknappen ändras till `"Ge en inbjudan"`, statusbrickan sätts till `"DIN INBJUDAN • FÖRBEREDS"` och undertexten till `"Förbereds för utskick i församlingsområdet"`.

```json
{
  "status": "ORIENTERING_KLAR",
  "current_domain": "inbjudningar",
  "next_step": "1b_kartlagga"
}
```

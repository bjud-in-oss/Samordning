# Steg 2e: Försoning och Förlikning

## Harmonisering och Gränsfall

1. **Gränsfall: Olika språk (`uiLanguage`)**:
   - Svenska texter får de nya precisa formuleringarna.
   - Engelska texter bevaras/anpassas mjukt vid behov utan regression.
2. **Gränsfall: Skärmstorlek & Mobilanpassning**:
   - Aktiveringsknappen och textavsnitten anpassas responsivt med god läsbarhet och tydliga marginaler.
3. **Ingen ADR-påverkan**:
   - Inga körtidsregler, API-kontrakt eller datamodeller påverkas; förändringen är ren UI-komposition inom domänen `anpassa`.

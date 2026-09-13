# Steg 2b: Evaluera yttre anpassning

## Granskning av gränssnitt och PWA-anpassning
1. **Mobilvy och responsivitet**:
   - Den övre navigeringslisten (`AppHeader`) har begränsad bredd på mobilskärmar (320–375px). Genom att placera hörlursikonen direkt intill kugghjulet med `size={18}` och `p-1.5` hålls layouten kompakt utan att titeln "Ta emot inbjudningar" eller switch-knappen trycks ihop eller radbryts felaktigt.
2. **Tillgänglighet (A11y)**:
   - Hörlursknappen förses med `aria-label="Direktöversättning"` och `title="Direktöversättning"` så att skärmläsare tydligt förmedlar knappens syfte.
3. **Temakonsistens**:
   - Använder befintliga Tailwind-klasser (`brand-ink`, `brand-paper`, `brand-accent`) och rundningsradier (`rounded-xl`) för enhetligt intryck.

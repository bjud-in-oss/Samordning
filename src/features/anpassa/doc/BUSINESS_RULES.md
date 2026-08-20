# Affärsregler: anpassa

1. **Temapersistens**: Det valda temat sparas till `localStorage` under nyckeln `active_theme` och appliceras omedelbart på `document.documentElement.setAttribute('data-theme', theme)`.
2. **Standardvärde**: Om inget tema valts ska temat `default` tillämpas.
3. **Komponentisolering**: Komponenter i `anpassa` får inte använda hårdkodade Tailwind-färgklasser för temafärger (såsom `emerald`, `teal` eller godtyckliga hexkoder), utan måste förlita sig på CSS-variablerna definierade i `src/index.css`.
4. **Tillståndsdisciplin (Habit-Hooks)**: UI-komponenter får ha högst 3 hooks. All tillståndshantering för guiden samlas i `hooks/useOnboardingState.ts`.

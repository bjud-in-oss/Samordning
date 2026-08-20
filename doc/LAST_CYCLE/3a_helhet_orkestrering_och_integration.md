# Steg 3a: Helhet, Orkestrering och Integration

- **Systemövergripande arkitektur och samverkan**:
  - Domänen `anpassa` ansvarar för användarens anpassningspreferenser (geografi, målgrupper, format, språk och färgtemainställningar).
  - Temahanteringen styrs deklarativt via HTML-attributet `data-theme` på `:root`-elementet och backas upp av `localStorage`.
  - Alla knappar, modaler, flödeskort och taggar konsumerar de centrala CSS-variablerna (`--color-btn-invite-*`, `--color-modal-*`, `--color-stream-*`, `--color-primary`, etc.) som definieras i `src/index.css`.
  - `OnboardingWizard.tsx` orkestrerar användarinställningarna och guidestegen. För att möta Habit-Hook-kraven bryts all tillståndshantering och biverkningar ut till `src/features/anpassa/hooks/useOnboardingState.ts`.
  - Integrationen mot `src/App.tsx` och övriga applikationen sker uteslutande via domänfasaden `src/features/anpassa/index.ts`.

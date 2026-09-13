# Steg 1a: Orientera (TCK-SMS-003)

## Mål och Omfång
Synkronisera och säkra initieringen av `deviceToken` i `AdminConsole.tsx` (`sms_assistant`) så att komponenten aldrig renderar med en tom enhetstoken under sin initiala mount-fas.
- Synkron lazy initializer i `useState` för att direkt läsa eller generera och persistera `admin_device_token` i `localStorage`.
- Extrahera affärslogik och nätverksanrop till anpassad hook `useAdminConsole` för att upprätthålla rena UI-komponenter och strikt arkitektur.
- Tillhandahålla körtidsvalidering via Zod i `src/features/sms_assistant/domain/schema.ts`.

## GROW-frågor (Risknoder: State, Contract, Effects)

1. **State & Synkronitet**:
   *Fråga*: Hur säkerställs att `deviceToken` omedelbart är tillgänglig vid allra första renderingscykeln utan asynkrona glapp eller race conditions mot `PairingGate`?

2. **Contract & Separation of Concerns**:
   *Fråga*: Hur bryts ansvaret för nätverksanrop och tillståndshantering ut från `AdminConsole.tsx` till `useAdminConsole.ts` så att UI-komponenten förblir under storleks- och hookgränserna med bevarat kontrakt?

3. **Effects & Parningsintegritet**:
   *Fråga*: Hur garanteras att parningskontrollen triggas med korrekt genererad eller hämtad token vid start utan onödiga dubbelanrop eller fördröjd statusvisning?

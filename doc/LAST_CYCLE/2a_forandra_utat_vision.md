# Steg 2a: Förändra utåt - Vision (TCK-SMS-003)

## Vision och Arkitekturell Intention
Administrationskonsolen ska alltid starta i ett deterministiskt tillstånd. Genom att eliminera asynkron fördröjning vid skapandet av `deviceToken` elimineras flimmer, ogiltiga tomma parametrar i API-anrop och onödiga omrenderingar i `PairingGate`.
Strukturen stärks genom ren separation mellan presentation i `AdminConsole.tsx` och tillståndshantering i `useAdminConsole.ts`.

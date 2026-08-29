# Steg 3b: Domänkontrakt och fraktal dokumentation (TCK-015)

## Domänkontrakt

Alla ändringar ryms inom `src/server/` utan att bryta existerande gränssnitt eller typer.

### Exporter i `src/server/storage.ts`:
- `export let adminNumbers: string[] = [];`
- `export async function loadAdmins(): Promise<void>`
- `export async function saveAdmins(): Promise<void>`
- Inga props tas bort eller ändrar signatur.

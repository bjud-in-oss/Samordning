# Steg 3b: Domän, kontrakt och fraktal dokumentation (TCK-LIVE-006)

## Kontrakt och typer

1. **Zod-scheman i `src/features/live_translation/domain/schema.ts`**:
   - `AudioSourceSchema`: `z.enum(['VMIX', 'WEBSOCKET'])`.
   - `AudioCodecSchema`: `z.enum(['PCM', 'OPUS'])`.

2. **Fasadexport i `src/features/live_translation/index.ts`**:
   - Exportera alla nödvändiga typer och klasser med strikt namngivna exporter.

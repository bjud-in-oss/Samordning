# Steg 2b: Evaluera yttre anpassning (TCK-016)

## Utvärdering mot körtidsmiljö och krav

- **Cloudflare Calls SFU & WebRTC**: Tolkklienten kopplar upp via WebRTC till SFU vid normal drift och faller tillbaka till `/ws/translation` över standard WebSocket vid nätverksrestriktioner.
- **Web Audio API & Sandlåda**: Webbläsarens autoplay-restriktioner hanteras proaktivt via `unlockAudioContext` vid användarinteraktion.
- **Isolering & FSD**: Featurekoden är fullständigt inkapslad under `src/features/live_translation/` med en dedikerad fasad.

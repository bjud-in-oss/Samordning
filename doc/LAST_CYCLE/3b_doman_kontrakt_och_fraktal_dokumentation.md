# Steg 3b: Domän, kontrakt och fraktal dokumentation (TCK-LT-012)

## Kontraktspecifikation för Live Translation Endpoints

### 1. Standard API Key Endpoint
- **URL**: `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key={API_KEY}`
- **Gäller för**: Alla nycklar som inte är efemära tokens (inkl. `AIza...`, interna utvecklingsnycklar, nycklar levererade via tokenProvider).

### 2. Ephemeral Token Endpoint
- **URL**: `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContentConstrained?access_token={TOKEN}`
- **Gäller för**: Endast tokens vars sträng börjar med `auth_tokens/`.

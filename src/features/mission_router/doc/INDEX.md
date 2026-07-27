# Feature Documentation: `mission_router`

## Overview & Scope
`mission_router` acts as the domain core for invitation routing, multi-language translations (Swedish, English, Spanish, Swahili, Vietnamese), and SMS payload parsing.

## Public API Exports (`src/features/mission_router/index.ts`)
- **Types**: `ActiveAlert`
- **Domain logic**: `washAnnouncementText`, `parseSmsGatewayPayload`
- **Translations**: `TRANSLATIONS`, `UiLanguage`

# Feature Documentation: `sms_assistant`

## Overview & Scope
`sms_assistant` tillhandahåller administratörskonsolen för SMS-gateway, hantering av administratörer och betrodda skapare, moderering av inkommande förfrågningar, samt prestandaoptimerad realtidssökning och nivåfiltrerad loggvisning.

## Public API Exports (`src/features/sms_assistant/index.ts`)
- **Components**: `AdminConsole`
- **Domain**: `SUPPORT_AGENT_PROMPT`, `classifyLogLevel`, `filterLogs`, `LogEntry`, `LogLevel`, `normalizePhone`, `isValidPhone`, `isPhoneInList`, `addPhoneToList`, `removePhoneFromList`, `filterPendingAlerts`

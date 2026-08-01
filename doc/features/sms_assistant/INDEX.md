# Feature Documentation: `sms_assistant`

## Overview & Scope
`sms_assistant` innehåller administratörskonsolen för SMS-gateway, medlemmar (admins och betrodda skapare), moderering av inkommande förfrågningar, samt realtidssökning och nivåfiltrerade systemloggar.

## Public API Exports (`src/features/sms_assistant/index.ts`)
- **Components**: `AdminConsole`
- **Domain**: `SUPPORT_AGENT_PROMPT`, `classifyLogLevel`, `filterLogs`, `LogEntry`, `LogLevel`

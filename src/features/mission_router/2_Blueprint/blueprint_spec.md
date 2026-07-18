# 2_Blueprint

## Nya Admin Kommandon (`server.ts`)

1. Ersätt strikta kommandon med mer toleranta regex.
```typescript
const isStatusReport = /^[\.#]$/.test(trimmedText);
const jaDraftMatch = trimmedText.match(/^[\.#]ja$/i);
const jaMatch = trimmedText.match(/^[\.#]ja\s+(\d+)$/i);
const nejMatch = trimmedText.match(/^[\.#]nej\s+(\d+)$/i); // Avvisar ELLER raderar
const jaAllaMatch = trimmedText.match(/^[\.#]ja\s+alla\s+(\d+)$/i);
const avsandareMatch = trimmedText.match(/^[\.#]avsändare\s+(.+)$/i);
const expanderaMatch = trimmedText.match(/^[\.#]expandera\s+(\d+)$/i);
const fullMatch = trimmedText.match(/^[\.#]full\s+(\d+)$/i);
const isWebb = trimmedText.toUpperCase().startsWith("#WEBB");
```

2. Statusrapport & Manual:
```typescript
if (isStatusReport) {
  let report = "";
  let count = 0;
  for (const id in activeAlerts) {
    const a = activeAlerts[id];
    report += `${id}. ${a.category} (${a.status === 'pending' ? 'Väntar' : 'Aktiv'})\n`;
    count++;
  }
  if (count === 0) report = "Inga inbjudningar.\n";
  report += "\nKommandon: .ja [nr], .nej [nr], .ja alla [nr], .avsändare [namn]";
  return res.json({ success: true, replyMessage: report });
}
```

3. Webbinlämning & Direktpublicering:
```typescript
// Hantera #WEBB och vanliga inbjudningar
const isTrustedOrAdmin = isAdmin || trustedNumbers.includes(sender);

if (isWebb) {
   // regex för att extrahera #WEBB [Tid] [Område] [Kategori] [Målgrupp] [Organisatör] [Språk] Text
   // TODO: Matcha formulärets fält
   // Status = isTrustedOrAdmin ? "active" : "pending";
   // Om pending, SMS till admin (simuleras med log).
}
```

## SMS / QR i `ActiveStream.tsx`

I `ActiveStream.tsx` (steg 2):
```tsx
const webbString = `#WEBB [${selectedTime}] [${selectedArea}] [${selectedCategory}] [${selectedAudience}] [${washResult?.extractedMetadata?.organization || "Arrangör"}] [${uiLanguage}] ${washResult?.scrubbedText}`;

if (window.innerWidth < 768) {
  // Mobile
  const smsHref = `sms:0736108997?body=${encodeURIComponent(webbString)}`;
  // Rendera knapp med href
} else {
  // Desktop
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(webbString)}`;
  // Rendera bild
}
```
Detta ersätter POST `/api/announcements`. Vi kan ta bort `/api/announcements` helt från `server.ts` eftersom #WEBB är "enda sättet att publicera".


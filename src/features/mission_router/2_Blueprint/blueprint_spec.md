# 2_Blueprint

## Frontend: `ActiveStream.tsx`

1. **Konstruera `smsPayload`**:
```typescript
const smsPayload = `#WEBB
Kategori: ${selectedCategory}
Tid: ${selectedTime}
Område: ${selectedArea}
Avsändare: ${selectedOrganization || "Arrangör"}
Text: ${announcementText}`;
```

2. **Skapa Hrefs och URL:er**:
```typescript
const smsHref = `sms:0736108997?body=${encodeURIComponent(smsPayload)}`;
const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(smsHref)}`;
```

3. **UI Implementation**:
- Ta bort state för `sending` om det inte längre behövs.
- Ändra den sista rutan under "Godkänn" till att utvärdera `isMobile`.
- Mobil: `a href={smsHref}` renderas som en stor grön knapp.
- Desktop: `img src={qrUrl}` med tillhörande instruktionstext.

## Backend Sync: `server.ts`
Eftersom vi måste matcha det backend förväntar sig, och frontend-formatet har dikterats om, bör vi (för att undvika brott i systemkontraktet) justera Regex i `server.ts` så att den mappar mot det nya multi-line formatet:
```typescript
const regex = /^#WEBB\nKategori:\s+(.+)\nTid:\s+(.+)\nOmråde:\s+(.+)\nAvsändare:\s+(.+)\nText:\s+(.*)$/s;
```

# 🔭 Långsiktig Vision & Arkitektur: Samordning + Live Translation

Detta dokument beskriver den långsiktiga produktvisionen, utökade AI-kapabiliteter och framtida skalningsmönster utöver den omedelbara produktions-roadmapen.

## 1. Digital Regissör (Sakramentsregi)
- **Tredje Gemini-instansen:** En dedikerad AI-instans övervakar mötesflödet i realtid.
- **Automatiserad styrning:** Identifierar när sakramentet påbörjas, dämpar automatiskt rumsljudet, spelar upp licensierad psalm för hemmatittare och ställer mjukt om tolkkanalen.

## 2. Missionärsöversättning (Zoom + SMS-brygga)
- **Lektionsläge för tvåvägstolkning:** Missionärer ansluter via Zoom-ljud på sina låsta mobiler medan deltagaren använder PWA-gränssnittet (`?mode=lesson&lang=es`).
- **Sömlös SMS-aktivering:** Tolkkanalen och mötesrummet upprättas på sekunder via SMS-kommandot `START EN`.

## 3. Wi-Fi- & Nätverksoptimering (Opus + Binär WebSocket)
- **Minimal Wi-Fi-belastning:** Övergång till Opus-kodat ljud (32–48 kbps) förpaketerat i binära `ArrayBuffer`-strömmar över WebSocket.
- **Prestanda:** Sänker datamängden med drygt 90 % jämfört med rå PCM16, vilket frigör kritisk Wi-Fi-lufttid i täta kapellmiljöer.

## 4. Integritet & Privacy-by-Design
- **Zero PII:** Besökares språkval och preferenser lagras uteslutande lokalt i webbläsaren (`localStorage`).
- **Säkra exporter:** Inga personuppgifter sparas centralt. Färdigt material exporteras enbart som anonyma sammanfattningar (HTML/PDF) till kyrkans officiella system.

## 5. Separerad Distribution (Lokal Nod vs Cloudflare SFU)
- **Lokal prioritet (Kapellet):** Besökare i bänkraderna ansluter direkt till den lokala noden/WebSocket-spridaren för ultra-låg fördröjning.
- **Cloudflare SFU (Fjärrdeltagare):** Cloudflare Calls / SFU reserveras enbart för deltagare som ansluter på distans över internet, vilket förhindrar onödig extern nätverkstrafik i kapellet.

## 6. Proaktiv AI-Hälsoövervakning & Fallback
- **Sömlös resiliens:** Vid AI-störning eller kvotspärr växlar systemet proaktivt till en sekundär instans eller lokal textgenerator så att tolkningskanalen aldrig blir helt tyst.

## 7. Annonseringsnotiser & Tidsbegränsad Inspelning (24h TTL)
- **Standardpolicy:** Inga möten spelas in som standard.
- **Biskopsgodkänd efterhandslyssning (24h TTL):** Systemet stöder en konfigurerbar funktion där inspelat tolkningsljud kan göras tillgängligt i PWA-appen under exakt 24 timmar efter mötet, varpå filerna raderas automatiskt.
- **Exempelarkiv:** Möjlighet att manuellt flagga och spara enstaka godkända översättningsexempel för utbildningsändamål.
- **Anonymiserade annonseringar:** AI:n punkterar automatiskt upp officiella annonseringar och övergripande ämnen utan personnamn.
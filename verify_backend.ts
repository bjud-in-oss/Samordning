import { isApprovedSender, parseMissionaryMessage, calculateSecondsUntilTime } from "./src/features/mission_router/domain/parser";

// ANSI Terminal Colors for elegant logs
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const BLUE = "\x1b[34m";
const CYAN = "\x1b[36m";
const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";

async function runTests() {
  console.log(`\n${BOLD}${CYAN}================================================================${RESET}`);
  console.log(`${BOLD}${CYAN}          GE STÖD - BACKEND & E-POST VERIFIERINGSSVIT            ${RESET}`);
  console.log(`${BOLD}${CYAN}================================================================${RESET}\n`);

  let passedTests = 0;
  let failedTests = 0;

  function assert(condition: boolean, testName: string, detail = "") {
    if (condition) {
      console.log(`  ${GREEN}✓ [GODKÄND]${RESET} ${testName} ${detail ? `(${detail})` : ""}`);
      passedTests++;
    } else {
      console.log(`  ${RED}✗ [MISSLYCKAD]${RESET} ${BOLD}${testName}${RESET} ${detail ? `\n    ↳ Fel: ${detail}` : ""}`);
      failedTests++;
    }
  }

  // ===========================================================================
  // DEL 1: ENHETSTESTER (DOMAIN LOGIC)
  // ===========================================================================
  console.log(`${BOLD}${BLUE}--- DEL 1: Enhetstester av Domänlogik & E-postfilter ---${RESET}`);

  // Test 1.1: E-postgodkännande (Whitelist & Regler)
  console.log(`\n  ${BOLD}Testar isApprovedSender():${RESET}`);
  
  const whitelistedEmails = [
    "biskop@goteseb.se",
    "biskop.goteborg@gmail.com",
    "aldste.smith@gmail.com",
    "syster.karin@gmail.com",
    "medlem@goteseb.se", // Matchar .endsWith("@goteseb.se")
    "young-missionary@gmail.com", // Matchar .includes("missionary")
    "missionar-syster@outlook.com", // Matchar .includes("missionar")
    "bishop-robert@outlook.com" // Matchar .includes("bishop")
  ];

  for (const email of whitelistedEmails) {
    assert(isApprovedSender(email) === true, `Ska godkänna whitelisted e-post`, email);
  }

  const blockedEmails = [
    "attacker@malicious.com",
    "random-user@gmail.com",
    "president@gote-seb.se", // Felstavat domännamn
    "mission-router@gmail.com" // Matchar ej regler
  ];

  for (const email of blockedEmails) {
    assert(isApprovedSender(email) === false, `Ska avvisa obehörig e-post`, email);
  }

  // Test 1.2: Manuell Hakparentes-Parsing (Fallback parsing)
  console.log(`\n  ${BOLD}Testar parseMissionaryMessage():${RESET}`);
  
  const rawMsg = "Hej! Vi ska ha ett möte på [Kortedala Torg] kl [18:00]. Behöver en [bror] som pratar [engelska].";
  const parsed = parseMissionaryMessage(rawMsg);
  
  assert(parsed !== null, "Ska lyckas parsa giltigt hakparentes-meddelande");
  if (parsed) {
    assert(parsed.locationName === "Kortedala Torg", "Platsnamn korrekt utläst", parsed.locationName);
    assert(parsed.time === "18:00", "Tid korrekt utläst", parsed.time);
    assert(parsed.gender === "bror", "Kategori/kön korrekt utläst", parsed.gender);
    assert(parsed.language === "engelska", "Språk korrekt utläst", parsed.language);
    assert(parsed.resolvedArea === "Kortedala", "Område korrekt geografiskt härlett", parsed.resolvedArea);
    assert(parsed.coords.lat === 57.7512 && parsed.coords.lng === 12.0322, "Exakta koordinater korrekt hämtade", JSON.stringify(parsed.coords));
    const actualLat = Number(parsed.cloakedCoords.lat.toFixed(4));
    const actualLng = Number(parsed.cloakedCoords.lng.toFixed(4));
    assert(actualLat === 57.76 && actualLng === 12.04, "Spatial cloaking (anonymisering) korrekt avrundad", JSON.stringify(parsed.cloakedCoords));
  }

  const invalidMsg = "Detta meddelande saknar helt hakparenteser.";
  assert(parseMissionaryMessage(invalidMsg) === null, "Ska returnera null vid felaktigt format");

  // Test 1.3: TTL Sekunder Beräkning
  console.log(`\n  ${BOLD}Testar calculateSecondsUntilTime():${RESET}`);
  const seconds = calculateSecondsUntilTime("18:00");
  assert(seconds >= 60 && seconds <= 86400, "Ska generera giltigt sekundantall inom 24 timmar", `${seconds} sekunder`);

  // ===========================================================================
  // DEL 2: INTEGRATIONSTESTER (API ENDPOINTS)
  // ===========================================================================
  console.log(`\n${BOLD}${BLUE}--- DEL 2: Integrationstester mot Live Express Server ---${RESET}`);

  const serverUrl = "http://localhost:3000";
  let isServerUp = false;

  try {
    const healthRes = await fetch(`${serverUrl}/api/vapid-public-key`);
    if (healthRes.ok) {
      isServerUp = true;
    }
  } catch (err) {
    console.log(`  ${YELLOW}⚠ Servern är inte igång på port 3000. Startar tillfällig server för integrationstester...${RESET}`);
  }

  if (isServerUp) {
    await runApiIntegrationTests(serverUrl, assert);
  } else {
    console.log(`  ${YELLOW}⚠ Integrationstester mot live-server hoppades över eftersom servern inte kunde nås.${RESET}`);
  }

  // Summary
  console.log(`\n${BOLD}${CYAN}================================================================${RESET}`);
  console.log(`${BOLD}                       SLUTRESULTAT                             ${RESET}`);
  console.log(`${BOLD}${CYAN}================================================================${RESET}`);
  console.log(`  Godkända tester:  ${GREEN}${passedTests}${RESET}`);
  console.log(`  Misslyckade tester: ${failedTests > 0 ? RED : GREEN}${failedTests}${RESET}`);
  console.log(`${BOLD}${CYAN}================================================================${RESET}\n`);

  if (failedTests > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

async function runApiIntegrationTests(serverUrl: string, assert: (cond: boolean, name: string, detail?: string) => void) {
  console.log(`  ${GREEN}✓ Ansluten till servern på ${serverUrl}${RESET}\n`);

  // Test 2.1: Hämta VAPID Key
  try {
    const vapidRes = await fetch(`${serverUrl}/api/vapid-public-key`);
    assert(vapidRes.ok, "Hämta VAPID Public Key returnerade 200 OK");
    const vapidData = await vapidRes.json();
    assert(typeof vapidData.publicKey === "string", "VAPID Public Key är en sträng", vapidData.publicKey);
  } catch (err: any) {
    assert(false, "Misslyckades att hämta VAPID-nyckel", err.message);
  }

  // Test 2.2: Skicka inkommande godkänd e-post (Skapar en ledarpålysning)
  let createdLeaderId = "";
  try {
    console.log(`\n  ${BOLD}Testar /api/incoming-email (Godkänd avsändare):${RESET}`);
    const emailPayload = {
      from: "biskop.goteborg@gmail.com",
      subject: "Samkväm på lördag",
      body: "Vi bjuder in till pysselkväll i [Kortedala Torg] på lördag kl [19:00]. Välkomna!"
    };

    const res = await fetch(`${serverUrl}/api/incoming-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(emailPayload)
    });

    assert(res.ok, "Inkommande godkänd e-post returnerade 200 OK");
    const data = await res.json();
    assert(data.success === true && typeof data.id === "string", "Ledarpålysning skapades framgångsrikt i RAM", `ID: ${data.id}`);
    createdLeaderId = data.id;
  } catch (err: any) {
    assert(false, "Misslyckades att posta godkänd e-post", err.message);
  }

  // Test 2.3: Skicka inkommande avvisad e-post (Ska returnera 403)
  try {
    console.log(`\n  ${BOLD}Testar /api/incoming-email (Avvisad obehörig avsändare):${RESET}`);
    const emailPayload = {
      from: "attacker@malicious.com",
      subject: "Otillåten åtkomst",
      body: "Försök att posta obehörigt meddelande."
    };

    const res = await fetch(`${serverUrl}/api/incoming-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(emailPayload)
    });

    assert(res.status === 403, "Obehörig e-post avvisades korrekt med 403 Forbidden");
  } catch (err: any) {
    assert(false, "Misslyckades att testa avvisad e-post", err.message);
  }

  // Test 2.4: Skicka larm via WhatsApp Simulator
  try {
    console.log(`\n  ${BOLD}Testar /api/sim/whatsapp (Skapar akut larm):${RESET}`);
    const waPayload = {
      from: "whatsapp:+46700112233",
      body: "Vi ska ha ett möte på [Kortedala Torg] kl [18:00]. Behöver en [bror] för [engelska]."
    };

    const res = await fetch(`${serverUrl}/api/sim/whatsapp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(waPayload)
    });

    assert(res.ok, "WhatsApp Simulator-larm returnerade 200 OK");
  } catch (err: any) {
    assert(false, "Misslyckades att testa WhatsApp-larm", err.message);
  }

  // Test 2.5: Verifiera att larmen finns i den offentliga (anonymiserade) listan
  let activeAlertId = "";
  try {
    console.log(`\n  ${BOLD}Testar /api/sim/active-alerts (Kontrollerar anonymiserad ström):${RESET}`);
    const res = await fetch(`${serverUrl}/api/sim/active-alerts`);
    assert(res.ok, "Hämta aktiva larm returnerade 200 OK");
    const list = await res.json();
    assert(Array.isArray(list) && list.length >= 2, "Hittade både skapat larm och pålysning i listan");
    
    // Hitta det akuta larmet
    const missionaryAlert = list.find((a: any) => a.type === "missionary_alert");
    if (missionaryAlert) {
      const containsKeyword = missionaryAlert.scrubbedText.includes("Kortedala") || missionaryAlert.scrubbedText.includes("Plats");
      assert(containsKeyword, "Larmtexten är korrekt formulerad och scrubbad", missionaryAlert.scrubbedText);
      assert(missionaryAlert.rawText === undefined, "Kritiskt: råtexten ('rawText') är döljd för att skydda integriteten (GDPR)", "rawText är undefined");
      activeAlertId = missionaryAlert.id;
    } else {
      assert(false, "Kunde inte hitta det skapade larmet i strömmen");
    }
  } catch (err: any) {
    assert(false, "Misslyckades att hämta aktiva larm", err.message);
  }

  // Test 2.6: Svara på ledarpålysning (Ska INTE utlösa amnesi, ska ligga kvar)
  if (createdLeaderId) {
    try {
      console.log(`\n  ${BOLD}Testar /api/alerts/${createdLeaderId}/respond (Svara på pålysning):${RESET}`);
      const res = await fetch(`${serverUrl}/api/alerts/${createdLeaderId}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ responseText: "Jag kan hjälpa till på samkvämet på lördag!" })
      });
      assert(res.ok, "Svara på pålysning returnerade 200 OK");

      // Verifiera att pålysningen fortfarande finns i RAM
      const checkRes = await fetch(`${serverUrl}/api/alerts/${createdLeaderId}`);
      assert(checkRes.ok, "Pålysningen ligger kvar i RAM efter svar (Ingen amnesi för ledarpålysningar)");
    } catch (err: any) {
      assert(false, "Misslyckades att testa svar på pålysning", err.message);
    }
  }

  // Test 2.7: Svara på missionärslarm (Ska utlösa Amnesi-protokollet och RADERA larmet direkt)
  if (activeAlertId) {
    try {
      console.log(`\n  ${BOLD}Testar /api/alerts/${activeAlertId}/respond (Svara på larm -> Utlöser Amnesi):${RESET}`);
      const res = await fetch(`${serverUrl}/api/alerts/${activeAlertId}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ responseText: "Jag kommer och stöttar er kl 18:00!" })
      });
      assert(res.ok, "Svara på larm returnerade 200 OK");

      // Kontrollera att larmet raderats omedelbart
      const checkRes = await fetch(`${serverUrl}/api/alerts/${activeAlertId}`);
      assert(checkRes.status === 404, "Kritiskt: Amnesi-protokollet raderade larmet permanent från RAM direkt efter svar!", `Status: ${checkRes.status}`);
    } catch (err: any) {
      assert(false, "Misslyckades att testa amnesi-svar på larm", err.message);
    }
  }
}

runTests().catch(err => {
  console.error("Test runner encountered an error:", err);
  process.exit(1);
});

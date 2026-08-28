import fs from 'fs';
import path from 'path';
import { logError, getMtime, readFile } from './utils.js';
import { createPreStep4Snapshots } from './snapshots.js';

export function verifyArchLog(docDir, state) {
  const pArchLog = path.join(docDir, 'ARCH_LOG.md');
  const tArchLog = getMtime(pArchLog);
  const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

  if (tArchLog === 0 || (Date.now() - tArchLog) > TWENTY_FOUR_HOURS) {
    logError('DAGLIG ARKITEKTURGRANSKNING SAKNAS', 'Det har gått mer än 24 timmar sedan senaste improve-codebase-architecture. Kör en analytisk cykel och stämpla doc/ARCH_LOG.md.', state);
  }
}

export function verifyStep1(lastCycleDir, scriptMtime, driverMtime, driverLang, state) {
  const p1a = path.join(lastCycleDir, '1a_orientera.md');
  const p1b = path.join(lastCycleDir, '1b_kartlagga.md');
  const t1a = getMtime(p1a);
  const t1b = getMtime(p1b);

  if (t1a === 0 || t1b === 0) logError('STEG 1 SAKNAS', '1a_orientera.md eller 1b_kartlagga.md saknas.', state);
  if (t1b <= t1a) logError('SEKVENSFEL', '1b_kartlagga.md måste sparas strikt EFTER 1a_orientera.md.', state);

  if (t1a > 0) {
    if (scriptMtime > t1a) logError('SKRIPTMANIPULERING', 'scripts/verify-architecture.js har redigerats under pågående cykel.', state);
    if (driverMtime > t1a) logError('DRIVRUTINSMANIPULERING', `scripts/drivers/${driverLang}.js har redigerats under pågående cykel.`, state);

    const jsonMatch = readFile(p1a).match(/```json\s*([\s\S]*?)\s*```/);
    if (!jsonMatch) {
      logError('FORMATFEL (ADR-010)', '1a_orientera.md saknar giltigt ```json ... ```-block.', state);
    } else {
      try {
        const parsed = JSON.parse(jsonMatch[1]);
        if (!parsed.status || !parsed.current_domain || !parsed.next_step || !parsed.ticket_id || !parsed.active_skill) {
          logError('FORMATFEL (ADR-010)', 'JSON-blocket i 1a saknar obligatoriska nycklar.', state);
        }
      } catch (e) {
        logError('JSON-PARSE-FEL (ADR-010)', 'JSON-blocket i 1a_orientera.md kunde inte tolkas.', state);
      }
    }
  }

  return { t1a, t1b };
}

export function verifyStep2(lastCycleDir, docDir, t1b, state) {
  const p2a = path.join(lastCycleDir, '2a_forandra_utat_vision.md');
  const p2b = path.join(lastCycleDir, '2b_evaluera_yttre_anpassning.md');
  const p2c1 = path.join(lastCycleDir, '2c1_gren_a.md');
  const p2d1 = path.join(lastCycleDir, '2d1_evaluera_a.md');
  const p2c2 = path.join(lastCycleDir, '2c2_gren_b.md');
  const p2d2 = path.join(lastCycleDir, '2d2_evaluera_b.md');
  const p2e = path.join(lastCycleDir, '2e_forsoning_och_forlikning.md');
  const p2f = path.join(lastCycleDir, '2f_evaluera_syntes.md');

  const t2a = getMtime(p2a), t2b = getMtime(p2b);
  const t2c1 = getMtime(p2c1), t2d1 = getMtime(p2d1);
  const t2c2 = getMtime(p2c2), t2d2 = getMtime(p2d2);
  const t2e = getMtime(p2e), t2f = getMtime(p2f);

  if (t2a <= t1b) logError('SEKVENSFEL', '2a_forandra_utat_vision.md måste sparas EFTER 1b_kartlagga.md.', state);
  if (t2b <= t2a) logError('SEKVENSFEL', '2b_evaluera_yttre_anpassning.md måste sparas EFTER 2a_forandra_utat_vision.md.', state);

  if (t2c1 === 0 || t2c2 === 0) logError('TREE SEARCH SAKNAS', 'Skapa minst två avvikande arkitekturgrenar (2c1_gren_a.md och 2c2_gren_b.md).', state);
  if (t2c1 <= t2b) logError('SEKVENSFEL', '2c1_gren_a.md måste sparas EFTER 2b_evaluera_yttre_anpassning.md.', state);
  if (t2d1 <= t2c1) logError('SEKVENSFEL', '2d1_evaluera_a.md måste sparas EFTER 2c1_gren_a.md.', state);
  if (t2c2 <= t2d1) logError('SEKVENSFEL', '2c2_gren_b.md måste sparas EFTER 2d1_evaluera_a.md.', state);
  if (t2d2 <= t2c2) logError('SEKVENSFEL', '2d2_evaluera_b.md måste sparas EFTER 2c2_gren_b.md.', state);

  let strategyPassedTime = 0;
  if (t2e <= t2d2) logError('SEKVENSFEL', '2e_forsoning_och_forlikning.md måste sparas EFTER den sista utvärderingsgrenen (minst 2d2_evaluera_b.md).', state);

  if (fs.existsSync(p2e) && /(tvärdomän|bibliotek|säkerhetsregler|kontrakt|adr)/i.test(readFile(p2e))) {
    if (getMtime(path.join(docDir, 'DECISIONS.md')) <= t2e) logError('DOKUMENTATIONSSKULD', 'Steg 2e kräver en uppdatering av doc/DECISIONS.md.', state);
  }

  if (t2f <= t2e) logError('SEKVENSFEL', '2f_evaluera_syntes.md måste sparas EFTER 2e_forsoning_och_forlikning.md.', state);

  if (/BESLUT:\s*GÅ_TILL_DESIGN/i.test(readFile(p2f))) {
    strategyPassedTime = t2f;
  } else {
    logError('STRATEGISK SPÄRR', 'Inget "BESLUT: GÅ_TILL_DESIGN" nåddes i Steg 2f.', state);
  }

  return { strategyPassedTime };
}

export function verifyStep3AndTokenGate(lastCycleDir, snapshotDir, srcDir, strategyPassedTime, state) {
  const p1a = path.join(lastCycleDir, '1a_orientera.md');
  const p3c = path.join(lastCycleDir, '3c_fil_operativ_kallkodsspecifikation.md');
  const pApproval = path.join(lastCycleDir, 'APPROVAL.md');
  const pToken = path.join(lastCycleDir, 'REQUIRED_TOKEN.txt');
  const p3a = path.join(lastCycleDir, '3a_helhet_orkestrering_och_integration.md');
  const p3b = path.join(lastCycleDir, '3b_doman_kontrakt_och_fraktal_dokumentation.md');

  const t1a = getMtime(p1a);
  const t3a = getMtime(p3a), t3b = getMtime(p3b), t3c = getMtime(p3c);
  let tApproval = getMtime(pApproval);

  if (tApproval > 0 && (tApproval < t1a || tApproval < t3c)) {
    try {
      fs.unlinkSync(pApproval);
      if (fs.existsSync(pToken)) fs.unlinkSync(pToken);
      tApproval = 0;
    } catch (e) {}
  }

  if (t3a <= strategyPassedTime) logError('SEKVENSFEL', '3a måste sparas EFTER Steg 2-godkännandet (2f).', state);
  if (t3b <= t3a) logError('SEKVENSFEL', '3b måste sparas EFTER 3a.', state);
  if (t3c <= t3b) logError('SEKVENSFEL', '3c måste sparas EFTER 3b.', state);

  if (!(t3c > 0 && /BESLUT:\s*GODKÄND/i.test(readFile(p3c)))) logError('DOMSTOLSSPÄRR', '3c saknar "BESLUT: GODKÄND".', state);

  if (t3c > 0) {
    if (!fs.existsSync(pToken)) {
      const token = 'TOKEN-' + Math.floor(1000 + Math.random() * 9000);
      fs.writeFileSync(pToken, token, 'utf-8');
    }
    const requiredToken = fs.readFileSync(pToken, 'utf-8').trim();

    if (tApproval === 0) {
      logError('MÄNSKLIGT GODKÄNNANDE SAKNAS', `Källkod låst. Uppge koden "${requiredToken}" för användaren. Skapa APPROVAL.md med koden för att låsa upp Steg 4.`, state);
    } else {
      const approvalContent = readFile(pApproval).trim();
      if (!approvalContent.includes(requiredToken)) {
        logError('OGILTIGT GODKÄNNANDE', `APPROVAL.md innehåller inte rätt verifieringskod (${requiredToken}).`, state);
      } else if (tApproval <= t3c) {
        logError('SEKVENSFEL (APPROVAL)', 'APPROVAL.md sparades FÖRE 3c.', state);
      } else {
        createPreStep4Snapshots(readFile(p3c), snapshotDir, srcDir);
      }
    }
  }

  return { t3c };
}
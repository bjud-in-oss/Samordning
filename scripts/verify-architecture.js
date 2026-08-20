/**
 * DETERMINISTISK PROCESS- OCH KODREVISOR (v8.7 - VATTENTÄT KÄRNA)
 * SHA-256-hashkontroll, mtime-tidsspärr, Mänsklig Input-Gate (10s betänketid),
 * automatisk drivrutinsdetektering (TS, Python, Rust, Go) och processsekvensering.
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '..');
const DOC_DIR = path.join(ROOT_DIR, 'doc');
const LAST_CYCLE_DIR = path.join(DOC_DIR, 'LAST_CYCLE');
const SRC_DIR = path.join(ROOT_DIR, 'src');
const HASHES_FILE = path.join(__dirname, 'hashes.json');
const INIT_HASHES_FILE = path.join(__dirname, 'init-hashes.js');

const ignoreMtime = process.argv.includes('--ignore-mtime') || process.argv.includes('--fresh-clone');
let hasErrors = false;

function logError(title, message) {
  console.error(`\n❌ [MEKANISK SPÄRR v8.7] ${title}`);
  console.error(`   ${message}`);
  hasErrors = true;
}

function getMtime(filePath) {
  return fs.existsSync(filePath) ? fs.statSync(filePath).mtimeMs : 0;
}

function readFile(filePath) {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf-8') : '';
}

function computeHash(filePath) {
  if (!fs.existsSync(filePath)) return '';
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function detectLanguageDriver() {
  if (fs.existsSync(path.join(ROOT_DIR, 'go.mod'))) return 'go';
  if (fs.existsSync(path.join(ROOT_DIR, 'Cargo.toml'))) return 'rust';
  if (fs.existsSync(path.join(ROOT_DIR, 'pyproject.toml')) || fs.existsSync(path.join(ROOT_DIR, 'requirements.txt'))) return 'python';
  return 'ts';
}

async function runVerification() {
  if (!fs.existsSync(LAST_CYCLE_DIR)) {
    logError('PROCESSMINNE SAKNAS', 'Mappen "doc/LAST_CYCLE/" saknas.');
    process.exit(1);
  }

  const driverLang = detectLanguageDriver();
  const driverPath = path.join(__dirname, 'drivers', `${driverLang}.js`);

  // 1. STEG 1 & TIDSSPÄRR FÖR SÄKERHETSMANIPULERING
  const p1a = path.join(LAST_CYCLE_DIR, '1a_orientera.md');
  const p1b = path.join(LAST_CYCLE_DIR, '1b_kartlagga.md');
  const t1a = getMtime(p1a), t1b = getMtime(p1b);
  const tScript = getMtime(__filename);
  const tDriver = getMtime(driverPath);
  const tHashes = getMtime(HASHES_FILE);
  const tInitHashes = getMtime(INIT_HASHES_FILE);

  if (t1a === 0 || t1b === 0) logError('STEG 1 SAKNAS', '1a_orientera.md eller 1b_kartlagga.md saknas.');
  if (!ignoreMtime && t1b <= t1a) logError('SEKVENSFEL', '1b_kartlagga.md måste sparas strikt EFTER 1a_orientera.md.');

  // VATTENTÄT SPÄRR: Inget skript eller hash-verktyg får ändras/köras EFTER att cykeln (1a) påbörjades
  if (!ignoreMtime && t1a > 0) {
    if (tScript > t1a) {
      logError('SKRIPTMANIPULERING', 'scripts/verify-architecture.js har redigerats under pågående cykel.');
    }
    if (tDriver > t1a) {
      logError('DRIVRUTINSMANIPULERING', `scripts/drivers/${driverLang}.js har redigerats under pågående cykel.`);
    }
    if (tHashes > t1a || tInitHashes > t1a) {
      logError('HASHMANIPULERING', 'hashes.json eller init-hashes.js har ändrats/körts under pågående cykel.');
    }
  }

  // SHA-256 INTEGRITETSKONTROLL
  if (fs.existsSync(HASHES_FILE)) {
    try {
      const storedHashes = JSON.parse(readFile(HASHES_FILE));
      const currentScriptHash = computeHash(__filename);
      const currentDriverHash = computeHash(driverPath);

      if (storedHashes['verify-architecture.js'] && storedHashes['verify-architecture.js'] !== currentScriptHash) {
        logError('SKRIPTMANIPULERING (SHA-256)', 'scripts/verify-architecture.js stämmer inte överens med sparat SHA-256-fingeravtryck.');
      }
      if (storedHashes[`drivers/${driverLang}.js`] && storedHashes[`drivers/${driverLang}.js`] !== currentDriverHash) {
        logError('DRIVRUTINSMANIPULERING (SHA-256)', `scripts/drivers/${driverLang}.js stämmer inte överens med sparat SHA-256-fingeravtryck.`);
      }
    } catch (e) {
      logError('HASH-KONTROLLMISSLYCKANDE', 'Kunde inte läsa eller tolka scripts/hashes.json.');
    }
  }

  // TIDSVARNING (1500 s = 25 min)
  if (!ignoreMtime && t1a > 0) {
    const elapsedSeconds = (Date.now() - t1a) / 1000;
    if (elapsedSeconds > 1500) {
      console.warn(`\n⏳ [TIDSVARNING] Pågående cykel har pågått i ${Math.round(elapsedSeconds)}s. Spara tillstånd till disk.\n`);
    }
  }

  if (t1a > 0) {
    const jsonMatch = readFile(p1a).match(/```json\s*([\s\S]*?)\s*```/);
    if (!jsonMatch) {
      logError('FORMATFEL (ADR-010)', '1a_orientera.md saknar giltigt ```json ... ```-block.');
    } else {
      try {
        const parsed = JSON.parse(jsonMatch[1]);
        if (!parsed.status || !parsed.current_domain || !parsed.next_step) logError('FORMATFEL (ADR-010)', 'JSON-blocket saknar obligatoriska nycklar.');
      } catch (e) {
        logError('JSON-PARSE-FEL (ADR-010)', 'JSON-blocket i 1a_orientera.md kunde inte tolkas.');
      }
    }
  }

  // 2. STEG 2: STRATEGISKT NÄTVERK (TVINGANDE 2C)
  const p2a = path.join(LAST_CYCLE_DIR, '2a_forandra_utat_vision.md');
  const p2b = path.join(LAST_CYCLE_DIR, '2b_evaluera_yttre_anpassning.md');
  const p2c = path.join(LAST_CYCLE_DIR, '2c_forandra_inat_refaktorisering.md');
  const p2d = path.join(LAST_CYCLE_DIR, '2d_evaluera_inre_struktur.md');
  const p2e = path.join(LAST_CYCLE_DIR, '2e_forsoning_och_forlikning.md');
  const p2f = path.join(LAST_CYCLE_DIR, '2f_evaluera_syntes.md');

  const t2a = getMtime(p2a), t2b = getMtime(p2b), t2c = getMtime(p2c);
  const t2d = getMtime(p2d), t2e = getMtime(p2e), t2f = getMtime(p2f);

  if (t2c === 0) logError('MÅSTE KÖRA 2C', 'Steg 2c är tvingande i v8.6 för att förhindra arkitekturskuld.');

  if (!ignoreMtime) {
    if (t2a <= t1b) logError('SEKVENSFEL', '2a måste sparas EFTER 1b.');
    if (t2b <= t2a) logError('SEKVENSFEL', '2b måste sparas EFTER 2a.');
    if (t2c <= t2b) logError('SEKVENSFEL', '2c måste sparas EFTER 2b.');
    if (t2d <= t2c) logError('SEKVENSFEL', '2d måste sparas EFTER 2c.');
  }

  let strategyPassedTime = 0;
  if (/BESLUT:\s*GÅ_TILL_DESIGN/i.test(readFile(p2d))) {
    strategyPassedTime = t2d;
  } else {
    if (!ignoreMtime) {
      if (t2e <= t2d) logError('SEKVENSFEL', '2e måste sparas EFTER 2d.');
      if (t2f <= t2e) logError('SEKVENSFEL', '2f måste sparas EFTER 2e.');
    }
    if (fs.existsSync(p2e) && /(tvärdomän|bibliotek|säkerhetsregler|kontrakt|adr)/i.test(readFile(p2e))) {
      if (!ignoreMtime && getMtime(path.join(DOC_DIR, 'ADR.md')) <= t2e) logError('DOKUMENTATIONSSKULD', '2e kräver en ADR-uppdatering.');
    }
    if (/BESLUT:\s*GÅ_TILL_DESIGN/i.test(readFile(p2f))) strategyPassedTime = t2f;
    else logError('STRATEGISK SPÄRR', 'Inget "BESLUT: GÅ_TILL_DESIGN" nåddes i Steg 2.');
  }

  // 3. STEG 3: DESIGNKEDJA
  const p3a = path.join(LAST_CYCLE_DIR, '3a_helhet_orkestrering_och_integration.md');
  const p3b = path.join(LAST_CYCLE_DIR, '3b_doman_kontrakt_och_fraktal_dokumentation.md');
  const p3c = path.join(LAST_CYCLE_DIR, '3c_fil_operativ_kallkodsspecifikation.md');
  const t3a = getMtime(p3a), t3b = getMtime(p3b), t3c = getMtime(p3c);

  if (!ignoreMtime) {
    if (t3a <= strategyPassedTime) logError('SEKVENSFEL', '3a måste sparas EFTER Steg 2-godkännandet.');
    if (t3b <= t3a) logError('SEKVENSFEL', '3b måste sparas EFTER 3a.');
    if (t3c <= t3b) logError('SEKVENSFEL', '3c måste sparas EFTER 3b.');
  }

  if (!(t3c > 0 && /BESLUT:\s*GODKÄND/i.test(readFile(p3c)))) logError('DOMSTOLSSPÄRR', '3c saknar "BESLUT: GODKÄND".');

  // MÄNSKLIG INPUT-GATE MED TIDSSPÄRR (Minst 10 sekunders betänketid efter 3c)
  const pApproval = path.join(LAST_CYCLE_DIR, 'APPROVAL.md');
  const tApproval = getMtime(pApproval);

  if (t3c > 0 && !ignoreMtime) {
    if (tApproval === 0) {
      logError('MÄNSKLIGT GODKÄNNANDE SAKNAS', 'Källkod får inte redigeras. Granska 3c och spara doc/LAST_CYCLE/APPROVAL.md för att låsa upp Steg 4.');
    } else if (tApproval <= t3c) {
      logError('SEKVENSFEL (APPROVAL)', 'APPROVAL.md sparades FÖRE eller SAMTIDIGT som 3c. Filen måste sparas EFTER att 3c granskats.');
    } else if ((tApproval - t3c) < 10000) {
      logError('AUTOMATISERAT GODKÄNNANDE UPPTÄCKT', `APPROVAL.md skapades endast ${Math.round((tApproval - t3c)/1000)}s efter 3c. Mänsklig granskning krävs (minst 10s betänketid).`);
    }
  }

  // 4. DELEGERA TILL SPRÅKDRIVRUTIN
  if (fs.existsSync(driverPath)) {
    const driverModule = await import(`./drivers/${driverLang}.js`);
    const verifyFunc = driverModule.verifyCodebase || driverModule.verifyTypeScriptCodebase;
    await verifyFunc({
      ROOT_DIR,
      SRC_DIR,
      t3c,
      ignoreMtime,
      logError,
      p4Path: path.join(LAST_CYCLE_DIR, '4_producera.md'),
      t4: getMtime(path.join(LAST_CYCLE_DIR, '4_producera.md'))
    });
  } else {
    logError('DRIVRUTIN SAKNAS', `Drivrutinen scripts/drivers/${driverLang}.js saknas.`);
  }

  if (hasErrors) {
    console.error('\n⛔ BYGGET STOPPADES AV MEKANISK KONTROLL v8.7.\n');
    process.exit(1);
  } else {
    console.log(`✅ Alla sekvenser, fasader, max-domänsgränser, AI-zoner, Mänsklig Gate och TDD-kronologier godkända [Drivrutin: ${driverLang}] (v8.7).`);
  }
}

runVerification();
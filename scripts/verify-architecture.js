/**
 * DETERMINISTISK PROCESS- OCH KODREVISOR (v9.5)
 * Git-baserad filskyddsspärr (ersätter hashes.json), Token Gate, 
 * Flerspråksdetektor, 24h Arkitekturkontroll, Dynamisk Tree Search (Minimigolv), Kvitto-Hash-generering.
 */
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DOC_DIR = path.join(ROOT_DIR, 'doc');
const LAST_CYCLE_DIR = path.join(DOC_DIR, 'LAST_CYCLE');
const SNAPSHOT_DIR = path.join(LAST_CYCLE_DIR, 'snapshots', 'pre_step4');
const SRC_DIR = path.join(ROOT_DIR, 'src');
const RECEIPT_FILE = path.join(LAST_CYCLE_DIR, 'VERIFY_RECEIPT.json');

let hasErrors = false;

function logError(title, message) {
  console.error(`\n❌ [MEKANISK SPÄRR v9.5] ${title}`);
  console.error(`   ${message}`);
  hasErrors = true;
}

function getMtime(filePath) {
  return fs.existsSync(filePath) ? fs.statSync(filePath).mtimeMs : 0;
}

function readFile(filePath) {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf-8') : '';
}

function detectLanguageDriver() {
  if (fs.existsSync(path.join(ROOT_DIR, 'go.mod'))) return 'go';
  if (fs.existsSync(path.join(ROOT_DIR, 'Cargo.toml'))) return 'rust';
  if (fs.existsSync(path.join(ROOT_DIR, 'pyproject.toml')) || fs.existsSync(path.join(ROOT_DIR, 'requirements.txt'))) return 'python';
  return 'ts';
}

function verifyGitProtectedFiles(driverLang) {
  const protectedFiles = [
    'scripts/verify-architecture.js',
    `scripts/drivers/${driverLang}.js`,
    'doc/AGENTS.md'
  ];

  for (const relPath of protectedFiles) {
    try {
      const diffOutput = execSync(`git diff HEAD -- "${relPath}"`, { cwd: ROOT_DIR, encoding: 'utf-8' }).trim();
      if (diffOutput) {
        logError('INSTRUKTIONSMANIPULERING (GIT)', `Filen "${relPath}" har redigerats under cykeln. Alla regeländringar kräver en godkänd git commit.`);
      }
    } catch (e) {
      logError('GIT-VERIFIERINGSFEL', `Kunde inte granska "${relPath}" mot Git HEAD.`);
    }
  }
}

function createPreStep4Snapshots(p3cContent) {
  try {
    if (!fs.existsSync(SNAPSHOT_DIR)) {
      fs.mkdirSync(SNAPSHOT_DIR, { recursive: true });
    }
    const matches = p3cContent.match(/`([^`]+\.(tsx?|jsx?))`|([a-zA-Z0-9_\-\/]+\.(tsx?|jsx?))/g) || [];
    for (const match of matches) {
      const cleanPath = match.replace(/`/g, '').trim();
      const fullSrcPath = path.isAbsolute(cleanPath) ? cleanPath : path.join(SRC_DIR, cleanPath.replace(/^src\//, ''));
      if (fs.existsSync(fullSrcPath) && fs.statSync(fullSrcPath).isFile()) {
        const destPath = path.join(SNAPSHOT_DIR, path.basename(fullSrcPath));
        fs.copyFileSync(fullSrcPath, destPath);
      }
    }
  } catch (e) {
    // Tyst snapshot
  }
}

async function runVerification() {
  if (!fs.existsSync(LAST_CYCLE_DIR)) {
    logError('PROCESSMINNE SAKNAS', 'Mappen "doc/LAST_CYCLE/" saknas.');
    process.exit(1);
  }

  // 1. MEKANISK 24H-SPÄRR FÖR ARKITEKTURGRANSKNING
  const pArchLog = path.join(DOC_DIR, 'ARCH_LOG.md');
  const tArchLog = getMtime(pArchLog);
  const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

  if (tArchLog === 0 || (Date.now() - tArchLog) > TWENTY_FOUR_HOURS) {
    logError('DAGLIG ARKITEKTURGRANSKNING SAKNAS', 'Det har gått mer än 24 timmar sedan senaste improve-codebase-architecture. Kör en analytisk cykel och stämpla doc/ARCH_LOG.md.');
  }

  const driverLang = detectLanguageDriver();
  const driverPath = path.join(__dirname, 'drivers', `${driverLang}.js`);

  // 2. DIREKT GITHUB/GIT-LÅSNING (Ersätter hashes.json)
  verifyGitProtectedFiles(driverLang);

  const p1a = path.join(LAST_CYCLE_DIR, '1a_orientera.md');
  const p1b = path.join(LAST_CYCLE_DIR, '1b_kartlagga.md');
  const p3c = path.join(LAST_CYCLE_DIR, '3c_fil_operativ_kallkodsspecifikation.md');
  const pApproval = path.join(LAST_CYCLE_DIR, 'APPROVAL.md');
  const pToken = path.join(LAST_CYCLE_DIR, 'REQUIRED_TOKEN.txt');

  const t1a = getMtime(p1a), t1b = getMtime(p1b), t3c = getMtime(p3c);
  let tApproval = getMtime(pApproval);

  // NOLLSTÄLLNING VID NY CYKEL
  if (tApproval > 0 && (tApproval < t1a || tApproval < t3c)) {
    try {
      fs.unlinkSync(pApproval);
      if (fs.existsSync(pToken)) fs.unlinkSync(pToken);
      tApproval = 0;
    } catch (e) {}
  }

  const tScript = getMtime(__filename);
  const tDriver = getMtime(driverPath);

  if (t1a === 0 || t1b === 0) logError('STEG 1 SAKNAS', '1a_orientera.md eller 1b_kartlagga.md saknas.');
  if (t1b <= t1a) logError('SEKVENSFEL', '1b_kartlagga.md måste sparas strikt EFTER 1a_orientera.md.');

  if (t1a > 0) {
    if (tScript > t1a) logError('SKRIPTMANIPULERING', 'scripts/verify-architecture.js har redigerats under pågående cykel.');
    if (tDriver > t1a) logError('DRIVRUTINSMANIPULERING', `scripts/drivers/${driverLang}.js har redigerats under pågående cykel.`);
  }

  if (t1a > 0) {
    const jsonMatch = readFile(p1a).match(/```json\s*([\s\S]*?)\s*```/);
    if (!jsonMatch) {
      logError('FORMATFEL (ADR-010)', '1a_orientera.md saknar giltigt ```json ... ```-block.');
    } else {
      try {
        const parsed = JSON.parse(jsonMatch[1]);
        if (!parsed.status || !parsed.current_domain || !parsed.next_step || !parsed.ticket_id || !parsed.active_skill) {
          logError('FORMATFEL (ADR-010)', 'JSON-blocket i 1a saknar obligatoriska nycklar.');
        }
      } catch (e) {
        logError('JSON-PARSE-FEL (ADR-010)', 'JSON-blocket i 1a_orientera.md kunde inte tolkas.');
      }
    }
  }

  // 3. DYNAMISK TREE SEARCH (SEKVENS & MINIMIGOLV)
  const p2a = path.join(LAST_CYCLE_DIR, '2a_forandra_utat_vision.md');
  const p2b = path.join(LAST_CYCLE_DIR, '2b_evaluera_yttre_anpassning.md');
  const p2c1 = path.join(LAST_CYCLE_DIR, '2c1_gren_a.md');
  const p2d1 = path.join(LAST_CYCLE_DIR, '2d1_evaluera_a.md');
  const p2c2 = path.join(LAST_CYCLE_DIR, '2c2_gren_b.md');
  const p2d2 = path.join(LAST_CYCLE_DIR, '2d2_evaluera_b.md');
  const p2e = path.join(LAST_CYCLE_DIR, '2e_forsoning_och_forlikning.md');
  const p2f = path.join(LAST_CYCLE_DIR, '2f_evaluera_syntes.md');

  const t2a = getMtime(p2a), t2b = getMtime(p2b);
  const t2c1 = getMtime(p2c1), t2d1 = getMtime(p2d1);
  const t2c2 = getMtime(p2c2), t2d2 = getMtime(p2d2);
  const t2e = getMtime(p2e), t2f = getMtime(p2f);

  if (t2a <= t1b) logError('SEKVENSFEL', '2a_forandra_utat_vision.md måste sparas EFTER 1b_kartlagga.md.');
  if (t2b <= t2a) logError('SEKVENSFEL', '2b_evaluera_yttre_anpassning.md måste sparas EFTER 2a_forandra_utat_vision.md.');

  if (t2c1 === 0 || t2c2 === 0) logError('TREE SEARCH SAKNAS', 'Skapa minst två avvikande arkitekturgrenar (2c1_gren_a.md och 2c2_gren_b.md).');
  if (t2c1 <= t2b) logError('SEKVENSFEL', '2c1_gren_a.md måste sparas EFTER 2b_evaluera_yttre_anpassning.md.');
  if (t2d1 <= t2c1) logError('SEKVENSFEL', '2d1_evaluera_a.md måste sparas EFTER 2c1_gren_a.md.');
  if (t2c2 <= t2d1) logError('SEKVENSFEL', '2c2_gren_b.md måste sparas EFTER 2d1_evaluera_a.md.');
  if (t2d2 <= t2c2) logError('SEKVENSFEL', '2d2_evaluera_b.md måste sparas EFTER 2c2_gren_b.md.');

  let strategyPassedTime = 0;
  if (t2e <= t2d2) logError('SEKVENSFEL', '2e_forsoning_och_forlikning.md måste sparas EFTER den sista utvärderingsgrenen (minst 2d2_evaluera_b.md).');

  if (fs.existsSync(p2e) && /(tvärdomän|bibliotek|säkerhetsregler|kontrakt|adr)/i.test(readFile(p2e))) {
    if (getMtime(path.join(DOC_DIR, 'DECISIONS.md')) <= t2e) logError('DOKUMENTATIONSSKULD', 'Steg 2e kräver en uppdatering av doc/DECISIONS.md.');
  }

  if (t2f <= t2e) logError('SEKVENSFEL', '2f_evaluera_syntes.md måste sparas EFTER 2e_forsoning_och_forlikning.md.');

  if (/BESLUT:\s*GÅ_TILL_DESIGN/i.test(readFile(p2f))) {
    strategyPassedTime = t2f;
  } else {
    logError('STRATEGISK SPÄRR', 'Inget "BESLUT: GÅ_TILL_DESIGN" nåddes i Steg 2f.');
  }

  const p3a = path.join(LAST_CYCLE_DIR, '3a_helhet_orkestrering_och_integration.md');
  const p3b = path.join(LAST_CYCLE_DIR, '3b_doman_kontrakt_och_fraktal_dokumentation.md');
  const t3a = getMtime(p3a), t3b = getMtime(p3b);

  if (t3a <= strategyPassedTime) logError('SEKVENSFEL', '3a måste sparas EFTER Steg 2-godkännandet (2f).');
  if (t3b <= t3a) logError('SEKVENSFEL', '3b måste sparas EFTER 3a.');
  if (t3c <= t3b) logError('SEKVENSFEL', '3c måste sparas EFTER 3b.');

  if (!(t3c > 0 && /BESLUT:\s*GODKÄND/i.test(readFile(p3c)))) logError('DOMSTOLSSPÄRR', '3c saknar "BESLUT: GODKÄND".');

  // TOKEN-BASERAD MÄNSKLIG GATE
  if (t3c > 0) {
    if (!fs.existsSync(pToken)) {
      const token = 'TOKEN-' + Math.floor(1000 + Math.random() * 9000);
      fs.writeFileSync(pToken, token, 'utf-8');
    }
    const requiredToken = fs.readFileSync(pToken, 'utf-8').trim();

    if (tApproval === 0) {
      logError('MÄNSKLIGT GODKÄNNANDE SAKNAS', `Källkod låst. Uppge koden "${requiredToken}" för användaren. Skapa APPROVAL.md med koden för att låsa upp Steg 4.`);
    } else {
      const approvalContent = readFile(pApproval).trim();
      if (!approvalContent.includes(requiredToken)) {
        logError('OGILTIGT GODKÄNNANDE', `APPROVAL.md innehåller inte rätt verifieringskod (${requiredToken}).`);
      } else if (tApproval <= t3c) {
        logError('SEKVENSFEL (APPROVAL)', 'APPROVAL.md sparades FÖRE 3c.');
      } else {
        createPreStep4Snapshots(readFile(p3c));
      }
    }
  }

  if (fs.existsSync(driverPath)) {
    const driverModule = await import(`./drivers/${driverLang}.js`);
    const verifyFunc = driverModule.verifyCodebase || driverModule.verifyTypeScriptCodebase;
    await verifyFunc({
      ROOT_DIR,
      SRC_DIR: path.join(ROOT_DIR, 'src'),
      t3c,
      logError,
      p4Path: path.join(LAST_CYCLE_DIR, '4_producera.md'),
      t4: getMtime(path.join(LAST_CYCLE_DIR, '4_producera.md'))
    });
  } else {
    logError('DRIVRUTIN SAKNAS', `Drivrutinen scripts/drivers/${driverLang}.js saknas.`);
  }

  if (hasErrors) {
    console.error('\n⛔ BYGGET STOPPADES AV MEKANISK KONTROLL v9.5.\n');
    process.exit(1);
  } else {
    const receiptHash = crypto.createHash('sha256').update(Date.now().toString() + readFile(p3c)).digest('hex').substring(0, 8);
    fs.writeFileSync(RECEIPT_FILE, JSON.stringify({ receipt: receiptHash, timestamp: Date.now() }), 'utf-8');
    console.log(`✅ Sekvenser, Zod-scheman, fasader, domänsspärrar, Token Gate och Git-lås godkända [Drivrutin: ${driverLang} | Kvitto: ${receiptHash}] (v9.5).`);
  }
}

runVerification();
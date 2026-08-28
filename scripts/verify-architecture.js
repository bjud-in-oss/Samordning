/**
 * DETERMINISTISK PROCESS- OCH KODREVISOR (v9.5)
 * Orkestrerar verifieringsbibliotek i scripts/lib/ samt språkdrivrutin.
 */
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

import { logError, getMtime, readFile, detectLanguageDriver } from './lib/utils.js';
import { verifyGitProtectedFiles } from './lib/git.js';
import { verifyArchLog, verifyStep1, verifyStep2, verifyStep3AndTokenGate } from './lib/cycle-steps.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DOC_DIR = path.join(ROOT_DIR, 'doc');
const LAST_CYCLE_DIR = path.join(DOC_DIR, 'LAST_CYCLE');
const SNAPSHOT_DIR = path.join(LAST_CYCLE_DIR, 'snapshots', 'pre_step4');
const SRC_DIR = path.join(ROOT_DIR, 'src');
const RECEIPT_FILE = path.join(LAST_CYCLE_DIR, 'VERIFY_RECEIPT.json');

const state = { hasErrors: false };

async function runVerification() {
  if (!fs.existsSync(LAST_CYCLE_DIR)) {
    logError('PROCESSMINNE SAKNAS', 'Mappen "doc/LAST_CYCLE/" saknas.', state);
    process.exit(1);
  }

  verifyArchLog(DOC_DIR, state);

  const driverLang = detectLanguageDriver(ROOT_DIR);
  const driverPath = path.join(__dirname, 'drivers', `${driverLang}.js`);

  verifyGitProtectedFiles(ROOT_DIR, driverLang, state);

  const tScript = getMtime(__filename);
  const tDriver = getMtime(driverPath);

  const { t1b } = verifyStep1(LAST_CYCLE_DIR, tScript, tDriver, driverLang, state);
  const { strategyPassedTime } = verifyStep2(LAST_CYCLE_DIR, DOC_DIR, t1b, state);
  const { t3c } = verifyStep3AndTokenGate(LAST_CYCLE_DIR, SNAPSHOT_DIR, SRC_DIR, strategyPassedTime, state);

  if (fs.existsSync(driverPath)) {
    const driverModule = await import(`./drivers/${driverLang}.js`);
    const verifyFunc = driverModule.verifyCodebase || driverModule.verifyTypeScriptCodebase;
    await verifyFunc({
      ROOT_DIR,
      SRC_DIR,
      t3c,
      logError: (title, message) => logError(title, message, state),
      p4Path: path.join(LAST_CYCLE_DIR, '4_producera.md'),
      t4: getMtime(path.join(LAST_CYCLE_DIR, '4_producera.md'))
    });
  } else {
    logError('DRIVRUTIN SAKNAS', `Drivrutinen scripts/drivers/${driverLang}.js saknas.`, state);
  }

  if (state.hasErrors) {
    console.error('\n⛔ BYGGET STOPPADES AV MEKANISK KONTROLL v9.5.\n');
    process.exit(1);
  } else {
    const p3cPath = path.join(LAST_CYCLE_DIR, '3c_fil_operativ_kallkodsspecifikation.md');
    const receiptHash = crypto.createHash('sha256').update(Date.now().toString() + readFile(p3cPath)).digest('hex').substring(0, 8);
    fs.writeFileSync(RECEIPT_FILE, JSON.stringify({ receipt: receiptHash, timestamp: Date.now() }), 'utf-8');
    console.log(`✅ Sekvenser, Zod-scheman, fasader, domänsspärrar, Token Gate och Git-lås godkända [Drivrutin: ${driverLang} | Kvitto: ${receiptHash}] (v9.5).`);
  }
}

runVerification();
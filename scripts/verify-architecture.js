import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { 
  purgeObsoleteBranchFiles, 
  readActiveVectors, 
  validateCycleSequence, 
  validateTokenGate, 
  runParallelBackgroundChecks 
} from './lib/cycle-steps.js';
import { purgeObsoleteSnapshots } from './lib/snapshots.js';
import { cleanClosedTickets } from './lib/utils.js';
import { runTsRules } from './lib/ts-rules.js';

// Registrerade giltiga FSD-featurevektorer
export const VALID_FEATURE_VECTORS = [
  'inbjudningar',
  'skapa_inbjudan',
  'anpassa',
  'sms_assistant',
  'live_translation'
];

export const VALID_FSD_FEATURES = VALID_FEATURE_VECTORS;

async function main() {
  console.log('🔍 Exekverar verifiering (v9.7)...');

  // 1. Tillståndsrening vid cykelstart
  purgeObsoleteBranchFiles();
  purgeObsoleteSnapshots();

  // 2. Sekvensvalidering för linjärt/förgrenat läge
  const seq = validateCycleSequence();
  if (!seq.valid) {
    console.error(`❌ Sekvensfel: ${seq.error}`);
    process.exit(1);
  }
  console.log(`✅ Sekvens godkänd (${seq.mode}-läge, Vektorer: [${seq.vectors.join(', ')}])`);

  // 3. Parallella API-kontroller i bakgrunden
  const bg = await runParallelBackgroundChecks(seq.vectors);
  if (bg.executed) {
    console.log(`⚡ Parallella bakgrundskontroller utförda för ${bg.results.length} vektorer.`);
  }

  // 4. TypeScript-kompilation och typvalidering
  const tsOk = runTsRules();
  if (!tsOk) {
    console.error('❌ TypeScript-validering misslyckades.');
    process.exit(1);
  }

  // 5. Automatisk biljettrening vid cykelavslut
  cleanClosedTickets();

  // 6. Skapa verifieringskvitto
  const LAST_CYCLE_DIR = path.join(process.cwd(), 'doc', 'LAST_CYCLE');
  const RECEIPT_FILE = path.join(LAST_CYCLE_DIR, 'VERIFY_RECEIPT.json');
  const p3cPath = path.join(LAST_CYCLE_DIR, '3c_fil_operativ_kallkodsspecifikation.md');
  const p3cContent = fs.existsSync(p3cPath) ? fs.readFileSync(p3cPath, 'utf-8') : '';
  const receiptHash = crypto.createHash('sha256').update(Date.now().toString() + p3cContent).digest('hex').substring(0, 8);
  if (fs.existsSync(LAST_CYCLE_DIR)) {
    fs.writeFileSync(RECEIPT_FILE, JSON.stringify({ receipt: receiptHash, timestamp: Date.now() }), 'utf-8');
  }

  console.log(`🚀 Verifiering fullbordad utan anmärkningar! [Kvitto: ${receiptHash}]`);
}

main();

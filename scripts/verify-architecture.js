import fs from 'fs';
import path from 'path';

const MAX_LINES = 250;
const IGNORE_DIRS = ['node_modules', '.git', 'dist', 'build', 'coverage'];
const TEXT_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.txt', '.json', '.css', '.html'];
const FIFTEEN_MINUTES = 15 * 60 * 1000;

function getAllFiles(dirPath, arrayOfFiles = []) {
  if (!fs.existsSync(dirPath)) return arrayOfFiles;
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!IGNORE_DIRS.includes(file)) arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

function verifyArchitecture() {
  const allFiles = getAllFiles('.');
  let hasErrors = false;
  const now = Date.now();

  // 1. KONTROLL: Max 250 rader per fil (Alla textfiler)
  allFiles.forEach((file) => {
    const ext = path.extname(file).toLowerCase();
    if (TEXT_EXTENSIONS.includes(ext) && !file.includes('package-lock.json')) {
      const lines = fs.readFileSync(file, 'utf-8').split('\n').length;
      if (lines > MAX_LINES) {
        console.error(`\n❌ STORLEKSFEL: Filen "${file}" har ${lines} rader (Max tillåtet: ${MAX_LINES}). Dela upp filen!`);
        hasErrors = true;
      }
    }
  });

  // 2. KONTROLL: FSD-gräns (Inga direktimporter till interna undermappar)
  allFiles.forEach((file) => {
    if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      const lines = fs.readFileSync(file, 'utf-8').split('\n');
      const illegalFsdImport = /from\s+['"][^'"]*features\/[^\/]+\/(components|hooks|api|domain)\//;
      const hasIllegal = lines.some(line => illegalFsdImport.test(line));
      if (hasIllegal) {
        console.error(`\n❌ FSD-ÖVERTRÄDELSE: Filen "${file}" importerar direkt från en interna undermapp i en feature.`);
        console.error(`--> Importera alltid via domänens publika gränssnitt!`);
        hasErrors = true;
      }
    }
  });

  // 3. KONTROLL: Konsumtionskrav (Isolerade mappar)
  const featuresDir = path.join('src', 'features');
  if (fs.existsSync(featuresDir)) {
    const features = fs.readdirSync(featuresDir).filter(f => fs.statSync(path.join(featuresDir, f)).isDirectory());
    const externalCodeFiles = allFiles.filter(f => (f.startsWith('src') || f.endsWith('server.ts')) && !f.startsWith(`src${path.sep}features`));
    const combinedExternalCode = externalCodeFiles.map(f => fs.readFileSync(f, 'utf-8')).join('\n');

    features.forEach((feature) => {
      const importRegex = new RegExp(`from ['"].*features/${feature}(/.*)?['"]`, 'g');
      if (!importRegex.test(combinedExternalCode)) {
        console.error(`\n⚠️ KONSUMTIONSKRAV BRUTET: Domänen "src/features/${feature}" saknar externa importer.`);
        console.error(`--> Reda ut orsaken: Anslut domänen externt ELLER rensa bort mappen om den är föråldrad.`);
        hasErrors = true;
      }
    });
  }

  // 4. KONTROLL: TDD- och Process-ordning (Körs endast om källkod nyligen ändrats)
  const recentCodeFiles = allFiles.filter(f => {
    const isCode = (f.startsWith('src/') || f.endsWith('server.ts')) && 
                   !f.includes('__tests__') && 
                   !f.includes('domain/types.ts') && 
                   !f.includes('/doc/');
    return isCode && (now - fs.statSync(f).mtimeMs) < FIFTEEN_MINUTES;
  });

  if (recentCodeFiles.length > 0) {
    const latestCodeTime = Math.max(...recentCodeFiles.map(f => fs.statSync(f).mtimeMs));

    // Kontrollera att loggen sparades FÖRE källkoden
    const lastCyclePath = path.join('doc', 'LAST_CYCLE.md');
    if (fs.existsSync(lastCyclePath)) {
      const docStat = fs.statSync(lastCyclePath);
      const docContent = fs.readFileSync(lastCyclePath, 'utf-8');

      if (!docContent.includes('Att vända') && !docContent.includes('att vända')) {
        console.error(`\n❌ PROCESSFEL: "doc/LAST_CYCLE.md" saknar avsnittet "Att vända".`);
        hasErrors = true;
      }
      if (docStat.mtimeMs > latestCodeTime + 1000) {
        console.error(`\n❌ PROCESS-ORDNINGSFEL: Loggen "doc/LAST_CYCLE.md" sparades EFTER källkoden.`);
        console.error(`--> Du måste spara planen i loggen FÖRE du ändrar källkoden!`);
        hasErrors = true;
      }
    }

    // Kontrollera att TDD-testet sparades FÖRE källkoden
    const recentTestFiles = allFiles.filter(f => f.includes('__tests__') && f.endsWith('.test.ts'));
    if (recentTestFiles.length === 0) {
      console.error(`\n❌ TDD-ÖVERTRÄDELSE: Källkod i src/ har ändrats men ingen testfil hittades i __tests__/!`);
      hasErrors = true;
    } else {
      const latestTestTime = Math.max(...recentTestFiles.map(f => fs.statSync(f).mtimeMs));
      if (latestTestTime > latestCodeTime + 1000) {
        console.error(`\n❌ TDD-ORDNINGSFEL: Testfilen uppdaterades EFTER källkoden.`);
        console.error(`--> Du måste skriva/spara det fallande testet FÖRE du bygger produktionskoden!`);
        hasErrors = true;
      }
    }
  }

  if (hasErrors) process.exit(1);
}

verifyArchitecture();
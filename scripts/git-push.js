import { execSync } from 'child_process';
import dotenv from 'dotenv';
dotenv.config();

export function pushToGitHub(options = {}) {
  if (process.env.SKIP_GIT_PUSH === 'true') {
    console.log('⏭️ SKIP_GIT_PUSH är aktiverat – hoppar över GitHub-push.');
    return false;
  }

  const { GH_USER, GH_PAT, GH_REPO } = process.env;

  if (!GH_PAT || !GH_USER || !GH_REPO) {
    if (!options.silent) {
      console.warn('⚠️ Saknar GH_PAT, GH_USER eller GH_REPO i Secrets / miljövariabler – hoppar över push.');
    }
    return false;
  }

  // Hantera om GH_REPO innehåller https:// eller inte
  const cleanRepo = GH_REPO.replace(/^https?:\/\//, '');
  const remoteUrl = `https://${GH_USER}:${GH_PAT}@${cleanRepo}`;

  try {
    // Initiera git repository om det inte redan finns
    try {
      execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
    } catch {
      console.log('📦 Initialiserar lokalt Git-arkiv...');
      execSync('git init', { stdio: 'inherit' });
    }

    // Tvinga anonym Git-identitet
    execSync('git config user.name "AI Studio Agent"', { stdio: 'inherit' });
    execSync('git config user.email "noreply@github.com"', { stdio: 'inherit' });
    
    execSync('git branch -M main', { stdio: 'inherit' });
    execSync('git add .', { stdio: 'inherit' });
    try {
      execSync('git commit -m "auto: cykel genomförd via AI Studio"', { stdio: 'inherit' });
    } catch (e) {
      // Inget nytt att committa
    }
    execSync(`git push --force ${remoteUrl} main`, { stdio: 'inherit' });
    console.log('🚀 Ändringarna har pushats anonymt till GitHub!');
    return true;
  } catch (error) {
    console.error('❌ Push misslyckades:', error.message);
    return false;
  }
}

// Kör om anropad direkt
if (process.argv[1] && (process.argv[1].endsWith('git-push.js') || process.argv[1].endsWith('git-push'))) {
  pushToGitHub();
}

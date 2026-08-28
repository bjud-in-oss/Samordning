import { execSync } from 'child_process';
import dotenv from 'dotenv';
dotenv.config();

const { GH_USER, GH_PAT, GH_REPO } = process.env;

if (!GH_PAT || !GH_USER || !GH_REPO) {
  console.error('❌ Saknar GH_PAT, GH_USER eller GH_REPO i Secrets / miljövariabler.');
  process.exit(1);
}

// Hantera om GH_REPO innehåller https:// eller inte
const cleanRepo = GH_REPO.replace(/^https?:\/\//, '');
const remoteUrl = `https://${GH_USER}:${GH_PAT}@${cleanRepo}`;

try {
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
} catch (error) {
  console.error('❌ Push misslyckades:', error.message);
}

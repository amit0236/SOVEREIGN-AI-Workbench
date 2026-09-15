const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const recordDir = path.join(__dirname, 'demo-video');
const outputMp4 = path.join(recordDir, 'sovereign-demo-working-video.mp4');
const bundledFfmpeg = path.join(process.env.LOCALAPPDATA || '', 'ms-playwright', 'ffmpeg-1011', 'ffmpeg-win64.exe');
const fullFfmpeg = path.join(
  process.env.USERPROFILE || '',
  'AppData',
  'Roaming',
  'Python',
  'Python312',
  'site-packages',
  'imageio_ffmpeg',
  'binaries',
  'ffmpeg-win-x86_64-v7.1.exe'
);
const ffmpegPath = fs.existsSync(fullFfmpeg) ? fullFfmpeg : bundledFfmpeg;

fs.rmSync(recordDir, { recursive: true, force: true });
fs.mkdirSync(recordDir, { recursive: true });

async function smoothScrollMain(page, ratio) {
  await page.locator('main').evaluate((el, targetRatio) => {
    const maxScroll = el.scrollHeight - el.clientHeight;
    const targetTop = Math.max(0, Math.min(maxScroll, maxScroll * targetRatio));
    el.scrollTo({ top: targetTop, behavior: 'smooth' });
  }, ratio);
  await page.waitForTimeout(1500);
}

async function moveCursorInSequence(page, x, y, steps = 12) {
  for (let i = 1; i <= steps; i++) {
    const nextX = Math.round((x / steps) * i);
    const nextY = Math.round((y / steps) * i);
    await page.mouse.move(nextX, nextY);
  }
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: {
      dir: recordDir,
      size: { width: 1440, height: 900 },
    },
  });

  const page = await context.newPage();

  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  await smoothScrollMain(page, 0.25);
  await page.waitForTimeout(500);
  await smoothScrollMain(page, 0.65);
  await page.waitForTimeout(500);

  const navButtons = [
    'Workbench',
    'Documents',
    'Document Intelligence',
    'P&ID Viewer',
    'Knowledge Base',
    'Models & Router',
    'Agent Execution',
    'Execution Sandbox',
    'Artifacts',
    'Audit Log',
    'System Verification',
  ];

  for (const label of navButtons) {
    const button = page.getByRole('button', { name: new RegExp(label, 'i') }).first();
    if (await button.count().then((c) => c > 0)) {
      await moveCursorInSequence(page, 1200, 180, 12);
      await button.click();
      await page.waitForTimeout(900);
      await smoothScrollMain(page, 0.35);
    }
  }

  const runHeroDemo = page.getByRole('button', { name: /Run Hero Demo/i }).first();
  if (await runHeroDemo.count().then((c) => c > 0)) {
    await moveCursorInSequence(page, 1200, 100, 12);
    await runHeroDemo.click();
    await page.waitForTimeout(3000);
    await smoothScrollMain(page, 0.8);
  }

  await page.waitForTimeout(2000);

  await context.close();
  await browser.close();

  const webmFile = fs.readdirSync(recordDir).find((file) => file.endsWith('.webm'));

  if (!webmFile) {
    throw new Error('No recorded video file was generated.');
  }

  const webmPath = path.join(recordDir, webmFile);

  execFileSync(ffmpegPath, [
    '-y',
    '-i', webmPath,
    '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p',
    outputMp4,
  ], { stdio: 'inherit' });

  console.log(`Demo video generated successfully: ${outputMp4}`);
  console.log(`Original recording available at: ${webmPath}`);
})().catch((error) => {
  console.error('Failed to generate demo video:', error);
  process.exit(1);
});

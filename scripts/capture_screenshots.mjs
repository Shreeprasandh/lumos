import { chromium } from 'playwright';

async function capture() {
  const browser = await chromium.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  const outDir = '/Users/shreeprasandhk/.gemini/antigravity-cli/brain/d56fd815-62e5-4cc6-abbe-ca960e1ce4c1';

  // 1. Dashboard (Lux Map mode default)
  await page.goto('http://localhost:3008', { waitUntil: 'networkidle' });
  await page.screenshot({ path: `${outDir}/01_dashboard_luxmap.png` });

  // 2. Dashboard 3D mode
  await page.getByRole('button', { name: '3D' }).click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${outDir}/02_dashboard_3d.png` });

  // 3. Projects
  await page.goto('http://localhost:3008/projects', { waitUntil: 'networkidle' });
  await page.screenshot({ path: `${outDir}/03_projects.png` });

  // 4. Design Studio
  await page.goto('http://localhost:3008/design', { waitUntil: 'networkidle' });
  await page.screenshot({ path: `${outDir}/04_design_studio.png` });

  // 5. BOM / BOQ
  await page.goto('http://localhost:3008/bom', { waitUntil: 'networkidle' });
  await page.screenshot({ path: `${outDir}/05_bom.png` });

  // 6. Standards
  await page.goto('http://localhost:3008/standards', { waitUntil: 'networkidle' });
  await page.screenshot({ path: `${outDir}/06_standards.png` });

  // 7. Library
  await page.goto('http://localhost:3008/library', { waitUntil: 'networkidle' });
  await page.screenshot({ path: `${outDir}/07_library.png` });

  await browser.close();
  console.log('Screenshots captured successfully!');
}

capture();

import { chromium } from 'playwright';

async function runQA() {
  console.log('🚀 Starting Lumos Full-Spectrum Autonomous E2E Crawler...');
  const browser = await chromium.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  const issues = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      issues.push(`[Console Error] ${msg.text()}`);
    }
  });

  page.on('pageerror', err => {
    issues.push(`[Page Crash] ${err.message}`);
  });

  try {
    // -------------------------------------------------------------------------
    // 1. DASHBOARD PAGE (/)
    // -------------------------------------------------------------------------
    console.log('\n--- 1. Testing Dashboard Page (/) ---');
    await page.goto('http://localhost:3008', { waitUntil: 'networkidle' });
    
    // Check title
    const title = await page.title();
    console.log(`Page Title: "${title}"`);
    if (title !== 'Lumos') {
      issues.push(`Expected page title to be 'Lumos', got '${title}'`);
    }

    // Verify Default View is Lux Map
    const activeSegmentText = await page.locator('div.border.rounded-lg button.bg-\\[\\#087F73\\]').first().innerText();
    console.log(`Default View Mode: "${activeSegmentText}"`);
    if (activeSegmentText !== 'Lux Map') {
      issues.push(`Default view mode is "${activeSegmentText}", expected "Lux Map"`);
    }

    // Click Segmented Controls: Layout, Routing, 3D, Lux Map
    console.log('Testing Segmented Controls...');
    await page.getByRole('button', { name: 'Layout' }).click();
    await page.waitForTimeout(300);
    const layoutHeader = await page.locator('h2').first().innerText();
    console.log(`Layout view header: "${layoutHeader}"`);

    await page.getByRole('button', { name: 'Routing' }).click();
    await page.waitForTimeout(300);
    const routingHeader = await page.locator('h2').first().innerText();
    console.log(`Routing view header: "${routingHeader}"`);

    await page.getByRole('button', { name: '3D' }).click();
    await page.waitForTimeout(300);
    const threeDHeader = await page.locator('h2').first().innerText();
    console.log(`3D view header: "${threeDHeader}"`);

    // In 3D: Test Explode slider
    const explodeSlider = page.locator('input[type="range"]').first();
    if (await explodeSlider.isVisible()) {
      await explodeSlider.evaluate(el => {
        el.value = '0.80';
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      });
      await page.waitForTimeout(300);
      console.log('Explode slider adjusted to 80%');
    } else {
      issues.push('3D Explode slider not visible');
    }

    // In 3D: Test Layer Toggles
    const toggleHeatmap = page.getByRole('button', { name: 'Heatmap' });
    if (await toggleHeatmap.isVisible()) {
      await toggleHeatmap.click();
      console.log('Clicked Heatmap toggle button');
    }
    const toggleFurniture = page.getByRole('button', { name: 'Furniture' });
    if (await toggleFurniture.isVisible()) {
      await toggleFurniture.click();
      console.log('Clicked Furniture toggle button');
    }
    const resetViewBtn = page.getByRole('button', { name: 'Reset View' });
    if (await resetViewBtn.isVisible()) {
      await resetViewBtn.click();
      console.log('Clicked Reset View button');
    }

    // Test Zoom buttons in bottom right
    const zoomInBtn = page.getByTitle('Zoom In');
    const zoomOutBtn = page.getByTitle('Zoom Out');
    const fitViewBtn = page.getByTitle('Fit to View (100%)');

    if (await zoomInBtn.isVisible()) {
      await zoomInBtn.click();
      await zoomInBtn.click();
      console.log('Clicked Zoom In twice');
    }
    if (await zoomOutBtn.isVisible()) {
      await zoomOutBtn.click();
      console.log('Clicked Zoom Out');
    }
    if (await fitViewBtn.isVisible()) {
      await fitViewBtn.click();
      console.log('Clicked Fit to View');
    }

    // Switch back to Lux Map
    await page.getByRole('button', { name: 'Lux Map' }).click();
    await page.waitForTimeout(300);

    // Test Header User Profile Popover
    console.log('Testing User Profile Popover in BrandHeader...');
    const userProfileTrigger = page.locator('header button:has-text("LT-MEP")').first();
    if (await userProfileTrigger.isVisible()) {
      await userProfileTrigger.click();
      await page.waitForTimeout(300);
      const isPopoverOpen = await page.getByText('Lead MEP Systems Engineer').isVisible();
      console.log(`Engineer Profile Popover Open: ${isPopoverOpen}`);
      if (!isPopoverOpen) {
        issues.push('Clicking user badge in header did not open profile popover');
      }
      // Click again to close
      await userProfileTrigger.click();
      await page.waitForTimeout(200);
    }

    // Test "New Project" button -> Opens Upload Modal
    console.log('Testing "New Project" button...');
    await page.getByRole('button', { name: 'New Project' }).click();
    await page.waitForTimeout(400);
    const modalVisible = await page.getByText('Import Architectural Plan & Blueprint').isVisible();
    console.log(`Upload Modal Opened: ${modalVisible}`);
    if (!modalVisible) {
      issues.push('Clicking "New Project" did not open Import Architectural Plan modal');
    } else {
      // Select benchmark blueprint (this closes modal)
      await page.getByText('Office Floor L1 (50,000 sq.ft)').click();
      await page.waitForTimeout(400);
      console.log('Selected benchmark Office Floor L1');
    }

    // Ensure no backdrop lingers
    await page.waitForTimeout(200);

    // Test Recent Projects selection
    console.log('Testing Recent Projects selection...');
    const b2ProjectItem = page.getByText('Tech Park – Basement B2');
    if (await b2ProjectItem.isVisible()) {
      await b2ProjectItem.click();
      await page.waitForTimeout(400);
      console.log('Switched project to Tech Park – Basement B2');
    }

    // Test Pipeline Strip Stages
    console.log('Testing Pipeline Strip stages...');
    const stage2 = page.getByText('2. Lighting Placement');
    if (await stage2.isVisible()) {
      await stage2.click();
      await page.waitForTimeout(300);
      console.log('Clicked Pipeline Stage 2 -> Switched to Layout mode');
    }

    const stage3 = page.getByText('3. Photometric Lux Map');
    if (await stage3.isVisible()) {
      await stage3.click();
      await page.waitForTimeout(300);
      console.log('Clicked Pipeline Stage 3 -> Switched to Lux Map mode');
    }

    const stage4 = page.getByText('4. Conduit & Circuit Routing');
    if (await stage4.isVisible()) {
      await stage4.click();
      await page.waitForTimeout(300);
      console.log('Clicked Pipeline Stage 4 -> Switched to Routing mode');
    }

    // Test "Generate BOM / BOQ" Button
    console.log('Testing "Generate BOM / BOQ" button...');
    await page.getByRole('button', { name: 'Generate BOM / BOQ' }).click();
    await page.waitForTimeout(400);
    const bomModalVisible = await page.getByText('6-Tier Bill of Quantities (BOM / BOQ)').isVisible();
    console.log(`BOQ Modal Opened: ${bomModalVisible}`);
    if (!bomModalVisible) {
      issues.push('Clicking "Generate BOM / BOQ" did not open BOQ modal');
    } else {
      // Close modal
      const closeBtn = page.getByLabel('Close modal');
      await closeBtn.click();
      await page.waitForTimeout(300);
      console.log('Closed BOQ modal cleanly');
    }

    // Test "View Report" in Design Compliance
    console.log('Testing "View Report" button...');
    await page.getByRole('button', { name: 'View Report' }).click();
    await page.waitForTimeout(400);
    const reportModalVisible = await page.getByText('Statutory Design Compliance Report').isVisible();
    console.log(`Compliance Report Modal Opened: ${reportModalVisible}`);
    if (!reportModalVisible) {
      issues.push('Clicking "View Report" did not open Compliance Report modal');
    } else {
      const closeBtn = page.getByLabel('Close modal');
      await closeBtn.click();
      await page.waitForTimeout(300);
      console.log('Closed Compliance Report modal cleanly');
    }

    // Test "View All" link in Recent Projects -> Navigates to /projects
    console.log('Testing "View All" link...');
    const viewAllLink = page.getByRole('link', { name: 'View All' });
    if (await viewAllLink.isVisible()) {
      await viewAllLink.click();
      await page.waitForTimeout(500);
      console.log(`Navigated via "View All" to: ${page.url()}`);
      if (!page.url().includes('/projects')) {
        issues.push(`Expected URL to include /projects, got ${page.url()}`);
      }
    }

    // -------------------------------------------------------------------------
    // 2. PROJECTS PAGE (/projects)
    // -------------------------------------------------------------------------
    console.log('\n--- 2. Testing Projects Page (/projects) ---');
    await page.goto('http://localhost:3008/projects', { waitUntil: 'networkidle' });

    // Search filter
    const searchInput = page.getByPlaceholder('Search by project name, facility type, or location...');
    await searchInput.fill('Airport');
    await page.waitForTimeout(300);
    const airportVisible = await page.getByText('Airport Terminal T2 Pier').isVisible();
    const l1Visible = await page.getByText('Tech Park – Floor L1').isVisible();
    console.log(`Search filter works: Airport visible=${airportVisible}, L1 visible=${l1Visible}`);
    if (!airportVisible || l1Visible) {
      issues.push('Search filter on /projects is not filtering cards correctly');
    }
    await searchInput.fill('');
    await page.waitForTimeout(200);

    // Status filter
    await page.getByRole('button', { name: 'completed' }).click();
    await page.waitForTimeout(200);
    const l1Comp = await page.getByText('Tech Park – Floor L1').isVisible();
    const b2Comp = await page.getByText('Tech Park – Basement B2').isVisible();
    console.log(`Status filter "completed": L1=${l1Comp}, B2=${b2Comp}`);
    if (!l1Comp || b2Comp) {
      issues.push('Status filter on /projects is not filtering cards correctly');
    }
    await page.getByRole('button', { name: 'all' }).click();
    await page.waitForTimeout(200);

    // Test "Open in Workspace" link
    console.log('Testing "Open in Workspace" link on first project card...');
    const openWorkspaceBtn = page.getByRole('link', { name: 'Open in Workspace' }).first();
    await openWorkspaceBtn.click();
    await page.waitForTimeout(500);
    console.log(`Navigated from /projects to workspace: ${page.url()}`);
    if (!page.url().includes('?project=')) {
      issues.push('"Open in Workspace" did not pass project query parameter');
    }

    // -------------------------------------------------------------------------
    // 3. DESIGN PAGE (/design)
    // -------------------------------------------------------------------------
    console.log('\n--- 3. Testing Design Page (/design) ---');
    await page.getByRole('link', { name: 'Design' }).click();
    await page.waitForTimeout(500);
    console.log(`Navigated to: ${page.url()}`);

    // Adjust Room Length slider
    const lengthSlider = page.locator('input[type="range"]').nth(0);
    await lengthSlider.evaluate(el => {
      el.value = '50';
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await page.waitForTimeout(300);
    console.log('Changed room length to 50m');

    // Click 750 Lux target
    await page.getByRole('button', { name: '750 Lux' }).click();
    await page.waitForTimeout(300);
    console.log('Clicked 750 Lux target');

    // Test 3D switcher in Design
    await page.getByRole('button', { name: '3D Axonometric Model' }).click();
    await page.waitForTimeout(400);
    console.log('Switched to 3D in Design page');
    await page.getByRole('button', { name: '2D Plan & Heatmap' }).click();
    await page.waitForTimeout(300);
    console.log('Switched back to 2D Plan in Design page');

    // -------------------------------------------------------------------------
    // 4. BOM / BOQ PAGE (/bom)
    // -------------------------------------------------------------------------
    console.log('\n--- 4. Testing BOM / BOQ Page (/bom) ---');
    await page.getByRole('link', { name: 'BOM / BOQ' }).click();
    await page.waitForTimeout(500);
    console.log(`Navigated to: ${page.url()}`);

    // Test Tier Filters
    await page.getByRole('button', { name: 'T1: Luminaires' }).click();
    await page.waitForTimeout(200);
    console.log('Filtered by T1: Luminaires');
    await page.getByRole('button', { name: 'T3: Conduits' }).click();
    await page.waitForTimeout(200);
    console.log('Filtered by T3: Conduits');
    await page.getByRole('button', { name: 'All Tiers' }).click();
    await page.waitForTimeout(200);

    // Test Search input
    const bomSearch = page.getByPlaceholder('Search by catalog code, description, or HSN...');
    if (await bomSearch.isVisible()) {
      await bomSearch.fill('LED');
      await page.waitForTimeout(200);
      console.log('Searched for "LED" in BOM');
      await bomSearch.fill('');
    }

    // Test SuFin CSV Export button
    const csvExportBtn = page.getByRole('button', { name: 'Export L&T SuFin (CSV)' });
    await csvExportBtn.click();
    await page.waitForTimeout(300);
    const noticeVisible = await page.getByText('SuFin CSV Downloaded Successfully').isVisible();
    console.log(`SuFin CSV Export notification triggered: ${noticeVisible}`);

    // -------------------------------------------------------------------------
    // 5. STANDARDS PAGE (/standards)
    // -------------------------------------------------------------------------
    console.log('\n--- 5. Testing Standards Page (/standards) ---');
    await page.getByRole('link', { name: 'Standards' }).click();
    await page.waitForTimeout(500);
    console.log(`Navigated to: ${page.url()}`);

    const stdSearch = page.getByPlaceholder('Search by code (e.g. IS 3646, NBC 2016, IS 732, ECBC) or parameter...');
    await stdSearch.fill('IS 3646');
    await page.waitForTimeout(200);
    const is3646Visible = await page.getByText('Maintained Workplane Illuminance').isVisible();
    console.log(`Search for "IS 3646" visible: ${is3646Visible}`);
    await stdSearch.fill('');

    // -------------------------------------------------------------------------
    // 6. LIBRARY PAGE (/library)
    // -------------------------------------------------------------------------
    console.log('\n--- 6. Testing Library Page (/library) ---');
    await page.getByRole('link', { name: 'Library' }).click();
    await page.waitForTimeout(500);
    console.log(`Navigated to: ${page.url()}`);

    // Click Category pills
    const catPills = ['All Luminaires', 'Downlight', 'Linear Batten', 'High Bay', 'Cleanroom', 'Recessed Troffer'];
    for (const cat of catPills) {
      const btn = page.getByRole('button', { name: cat });
      if (await btn.isVisible()) {
        await btn.click();
        await page.waitForTimeout(150);
        console.log(`Selected library category: ${cat}`);
      }
    }

    // Test IES Profile Download button
    console.log('Testing IES Profile download button...');
    const iesBtn = page.getByRole('button', { name: 'IES Profile' }).first();
    await iesBtn.click();
    await page.waitForTimeout(300);
    const iesNoticeVisible = await page.getByText('Downloaded IES Photometric Profile').isVisible();
    console.log(`IES download notification triggered: ${iesNoticeVisible}`);

  } catch (err) {
    issues.push(`Fatal QA Exception: ${err.message}`);
  } finally {
    await browser.close();
  }

  console.log('\n======================================================');
  console.log('QA AUDIT EXECUTION SUMMARY');
  console.log('======================================================');
  if (issues.length === 0) {
    console.log('✅ ALL E2E USER FLOW TESTS PASSED WITH 0 ISSUES!');
  } else {
    console.log(`⚠️ FOUND ${issues.length} ISSUE(S):`);
    issues.forEach((iss, i) => console.log(`  ${i + 1}. ${iss}`));
  }
  console.log('======================================================\n');
}

runQA();

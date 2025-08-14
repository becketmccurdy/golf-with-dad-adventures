#!/usr/bin/env node

import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function runAccessibilityAudit() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    console.log('🚀 Starting accessibility audit...');
    
    // Navigate to the deployed app
    const url = 'https://golf-with-dad-adventures-a11hdnwgx-becket-mccurdys-projects.vercel.app';
    console.log(`📍 Navigating to: ${url}`);
    await page.goto(url, { waitUntil: 'networkidle' });
    
    // Wait for the page to be fully loaded
    await page.waitForTimeout(3000);
    
    console.log('🔍 Running accessibility checks...');
    
    // Run accessibility checks with AxeBuilder
    const results = await new AxeBuilder({ page }).analyze();
    
    if (results.violations.length === 0) {
      console.log('✅ No accessibility violations found!');
    } else {
      console.log(`❌ Found ${results.violations.length} accessibility violations:`);
      results.violations.forEach((violation, index) => {
        console.log(`\n${index + 1}. ${violation.id} (${violation.impact})`);
        console.log(`   Description: ${violation.description}`);
        console.log(`   Help: ${violation.help}`);
        console.log(`   Elements affected: ${violation.nodes.length}`);
        if (violation.nodes.length > 0) {
          console.log(`   Example selector: ${violation.nodes[0].target[0]}`);
        }
      });
    }
    
    console.log(`\n📊 Summary:`);
    console.log(`   ✅ Passes: ${results.passes.length}`);
    console.log(`   ❌ Violations: ${results.violations.length}`);
    console.log(`   ⚠️ Incomplete: ${results.incomplete.length}`);
    console.log(`   ℹ️ Inapplicable: ${results.inapplicable.length}`);
    
  } catch (error) {
    console.error('❌ Error during accessibility audit:', error);
  } finally {
    await browser.close();
  }
}

runAccessibilityAudit().catch(console.error);

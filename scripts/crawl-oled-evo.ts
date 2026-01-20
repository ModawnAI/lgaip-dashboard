#!/usr/bin/env npx tsx
/**
 * Quick script to crawl OLED evo products
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const OUTPUT_DIR = '/Users/kjyoo/hsad/lgaip-dashboard/scripts/crawl-output';

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function exec(cmd: string, parseJson = false): any {
  try {
    const result = execSync(cmd, {
      timeout: 60000,
      encoding: 'utf-8',
      maxBuffer: 50 * 1024 * 1024,
    });
    if (parseJson) {
      try {
        return JSON.parse(result.trim());
      } catch {
        return result.trim();
      }
    }
    return result.trim();
  } catch (error: any) {
    if (error.stdout) {
      if (parseJson) {
        try {
          return JSON.parse(error.stdout.toString().trim());
        } catch {
          return error.stdout.toString().trim();
        }
      }
      return error.stdout.toString().trim();
    }
    throw error;
  }
}

async function extractProductData(url: string): Promise<any> {
  console.log(`  Opening: ${url}`);
  exec(`agent-browser open "${url}"`);
  exec('agent-browser wait --load networkidle');
  exec('agent-browser wait 2000');

  // Try to accept cookies
  try {
    exec('agent-browser click "button:has-text(\\"ALLE AKZEPTIEREN\\")"');
  } catch {}

  exec('agent-browser wait 1000');

  // Extract JSON-LD data
  const jsonLdScript = `
    JSON.stringify(
      Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
        .map(s => {
          try { return JSON.parse(s.textContent); }
          catch { return null; }
        })
        .filter(Boolean)
    )
  `;

  let jsonLd: any[] = [];
  try {
    const jsonLdResult = exec(`agent-browser eval '${jsonLdScript}'`, true);
    if (typeof jsonLdResult === 'string') {
      jsonLd = JSON.parse(jsonLdResult);
    } else {
      jsonLd = jsonLdResult;
    }
  } catch (e) {
    console.log(`  Warning: Could not parse JSON-LD`);
  }

  // Extract basic page info
  const title = exec(`agent-browser eval 'document.title'`, true);
  const description = exec(`agent-browser eval 'document.querySelector("meta[name=\\"description\\"]")?.content || ""'`, true);

  // Extract images
  let images: any[] = [];
  try {
    const imagesScript = `
      JSON.stringify(
        Array.from(document.querySelectorAll('.pdp-gallery img, .product-image img, [data-testid*="image"] img'))
          .map(img => ({ src: img.src, alt: img.alt }))
          .filter(i => i.src && i.src.startsWith('http'))
      )
    `;
    const imagesResult = exec(`agent-browser eval '${imagesScript}'`, true);
    if (typeof imagesResult === 'string') {
      images = JSON.parse(imagesResult);
    }
  } catch {}

  // Extract price
  let price: string | null = null;
  try {
    const priceScript = `document.querySelector('.price, [data-testid*="price"], .product-price')?.textContent?.trim() || ''`;
    price = exec(`agent-browser eval '${priceScript}'`, true);
  } catch {}

  // Extract specifications
  let specs: Record<string, string> = {};
  try {
    const specsScript = `
      JSON.stringify(
        Array.from(document.querySelectorAll('.spec-row, .specs-table tr, [data-testid*="spec"]'))
          .reduce((acc, row) => {
            const label = row.querySelector('.spec-label, th, .label')?.textContent?.trim();
            const value = row.querySelector('.spec-value, td, .value')?.textContent?.trim();
            if (label && value) acc[label] = value;
            return acc;
          }, {})
      )
    `;
    const specsResult = exec(`agent-browser eval '${specsScript}'`, true);
    if (typeof specsResult === 'string' && specsResult) {
      specs = JSON.parse(specsResult);
    }
  } catch {}

  return {
    url,
    title,
    description,
    jsonLd,
    images,
    price,
    specs,
    crawledAt: new Date().toISOString(),
  };
}

async function main() {
  // Product URLs discovered from the listing page
  const productUrls = [
    'https://www.lg.com/de/tvs-und-soundbars/oled-evo/oled65g59ls/',
    'https://www.lg.com/de/tvs-und-soundbars/oled-evo/oled83c5ela/',
    'https://www.lg.com/de/tvs-und-soundbars/oled-evo/oled65g57lw/',
    'https://www.lg.com/de/tvs-und-soundbars/oled-evo/oled65m59la/',
    'https://www.lg.com/de/tvs-und-soundbars/oled-evo/oled77c58la/',
    'https://www.lg.com/de/tvs-und-soundbars/oled-evo/oled42c47la/',
    'https://www.lg.com/de/tvs-und-soundbars/oled-evo/oled97g48lw/',
    'https://www.lg.com/de/tvs-und-soundbars/oled-evo/oled83g58lw/',
    'https://www.lg.com/de/tvs-und-soundbars/oled-evo/oled65c59lb/',
    'https://www.lg.com/de/tvs-und-soundbars/oled-evo/oled65c57la/',
    'https://www.lg.com/de/tvs-und-soundbars/oled-evo/oled83c44la/',
  ];

  console.log(`Found ${productUrls.length} unique products to crawl\n`);

  const results: any[] = [];

  for (let i = 0; i < productUrls.length; i++) {
    const url = productUrls[i];
    console.log(`\n[${i + 1}/${productUrls.length}] Crawling product...`);

    try {
      const data = await extractProductData(url);
      results.push(data);

      // Extract SKU from URL
      const sku = url.split('/').filter(Boolean).pop() || `product-${i}`;

      // Save individual product file
      const productFile = path.join(OUTPUT_DIR, `${sku}.json`);
      fs.writeFileSync(productFile, JSON.stringify(data, null, 2));
      console.log(`  ✅ Saved: ${productFile}`);
    } catch (error: any) {
      console.log(`  ❌ Failed: ${error.message}`);
      results.push({
        url,
        error: error.message,
        crawledAt: new Date().toISOString(),
      });
    }

    // Delay between requests
    await new Promise(r => setTimeout(r, 2000));
  }

  // Save manifest
  const manifestFile = path.join(OUTPUT_DIR, 'manifest.json');
  fs.writeFileSync(manifestFile, JSON.stringify({
    category: 'oled-evo',
    crawledAt: new Date().toISOString(),
    totalProducts: productUrls.length,
    successful: results.filter(r => !r.error).length,
    failed: results.filter(r => r.error).length,
    products: results,
  }, null, 2));

  console.log(`\n${'='.repeat(60)}`);
  console.log('Crawl Complete');
  console.log('='.repeat(60));
  console.log(`Total: ${productUrls.length}`);
  console.log(`Successful: ${results.filter(r => !r.error).length}`);
  console.log(`Failed: ${results.filter(r => r.error).length}`);
  console.log(`Output: ${OUTPUT_DIR}`);

  // Close browser
  try {
    exec('agent-browser close');
  } catch {}
}

main().catch(console.error);

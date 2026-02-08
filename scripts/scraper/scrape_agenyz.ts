import fs from 'fs';
import path from 'path';

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const DOMAINS = {
  RU: 'https://agenyz.ru',
  EU: 'https://agenyz.eu',
};

// Simple delay to be nice
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchHtml(url: string) {
  console.log(`Fetching ${url}...`);
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': USER_AGENT,
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      },
    });
    if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
    return await res.text();
  } catch (e) {
    console.error(e);
    return null;
  }
}

async function getCatalogLinks(domain: string) {
  const startUrl = `${domain}/catalog?category_id=0`; // All categories
  const html = await fetchHtml(startUrl);
  if (!html) return [];

  // Regex to find links starting with /catalog/
  // Exclude links with ?, which are usually category filters or sorting
  const productLinkRegex = /href="(\/catalog\/[^"?#]+)"/g;
  const matches = [...html.matchAll(productLinkRegex)];

  // Additional check for category pages if pagination exists (though single page seems likely for this site structure)
  // Based on snapshot, it looks like a long list.

  const uniqueLinks = new Set<string>();
  for (const m of matches) {
    const link = m[1];
    // Filter out non-product pages if any known patterns exist
    if (link.includes('/marketing-materials') || link.includes('/ensuvenirnaya-produktsiya')) {
      // Decide if we want these. User said "all products". Marketing materials might be products.
      // Keeping them for now.
    }
    uniqueLinks.add(link);
  }

  console.log(`Found ${uniqueLinks.size} unique product/category links on catalog page.`);
  return Array.from(uniqueLinks).map((l) => `${domain}${l}`);
}

async function scrapeProduct(url: string, domain: string) {
  const html = await fetchHtml(url);
  if (!html) return null;

  // 1. Extract Basic Metadata
  const titleMatch = html.match(/<h1[^>]*>([^<]+)<\/h1>/);
  const title = titleMatch ? titleMatch[1].trim() : 'Unknown Product';

  // 2. Extract SKU
  // Look for data-sku="SC-02.50"
  const skuMatch = html.match(/data-sku="([^"]+)"/);
  const sku = skuMatch ? skuMatch[1] : null;

  // 3. Extract Description
  // Simple block extraction - look for text blocks
  // This is rough without a DOM parser, searching for common container classes
  // Based on previous snapshot analysis, content might be in specific divs.

  // 4. Extract Images
  // <img ... src="...">
  const imageMatches = [...html.matchAll(/<img[^>]+src="([^"]+)"/g)];
  const images = Array.from(
    new Set(
      imageMatches.map((m) => {
        let src = m[1];
        if (src.startsWith('/')) src = domain + src;
        return src;
      })
    )
  ).filter((img) => !img.includes('assets') && !img.includes('icons')); // Filter junk

  // 5. Find Pricing API Info
  // Look for the script that calls the API: https://wh.agenyz.ru/api/34469793/product-inventory
  // Pattern: `https://wh.agenyz.ru/api/(\d+)/product-inventory`
  const apiMatch = html.match(/https:\/\/wh\.agenyz\.(?:ru|eu)\/api\/(\d+)\/product-inventory/);

  let priceData = null;

  if (sku && apiMatch) {
    // Construct API URL
    // The script usually has parameters: ?currency=RUB&country_key=ru...&product[SKU]=QTY
    // We can reconstruct a simple call
    const orgId = apiMatch[1];
    // Determine currency/country based on domain
    const currency = domain.includes('.ru') ? 'RUB' : 'EUR';
    const countryKey = domain.includes('.ru') ? 'ru' : 'eu'; // Need to verify 'eu' key for agenyz.eu

    const apiUrl = `https://wh.agenyz.${domain.includes('.ru') ? 'ru' : 'eu'}/api/${orgId}/product-inventory?currency=${currency}&country_key=${countryKey}&product[${encodeURIComponent(sku)}]=1`;

    try {
      const priceRes = await fetch(apiUrl, { headers: { 'User-Agent': USER_AGENT } });
      if (priceRes.ok) {
        priceData = await priceRes.json();
      }
    } catch (e) {
      console.error(`Error fetching price for ${sku}:`, e);
    }
  }

  return {
    url,
    title,
    sku,
    images,
    priceData,
    // fullHtml: html // Too big to save probably
  };
}

async function main() {
  const domain = process.argv.includes('--eu') ? DOMAINS.EU : DOMAINS.RU;
  console.log(`Starting scrape for ${domain}...`);

  const links = await getCatalogLinks(domain);
  console.log(`Identified ${links.length} potential usage pages.`);

  const results = [];
  let count = 0;

  // Limit for testing
  const LIMIT = process.argv.includes('--test') ? 5 : 1000;

  for (const link of links) {
    if (count >= LIMIT) break;
    console.log(`[${count + 1}/${Math.min(links.length, LIMIT)}] Scraping ${link}`);
    const data = await scrapeProduct(link, domain);
    if (data) {
      results.push(data);
    }
    await delay(500); // polite delay
    count++;
  }

  const outFile = path.join(
    process.cwd(),
    `scraped_data_${domain.includes('.ru') ? 'ru' : 'eu'}.json`
  );
  fs.writeFileSync(outFile, JSON.stringify(results, null, 2));
  console.log(`Saved ${results.length} products to ${outFile}`);
}

main().catch(console.error);

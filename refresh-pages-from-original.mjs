import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const base = 'https://nawahenergies.com';
const pages = [
  { url: '/', outs: ['index.html'] },
  { url: '/nawah-energiesabout-us-', outs: ['nawah-energiesabout-us-/index.html', 'about-us/index.html'] },
  { url: '/solutions', outs: ['solutions/index.html'] },
  { url: '/impact-carbon-savings', outs: ['impact-carbon-savings/index.html', 'impact/index.html'] },
  { url: '/investment', outs: ['investment/index.html'] },
  { url: '/contact-nawahs-team-island-energy-project', outs: ['contact-nawahs-team-island-energy-project/index.html', 'contact-us/index.html'] },
];

const localAssetFiles = [
  '_astro-1784102099836/Page._Mw51Upn.js',
  '_astro-1784102099836/ClientHead.Bxkt5-KZ.js',
  '_astro-1784102099836/Integrations.lVwkHJVP.js',
  '_astro-1784102099836/client.C-7hanOZ.js',
  '_astro-1784102099836/_..0kNO_p2j.css',
  '_astro-1784102099836/cookieconsent.DjanN7tQ.css',
];

const assetMap = new Map();

function collectAssetUrls(text) {
  for (const match of text.matchAll(/https?:\/\/(?:(?!&quot;|&#39;)[^\s"'<>\\)])+/g)) {
    const url = match[0].replaceAll('&amp;', '&').replaceAll('&quot;', '').replaceAll('&#39;', '').replace(/[`,;}\]]+$/g, '');
    if (!/(assets\.zyrosite|cdn\.zyrosite|images\.unsplash|images\.pexels|videos\.pexels)/.test(url)) continue;
    const cleanUrl = new URL(url).toString();
    const host = new URL(cleanUrl).hostname;
    const basename = new URL(cleanUrl).pathname.split('/').filter(Boolean).pop()?.replace(/\.[^.]+$/, '');
    if (!basename) continue;
    const dir = join(process.cwd(), 'local-assets', host);
    if (!existsSync(dir)) continue;
    const candidates = readdirSync(dir).filter((name) => name.startsWith(`${basename}-`));
    if (candidates.length) {
      assetMap.set(cleanUrl, `/local-assets/${host}/${candidates[0].replaceAll('\\', '/')}`);
    }
  }
}

function replaceAssets(text) {
  for (const [remote, local] of assetMap) {
    text = text.replaceAll(remote, local).replaceAll(remote.replaceAll('&', '&amp;'), local);
  }
  return text;
}

function addStaticFallbacks(text) {
  text = text.replaceAll('<link rel="preconnect" href="https://assets.zyrosite.com">', '');
  if (!text.includes('/static-fallback.css')) {
    text = text.replace(
      '<link rel="stylesheet" href="/_astro-1784102099836/cookieconsent.DjanN7tQ.css">',
      '<link rel="stylesheet" href="/_astro-1784102099836/cookieconsent.DjanN7tQ.css"><link rel="stylesheet" href="/static-fallback.css">',
    );
  }

  if (!text.includes('static-whatsapp-bubble')) {
    text = text.replace(
      '</body>',
      '<a class="static-whatsapp-bubble" href="https://wa.me/60123799220" target="_blank" rel="noopener" aria-label="Chat on WhatsApp"><svg viewBox="0 0 32 32" aria-hidden="true" focusable="false"><path fill="currentColor" d="M16.04 3.2A12.74 12.74 0 0 0 5.2 22.66L3.6 28.8l6.28-1.64A12.73 12.73 0 1 0 16.04 3.2Zm0 2.34a10.39 10.39 0 1 1-5.3 19.33l-.38-.23-3.73.98 1-3.63-.25-.4A10.39 10.39 0 0 1 16.04 5.54Zm-4.42 5.8c-.23 0-.6.08-.91.43-.31.34-1.2 1.17-1.2 2.86s1.23 3.32 1.4 3.55c.17.23 2.38 3.8 5.88 5.17 2.9 1.14 3.5.91 4.13.86.63-.06 2.04-.83 2.33-1.63.29-.8.29-1.48.2-1.63-.08-.14-.31-.23-.66-.4-.34-.17-2.04-1-2.35-1.12-.31-.11-.54-.17-.77.17-.23.34-.88 1.12-1.08 1.34-.2.23-.4.26-.74.09-.34-.17-1.45-.53-2.77-1.7-1.02-.91-1.71-2.04-1.91-2.38-.2-.34-.02-.53.15-.7.15-.15.34-.4.51-.6.17-.2.23-.34.34-.57.11-.23.06-.43-.03-.6-.08-.17-.77-1.86-1.05-2.55-.28-.67-.56-.58-.77-.59h-.66Z"/></svg></a></body>',
    );
  }

  return text;
}

const fetched = [];
for (const page of pages) {
  const response = await fetch(`${base}${page.url}`);
  if (!response.ok) throw new Error(`Failed ${response.status} ${page.url}`);
  const html = new TextDecoder('utf-8').decode(await response.arrayBuffer());
  fetched.push({ ...page, html });
  collectAssetUrls(html);
}

for (const file of localAssetFiles) {
  if (existsSync(file)) collectAssetUrls(readFileSync(file, 'utf8'));
}

for (const page of fetched) {
  let html = replaceAssets(page.html);
  html = addStaticFallbacks(html);
  for (const out of page.outs) {
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, html, 'utf8');
  }
}

console.log(`Refreshed ${fetched.length} pages from original with ${assetMap.size} local asset mappings.`);

import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, extname, join, relative } from 'node:path';

const root = process.cwd();
const assetRoot = join(root, 'local-assets');
const allowedHosts = new Set([
  'assets.zyrosite.com',
  'cdn.zyrosite.com',
  'images.unsplash.com',
]);
const textExtensions = new Set(['.html', '.css', '.js']);
const skippedDirs = new Set(['.git', '_before-shared-layout-20260629-002916']);

const pagesAndBundles = [
  'index.html',
  'about-us/index.html',
  'contact-us/index.html',
  'impact/index.html',
  'solutions/index.html',
  'investment/index.html',
  'nawah-energiesabout-us-/index.html',
  'impact-carbon-savings/index.html',
  'contact-nawahs-team-island-energy-project/index.html',
  '_astro-1784102099836/Page._Mw51Upn.js',
  '_astro-1784102099836/ClientHead.Bxkt5-KZ.js',
  '_astro-1784102099836/Integrations.lVwkHJVP.js',
  '_astro-1784102099836/_..0kNO_p2j.css',
  '_astro-1784102099836/cookieconsent.DjanN7tQ.css',
];

function hash(value) {
  return createHash('sha1').update(value).digest('hex').slice(0, 12);
}

function safeExtension(url, contentType = '') {
  const pathname = new URL(url).pathname;
  const ext = extname(pathname).toLowerCase();
  if (ext) return ext;
  if (contentType.includes('css')) return '.css';
  if (contentType.includes('font/woff2')) return '.woff2';
  if (contentType.includes('font/woff')) return '.woff';
  if (contentType.includes('png')) return '.png';
  if (contentType.includes('jpeg')) return '.jpg';
  if (contentType.includes('webp')) return '.webp';
  return '.bin';
}

function localPathFor(url, contentType) {
  const parsed = new URL(url);
  const rawName = parsed.pathname.split('/').filter(Boolean).pop() || 'asset';
  const baseName = rawName.replace(/[^a-zA-Z0-9._-]/g, '-').replace(/\.[^.]+$/, '');
  const ext = safeExtension(url, contentType);
  return join(assetRoot, parsed.hostname, `${baseName}-${hash(url)}${ext}`);
}

function findUrls(text) {
  const urls = new Set();
  for (const match of text.matchAll(/https?:\/\/[^\s"'<>\\)]+/g)) {
    const cleaned = match[0]
      .replaceAll('&amp;', '&')
      .replace(/[`,;}\]]+$/g, '');
    try {
      const parsed = new URL(cleaned);
      if (
        allowedHosts.has(parsed.hostname) &&
        parsed.pathname !== '/' &&
        !cleaned.includes('${')
      ) {
        urls.add(parsed.toString());
      }
    } catch {
      // Ignore strings from minified JavaScript that only look like URLs.
    }
  }
  return [...urls];
}

async function download(url, known = new Map()) {
  if (known.has(url)) return known.get(url);

  const response = await fetch(url, {
    headers: {
      'user-agent': 'Mozilla/5.0 Static Asset Localizer',
    },
  });
  if (!response.ok) {
    throw new Error(`Failed ${response.status} ${url}`);
  }

  const contentType = response.headers.get('content-type') || '';
  const filePath = localPathFor(url, contentType);
  mkdirSync(dirname(filePath), { recursive: true });

  if (contentType.includes('text/css')) {
    let css = await response.text();
    for (const nestedUrl of findUrls(css)) {
      const nestedLocal = await download(nestedUrl, known);
      css = replaceUrl(css, nestedUrl, nestedLocal);
    }
    writeFileSync(filePath, css);
  } else {
    const bytes = Buffer.from(await response.arrayBuffer());
    writeFileSync(filePath, bytes);
  }

  const publicPath = `/${relative(root, filePath).replaceAll('\\', '/')}`;
  known.set(url, publicPath);
  return publicPath;
}

function replaceUrl(text, url, localPath) {
  return text
    .replaceAll(url, localPath)
    .replaceAll(url.replaceAll('&', '&amp;'), localPath);
}

const replacements = new Map();
for (const file of pagesAndBundles) {
  const fullPath = join(root, file);
  if (!existsSync(fullPath)) continue;

  const text = readFileSync(fullPath, 'utf8');
  for (const url of findUrls(text)) {
    const localPath = await download(url, replacements);
    replacements.set(url, localPath);
  }
}

for (const file of pagesAndBundles) {
  const fullPath = join(root, file);
  if (!existsSync(fullPath)) continue;

  let text = readFileSync(fullPath, 'utf8');
  for (const [url, localPath] of replacements) {
    text = replaceUrl(text, url, localPath);
  }
  writeFileSync(fullPath, text);
}

console.log(`Localized ${replacements.size} external asset URLs into /local-assets.`);

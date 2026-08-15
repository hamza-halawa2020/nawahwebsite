import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const pages = [
  ['home', 'index.html'],
  ['about', 'nawah-energiesabout-us-/index.html'],
  ['solutions', 'solutions/index.html'],
  ['impact', 'impact-carbon-savings/index.html'],
  ['investment', 'investment/index.html'],
  ['contact', 'contact-nawahs-team-island-energy-project/index.html']
];

const outputDir = path.join(root, 'public', 'static-pages');
await mkdir(outputDir, { recursive: true });

for (const [name, relativePath] of pages) {
  const html = await readFile(path.join(root, relativePath), 'utf8');
  const match = html.match(/<main[\s\S]*?<\/main>/i);

  if (!match) {
    throw new Error(`Could not find <main> in ${relativePath}`);
  }

  const fragment = match[0]
    .replace(/<a class="static-whatsapp-bubble"[\s\S]*?<\/a>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '');

  await writeFile(path.join(outputDir, `${name}.html`), fragment, 'utf8');
  console.log(`Extracted ${name} from ${relativePath}`);
}

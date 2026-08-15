import { copyFile, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const pages = [
  ['public/static-pages/home.html', 'src/app/pages/home-page/home-page.component.html'],
  ['public/static-pages/about.html', 'src/app/pages/about-page/about-page.component.html'],
  ['public/static-pages/solutions.html', 'src/app/pages/solutions-page/solutions-page.component.html'],
  ['public/static-pages/impact.html', 'src/app/pages/impact-page/impact-page.component.html'],
  ['public/static-pages/investment.html', 'src/app/pages/investment-page/investment-page.component.html'],
  ['public/static-pages/contact.html', 'src/app/pages/contact-page/contact-page.component.html']
];

for (const [source, destination] of pages) {
  await copyFile(path.join(root, source), path.join(root, destination));
  const html = await readFile(path.join(root, destination), 'utf8');
  await writeFile(
    path.join(root, destination),
    html.replaceAll('<span> </span>', '<span>&nbsp;</span>'),
    'utf8'
  );
  console.log(`Synced ${destination}`);
}

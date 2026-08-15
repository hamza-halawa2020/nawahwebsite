import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const cp1252 = new Map([
  ['€', 0x80], ['‚', 0x82], ['ƒ', 0x83], ['„', 0x84], ['…', 0x85],
  ['†', 0x86], ['‡', 0x87], ['ˆ', 0x88], ['‰', 0x89], ['Š', 0x8a],
  ['‹', 0x8b], ['Œ', 0x8c], ['Ž', 0x8e], ['‘', 0x91], ['’', 0x92],
  ['“', 0x93], ['”', 0x94], ['•', 0x95], ['–', 0x96], ['—', 0x97],
  ['˜', 0x98], ['™', 0x99], ['š', 0x9a], ['›', 0x9b], ['œ', 0x9c],
  ['ž', 0x9e], ['Ÿ', 0x9f],
]);

const files = [
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
];

function encodeWindows1252(text) {
  const bytes = [];

  for (const char of text) {
    const mapped = cp1252.get(char);
    if (mapped !== undefined) {
      bytes.push(mapped);
      continue;
    }

    const code = char.charCodeAt(0);
    bytes.push(code <= 0xff ? code : 0x3f);
  }

  return Buffer.from(bytes);
}

function fixOnce(text) {
  return new TextDecoder('utf-8', { fatal: false }).decode(encodeWindows1252(text));
}

function score(text) {
  return (text.match(/[ÃÂâ€™€œ€šƒÅØÙ]/g) || []).length;
}

for (const file of files) {
  const path = join(process.cwd(), file);
  if (!existsSync(path)) continue;

  let text = readFileSync(path, 'utf8');
  let best = text;
  let bestScore = score(text);

  for (let i = 0; i < 3; i += 1) {
    text = fixOnce(text);
    const currentScore = score(text);
    if (currentScore <= bestScore) {
      best = text;
      bestScore = currentScore;
    }
  }

  writeFileSync(path, best);
  console.log(`${file}: mojibake score ${bestScore}`);
}

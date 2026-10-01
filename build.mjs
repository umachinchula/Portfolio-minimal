import { readFile, writeFile } from 'node:fs/promises';

let html = await readFile('index.html', 'utf8');
for (const match of [...html.matchAll(/<div data-fragment="([^"]+)"><\/div>/g)]) {
  const fragment = await readFile(match[1], 'utf8');
  html = html.replace(match[0], fragment.trim());
}
html = html.replace('<script type="module" src="page.js"></script>', '<script src="navigation.js" defer></script>');
await writeFile('index.html', html);

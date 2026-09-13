const fs = require('fs');
const path = require('path');

const outDir = path.join(process.cwd(), 'out');
const htmlFiles = [];

function walk(dir) {
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) {
      walk(full);
    } else if (item.name.endsWith('.html')) {
      htmlFiles.push(full);
    }
  }
}

walk(outDir);
console.log('Total HTML files to crawl:', htmlFiles.length);

const brokenLinks = [];
let totalLinks = 0;

for (const file of htmlFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const relPath = path.relative(outDir, file).replace(/\\/g, '/');
  
  const hrefRegex = /href="([^"#]*)(#[^"]*)?"/g;
  let match;
  while ((match = hrefRegex.exec(content)) !== null) {
    totalLinks++;
    const hrefPath = match[1];
    const hash = match[2];

    if (!hrefPath && hash) {
      const targetId = hash.slice(1);
      if (!content.includes('id="' + targetId + '"') && !content.includes('name="' + targetId + '"')) {
        brokenLinks.push({ file: relPath, href: hash, reason: 'Missing anchor ID in page' });
      }
      continue;
    }

    if (hrefPath && hrefPath.startsWith('/')) {
      // Clean query strings if any
      const cleanPath = hrefPath.split('?')[0];
      let targetFile = path.join(outDir, cleanPath.slice(1));
      if (!targetFile.endsWith('.html')) {
        if (fs.existsSync(targetFile + '.html')) {
          targetFile = targetFile + '.html';
        } else if (fs.existsSync(path.join(targetFile, 'index.html'))) {
          targetFile = path.join(targetFile, 'index.html');
        }
      }

      if (!fs.existsSync(targetFile)) {
        brokenLinks.push({ file: relPath, href: hrefPath, reason: 'Target file does not exist in build' });
      } else if (hash) {
        const targetContent = fs.readFileSync(targetFile, 'utf8');
        const targetId = hash.slice(1);
        if (!targetContent.includes('id="' + targetId + '"') && !targetContent.includes('name="' + targetId + '"')) {
          brokenLinks.push({ file: relPath, href: hrefPath + hash, reason: 'Missing anchor ID in target' });
        }
      }
    }
  }
}

console.log('Total link instances checked:', totalLinks);
console.log('Broken links found:', brokenLinks.length);
if (brokenLinks.length > 0) {
  console.log('Broken details:', brokenLinks);
}

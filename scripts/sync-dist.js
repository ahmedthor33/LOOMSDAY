const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const nextDir = path.join(rootDir, '.next');
const distDir = path.join(rootDir, 'dist');
const publicDir = path.join(rootDir, 'public');

try {
  if (fs.existsSync(nextDir)) {
    // 1. Ensure dist directory exists
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true });
    }

    // 2. Copy all .next raw files into dist for Node runtime compatibility
    fs.cpSync(nextDir, distDir, { recursive: true });

    // 3. Copy public assets (images, favicon, etc.) directly into dist/
    if (fs.existsSync(publicDir)) {
      fs.cpSync(publicDir, distDir, { recursive: true });
    }

    // 4. Ensure _next/static is accessible at dist/_next/static
    const nextStatic = path.join(nextDir, 'static');
    const distNextStatic = path.join(distDir, '_next', 'static');
    if (fs.existsSync(nextStatic)) {
      fs.mkdirSync(path.dirname(distNextStatic), { recursive: true });
      fs.cpSync(nextStatic, distNextStatic, { recursive: true });
    }

    // 5. Elevate server-rendered HTML pages directly to root of dist/
    // e.g. .next/server/app/index.html -> dist/index.html, shop.html, cart.html
    const appServerDir = path.join(nextDir, 'server', 'app');
    if (fs.existsSync(appServerDir)) {
      const files = fs.readdirSync(appServerDir);
      for (const file of files) {
        if (file.endsWith('.html')) {
          const srcFile = path.join(appServerDir, file);
          const destFile = path.join(distDir, file);
          fs.copyFileSync(srcFile, destFile);

          // Also create matching folder/index.html (e.g. /shop -> /shop/index.html)
          const baseName = file.replace(/\.html$/, '');
          if (baseName !== 'index' && !baseName.startsWith('_')) {
            const folderPath = path.join(distDir, baseName);
            if (!fs.existsSync(folderPath)) {
              fs.mkdirSync(folderPath, { recursive: true });
            }
            fs.copyFileSync(srcFile, path.join(folderPath, 'index.html'));
          }
        }
      }

      // Pre-create category subroutes with index.html for direct 200 responses
      const shopHtml = path.join(distDir, 'shop.html');
      if (fs.existsSync(shopHtml)) {
        const categories = ['bedsheets', 'pillows', 'duvets'];
        for (const cat of categories) {
          const catFolder = path.join(distDir, 'shop', cat);
          fs.mkdirSync(catFolder, { recursive: true });
          fs.copyFileSync(shopHtml, path.join(catFolder, 'index.html'));
        }
      }

      // Also ensure product/ has index.html
      const productFolder = path.join(distDir, 'product');
      if (!fs.existsSync(productFolder)) {
        fs.mkdirSync(productFolder, { recursive: true });
      }
      if (fs.existsSync(shopHtml)) {
        fs.copyFileSync(shopHtml, path.join(productFolder, 'index.html'));
      }
    }

    // 6. Generate bulletproof production .htaccess without infinite redirect loops
    const htaccessContent = `<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # 1. Prevent recursion: if already redirected internally, stop processing
  RewriteCond %{ENV:REDIRECT_STATUS} 200
  RewriteRule ^ - [L]

  # 2. Do not rewrite existing files or folders (CSS, JS, images, directories)
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]

  # 3. Match exact .html files if requested without extension
  RewriteCond %{REQUEST_FILENAME}.html -f
  RewriteRule ^(.+)$ $1.html [L]

  # 4. Match folder/index.html if available
  RewriteCond %{REQUEST_FILENAME}/index.html -f
  RewriteRule ^(.+)$ $1/index.html [L]

  # 5. Fallback for all other routes to index.html (SPA Fallback)
  RewriteCond %{REQUEST_URI} !^/index\\.html$
  RewriteRule . /index.html [L]
</IfModule>
`;
    fs.writeFileSync(path.join(distDir, '.htaccess'), htaccessContent, 'utf8');

    console.log('✓ Successfully prepared complete dist directory with static subroutes, root index.html, and bulletproof .htaccess.');
  }
} catch (err) {
  console.warn('Note on dist sync:', err.message);
}

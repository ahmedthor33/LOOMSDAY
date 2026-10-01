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
          fs.copyFileSync(
            path.join(appServerDir, file),
            path.join(distDir, file)
          );
        }
      }
    }

    // 6. Generate production .htaccess with clean URL rewrites for Hostinger / LiteSpeed / Apache
    const htaccessContent = `<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME}.html -f
  RewriteRule ^(.*)$ $1.html [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
`;
    fs.writeFileSync(path.join(distDir, '.htaccess'), htaccessContent, 'utf8');

    console.log('✓ Successfully prepared complete dist directory with root index.html, static assets, and .htaccess.');
  }
} catch (err) {
  console.warn('Note on dist sync:', err.message);
}

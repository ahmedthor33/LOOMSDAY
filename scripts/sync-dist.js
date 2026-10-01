const fs = require('fs');
const path = require('path');

const nextDir = path.join(process.cwd(), '.next');
const distDir = path.join(process.cwd(), 'dist');

try {
  if (fs.existsSync(nextDir)) {
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true });
    }
    fs.cpSync(nextDir, distDir, { recursive: true });
    console.log('✓ Successfully synced .next build output to dist directory for Hostinger compatibility.');
  }
} catch (err) {
  console.warn('Note on dist sync:', err.message);
}

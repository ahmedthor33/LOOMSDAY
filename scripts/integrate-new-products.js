const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const catalogPath = 'C:/Users/user/Downloads/loomsday-catalog-2026-10-07.json';

if (!fs.existsSync(catalogPath)) {
  console.error('Catalog file not found at:', catalogPath);
  process.exit(1);
}

const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
console.log('Loaded export file with', catalog.length, 'products.');

const publicImgDir = path.join(rootDir, 'public', 'images', 'products');
const distImgDir = path.join(rootDir, 'dist', 'images', 'products');

if (!fs.existsSync(publicImgDir)) fs.mkdirSync(publicImgDir, { recursive: true });
if (!fs.existsSync(distImgDir)) fs.mkdirSync(distImgDir, { recursive: true });

let extractedImages = 0;
const processedProducts = catalog.map((p) => {
  const productCopy = { ...p };
  
  if (productCopy.images && productCopy.images.length > 0) {
    productCopy.images = productCopy.images.map((img, idx) => {
      const imgCopy = { ...img };
      if (imgCopy.url && imgCopy.url.startsWith('data:image')) {
        const matches = imgCopy.url.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
        if (matches) {
          const ext = 'jpg';
          const fileName = idx === 0 ? (p.slug + '.' + ext) : (p.slug + '-' + idx + '.' + ext);
          const filePath = path.join(publicImgDir, fileName);
          const buffer = Buffer.from(matches[2], 'base64');
          fs.writeFileSync(filePath, buffer);
          
          const distFilePath = path.join(distImgDir, fileName);
          fs.writeFileSync(distFilePath, buffer);
          
          imgCopy.url = '/images/products/' + fileName;
          extractedImages++;
        }
      }
      return imgCopy;
    });
  }
  return productCopy;
});

console.log('Successfully extracted', extractedImages, 'images to', publicImgDir);

// 1. Write clean json
const cleanJsonPath = path.join(rootDir, 'src', 'lib', 'products-data-clean.json');
fs.writeFileSync(cleanJsonPath, JSON.stringify(processedProducts, null, 2), 'utf8');
console.log('Saved', processedProducts.length, 'products to', cleanJsonPath);

// 2. Write catalog-export.json
const catalogExportPath = path.join(rootDir, 'src', 'lib', 'catalog-export.json');
fs.writeFileSync(catalogExportPath, JSON.stringify(processedProducts, null, 2), 'utf8');
console.log('Saved', processedProducts.length, 'products to', catalogExportPath);

// 3. Update products-data.ts using sync-products-to-data.js logic
const targetTsPath = path.join(rootDir, 'src', 'lib', 'products-data.ts');
const content = `import { Product } from "@/types";

export const PRODUCTS: Product[] = ${JSON.stringify(processedProducts, null, 2)};

export interface CrossSellItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  imageUrl: string;
  tagline: string;
  size: string;
  colorName: string;
  colorHex: string;
}

export const CROSS_SELL_ITEMS: CrossSellItem[] = [
  {
    id: "cs-1",
    name: "Natural Lavender Linen Mist",
    slug: "natural-lavender-linen-mist",
    price: 28,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCaRnZ1PQF0OEyclGJ_WHgJWj8cg3MUBgmS4Diq9w0pa0HF570lEkiyhnH0n0Nz73gGLDsxqQsgFKgIQQNHn4wzxk1k0hcKLKROLBr001AFYkzAam6bFlkCYavKTjwABr_ThAAHxF38Cp-8WM97GayFtGdlh6FWzyF2raquroccsF9Ce5diGGuhwWpDhUcH8ExrgsZzMzIGhRHXbmL-FxBsUKFIBTohjeaYEHo6Cy15pVCpV1kbK_PKyw",
    tagline: "Organic French Provence Elixir",
    size: "100ml",
    colorName: "Amber Glass",
    colorHex: "#C59B27",
  },
  {
    id: "cs-2",
    name: "Pure Silk Sleep Eye Mask",
    slug: "pure-silk-sleep-eye-mask",
    price: 35,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuD_q35MAgcDrpiVaZ-YkI2s70wMrVlcBKzmKS0N4rmTjpF9OS2j9ggL0cxz3CgeagnDKPOPoXtfYlkt2ce6ZT2Emq0kMt9iQm5uxT9_HQar4aZOu4mJb0PxCad0mIdFl0mNuhB7P8XYTujbG8d3Hw6EBHZE6uzR_ewrwbm_HzZyRTPmUud0VWlZNIZLa0XBSqh4Kf-qN74DyeuLjlEkTSOyLg_E1-S_UWIszzG4eCBJoq6L0aOerqclJA",
    tagline: "22-Momme Mulberry Silk",
    size: "One Size",
    colorName: "Champagne",
    colorHex: "#DFCFB2",
  },
];
`;

fs.writeFileSync(targetTsPath, content, 'utf8');
console.log('Successfully generated', targetTsPath, 'with', processedProducts.length, 'products!');

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://hkdrxhgemyovniprfglo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhrZHJ4aGdlbXlvdm5pcHJmZ2xvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA4NzA3NTEsImV4cCI6MjEwNjQ0Njc1MX0.X49x8-VCnLxCrzam_tUMfrBL0us2J2nfG57T1xvx_lc';

const supabase = createClient(supabaseUrl, supabaseKey);

function toUUID(str) {
  const h = crypto.createHash('md5').update(str).digest('hex');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-4${h.slice(13, 16)}-a${h.slice(17, 20)}-${h.slice(20, 32)}`;
}

async function uploadCatalog() {
  console.log('--- Starting LOOMSDAY Supabase Cloud Sync ---');

  const cleanJsonPath = path.join(__dirname, '..', 'src', 'lib', 'products-data-clean.json');
  const products = JSON.parse(fs.readFileSync(cleanJsonPath, 'utf8'));

  console.log(`Loaded ${products.length} products to upload.`);

  // 1. Wipe old testing products from Supabase
  console.log('Cleaning old demo test products from Supabase...');
  const demoSlugs = [
    'french-flax-linen-sheet-set',
    'washed-linen-sheet-set',
    'organic-percale-crisp-sheet-set',
    'lustrous-sateen-luxe-bedding-set',
    'heirloom-belgian-flax-fitted-sheet',
    'cloud-goose-down-duvet-insert',
    'heirloom-linen-duvet-cover',
    'lightweight-summer-down-alternative-duvet',
    'pure-silk-french-linen-pillow-pair',
    'linen-pillow-shams-set-of-2',
    'cloud-loft-goose-down-pillow',
    'ergonomic-memory-latex-contour-pillow'
  ];

  for (const slug of demoSlugs) {
    await supabase.from('products').delete().eq('slug', slug);
  }

  // 2. Prepare database rows
  const categoryId = 'c0000000-0000-0000-0000-000000000001'; // Bedsheets

  const productRows = [];
  const variantRows = [];
  const imageRows = [];

  for (const p of products) {
    const pUUID = toUUID('loomsday-prod-' + p.slug);

    productRows.push({
      id: pUUID,
      category_id: categoryId,
      name: p.name,
      slug: p.slug,
      tagline: p.tagline || p.name,
      description: p.description || '',
      base_price: Number(p.basePrice) || 1900,
      rating: Number(p.rating) || 5.0,
      review_count: Number(p.reviewCount) || 1,
      material: p.material || '100% Pure Cotton',
      thread_count_or_gsm: p.threadCountOrGsm || '300 TC',
      origin: p.origin || 'Pakistan',
      is_bestseller: Boolean(p.isBestSeller),
      is_new_arrival: Boolean(p.isNewArrival)
    });

    const variants = p.variants && p.variants.length > 0 ? p.variants : [
      { size: 'King', colorName: 'Warm Ivory', colorHex: '#FAF7F2', price: p.basePrice, stock: 30, sku: `SKU-${p.slug.toUpperCase()}-1` }
    ];

    variants.forEach((v, vIdx) => {
      variantRows.push({
        id: toUUID('loomsday-var-' + p.slug + '-' + vIdx),
        product_id: pUUID,
        size: v.size || 'King',
        color_name: v.colorName || 'Warm Ivory',
        color_hex: v.colorHex || '#FAF7F2',
        price: Number(v.price) || Number(p.basePrice) || 1900,
        stock: typeof v.stock === 'number' ? v.stock : 30,
        sku: v.sku || `SKU-${p.slug.toUpperCase()}-${vIdx + 1}`
      });
    });

    const images = p.images && p.images.length > 0 ? p.images : [
      { url: `/images/products/${p.slug}.jpg`, altText: p.name, sortOrder: 0, isPrimary: true }
    ];

    images.forEach((img, imgIdx) => {
      imageRows.push({
        id: toUUID('loomsday-img-' + p.slug + '-' + imgIdx),
        product_id: pUUID,
        url: img.url || `/images/products/${p.slug}.jpg`,
        alt_text: img.altText || p.name,
        sort_order: img.sortOrder ?? imgIdx,
        is_primary: Boolean(img.isPrimary ?? (imgIdx === 0))
      });
    });
  }

  // 3. Upsert products in batches of 10
  console.log(`Upserting ${productRows.length} products to Supabase...`);
  for (let i = 0; i < productRows.length; i += 10) {
    const chunk = productRows.slice(i, i + 10);
    const { error } = await supabase.from('products').upsert(chunk, { onConflict: 'slug' });
    if (error) {
      console.error(`Error upserting product chunk ${i}:`, error);
    } else {
      process.stdout.write(`.` );
    }
  }
  console.log('\nProducts upserted successfully.');

  // 4. Upsert variants
  console.log(`Upserting ${variantRows.length} variants to Supabase...`);
  for (let i = 0; i < variantRows.length; i += 10) {
    const chunk = variantRows.slice(i, i + 10);
    const { error } = await supabase.from('product_variants').upsert(chunk, { onConflict: 'id' });
    if (error) {
      console.error(`Error upserting variant chunk ${i}:`, error);
    } else {
      process.stdout.write(`.` );
    }
  }
  console.log('\nVariants upserted successfully.');

  // 5. Upsert images
  console.log(`Upserting ${imageRows.length} images to Supabase...`);
  for (let i = 0; i < imageRows.length; i += 10) {
    const chunk = imageRows.slice(i, i + 10);
    const { error } = await supabase.from('product_images').upsert(chunk, { onConflict: 'id' });
    if (error) {
      console.error(`Error upserting image chunk ${i}:`, error);
    } else {
      process.stdout.write(`.` );
    }
  }
  console.log('\nImages upserted successfully.');

  // 6. Verify total products, variants, images in Supabase
  const { data: pData } = await supabase.from('products').select('id');
  const { data: vData } = await supabase.from('product_variants').select('id');
  const { data: iData } = await supabase.from('product_images').select('id');

  console.log(`\n🎉 Verification Complete:`);
  console.log(`- Products in Cloud: ${pData ? pData.length : 0}`);
  console.log(`- Variants in Cloud: ${vData ? vData.length : 0}`);
  console.log(`- Images in Cloud: ${iData ? iData.length : 0}`);
}

uploadCatalog().catch(err => {
  console.error('Fatal error in uploadCatalog:', err);
});

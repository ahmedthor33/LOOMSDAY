const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();

// 1. Patch src/lib/catalog-service.ts
const catalogServicePath = path.join(rootDir, 'src', 'lib', 'catalog-service.ts');
let csContent = fs.readFileSync(catalogServicePath, 'utf8');

const target1 = `    return mapped;
  } catch (err) {`;

const replace1 = `    // Ensure all master catalog products from PRODUCTS are included even if Supabase has fewer items
    const existingSlugs = new Set(mapped.map((m) => m.slug));
    const existingIds = new Set(mapped.map((m) => m.id));
    for (const bp of PRODUCTS) {
      if (!existingSlugs.has(bp.slug) && !existingIds.has(bp.id)) {
        mapped.push(bp);
      }
    }

    return mapped;
  } catch (err) {`;

if (csContent.includes(target1)) {
  csContent = csContent.replace(target1, replace1);
  fs.writeFileSync(catalogServicePath, csContent, 'utf8');
  console.log('Patched catalog-service.ts');
} else {
  console.log('Target 1 not found in catalog-service.ts or already patched');
}

// 2. Patch src/store/useAdminStore.ts
const adminStorePath = path.join(rootDir, 'src', 'store', 'useAdminStore.ts');
let asContent = fs.readFileSync(adminStorePath, 'utf8');

asContent = asContent.replace(
  'eyebrow: "THE COMPLETE ARCHIVE : 55 PIECES",',
  'eyebrow: "THE COMPLETE ARCHIVE : 81 PIECES",'
);

const rehydrateTarget = `      onRehydrateStorage: () => (state) => {
        if (state && (!Array.isArray(state.products) || state.products.length === 0)) {
          state.products = PRODUCTS;
        }
      },`;

const rehydrateReplace = `      onRehydrateStorage: () => (state) => {
        if (state) {
          if (!Array.isArray(state.products) || state.products.length === 0) {
            state.products = PRODUCTS;
          } else if (state.products.length < PRODUCTS.length) {
            const existingMap = new Map(state.products.map((p) => [p.slug || p.id, p]));
            PRODUCTS.forEach((p) => {
              if (!existingMap.has(p.slug || p.id)) {
                existingMap.set(p.slug || p.id, p);
              }
            });
            state.products = Array.from(existingMap.values());
          }
        }
      },`;

if (asContent.includes(rehydrateTarget)) {
  asContent = asContent.replace(rehydrateTarget, rehydrateReplace);
}

fs.writeFileSync(adminStorePath, asContent, 'utf8');
console.log('Patched useAdminStore.ts');

// 3. Patch src/app/shop/page.tsx
const shopPagePath = path.join(rootDir, 'src', 'app', 'shop', 'page.tsx');
let spContent = fs.readFileSync(shopPagePath, 'utf8');

const spTarget = `      // 3. Live cloud sync from Supabase
      try {
        const cloudProds = await fetchSupabaseProducts();
        if (cloudProds && cloudProds.length > 0 && !isCancelled) {
          setLocalProducts(cloudProds);
        }
      } catch {}`;

const spReplace = `      // 3. Live cloud sync from Supabase
      try {
        const cloudProds = await fetchSupabaseProducts();
        if (cloudProds && cloudProds.length > 0 && !isCancelled) {
          const mergedMap = new Map<string, Product>();
          cloudProds.forEach((p) => mergedMap.set(p.slug || p.id, p));
          PRODUCTS.forEach((p) => {
            if (!mergedMap.has(p.slug || p.id)) {
              mergedMap.set(p.slug || p.id, p);
            }
          });
          setLocalProducts(Array.from(mergedMap.values()));
        }
      } catch {}`;

if (spContent.includes(spTarget)) {
  spContent = spContent.replace(spTarget, spReplace);
  fs.writeFileSync(shopPagePath, spContent, 'utf8');
  console.log('Patched shop/page.tsx');
}

// 4. Patch src/app/page.tsx
const homePagePath = path.join(rootDir, 'src', 'app', 'page.tsx');
let hpContent = fs.readFileSync(homePagePath, 'utf8');

const hpTarget = `      // 3. Live cloud sync from Supabase (pulls newly added products on any device)
      try {
        const cloudProds = await fetchSupabaseProducts();
        if (cloudProds && cloudProds.length > 0 && !isCancelled) {
          setLocalProducts(cloudProds);
        }
      } catch {}`;

const hpReplace = `      // 3. Live cloud sync from Supabase (pulls newly added products on any device)
      try {
        const cloudProds = await fetchSupabaseProducts();
        if (cloudProds && cloudProds.length > 0 && !isCancelled) {
          const mergedMap = new Map<string, Product>();
          cloudProds.forEach((p) => mergedMap.set(p.slug || p.id, p));
          PRODUCTS.forEach((p) => {
            if (!mergedMap.has(p.slug || p.id)) {
              mergedMap.set(p.slug || p.id, p);
            }
          });
          setLocalProducts(Array.from(mergedMap.values()));
        }
      } catch {}`;

if (hpContent.includes(hpTarget)) {
  hpContent = hpContent.replace(hpTarget, hpReplace);
  fs.writeFileSync(homePagePath, hpContent, 'utf8');
  console.log('Patched app/page.tsx');
}

// 5. Patch src/app/shop/[category]/CategoryClientView.tsx
const catViewPath = path.join(rootDir, 'src', 'app', 'shop', '[category]', 'CategoryClientView.tsx');
let cvContent = fs.readFileSync(catViewPath, 'utf8');

const cvTarget = `      // 3. Live cloud sync from Supabase
      try {
        const cloudProds = await fetchSupabaseProducts();
        if (cloudProds && cloudProds.length > 0 && !isCancelled) {
          setLocalProducts(cloudProds);
        }
      } catch {}`;

const cvReplace = `      // 3. Live cloud sync from Supabase
      try {
        const cloudProds = await fetchSupabaseProducts();
        if (cloudProds && cloudProds.length > 0 && !isCancelled) {
          const mergedMap = new Map<string, Product>();
          cloudProds.forEach((p) => mergedMap.set(p.slug || p.id, p));
          PRODUCTS.forEach((p) => {
            if (!mergedMap.has(p.slug || p.id)) {
              mergedMap.set(p.slug || p.id, p);
            }
          });
          setLocalProducts(Array.from(mergedMap.values()));
        }
      } catch {}`;

if (cvContent.includes(cvTarget)) {
  cvContent = cvContent.replace(cvTarget, cvReplace);
  fs.writeFileSync(catViewPath, cvContent, 'utf8');
  console.log('Patched CategoryClientView.tsx');
}

// 6. Patch src/components/layout/SearchModal.tsx
const searchModalPath = path.join(rootDir, 'src', 'components', 'layout', 'SearchModal.tsx');
let smContent = fs.readFileSync(searchModalPath, 'utf8');

const smTarget = `      try {
        const cloudProds = await fetchSupabaseProducts();
        if (cloudProds && cloudProds.length > 0 && !isCancelled) {
          setLocalProducts(cloudProds);
        }
      } catch {}`;

const smReplace = `      try {
        const cloudProds = await fetchSupabaseProducts();
        if (cloudProds && cloudProds.length > 0 && !isCancelled) {
          const mergedMap = new Map<string, Product>();
          cloudProds.forEach((p) => mergedMap.set(p.slug || p.id, p));
          PRODUCTS.forEach((p) => {
            if (!mergedMap.has(p.slug || p.id)) {
              mergedMap.set(p.slug || p.id, p);
            }
          });
          setLocalProducts(Array.from(mergedMap.values()));
        }
      } catch {}`;

if (smContent.includes(smTarget)) {
  smContent = smContent.replace(smTarget, smReplace);
  fs.writeFileSync(searchModalPath, smContent, 'utf8');
  console.log('Patched SearchModal.tsx');
}

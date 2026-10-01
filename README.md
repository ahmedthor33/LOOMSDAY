# LOOMSDAY — Luxury Bedding & Rest Sanctuary

> **Production-Ready E-Commerce Platform** matching Google Stitch designs pixel-close: colors, typography, spacing, and luxury editorial aesthetics.

[![Next.js](https://img.shields.io/badge/Next.js-16_App_Router-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth_%26_PostgreSQL-3ecf8e)](https://supabase.com/)
[![Zustand](https://img.shields.io/badge/Zustand-State_Management-orange)](https://zustand-demo.pmnd.rs/)

---

## 🏛️ Design System & Aesthetic (`Serene Sanctuary`)

- **Palette**: Tactile Warm Ivory (`#FAF7F2`), Deep Charcoal (`#1C1C19`), Muted Champagne Gold (`#B89B6A`), Sandstone hairlines (`#E2D9CC`), and volcanic stone-washed hues (`#8A9A86`, `#E5DCC5`).
- **Typography**: Editorial pairings featuring **Playfair Display** for high-contrast serif literary headlines and **Inter** for neutral, hyper-legible body & micro-labels.
- **Elevation**: Diffused warm charcoal ambient shadow (`0 12px 32px -4px rgba(28, 28, 28, 0.05)`).
- **Icons**: Material Symbols Outlined.

---

## 🌐 Routes & Pages

| Route | Description |
| :--- | :--- |
| `/` | Landing page: Hero with golden morning light, Category Grid, Filterable Bestsellers, Provenance Bento Mosaic, Press & Reviews |
| `/shop` | Full Bedding Collection with multi-faceted sidebar filters (size, color, material, price), sorting, and 3-col/4-col density toggles |
| `/shop/[category]` | Dynamic category collections (`/shop/bedsheets`, `/shop/pillows`, `/shop/duvets`) |
| `/product/[slug]` | Product Detail Page (PDP): 60/40 split gallery, color swatches, size selector pills with live price differences, quantity stepper, "What's Included", specifications accordions, verified customer reviews, and size guide modal |
| `/wishlist` | Saved Sanctuary: 14-day reservation indicator, "Move to Cart", "Move All to Cart", Share Wishlist modal with copyable link, and quiet state toggle |
| `/cart` | Full Cart: Two-column layout with White-Glove Monogramming progress bar ($715 target), steppers, promo code field (`SANCTUARY15`, `WELCOME10`), live tax and shipping calculations |
| `/sign-in` | Split-screen login: Google OAuth, email/password validation, remember me, and 1-Click VIP Demo Login |
| `/sign-up` | Split-screen registration: Google OAuth, dynamic 3-stage password security indicator, and concierge charter acceptance |
| `/forgot-password`| Password recovery request with confirmation states |
| `/account` | Protected Member Concierge: VIP badge, order history with tracking numbers, item breakdowns, and shipping address management |

---

## ⚡ Core Features

1. **Slide-Out Mini Cart Drawer**:
   - Opens smoothly from the right whenever an item is added or the bag icon is clicked.
   - Live free shipping progress threshold ($100 complimentary delivery).
   - In-drawer "Frequently Paired" cross-sell module (Lavender Linen Mist $28, Pure Silk Eye Mask $35) with single-click quick-add.
2. **Persistent Cart & Wishlist**:
   - Built on **Zustand** with `localStorage` persistence for visitors.
   - Synchronizes seamlessly with Supabase database for authenticated sessions.
3. **Instant Search Modal**:
   - Accessible via search button or keyboard shortcut (`Cmd/Ctrl + K` or `/`).
   - Autocomplete filtering across names, materials, and categories.
4. **1-Click VIP Demo Mode**:
   - Test signed-in states instantly (as VIP Collector *Eleanor Vane*) without requiring remote database configuration.

---

## 🛠️ Getting Started

### 1. Prerequisites
- Node.js 18+ (tested on Node v20/v24)
- npm or pnpm

### 2. Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd loomsday-bedding

# Install dependencies
npm install
```

### 3. Environment Configuration
Copy the example environment file:
```bash
cp .env.example .env.local
```

Fill in your Supabase credentials in `.env.local` (optional for local browsing, as a full offline demo fallback is included):
```ini
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Database Setup (Supabase)
1. Open your Supabase project dashboard.
2. Navigate to the **SQL Editor**.
3. Run `supabase/schema.sql` to create all 9 tables with Row Level Security (RLS) policies.
4. Run `supabase/seed.sql` to populate the 12 luxury bedding products, variants, categories, and photography records.

### 5. Running the Dev Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Production Build
```bash
npm run build
npm run start
```

---

## 📦 Database Schema (9 Tables with RLS)

- `profiles`: User information, phone, shipping addresses
- `categories`: Bedding categories (`bedsheets`, `pillows`, `duvets`)
- `products`: Product names, materials, thread count/GSM, ratings, origins
- `product_variants`: Size (Twin, Full, Queen, King, Cal King), color swatches, prices, stock, SKUs
- `product_images`: High-resolution photography records with sort orders
- `wishlist_items`: User-saved items with RLS policies
- `cart_items`: User cart items with RLS policies
- `orders`: Order totals, discounts, shipping status, tracking numbers
- `order_items`: Order line items with historical price snapshots

---

## 🌟 Quality & Performance Highlights

- **Mobile-First & Responsive**: Handcrafted breakpoints for mobile (375px), tablet (768px), and wide monitors (1440px+).
- **Accessibility**: Semantic HTML5 tags (`header`, `main`, `nav`, `section`, `article`, `footer`), explicit `aria-label` attributes on buttons, focus rings, and readable color contrast.
- **SEO Ready**: Dynamic OpenGraph tags, meta descriptions, and dynamic `sitemap.ts`.
- **Zero Third-Party Image Bloat**: Optimized with Next.js image caching and responsive `sizes` attributes.

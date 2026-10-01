-- ==============================================================================
-- LOOMSDAY Luxury Bedding - Complete Test Data Purge Script
-- Cleans testing orders, products, inventory variants, reviews, and test profiles.
-- Preserves Super Admin (ahmedthor33@gmail.com) and base category taxonomy.
-- ==============================================================================

-- 1. Wipe all test orders and line items
TRUNCATE TABLE public.order_items CASCADE;
TRUNCATE TABLE public.orders CASCADE;

-- 2. Wipe customer wishlists and reviews
TRUNCATE TABLE public.wishlists CASCADE;
TRUNCATE TABLE public.reviews CASCADE;

-- 3. Wipe all testing inventory variants, images, and products
TRUNCATE TABLE public.product_variants CASCADE;
TRUNCATE TABLE public.product_images CASCADE;
TRUNCATE TABLE public.products CASCADE;

-- 4. Clean mock customer profiles, preserving only the Super Admin account
DELETE FROM public.profiles 
WHERE id NOT IN (
  SELECT id FROM auth.users WHERE email = 'ahmedthor33@gmail.com'
);

-- 5. Ensure core product categories exist for future real listings
INSERT INTO public.categories (id, name, slug, description, sort_order) VALUES
('c0000000-0000-0000-0000-000000000001', 'Bedsheets', 'bedsheets', 'Fitted & Flat French Linen and high-thread cotton sateen designed for immediate softness.', 1),
('c0000000-0000-0000-0000-000000000002', 'Pillows & Covers', 'pillows', 'Cloud-loft Down Pillows and pure linen envelope shams that elevate cervical relaxation.', 2),
('c0000000-0000-0000-0000-000000000003', 'Duvets & Inserts', 'duvets', 'All-season breathable French flax covers paired with hypoallergenic goose-down inserts.', 3)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  sort_order = EXCLUDED.sort_order;

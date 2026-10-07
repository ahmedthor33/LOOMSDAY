-- ==============================================================================
-- LOOMSDAY: 81-Product Catalog Sync & Permission Unlock
-- ==============================================================================

-- 1. UNLOCK RLS PERMISSIONS FOR CATALOG MANAGEMENT
-- Allows the store owner terminal to push products, variants, and images
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images DISABLE ROW LEVEL SECURITY;

-- Ensure default category exists
INSERT INTO public.categories (id, name, slug, description, sort_order)
VALUES ('c0000000-0000-0000-0000-000000000001', 'Bedsheets', 'bedsheets', 'Pure Normandy flax and organic cotton bedsheet sets.', 1)
ON CONFLICT (slug) DO NOTHING;

-- 2. INSERT / UPSERT ALL 81 PRODUCTS

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  'cd6fd9d5-8b7f-464c-a233-1a45624e90bc', 'c0000000-0000-0000-0000-000000000001', '4Pc Velvet Jacquard Bedsheet Set (King Size)', '4pc-velvet-jacquard-bedsheet-set-king-size-26', 'Plush velvet. Woven luxury. Colour that lasts.',
  '4Pc Velvet Jacquard Bedsheet Set (King Size)

Tagline: Plush velvet. Woven luxury. Colour that lasts.

Overview

Give your bedroom the look of a boutique hotel suite. This 4-piece King Size set is made from rich velvet jacquard, a fabric known for its soft, plush feel and its elegant woven pattern. The pattern is woven into the fabric rather than printed on it, so the design has depth, texture and a subtle sheen that catches the light. It suits both modern and classic décor, and it works well for everyday use as well as for wedding, gifting and festive occasions.

What''s in the Set
Piece	Quantity	Size
Bedsheet	1	95 × 95 inches
Pillow Covers	2	19 × 29 inches
Cushion Cover	1	15 × 15 inches

The generous 95 × 95 inch bedsheet covers a King Size bed with room to tuck in. The pillow covers fit standard bed pillows, and the matching cushion cover adds a finishing touch.

Key Features
Velvet jacquard fabric: soft and smooth to the touch, with a rich, premium look.
Woven pattern: the design is built into the fabric, so it won''t fade or peel like a surface print.
100% colour guarantee: the colours stay vivid and true, wash after wash.
Complete coordinated set: the bedsheet, pillow covers and cushion cover match, so the bed looks styled straight away.
Warm and cosy feel: velvet is comfortable and inviting, especially in cooler months.
Gift-worthy: a good choice for weddings, housewarmings and festive gifting.
Care Instructions
Wash gently in cold or lukewarm water.
Wash with similar colours and turn the pieces inside out.
Use a mild detergent and avoid bleach.
Dry in shade and iron on low heat on the reverse side.
Why You''ll Love It

It looks like a luxury hotel bed, feels soft against the skin, and the design stays vibrant for a long time. The matching pieces mean you don''t have to buy extras to style your bed.', 3500, 5, 1, '100% Velvet Jacquard',
  '300 TC', 'Pakistan', false, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('4e45e218-3808-4f5a-aa0c-6954b62de446', 'cd6fd9d5-8b7f-464c-a233-1a45624e90bc', 'King', 'Warm Ivory', '#FAF7F2', 3500, 30, '4PC--KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('4bffcf2c-df51-4b89-a1ba-430a6fb15f64', 'cd6fd9d5-8b7f-464c-a233-1a45624e90bc', '/images/products/4pc-velvet-jacquard-bedsheet-set-king-size-26.jpg', '4Pc Velvet Jacquard Bedsheet Set (King Size) styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  '03a49915-7a2b-4e55-a506-543737e982bb', 'c0000000-0000-0000-0000-000000000001', '4Pc Velvet Jacquard Bedsheet Set (King Size)', '4pc-velvet-jacquard-bedsheet-set-king-size-25', 'Plush velvet. Woven luxury. Colour that lasts.',
  '4Pc Velvet Jacquard Bedsheet Set (King Size)

Tagline: Plush velvet. Woven luxury. Colour that lasts.

Overview

Give your bedroom the look of a boutique hotel suite. This 4-piece King Size set is made from rich velvet jacquard, a fabric known for its soft, plush feel and its elegant woven pattern. The pattern is woven into the fabric rather than printed on it, so the design has depth, texture and a subtle sheen that catches the light. It suits both modern and classic décor, and it works well for everyday use as well as for wedding, gifting and festive occasions.

What''s in the Set
Piece	Quantity	Size
Bedsheet	1	95 × 95 inches
Pillow Covers	2	19 × 29 inches
Cushion Cover	1	15 × 15 inches

The generous 95 × 95 inch bedsheet covers a King Size bed with room to tuck in. The pillow covers fit standard bed pillows, and the matching cushion cover adds a finishing touch.

Key Features
Velvet jacquard fabric: soft and smooth to the touch, with a rich, premium look.
Woven pattern: the design is built into the fabric, so it won''t fade or peel like a surface print.
100% colour guarantee: the colours stay vivid and true, wash after wash.
Complete coordinated set: the bedsheet, pillow covers and cushion cover match, so the bed looks styled straight away.
Warm and cosy feel: velvet is comfortable and inviting, especially in cooler months.
Gift-worthy: a good choice for weddings, housewarmings and festive gifting.
Care Instructions
Wash gently in cold or lukewarm water.
Wash with similar colours and turn the pieces inside out.
Use a mild detergent and avoid bleach.
Dry in shade and iron on low heat on the reverse side.
Why You''ll Love It

It looks like a luxury hotel bed, feels soft against the skin, and the design stays vibrant for a long time. The matching pieces mean you don''t have to buy extras to style your bed.', 3500, 5, 1, '100% Velvet Jacquard',
  '300 TC', 'Pakistan', false, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('36de772f-ec60-4bc7-a49f-6c49a2d2509a', '03a49915-7a2b-4e55-a506-543737e982bb', 'King', 'Warm Ivory', '#FAF7F2', 3500, 30, '4PC--KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('27e6f926-c0e5-4c1d-adfd-ea4045caa800', '03a49915-7a2b-4e55-a506-543737e982bb', '/images/products/4pc-velvet-jacquard-bedsheet-set-king-size-25.jpg', '4Pc Velvet Jacquard Bedsheet Set (King Size) styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  'e4228a90-86f8-4f8d-a4cb-138c7c41bbb7', 'c0000000-0000-0000-0000-000000000001', '4Pc Velvet Jacquard Bedsheet Set (King Size)', '4pc-velvet-jacquard-bedsheet-set-king-size-24', 'Plush velvet. Woven luxury. Colour that lasts.',
  '4Pc Velvet Jacquard Bedsheet Set (King Size)

Tagline: Plush velvet. Woven luxury. Colour that lasts.

Overview

Give your bedroom the look of a boutique hotel suite. This 4-piece King Size set is made from rich velvet jacquard, a fabric known for its soft, plush feel and its elegant woven pattern. The pattern is woven into the fabric rather than printed on it, so the design has depth, texture and a subtle sheen that catches the light. It suits both modern and classic décor, and it works well for everyday use as well as for wedding, gifting and festive occasions.

What''s in the Set
Piece	Quantity	Size
Bedsheet	1	95 × 95 inches
Pillow Covers	2	19 × 29 inches
Cushion Cover	1	15 × 15 inches

The generous 95 × 95 inch bedsheet covers a King Size bed with room to tuck in. The pillow covers fit standard bed pillows, and the matching cushion cover adds a finishing touch.

Key Features
Velvet jacquard fabric: soft and smooth to the touch, with a rich, premium look.
Woven pattern: the design is built into the fabric, so it won''t fade or peel like a surface print.
100% colour guarantee: the colours stay vivid and true, wash after wash.
Complete coordinated set: the bedsheet, pillow covers and cushion cover match, so the bed looks styled straight away.
Warm and cosy feel: velvet is comfortable and inviting, especially in cooler months.
Gift-worthy: a good choice for weddings, housewarmings and festive gifting.
Care Instructions
Wash gently in cold or lukewarm water.
Wash with similar colours and turn the pieces inside out.
Use a mild detergent and avoid bleach.
Dry in shade and iron on low heat on the reverse side.
Why You''ll Love It

It looks like a luxury hotel bed, feels soft against the skin, and the design stays vibrant for a long time. The matching pieces mean you don''t have to buy extras to style your bed.', 3500, 5, 1, '100% Velvet Jacquard',
  '300 TC', 'Pakistan', false, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('e216995a-4870-4890-ab9e-1cbb270fdb7f', 'e4228a90-86f8-4f8d-a4cb-138c7c41bbb7', 'King', 'Warm Ivory', '#FAF7F2', 3500, 30, '4PC--KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('995f787c-9ace-4514-adc3-ae0434121305', 'e4228a90-86f8-4f8d-a4cb-138c7c41bbb7', '/images/products/4pc-velvet-jacquard-bedsheet-set-king-size-24.jpg', '4Pc Velvet Jacquard Bedsheet Set (King Size) styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  '365d9709-ab2d-4e83-acb5-a7b2288a4cb6', 'c0000000-0000-0000-0000-000000000001', '4Pc Velvet Jacquard Bedsheet Set (King Size)', '4pc-velvet-jacquard-bedsheet-set-king-size-23', 'Plush velvet. Woven luxury. Colour that lasts.',
  '4Pc Velvet Jacquard Bedsheet Set (King Size)

Tagline: Plush velvet. Woven luxury. Colour that lasts.

Overview

Give your bedroom the look of a boutique hotel suite. This 4-piece King Size set is made from rich velvet jacquard, a fabric known for its soft, plush feel and its elegant woven pattern. The pattern is woven into the fabric rather than printed on it, so the design has depth, texture and a subtle sheen that catches the light. It suits both modern and classic décor, and it works well for everyday use as well as for wedding, gifting and festive occasions.

What''s in the Set
Piece	Quantity	Size
Bedsheet	1	95 × 95 inches
Pillow Covers	2	19 × 29 inches
Cushion Cover	1	15 × 15 inches

The generous 95 × 95 inch bedsheet covers a King Size bed with room to tuck in. The pillow covers fit standard bed pillows, and the matching cushion cover adds a finishing touch.

Key Features
Velvet jacquard fabric: soft and smooth to the touch, with a rich, premium look.
Woven pattern: the design is built into the fabric, so it won''t fade or peel like a surface print.
100% colour guarantee: the colours stay vivid and true, wash after wash.
Complete coordinated set: the bedsheet, pillow covers and cushion cover match, so the bed looks styled straight away.
Warm and cosy feel: velvet is comfortable and inviting, especially in cooler months.
Gift-worthy: a good choice for weddings, housewarmings and festive gifting.
Care Instructions
Wash gently in cold or lukewarm water.
Wash with similar colours and turn the pieces inside out.
Use a mild detergent and avoid bleach.
Dry in shade and iron on low heat on the reverse side.
Why You''ll Love It

It looks like a luxury hotel bed, feels soft against the skin, and the design stays vibrant for a long time. The matching pieces mean you don''t have to buy extras to style your bed.', 3500, 5, 1, '100% Velvet Jacquard',
  '300 TC', 'Pakistan', false, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('05b36166-ca25-4e00-af57-7d4d506fbdf9', '365d9709-ab2d-4e83-acb5-a7b2288a4cb6', 'King', 'Warm Ivory', '#FAF7F2', 3500, 30, '4PC--KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('3dec9e48-652e-4d77-af5c-a972fba020d2', '365d9709-ab2d-4e83-acb5-a7b2288a4cb6', '/images/products/4pc-velvet-jacquard-bedsheet-set-king-size-23.jpg', '4Pc Velvet Jacquard Bedsheet Set (King Size) styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  'a6aefaf9-f14e-4926-a471-1f573cdc147b', 'c0000000-0000-0000-0000-000000000001', '4Pc Velvet Jacquard Bedsheet Set (King Size)', '4pc-velvet-jacquard-bedsheet-set-king-size-22', 'Plush velvet. Woven luxury. Colour that lasts.',
  '4Pc Velvet Jacquard Bedsheet Set (King Size)

Tagline: Plush velvet. Woven luxury. Colour that lasts.

Overview

Give your bedroom the look of a boutique hotel suite. This 4-piece King Size set is made from rich velvet jacquard, a fabric known for its soft, plush feel and its elegant woven pattern. The pattern is woven into the fabric rather than printed on it, so the design has depth, texture and a subtle sheen that catches the light. It suits both modern and classic décor, and it works well for everyday use as well as for wedding, gifting and festive occasions.

What''s in the Set
Piece	Quantity	Size
Bedsheet	1	95 × 95 inches
Pillow Covers	2	19 × 29 inches
Cushion Cover	1	15 × 15 inches

The generous 95 × 95 inch bedsheet covers a King Size bed with room to tuck in. The pillow covers fit standard bed pillows, and the matching cushion cover adds a finishing touch.

Key Features
Velvet jacquard fabric: soft and smooth to the touch, with a rich, premium look.
Woven pattern: the design is built into the fabric, so it won''t fade or peel like a surface print.
100% colour guarantee: the colours stay vivid and true, wash after wash.
Complete coordinated set: the bedsheet, pillow covers and cushion cover match, so the bed looks styled straight away.
Warm and cosy feel: velvet is comfortable and inviting, especially in cooler months.
Gift-worthy: a good choice for weddings, housewarmings and festive gifting.
Care Instructions
Wash gently in cold or lukewarm water.
Wash with similar colours and turn the pieces inside out.
Use a mild detergent and avoid bleach.
Dry in shade and iron on low heat on the reverse side.
Why You''ll Love It

It looks like a luxury hotel bed, feels soft against the skin, and the design stays vibrant for a long time. The matching pieces mean you don''t have to buy extras to style your bed.', 3500, 5, 1, '100% Velvet Jacquard',
  '300 TC', 'Pakistan', false, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('8ec94621-6e08-439e-a24e-39dd5d45f27b', 'a6aefaf9-f14e-4926-a471-1f573cdc147b', 'King', 'Warm Ivory', '#FAF7F2', 3500, 30, '4PC--KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('730c6f6d-2250-4a58-a4ad-3aab5609ba25', 'a6aefaf9-f14e-4926-a471-1f573cdc147b', '/images/products/4pc-velvet-jacquard-bedsheet-set-king-size-22.jpg', '4Pc Velvet Jacquard Bedsheet Set (King Size) styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  '4fc5da2f-3ad5-478d-abb7-afd51defb49c', 'c0000000-0000-0000-0000-000000000001', '4Pc Velvet Jacquard Bedsheet Set (King Size)', '4pc-velvet-jacquard-bedsheet-set-king-size-21', 'Plush velvet. Woven luxury. Colour that lasts.',
  '4Pc Velvet Jacquard Bedsheet Set (King Size)

Tagline: Plush velvet. Woven luxury. Colour that lasts.

Overview

Give your bedroom the look of a boutique hotel suite. This 4-piece King Size set is made from rich velvet jacquard, a fabric known for its soft, plush feel and its elegant woven pattern. The pattern is woven into the fabric rather than printed on it, so the design has depth, texture and a subtle sheen that catches the light. It suits both modern and classic décor, and it works well for everyday use as well as for wedding, gifting and festive occasions.

What''s in the Set
Piece	Quantity	Size
Bedsheet	1	95 × 95 inches
Pillow Covers	2	19 × 29 inches
Cushion Cover	1	15 × 15 inches

The generous 95 × 95 inch bedsheet covers a King Size bed with room to tuck in. The pillow covers fit standard bed pillows, and the matching cushion cover adds a finishing touch.

Key Features
Velvet jacquard fabric: soft and smooth to the touch, with a rich, premium look.
Woven pattern: the design is built into the fabric, so it won''t fade or peel like a surface print.
100% colour guarantee: the colours stay vivid and true, wash after wash.
Complete coordinated set: the bedsheet, pillow covers and cushion cover match, so the bed looks styled straight away.
Warm and cosy feel: velvet is comfortable and inviting, especially in cooler months.
Gift-worthy: a good choice for weddings, housewarmings and festive gifting.
Care Instructions
Wash gently in cold or lukewarm water.
Wash with similar colours and turn the pieces inside out.
Use a mild detergent and avoid bleach.
Dry in shade and iron on low heat on the reverse side.
Why You''ll Love It

It looks like a luxury hotel bed, feels soft against the skin, and the design stays vibrant for a long time. The matching pieces mean you don''t have to buy extras to style your bed.', 3500, 5, 1, '100%Velvet Jacquard',
  '300 TC', 'Pakistan', false, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('e9599d0e-2fab-4f24-a801-bfd1ffbca953', '4fc5da2f-3ad5-478d-abb7-afd51defb49c', 'King', 'Warm Ivory', '#FAF7F2', 3500, 30, '4PC--KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('01f5ad0d-a448-460d-a893-9ec9f0887e4a', '4fc5da2f-3ad5-478d-abb7-afd51defb49c', '/images/products/4pc-velvet-jacquard-bedsheet-set-king-size-21.jpg', '4Pc Velvet Jacquard Bedsheet Set (King Size) styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  'b5a84d24-63dd-4ed0-a6be-3f11c1f440af', 'c0000000-0000-0000-0000-000000000001', '4Pc Velvet Jacquard Bedsheet Set (King Size)', '4pc-velvet-jacquard-bedsheet-set-king-size-20', 'Plush velvet. Woven luxury. Colour that lasts.',
  '4Pc Velvet Jacquard Bedsheet Set (King Size)

Tagline: Plush velvet. Woven luxury. Colour that lasts.

Overview

Give your bedroom the look of a boutique hotel suite. This 4-piece King Size set is made from rich velvet jacquard, a fabric known for its soft, plush feel and its elegant woven pattern. The pattern is woven into the fabric rather than printed on it, so the design has depth, texture and a subtle sheen that catches the light. It suits both modern and classic décor, and it works well for everyday use as well as for wedding, gifting and festive occasions.

What''s in the Set
Piece	Quantity	Size
Bedsheet	1	95 × 95 inches
Pillow Covers	2	19 × 29 inches
Cushion Cover	1	15 × 15 inches

The generous 95 × 95 inch bedsheet covers a King Size bed with room to tuck in. The pillow covers fit standard bed pillows, and the matching cushion cover adds a finishing touch.

Key Features
Velvet jacquard fabric: soft and smooth to the touch, with a rich, premium look.
Woven pattern: the design is built into the fabric, so it won''t fade or peel like a surface print.
100% colour guarantee: the colours stay vivid and true, wash after wash.
Complete coordinated set: the bedsheet, pillow covers and cushion cover match, so the bed looks styled straight away.
Warm and cosy feel: velvet is comfortable and inviting, especially in cooler months.
Gift-worthy: a good choice for weddings, housewarmings and festive gifting.
Care Instructions
Wash gently in cold or lukewarm water.
Wash with similar colours and turn the pieces inside out.
Use a mild detergent and avoid bleach.
Dry in shade and iron on low heat on the reverse side.
Why You''ll Love It

It looks like a luxury hotel bed, feels soft against the skin, and the design stays vibrant for a long time. The matching pieces mean you don''t have to buy extras to style your bed.', 3500, 5, 1, '100% Velvet Jacquard',
  '300 TC', 'Pakistan', false, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('600cf478-8d9d-41a6-a27c-2095f6aa904d', 'b5a84d24-63dd-4ed0-a6be-3f11c1f440af', 'King', 'Warm Ivory', '#FAF7F2', 3500, 30, '4PC--KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('0d48674e-3a97-462e-ad20-829398923659', 'b5a84d24-63dd-4ed0-a6be-3f11c1f440af', '/images/products/4pc-velvet-jacquard-bedsheet-set-king-size-20.jpg', '4Pc Velvet Jacquard Bedsheet Set (King Size) styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  '6fa7534e-c7be-4204-a215-fffa3a01969e', 'c0000000-0000-0000-0000-000000000001', '4Pc Velvet Jacquard Bedsheet Set (King Size)', '4pc-velvet-jacquard-bedsheet-set-king-size-19', 'Plush velvet. Woven luxury. Colour that lasts.',
  '4Pc Velvet Jacquard Bedsheet Set (King Size)

Tagline: Plush velvet. Woven luxury. Colour that lasts.

Overview

Give your bedroom the look of a boutique hotel suite. This 4-piece King Size set is made from rich velvet jacquard, a fabric known for its soft, plush feel and its elegant woven pattern. The pattern is woven into the fabric rather than printed on it, so the design has depth, texture and a subtle sheen that catches the light. It suits both modern and classic décor, and it works well for everyday use as well as for wedding, gifting and festive occasions.

What''s in the Set
Piece	Quantity	Size
Bedsheet	1	95 × 95 inches
Pillow Covers	2	19 × 29 inches
Cushion Cover	1	15 × 15 inches

The generous 95 × 95 inch bedsheet covers a King Size bed with room to tuck in. The pillow covers fit standard bed pillows, and the matching cushion cover adds a finishing touch.

Key Features
Velvet jacquard fabric: soft and smooth to the touch, with a rich, premium look.
Woven pattern: the design is built into the fabric, so it won''t fade or peel like a surface print.
100% colour guarantee: the colours stay vivid and true, wash after wash.
Complete coordinated set: the bedsheet, pillow covers and cushion cover match, so the bed looks styled straight away.
Warm and cosy feel: velvet is comfortable and inviting, especially in cooler months.
Gift-worthy: a good choice for weddings, housewarmings and festive gifting.
Care Instructions
Wash gently in cold or lukewarm water.
Wash with similar colours and turn the pieces inside out.
Use a mild detergent and avoid bleach.
Dry in shade and iron on low heat on the reverse side.
Why You''ll Love It

It looks like a luxury hotel bed, feels soft against the skin, and the design stays vibrant for a long time. The matching pieces mean you don''t have to buy extras to style your bed.', 3500, 5, 1, '100% Velvet Jacquard',
  '300 TC', 'Pakistan', false, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('72388364-144e-4ad7-ab25-a5d9ae5c17bd', '6fa7534e-c7be-4204-a215-fffa3a01969e', 'King', 'Warm Ivory', '#FAF7F2', 3500, 30, '4PC--KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('480e8b18-c04f-4da1-affd-43ea5e7a611b', '6fa7534e-c7be-4204-a215-fffa3a01969e', '/images/products/4pc-velvet-jacquard-bedsheet-set-king-size-19.jpg', '4Pc Velvet Jacquard Bedsheet Set (King Size) styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  '2f28532d-30b6-4824-a32a-d09c9424f8d2', 'c0000000-0000-0000-0000-000000000001', '4Pc Velvet Jacquard Bedsheet Set (King Size)', '4pc-velvet-jacquard-bedsheet-set-king-size-18', 'Plush velvet. Woven luxury. Colour that lasts.',
  '4Pc Velvet Jacquard Bedsheet Set (King Size)

Tagline: Plush velvet. Woven luxury. Colour that lasts.

Overview

Give your bedroom the look of a boutique hotel suite. This 4-piece King Size set is made from rich velvet jacquard, a fabric known for its soft, plush feel and its elegant woven pattern. The pattern is woven into the fabric rather than printed on it, so the design has depth, texture and a subtle sheen that catches the light. It suits both modern and classic décor, and it works well for everyday use as well as for wedding, gifting and festive occasions.

What''s in the Set
Piece	Quantity	Size
Bedsheet	1	95 × 95 inches
Pillow Covers	2	19 × 29 inches
Cushion Cover	1	15 × 15 inches

The generous 95 × 95 inch bedsheet covers a King Size bed with room to tuck in. The pillow covers fit standard bed pillows, and the matching cushion cover adds a finishing touch.

Key Features
Velvet jacquard fabric: soft and smooth to the touch, with a rich, premium look.
Woven pattern: the design is built into the fabric, so it won''t fade or peel like a surface print.
100% colour guarantee: the colours stay vivid and true, wash after wash.
Complete coordinated set: the bedsheet, pillow covers and cushion cover match, so the bed looks styled straight away.
Warm and cosy feel: velvet is comfortable and inviting, especially in cooler months.
Gift-worthy: a good choice for weddings, housewarmings and festive gifting.
Care Instructions
Wash gently in cold or lukewarm water.
Wash with similar colours and turn the pieces inside out.
Use a mild detergent and avoid bleach.
Dry in shade and iron on low heat on the reverse side.
Why You''ll Love It

It looks like a luxury hotel bed, feels soft against the skin, and the design stays vibrant for a long time. The matching pieces mean you don''t have to buy extras to style your bed.', 3500, 5, 1, '100% Velvet Jacquard',
  '300 TC', 'Pakistan', false, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('2aabb7b3-b61a-4130-a2a8-a617c682dc60', '2f28532d-30b6-4824-a32a-d09c9424f8d2', 'King', 'Warm Ivory', '#FAF7F2', 3500, 30, '4PC--KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('8f905429-633c-49ab-a6f6-edc185765402', '2f28532d-30b6-4824-a32a-d09c9424f8d2', '/images/products/4pc-velvet-jacquard-bedsheet-set-king-size-18.jpg', '4Pc Velvet Jacquard Bedsheet Set (King Size) styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  '7819c85c-379f-4567-a013-b130e7d73f00', 'c0000000-0000-0000-0000-000000000001', '4Pc Velvet Jacquard Bedsheet Set (King Size)', '4pc-velvet-jacquard-bedsheet-set-king-size-17', 'Plush velvet. Woven luxury. Colour that lasts.',
  '4Pc Velvet Jacquard Bedsheet Set (King Size)

Tagline: Plush velvet. Woven luxury. Colour that lasts.

Overview

Give your bedroom the look of a boutique hotel suite. This 4-piece King Size set is made from rich velvet jacquard, a fabric known for its soft, plush feel and its elegant woven pattern. The pattern is woven into the fabric rather than printed on it, so the design has depth, texture and a subtle sheen that catches the light. It suits both modern and classic décor, and it works well for everyday use as well as for wedding, gifting and festive occasions.

What''s in the Set
Piece	Quantity	Size
Bedsheet	1	95 × 95 inches
Pillow Covers	2	19 × 29 inches
Cushion Cover	1	15 × 15 inches

The generous 95 × 95 inch bedsheet covers a King Size bed with room to tuck in. The pillow covers fit standard bed pillows, and the matching cushion cover adds a finishing touch.

Key Features
Velvet jacquard fabric: soft and smooth to the touch, with a rich, premium look.
Woven pattern: the design is built into the fabric, so it won''t fade or peel like a surface print.
100% colour guarantee: the colours stay vivid and true, wash after wash.
Complete coordinated set: the bedsheet, pillow covers and cushion cover match, so the bed looks styled straight away.
Warm and cosy feel: velvet is comfortable and inviting, especially in cooler months.
Gift-worthy: a good choice for weddings, housewarmings and festive gifting.
Care Instructions
Wash gently in cold or lukewarm water.
Wash with similar colours and turn the pieces inside out.
Use a mild detergent and avoid bleach.
Dry in shade and iron on low heat on the reverse side.
Why You''ll Love It

It looks like a luxury hotel bed, feels soft against the skin, and the design stays vibrant for a long time. The matching pieces mean you don''t have to buy extras to style your bed.', 3500, 5, 1, '100% Velvet Jacquard',
  '300 TC', 'Pakistan', false, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('3b918465-0d16-43b5-aae0-e9cfaee20a3b', '7819c85c-379f-4567-a013-b130e7d73f00', 'King', 'Warm Ivory', '#FAF7F2', 3500, 30, '4PC--KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('af5cf8f3-2ad0-4832-ab5b-a73580013b76', '7819c85c-379f-4567-a013-b130e7d73f00', '/images/products/4pc-velvet-jacquard-bedsheet-set-king-size-17.jpg', '4Pc Velvet Jacquard Bedsheet Set (King Size) styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  'bda1cf4c-c1d8-41d7-a0a7-55ba7f7eac42', 'c0000000-0000-0000-0000-000000000001', '4Pc Velvet Jacquard Bedsheet Set (King Size)', '4pc-velvet-jacquard-bedsheet-set-king-size-16', 'Plush velvet. Woven luxury. Colour that lasts.',
  '4Pc Velvet Jacquard Bedsheet Set (King Size)

Tagline: Plush velvet. Woven luxury. Colour that lasts.

Overview

Give your bedroom the look of a boutique hotel suite. This 4-piece King Size set is made from rich velvet jacquard, a fabric known for its soft, plush feel and its elegant woven pattern. The pattern is woven into the fabric rather than printed on it, so the design has depth, texture and a subtle sheen that catches the light. It suits both modern and classic décor, and it works well for everyday use as well as for wedding, gifting and festive occasions.

What''s in the Set
Piece	Quantity	Size
Bedsheet	1	95 × 95 inches
Pillow Covers	2	19 × 29 inches
Cushion Cover	1	15 × 15 inches

The generous 95 × 95 inch bedsheet covers a King Size bed with room to tuck in. The pillow covers fit standard bed pillows, and the matching cushion cover adds a finishing touch.

Key Features
Velvet jacquard fabric: soft and smooth to the touch, with a rich, premium look.
Woven pattern: the design is built into the fabric, so it won''t fade or peel like a surface print.
100% colour guarantee: the colours stay vivid and true, wash after wash.
Complete coordinated set: the bedsheet, pillow covers and cushion cover match, so the bed looks styled straight away.
Warm and cosy feel: velvet is comfortable and inviting, especially in cooler months.
Gift-worthy: a good choice for weddings, housewarmings and festive gifting.
Care Instructions
Wash gently in cold or lukewarm water.
Wash with similar colours and turn the pieces inside out.
Use a mild detergent and avoid bleach.
Dry in shade and iron on low heat on the reverse side.
Why You''ll Love It

It looks like a luxury hotel bed, feels soft against the skin, and the design stays vibrant for a long time. The matching pieces mean you don''t have to buy extras to style your bed.', 3500, 5, 1, '100% Velvet Jacquard',
  '300 TC', 'Pakistan', false, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('c52edb26-9258-4714-abf7-0bf32c6970d7', 'bda1cf4c-c1d8-41d7-a0a7-55ba7f7eac42', 'King', 'Warm Ivory', '#FAF7F2', 3500, 30, '4PC--KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('652c68d4-2b10-414a-a0ec-bd2019c80465', 'bda1cf4c-c1d8-41d7-a0a7-55ba7f7eac42', '/images/products/4pc-velvet-jacquard-bedsheet-set-king-size-16.jpg', '4Pc Velvet Jacquard Bedsheet Set (King Size) styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  'a2f3caed-312e-483e-ab02-08f1369a2f14', 'c0000000-0000-0000-0000-000000000001', '4Pc Velvet Jacquard Bedsheet Set (King Size)', '4pc-velvet-jacquard-bedsheet-set-king-size-15', 'Plush velvet. Woven luxury. Colour that lasts.',
  '4Pc Velvet Jacquard Bedsheet Set (King Size)

Tagline: Plush velvet. Woven luxury. Colour that lasts.

Overview

Give your bedroom the look of a boutique hotel suite. This 4-piece King Size set is made from rich velvet jacquard, a fabric known for its soft, plush feel and its elegant woven pattern. The pattern is woven into the fabric rather than printed on it, so the design has depth, texture and a subtle sheen that catches the light. It suits both modern and classic décor, and it works well for everyday use as well as for wedding, gifting and festive occasions.

What''s in the Set
Piece	Quantity	Size
Bedsheet	1	95 × 95 inches
Pillow Covers	2	19 × 29 inches
Cushion Cover	1	15 × 15 inches

The generous 95 × 95 inch bedsheet covers a King Size bed with room to tuck in. The pillow covers fit standard bed pillows, and the matching cushion cover adds a finishing touch.

Key Features
Velvet jacquard fabric: soft and smooth to the touch, with a rich, premium look.
Woven pattern: the design is built into the fabric, so it won''t fade or peel like a surface print.
100% colour guarantee: the colours stay vivid and true, wash after wash.
Complete coordinated set: the bedsheet, pillow covers and cushion cover match, so the bed looks styled straight away.
Warm and cosy feel: velvet is comfortable and inviting, especially in cooler months.
Gift-worthy: a good choice for weddings, housewarmings and festive gifting.
Care Instructions
Wash gently in cold or lukewarm water.
Wash with similar colours and turn the pieces inside out.
Use a mild detergent and avoid bleach.
Dry in shade and iron on low heat on the reverse side.
Why You''ll Love It

It looks like a luxury hotel bed, feels soft against the skin, and the design stays vibrant for a long time. The matching pieces mean you don''t have to buy extras to style your bed.', 3500, 5, 1, '100% Velvet Jacquard',
  '300 TC', 'Pakistan', false, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('f6ed557b-65d1-4180-aa46-b6ea364f1017', 'a2f3caed-312e-483e-ab02-08f1369a2f14', 'King', 'Warm Ivory', '#FAF7F2', 3500, 30, '4PC--KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('672d3ce2-9ac0-4f28-a9e4-03a534ef3992', 'a2f3caed-312e-483e-ab02-08f1369a2f14', '/images/products/4pc-velvet-jacquard-bedsheet-set-king-size-15.jpg', '4Pc Velvet Jacquard Bedsheet Set (King Size) styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  'f4a30440-b403-4a94-a87d-d1cabded2f73', 'c0000000-0000-0000-0000-000000000001', '4Pc Velvet Jacquard Bedsheet Set (King Size)', '4pc-velvet-jacquard-bedsheet-set-king-size-14', 'Plush velvet. Woven luxury. Colour that lasts.',
  '4Pc Velvet Jacquard Bedsheet Set (King Size)

Tagline: Plush velvet. Woven luxury. Colour that lasts.

Overview

Give your bedroom the look of a boutique hotel suite. This 4-piece King Size set is made from rich velvet jacquard, a fabric known for its soft, plush feel and its elegant woven pattern. The pattern is woven into the fabric rather than printed on it, so the design has depth, texture and a subtle sheen that catches the light. It suits both modern and classic décor, and it works well for everyday use as well as for wedding, gifting and festive occasions.

What''s in the Set
Piece	Quantity	Size
Bedsheet	1	95 × 95 inches
Pillow Covers	2	19 × 29 inches
Cushion Cover	1	15 × 15 inches

The generous 95 × 95 inch bedsheet covers a King Size bed with room to tuck in. The pillow covers fit standard bed pillows, and the matching cushion cover adds a finishing touch.

Key Features
Velvet jacquard fabric: soft and smooth to the touch, with a rich, premium look.
Woven pattern: the design is built into the fabric, so it won''t fade or peel like a surface print.
100% colour guarantee: the colours stay vivid and true, wash after wash.
Complete coordinated set: the bedsheet, pillow covers and cushion cover match, so the bed looks styled straight away.
Warm and cosy feel: velvet is comfortable and inviting, especially in cooler months.
Gift-worthy: a good choice for weddings, housewarmings and festive gifting.
Care Instructions
Wash gently in cold or lukewarm water.
Wash with similar colours and turn the pieces inside out.
Use a mild detergent and avoid bleach.
Dry in shade and iron on low heat on the reverse side.
Why You''ll Love It

It looks like a luxury hotel bed, feels soft against the skin, and the design stays vibrant for a long time. The matching pieces mean you don''t have to buy extras to style your bed.', 3500, 5, 1, '100% Velvet Jacquard',
  '300 TC', 'Pakistan', false, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('685e3fbf-6f4e-4c9c-ac69-784f9ea2551f', 'f4a30440-b403-4a94-a87d-d1cabded2f73', 'King', 'Warm Ivory', '#FAF7F2', 3500, 30, '4PC--KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('df0a6679-8104-4b12-a81a-55af76bab14a', 'f4a30440-b403-4a94-a87d-d1cabded2f73', '/images/products/4pc-velvet-jacquard-bedsheet-set-king-size-14.jpg', '4Pc Velvet Jacquard Bedsheet Set (King Size) styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  '37cacc35-39aa-4bb9-a68d-c6a0df3f321c', 'c0000000-0000-0000-0000-000000000001', '4Pc Velvet Jacquard Bedsheet Set (King Size)', '4pc-velvet-jacquard-bedsheet-set-king-size-13', 'Stone-Washed Normandy Flax • Impossibly Soft',
  '4Pc Velvet Jacquard Bedsheet Set (King Size)

Tagline: Plush velvet. Woven luxury. Colour that lasts.

Overview

Give your bedroom the look of a boutique hotel suite. This 4-piece King Size set is made from rich velvet jacquard, a fabric known for its soft, plush feel and its elegant woven pattern. The pattern is woven into the fabric rather than printed on it, so the design has depth, texture and a subtle sheen that catches the light. It suits both modern and classic décor, and it works well for everyday use as well as for wedding, gifting and festive occasions.

What''s in the Set
Piece	Quantity	Size
Bedsheet	1	95 × 95 inches
Pillow Covers	2	19 × 29 inches
Cushion Cover	1	15 × 15 inches

The generous 95 × 95 inch bedsheet covers a King Size bed with room to tuck in. The pillow covers fit standard bed pillows, and the matching cushion cover adds a finishing touch.

Key Features
Velvet jacquard fabric: soft and smooth to the touch, with a rich, premium look.
Woven pattern: the design is built into the fabric, so it won''t fade or peel like a surface print.
100% colour guarantee: the colours stay vivid and true, wash after wash.
Complete coordinated set: the bedsheet, pillow covers and cushion cover match, so the bed looks styled straight away.
Warm and cosy feel: velvet is comfortable and inviting, especially in cooler months.
Gift-worthy: a good choice for weddings, housewarmings and festive gifting.
Care Instructions
Wash gently in cold or lukewarm water.
Wash with similar colours and turn the pieces inside out.
Use a mild detergent and avoid bleach.
Dry in shade and iron on low heat on the reverse side.
Why You''ll Love It

It looks like a luxury hotel bed, feels soft against the skin, and the design stays vibrant for a long time. The matching pieces mean you don''t have to buy extras to style your bed.', 3500, 5, 1, '100% French Flax Linen',
  '300 TC', 'Pakistan', false, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('58fda48c-3546-4653-a343-908bc29c529e', '37cacc35-39aa-4bb9-a68d-c6a0df3f321c', 'King', 'Warm Ivory', '#FAF7F2', 3500, 30, '4PC--KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('6bbde7e5-fa2d-4ebc-a081-02058c9bf7eb', '37cacc35-39aa-4bb9-a68d-c6a0df3f321c', '/images/products/4pc-velvet-jacquard-bedsheet-set-king-size-13.jpg', '4Pc Velvet Jacquard Bedsheet Set (King Size) styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  '50130535-c300-4a7d-a1d5-dbc5383763f4', 'c0000000-0000-0000-0000-000000000001', '4Pc Velvet Jacquard Bedsheet Set (King Size)', '4pc-velvet-jacquard-bedsheet-set-king-size-12', 'Plush velvet. Woven luxury. Colour that lasts.',
  '4Pc Velvet Jacquard Bedsheet Set (King Size)

Tagline: Plush velvet. Woven luxury. Colour that lasts.

Overview

Give your bedroom the look of a boutique hotel suite. This 4-piece King Size set is made from rich velvet jacquard, a fabric known for its soft, plush feel and its elegant woven pattern. The pattern is woven into the fabric rather than printed on it, so the design has depth, texture and a subtle sheen that catches the light. It suits both modern and classic décor, and it works well for everyday use as well as for wedding, gifting and festive occasions.

What''s in the Set
Piece	Quantity	Size
Bedsheet	1	95 × 95 inches
Pillow Covers	2	19 × 29 inches
Cushion Cover	1	15 × 15 inches

The generous 95 × 95 inch bedsheet covers a King Size bed with room to tuck in. The pillow covers fit standard bed pillows, and the matching cushion cover adds a finishing touch.

Key Features
Velvet jacquard fabric: soft and smooth to the touch, with a rich, premium look.
Woven pattern: the design is built into the fabric, so it won''t fade or peel like a surface print.
100% colour guarantee: the colours stay vivid and true, wash after wash.
Complete coordinated set: the bedsheet, pillow covers and cushion cover match, so the bed looks styled straight away.
Warm and cosy feel: velvet is comfortable and inviting, especially in cooler months.
Gift-worthy: a good choice for weddings, housewarmings and festive gifting.
Care Instructions
Wash gently in cold or lukewarm water.
Wash with similar colours and turn the pieces inside out.
Use a mild detergent and avoid bleach.
Dry in shade and iron on low heat on the reverse side.
Why You''ll Love It

It looks like a luxury hotel bed, feels soft against the skin, and the design stays vibrant for a long time. The matching pieces mean you don''t have to buy extras to style your bed.', 3500, 5, 1, '100% Velvet Jacquard',
  '300 TC', 'Pakistan', false, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('5fc1b7f3-aff8-472a-a6bf-5cf2de29acbf', '50130535-c300-4a7d-a1d5-dbc5383763f4', 'King', 'Warm Ivory', '#FAF7F2', 3500, 30, '4PC--KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('b6ca555a-c2c2-417f-a5b4-435d15a049e8', '50130535-c300-4a7d-a1d5-dbc5383763f4', '/images/products/4pc-velvet-jacquard-bedsheet-set-king-size-12.jpg', '4Pc Velvet Jacquard Bedsheet Set (King Size) styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  '41966756-92ea-4422-abe4-5ecdf52072ec', 'c0000000-0000-0000-0000-000000000001', '4Pc Velvet Jacquard Bedsheet Set (King Size)', '4pc-velvet-jacquard-bedsheet-set-king-size-11', 'Plush velvet. Woven luxury. Colour that lasts.',
  '4Pc Velvet Jacquard Bedsheet Set (King Size)

Tagline: Plush velvet. Woven luxury. Colour that lasts.

Overview

Give your bedroom the look of a boutique hotel suite. This 4-piece King Size set is made from rich velvet jacquard, a fabric known for its soft, plush feel and its elegant woven pattern. The pattern is woven into the fabric rather than printed on it, so the design has depth, texture and a subtle sheen that catches the light. It suits both modern and classic décor, and it works well for everyday use as well as for wedding, gifting and festive occasions.

What''s in the Set
Piece	Quantity	Size
Bedsheet	1	95 × 95 inches
Pillow Covers	2	19 × 29 inches
Cushion Cover	1	15 × 15 inches

The generous 95 × 95 inch bedsheet covers a King Size bed with room to tuck in. The pillow covers fit standard bed pillows, and the matching cushion cover adds a finishing touch.

Key Features
Velvet jacquard fabric: soft and smooth to the touch, with a rich, premium look.
Woven pattern: the design is built into the fabric, so it won''t fade or peel like a surface print.
100% colour guarantee: the colours stay vivid and true, wash after wash.
Complete coordinated set: the bedsheet, pillow covers and cushion cover match, so the bed looks styled straight away.
Warm and cosy feel: velvet is comfortable and inviting, especially in cooler months.
Gift-worthy: a good choice for weddings, housewarmings and festive gifting.
Care Instructions
Wash gently in cold or lukewarm water.
Wash with similar colours and turn the pieces inside out.
Use a mild detergent and avoid bleach.
Dry in shade and iron on low heat on the reverse side.
Why You''ll Love It

It looks like a luxury hotel bed, feels soft against the skin, and the design stays vibrant for a long time. The matching pieces mean you don''t have to buy extras to style your bed.', 3500, 5, 1, '100% Velvet Jacquard',
  '300 TC', 'Pakistan', false, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('89724475-2d53-44e4-aa53-ecc20de0659e', '41966756-92ea-4422-abe4-5ecdf52072ec', 'King', 'Warm Ivory', '#FAF7F2', 3500, 30, '4PC--KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('b3d0805c-9da8-41e6-a63a-4f3941444baf', '41966756-92ea-4422-abe4-5ecdf52072ec', '/images/products/4pc-velvet-jacquard-bedsheet-set-king-size-11.jpg', '4Pc Velvet Jacquard Bedsheet Set (King Size) styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  '134cb81d-66c0-41b9-aa00-657bc3242d41', 'c0000000-0000-0000-0000-000000000001', '4Pc Velvet Jacquard Bedsheet Set (King Size)', '4pc-velvet-jacquard-bedsheet-set-king-size-10', 'Plush velvet. Woven luxury. Colour that lasts.',
  '4Pc Velvet Jacquard Bedsheet Set (King Size)

Tagline: Plush velvet. Woven luxury. Colour that lasts.

Overview

Give your bedroom the look of a boutique hotel suite. This 4-piece King Size set is made from rich velvet jacquard, a fabric known for its soft, plush feel and its elegant woven pattern. The pattern is woven into the fabric rather than printed on it, so the design has depth, texture and a subtle sheen that catches the light. It suits both modern and classic décor, and it works well for everyday use as well as for wedding, gifting and festive occasions.

What''s in the Set
Piece	Quantity	Size
Bedsheet	1	95 × 95 inches
Pillow Covers	2	19 × 29 inches
Cushion Cover	1	15 × 15 inches

The generous 95 × 95 inch bedsheet covers a King Size bed with room to tuck in. The pillow covers fit standard bed pillows, and the matching cushion cover adds a finishing touch.

Key Features
Velvet jacquard fabric: soft and smooth to the touch, with a rich, premium look.
Woven pattern: the design is built into the fabric, so it won''t fade or peel like a surface print.
100% colour guarantee: the colours stay vivid and true, wash after wash.
Complete coordinated set: the bedsheet, pillow covers and cushion cover match, so the bed looks styled straight away.
Warm and cosy feel: velvet is comfortable and inviting, especially in cooler months.
Gift-worthy: a good choice for weddings, housewarmings and festive gifting.
Care Instructions
Wash gently in cold or lukewarm water.
Wash with similar colours and turn the pieces inside out.
Use a mild detergent and avoid bleach.
Dry in shade and iron on low heat on the reverse side.
Why You''ll Love It

It looks like a luxury hotel bed, feels soft against the skin, and the design stays vibrant for a long time. The matching pieces mean you don''t have to buy extras to style your bed.', 3500, 5, 1, '100% Velvet Jacquard',
  '300 TC', 'Pakistan', false, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('555a9877-060a-4590-a7f6-8f8d6e4b1c93', '134cb81d-66c0-41b9-aa00-657bc3242d41', 'King', 'Warm Ivory', '#FAF7F2', 3500, 30, '4PC--KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('4d7e87ba-7e75-4287-a6f4-d2c2dd8d4c6c', '134cb81d-66c0-41b9-aa00-657bc3242d41', '/images/products/4pc-velvet-jacquard-bedsheet-set-king-size-10.jpg', '4Pc Velvet Jacquard Bedsheet Set (King Size) styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  '2ce515b9-b6aa-4ec9-a7e1-2545af30a54e', 'c0000000-0000-0000-0000-000000000001', '4Pc Velvet Jacquard Bedsheet Set (King Size)', '4pc-velvet-jacquard-bedsheet-set-king-size-9', 'Plush velvet. Woven luxury. Colour that lasts.',
  '4Pc Velvet Jacquard Bedsheet Set (King Size)

Tagline: Plush velvet. Woven luxury. Colour that lasts.

Overview

Give your bedroom the look of a boutique hotel suite. This 4-piece King Size set is made from rich velvet jacquard, a fabric known for its soft, plush feel and its elegant woven pattern. The pattern is woven into the fabric rather than printed on it, so the design has depth, texture and a subtle sheen that catches the light. It suits both modern and classic décor, and it works well for everyday use as well as for wedding, gifting and festive occasions.

What''s in the Set
Piece	Quantity	Size
Bedsheet	1	95 × 95 inches
Pillow Covers	2	19 × 29 inches
Cushion Cover	1	15 × 15 inches

The generous 95 × 95 inch bedsheet covers a King Size bed with room to tuck in. The pillow covers fit standard bed pillows, and the matching cushion cover adds a finishing touch.

Key Features
Velvet jacquard fabric: soft and smooth to the touch, with a rich, premium look.
Woven pattern: the design is built into the fabric, so it won''t fade or peel like a surface print.
100% colour guarantee: the colours stay vivid and true, wash after wash.
Complete coordinated set: the bedsheet, pillow covers and cushion cover match, so the bed looks styled straight away.
Warm and cosy feel: velvet is comfortable and inviting, especially in cooler months.
Gift-worthy: a good choice for weddings, housewarmings and festive gifting.
Care Instructions
Wash gently in cold or lukewarm water.
Wash with similar colours and turn the pieces inside out.
Use a mild detergent and avoid bleach.
Dry in shade and iron on low heat on the reverse side.
Why You''ll Love It

It looks like a luxury hotel bed, feels soft against the skin, and the design stays vibrant for a long time. The matching pieces mean you don''t have to buy extras to style your bed.', 3500, 5, 1, '100% Velvet Jacquard',
  '300 TC', 'Pakistan', false, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('ddb1b5a0-f435-4cd6-a567-77a57caffe80', '2ce515b9-b6aa-4ec9-a7e1-2545af30a54e', 'King', 'Warm Ivory', '#FAF7F2', 3500, 30, '4PC--KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('c3cf9eb7-c173-42e8-af95-fc771612966b', '2ce515b9-b6aa-4ec9-a7e1-2545af30a54e', '/images/products/4pc-velvet-jacquard-bedsheet-set-king-size-9.jpg', '4Pc Velvet Jacquard Bedsheet Set (King Size) styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  '215a38c6-faad-4091-aa00-fd02590e3d87', 'c0000000-0000-0000-0000-000000000001', '4Pc Velvet Jacquard Bedsheet Set (King Size)', '4pc-velvet-jacquard-bedsheet-set-king-size-8', 'Plush velvet. Woven luxury. Colour that lasts.',
  '4Pc Velvet Jacquard Bedsheet Set (King Size)

Tagline: Plush velvet. Woven luxury. Colour that lasts.

Overview

Give your bedroom the look of a boutique hotel suite. This 4-piece King Size set is made from rich velvet jacquard, a fabric known for its soft, plush feel and its elegant woven pattern. The pattern is woven into the fabric rather than printed on it, so the design has depth, texture and a subtle sheen that catches the light. It suits both modern and classic décor, and it works well for everyday use as well as for wedding, gifting and festive occasions.

What''s in the Set
Piece	Quantity	Size
Bedsheet	1	95 × 95 inches
Pillow Covers	2	19 × 29 inches
Cushion Cover	1	15 × 15 inches

The generous 95 × 95 inch bedsheet covers a King Size bed with room to tuck in. The pillow covers fit standard bed pillows, and the matching cushion cover adds a finishing touch.

Key Features
Velvet jacquard fabric: soft and smooth to the touch, with a rich, premium look.
Woven pattern: the design is built into the fabric, so it won''t fade or peel like a surface print.
100% colour guarantee: the colours stay vivid and true, wash after wash.
Complete coordinated set: the bedsheet, pillow covers and cushion cover match, so the bed looks styled straight away.
Warm and cosy feel: velvet is comfortable and inviting, especially in cooler months.
Gift-worthy: a good choice for weddings, housewarmings and festive gifting.
Care Instructions
Wash gently in cold or lukewarm water.
Wash with similar colours and turn the pieces inside out.
Use a mild detergent and avoid bleach.
Dry in shade and iron on low heat on the reverse side.
Why You''ll Love It

It looks like a luxury hotel bed, feels soft against the skin, and the design stays vibrant for a long time. The matching pieces mean you don''t have to buy extras to style your bed.', 3500, 5, 1, '100% Velvet Jacquard',
  '300 TC', 'Pakistan', false, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('1b2dd06a-b998-41c9-a421-a387a3975c2a', '215a38c6-faad-4091-aa00-fd02590e3d87', 'King', 'Warm Ivory', '#FAF7F2', 3500, 30, '4PC--KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('e61d8550-1e6e-4eb0-abd0-1d6e46a70a79', '215a38c6-faad-4091-aa00-fd02590e3d87', '/images/products/4pc-velvet-jacquard-bedsheet-set-king-size-8.jpg', '4Pc Velvet Jacquard Bedsheet Set (King Size) styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  'a43a3d15-90bf-44f2-a9e6-f757ff791af1', 'c0000000-0000-0000-0000-000000000001', '4Pc Velvet Jacquard Bedsheet Set (King Size)', '4pc-velvet-jacquard-bedsheet-set-king-size-7', 'Plush velvet. Woven luxury. Colour that lasts.',
  '4Pc Velvet Jacquard Bedsheet Set (King Size)

Tagline: Plush velvet. Woven luxury. Colour that lasts.

Overview

Give your bedroom the look of a boutique hotel suite. This 4-piece King Size set is made from rich velvet jacquard, a fabric known for its soft, plush feel and its elegant woven pattern. The pattern is woven into the fabric rather than printed on it, so the design has depth, texture and a subtle sheen that catches the light. It suits both modern and classic décor, and it works well for everyday use as well as for wedding, gifting and festive occasions.

What''s in the Set
Piece	Quantity	Size
Bedsheet	1	95 × 95 inches
Pillow Covers	2	19 × 29 inches
Cushion Cover	1	15 × 15 inches

The generous 95 × 95 inch bedsheet covers a King Size bed with room to tuck in. The pillow covers fit standard bed pillows, and the matching cushion cover adds a finishing touch.

Key Features
Velvet jacquard fabric: soft and smooth to the touch, with a rich, premium look.
Woven pattern: the design is built into the fabric, so it won''t fade or peel like a surface print.
100% colour guarantee: the colours stay vivid and true, wash after wash.
Complete coordinated set: the bedsheet, pillow covers and cushion cover match, so the bed looks styled straight away.
Warm and cosy feel: velvet is comfortable and inviting, especially in cooler months.
Gift-worthy: a good choice for weddings, housewarmings and festive gifting.
Care Instructions
Wash gently in cold or lukewarm water.
Wash with similar colours and turn the pieces inside out.
Use a mild detergent and avoid bleach.
Dry in shade and iron on low heat on the reverse side.
Why You''ll Love It

It looks like a luxury hotel bed, feels soft against the skin, and the design stays vibrant for a long time. The matching pieces mean you don''t have to buy extras to style your bed.', 3500, 5, 1, '100%Velvet Jacquard',
  '300 TC', 'Pakistan', false, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('d02a478f-9623-4ff9-a50f-481dd0580da6', 'a43a3d15-90bf-44f2-a9e6-f757ff791af1', 'King', 'Warm Ivory', '#FAF7F2', 3500, 30, '4PC--KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('57c88cfc-a5c4-4971-a72c-48f462b8e43e', 'a43a3d15-90bf-44f2-a9e6-f757ff791af1', '/images/products/4pc-velvet-jacquard-bedsheet-set-king-size-7.jpg', '4Pc Velvet Jacquard Bedsheet Set (King Size) styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  'df178bb4-3458-4579-a724-f3da335f0ce0', 'c0000000-0000-0000-0000-000000000001', '4Pc Velvet Jacquard Bedsheet Set (King Size)', '4pc-velvet-jacquard-bedsheet-set-king-size-6', 'Plush velvet. Woven luxury. Colour that lasts.',
  '4Pc Velvet Jacquard Bedsheet Set (King Size)

Tagline: Plush velvet. Woven luxury. Colour that lasts.

Overview

Give your bedroom the look of a boutique hotel suite. This 4-piece King Size set is made from rich velvet jacquard, a fabric known for its soft, plush feel and its elegant woven pattern. The pattern is woven into the fabric rather than printed on it, so the design has depth, texture and a subtle sheen that catches the light. It suits both modern and classic décor, and it works well for everyday use as well as for wedding, gifting and festive occasions.

What''s in the Set
Piece	Quantity	Size
Bedsheet	1	95 × 95 inches
Pillow Covers	2	19 × 29 inches
Cushion Cover	1	15 × 15 inches

The generous 95 × 95 inch bedsheet covers a King Size bed with room to tuck in. The pillow covers fit standard bed pillows, and the matching cushion cover adds a finishing touch.

Key Features
Velvet jacquard fabric: soft and smooth to the touch, with a rich, premium look.
Woven pattern: the design is built into the fabric, so it won''t fade or peel like a surface print.
100% colour guarantee: the colours stay vivid and true, wash after wash.
Complete coordinated set: the bedsheet, pillow covers and cushion cover match, so the bed looks styled straight away.
Warm and cosy feel: velvet is comfortable and inviting, especially in cooler months.
Gift-worthy: a good choice for weddings, housewarmings and festive gifting.
Care Instructions
Wash gently in cold or lukewarm water.
Wash with similar colours and turn the pieces inside out.
Use a mild detergent and avoid bleach.
Dry in shade and iron on low heat on the reverse side.
Why You''ll Love It

It looks like a luxury hotel bed, feels soft against the skin, and the design stays vibrant for a long time. The matching pieces mean you don''t have to buy extras to style your bed.', 3500, 5, 1, '100% Velvet Jacquard',
  '300 TC', 'Pakistan', false, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('29243109-ed93-4dfd-a2a8-58d3bbd2f0db', 'df178bb4-3458-4579-a724-f3da335f0ce0', 'King', 'Warm Ivory', '#FAF7F2', 3500, 30, '4PC--KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('fe796db7-cc6d-43cc-aefb-a3753c5746a8', 'df178bb4-3458-4579-a724-f3da335f0ce0', '/images/products/4pc-velvet-jacquard-bedsheet-set-king-size-6.jpg', '4Pc Velvet Jacquard Bedsheet Set (King Size) styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  '597727e6-ce2c-49ab-ac41-e697e05b1399', 'c0000000-0000-0000-0000-000000000001', '4Pc Velvet Jacquard Bedsheet Set (King Size)', '4pc-velvet-jacquard-bedsheet-set-king-size-5', 'Plush velvet. Woven luxury. Colour that lasts.',
  '4Pc Velvet Jacquard Bedsheet Set (King Size)

Tagline: Plush velvet. Woven luxury. Colour that lasts.

Overview

Give your bedroom the look of a boutique hotel suite. This 4-piece King Size set is made from rich velvet jacquard, a fabric known for its soft, plush feel and its elegant woven pattern. The pattern is woven into the fabric rather than printed on it, so the design has depth, texture and a subtle sheen that catches the light. It suits both modern and classic décor, and it works well for everyday use as well as for wedding, gifting and festive occasions.

What''s in the Set
Piece	Quantity	Size
Bedsheet	1	95 × 95 inches
Pillow Covers	2	19 × 29 inches
Cushion Cover	1	15 × 15 inches

The generous 95 × 95 inch bedsheet covers a King Size bed with room to tuck in. The pillow covers fit standard bed pillows, and the matching cushion cover adds a finishing touch.

Key Features
Velvet jacquard fabric: soft and smooth to the touch, with a rich, premium look.
Woven pattern: the design is built into the fabric, so it won''t fade or peel like a surface print.
100% colour guarantee: the colours stay vivid and true, wash after wash.
Complete coordinated set: the bedsheet, pillow covers and cushion cover match, so the bed looks styled straight away.
Warm and cosy feel: velvet is comfortable and inviting, especially in cooler months.
Gift-worthy: a good choice for weddings, housewarmings and festive gifting.
Care Instructions
Wash gently in cold or lukewarm water.
Wash with similar colours and turn the pieces inside out.
Use a mild detergent and avoid bleach.
Dry in shade and iron on low heat on the reverse side.
Why You''ll Love It

It looks like a luxury hotel bed, feels soft against the skin, and the design stays vibrant for a long time. The matching pieces mean you don''t have to buy extras to style your bed.', 3500, 5, 1, '100% Velvet Jacquard',
  '300 TC', 'Pakistan', false, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('7048724a-bb75-4c1b-afdb-abb83738f80a', '597727e6-ce2c-49ab-ac41-e697e05b1399', 'King', 'Warm Ivory', '#FAF7F2', 3500, 30, '4PC--KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('847e3ed3-3f44-4e35-afec-dd6c15f73e9c', '597727e6-ce2c-49ab-ac41-e697e05b1399', '/images/products/4pc-velvet-jacquard-bedsheet-set-king-size-5.jpg', '4Pc Velvet Jacquard Bedsheet Set (King Size) styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  '7080f6ff-6300-4463-af3e-0c1ab49acc3f', 'c0000000-0000-0000-0000-000000000001', '4Pc Velvet Jacquard Bedsheet Set (King Size)', '4pc-velvet-jacquard-bedsheet-set-king-size-4', 'Plush velvet. Woven luxury. Colour that lasts.',
  '4Pc Velvet Jacquard Bedsheet Set (King Size)

Tagline: Plush velvet. Woven luxury. Colour that lasts.

Overview

Give your bedroom the look of a boutique hotel suite. This 4-piece King Size set is made from rich velvet jacquard, a fabric known for its soft, plush feel and its elegant woven pattern. The pattern is woven into the fabric rather than printed on it, so the design has depth, texture and a subtle sheen that catches the light. It suits both modern and classic décor, and it works well for everyday use as well as for wedding, gifting and festive occasions.

What''s in the Set
Piece	Quantity	Size
Bedsheet	1	95 × 95 inches
Pillow Covers	2	19 × 29 inches
Cushion Cover	1	15 × 15 inches

The generous 95 × 95 inch bedsheet covers a King Size bed with room to tuck in. The pillow covers fit standard bed pillows, and the matching cushion cover adds a finishing touch.

Key Features
Velvet jacquard fabric: soft and smooth to the touch, with a rich, premium look.
Woven pattern: the design is built into the fabric, so it won''t fade or peel like a surface print.
100% colour guarantee: the colours stay vivid and true, wash after wash.
Complete coordinated set: the bedsheet, pillow covers and cushion cover match, so the bed looks styled straight away.
Warm and cosy feel: velvet is comfortable and inviting, especially in cooler months.
Gift-worthy: a good choice for weddings, housewarmings and festive gifting.
Care Instructions
Wash gently in cold or lukewarm water.
Wash with similar colours and turn the pieces inside out.
Use a mild detergent and avoid bleach.
Dry in shade and iron on low heat on the reverse side.
Why You''ll Love It

It looks like a luxury hotel bed, feels soft against the skin, and the design stays vibrant for a long time. The matching pieces mean you don''t have to buy extras to style your bed.', 3599, 5, 1, '100% Velvet Jacquard',
  '300 TC', 'Pakistan', false, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('d761cf55-663f-4e7a-a9fc-326e095b28f1', '7080f6ff-6300-4463-af3e-0c1ab49acc3f', 'King', 'Warm Ivory', '#FAF7F2', 3599, 30, '4PC--KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('4c99f256-89d5-4af8-a67a-d59def117c0f', '7080f6ff-6300-4463-af3e-0c1ab49acc3f', '/images/products/4pc-velvet-jacquard-bedsheet-set-king-size-4.jpg', '4Pc Velvet Jacquard Bedsheet Set (King Size) styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  '6a59e4d3-a3f5-4da7-ab8a-a471ad263e3f', 'c0000000-0000-0000-0000-000000000001', '4Pc Velvet Jacquard Bedsheet Set (King Size)', '4pc-velvet-jacquard-bedsheet-set-king-size-3', 'Plush velvet. Woven luxury. Colour that lasts.',
  '4Pc Velvet Jacquard Bedsheet Set (King Size)

Tagline: Plush velvet. Woven luxury. Colour that lasts.

Overview

Give your bedroom the look of a boutique hotel suite. This 4-piece King Size set is made from rich velvet jacquard, a fabric known for its soft, plush feel and its elegant woven pattern. The pattern is woven into the fabric rather than printed on it, so the design has depth, texture and a subtle sheen that catches the light. It suits both modern and classic décor, and it works well for everyday use as well as for wedding, gifting and festive occasions.

What''s in the Set
Piece	Quantity	Size
Bedsheet	1	95 × 95 inches
Pillow Covers	2	19 × 29 inches
Cushion Cover	1	15 × 15 inches

The generous 95 × 95 inch bedsheet covers a King Size bed with room to tuck in. The pillow covers fit standard bed pillows, and the matching cushion cover adds a finishing touch.

Key Features
Velvet jacquard fabric: soft and smooth to the touch, with a rich, premium look.
Woven pattern: the design is built into the fabric, so it won''t fade or peel like a surface print.
100% colour guarantee: the colours stay vivid and true, wash after wash.
Complete coordinated set: the bedsheet, pillow covers and cushion cover match, so the bed looks styled straight away.
Warm and cosy feel: velvet is comfortable and inviting, especially in cooler months.
Gift-worthy: a good choice for weddings, housewarmings and festive gifting.
Care Instructions
Wash gently in cold or lukewarm water.
Wash with similar colours and turn the pieces inside out.
Use a mild detergent and avoid bleach.
Dry in shade and iron on low heat on the reverse side.
Why You''ll Love It

It looks like a luxury hotel bed, feels soft against the skin, and the design stays vibrant for a long time. The matching pieces mean you don''t have to buy extras to style your bed.', 3500, 5, 1, '100% Velvet Jacquard',
  '300 TC', 'Pakistan', false, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('9ab8cce2-1963-4871-a12f-094170bca687', '6a59e4d3-a3f5-4da7-ab8a-a471ad263e3f', 'King', 'Warm Ivory', '#FAF7F2', 3500, 30, '4PC--KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('0a3fc74b-118c-4ab1-a1fb-86ff9f5a68a8', '6a59e4d3-a3f5-4da7-ab8a-a471ad263e3f', '/images/products/4pc-velvet-jacquard-bedsheet-set-king-size-3.jpg', '4Pc Velvet Jacquard Bedsheet Set (King Size) styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  '28ea57a5-3240-4822-a8b6-d6305e3e1794', 'c0000000-0000-0000-0000-000000000001', '4Pc Velvet Jacquard Bedsheet Set (King Size)', '4pc-velvet-jacquard-bedsheet-set-king-size-2', 'Plush velvet. Woven luxury. Colour that lasts.',
  '4Pc Velvet Jacquard Bedsheet Set (King Size)

Tagline: Plush velvet. Woven luxury. Colour that lasts.

Overview

Give your bedroom the look of a boutique hotel suite. This 4-piece King Size set is made from rich velvet jacquard, a fabric known for its soft, plush feel and its elegant woven pattern. The pattern is woven into the fabric rather than printed on it, so the design has depth, texture and a subtle sheen that catches the light. It suits both modern and classic décor, and it works well for everyday use as well as for wedding, gifting and festive occasions.

What''s in the Set
Piece	Quantity	Size
Bedsheet	1	95 × 95 inches
Pillow Covers	2	19 × 29 inches
Cushion Cover	1	15 × 15 inches

The generous 95 × 95 inch bedsheet covers a King Size bed with room to tuck in. The pillow covers fit standard bed pillows, and the matching cushion cover adds a finishing touch.

Key Features
Velvet jacquard fabric: soft and smooth to the touch, with a rich, premium look.
Woven pattern: the design is built into the fabric, so it won''t fade or peel like a surface print.
100% colour guarantee: the colours stay vivid and true, wash after wash.
Complete coordinated set: the bedsheet, pillow covers and cushion cover match, so the bed looks styled straight away.
Warm and cosy feel: velvet is comfortable and inviting, especially in cooler months.
Gift-worthy: a good choice for weddings, housewarmings and festive gifting.
Care Instructions
Wash gently in cold or lukewarm water.
Wash with similar colours and turn the pieces inside out.
Use a mild detergent and avoid bleach.
Dry in shade and iron on low heat on the reverse side.
Why You''ll Love It

It looks like a luxury hotel bed, feels soft against the skin, and the design stays vibrant for a long time. The matching pieces mean you don''t have to buy extras to style your bed.', 3500, 5, 1, '100% Velvet Jacquard',
  '300 TC', 'Pakistan', false, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('82603b7d-2847-4b59-a6c6-a94cd85789fe', '28ea57a5-3240-4822-a8b6-d6305e3e1794', 'King', 'Warm Ivory', '#FAF7F2', 3500, 30, '4PC--KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('d2dc4af3-6a7e-4d59-ae29-6648708e92cf', '28ea57a5-3240-4822-a8b6-d6305e3e1794', '/images/products/4pc-velvet-jacquard-bedsheet-set-king-size-2.jpg', '4Pc Velvet Jacquard Bedsheet Set (King Size) styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  'fe650719-7308-48fd-ac2b-123fdf25a39c', 'c0000000-0000-0000-0000-000000000001', '4Pc Velvet Jacquard Bedsheet Set (King Size)', '4pc-velvet-jacquard-bedsheet-set-king-size', 'Plush velvet. Woven luxury. Colour that lasts.',
  '4Pc Velvet Jacquard Bedsheet Set (King Size)

Tagline: Plush velvet. Woven luxury. Colour that lasts.

Overview

Give your bedroom the look of a boutique hotel suite. This 4-piece King Size set is made from rich velvet jacquard, a fabric known for its soft, plush feel and its elegant woven pattern. The pattern is woven into the fabric rather than printed on it, so the design has depth, texture and a subtle sheen that catches the light. It suits both modern and classic décor, and it works well for everyday use as well as for wedding, gifting and festive occasions.

What''s in the Set
Piece	Quantity	Size
Bedsheet	1	95 × 95 inches
Pillow Covers	2	19 × 29 inches
Cushion Cover	1	15 × 15 inches

The generous 95 × 95 inch bedsheet covers a King Size bed with room to tuck in. The pillow covers fit standard bed pillows, and the matching cushion cover adds a finishing touch.

Key Features
Velvet jacquard fabric: soft and smooth to the touch, with a rich, premium look.
Woven pattern: the design is built into the fabric, so it won''t fade or peel like a surface print.
100% colour guarantee: the colours stay vivid and true, wash after wash.
Complete coordinated set: the bedsheet, pillow covers and cushion cover match, so the bed looks styled straight away.
Warm and cosy feel: velvet is comfortable and inviting, especially in cooler months.
Gift-worthy: a good choice for weddings, housewarmings and festive gifting.
Care Instructions
Wash gently in cold or lukewarm water.
Wash with similar colours and turn the pieces inside out.
Use a mild detergent and avoid bleach.
Dry in shade and iron on low heat on the reverse side.', 3500, 5, 1, '100% French Flax Linen',
  '300 TC', 'Pakistan', false, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('4990b0fb-2a6c-4d60-a234-6353e827bc4e', 'fe650719-7308-48fd-ac2b-123fdf25a39c', 'King', 'Warm Ivory', '#FAF7F2', 3500, 30, '4PC--KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('26d7d341-c2b2-4efa-aca0-226754a24fb5', 'fe650719-7308-48fd-ac2b-123fdf25a39c', '/images/products/4pc-velvet-jacquard-bedsheet-set-king-size.jpg', '4Pc Velvet Jacquard Bedsheet Set (King Size) styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  'ea21a4ad-f657-4f11-a0ed-7db4e5efcb44', 'c0000000-0000-0000-0000-000000000001', '3pc Export Quality Pure Cotton Bedsheets', '3pc-export-quality-pure-cotton-bedsheets-33', '3pc Export Quality Pure Cotton Bedsheets',
  '3pc Export Quality Pure Cotton Bedsheets 

 Double Bedsheets

 💯 % King Size

Fabric 100% Pure Cotton
1 Flat-Sheet king Size 10 (87*95)
2 Pillow Cover''s
( Size 19*29(50*75cm)
Granted Colours
Ready To Use and easily washable', 1900, 5, 1, '100% Pure Cotton',
  '300 TC', 'Pakistan', true, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('5ec8554e-1b14-4ff4-a977-051d118aa98e', 'ea21a4ad-f657-4f11-a0ed-7db4e5efcb44', 'King', 'Warm Ivory', '#FAF7F2', 1900, 30, '3PC--KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('7511b6a3-8fc5-4cac-a83b-76e8b374c781', 'ea21a4ad-f657-4f11-a0ed-7db4e5efcb44', '/images/products/3pc-export-quality-pure-cotton-bedsheets-33.jpg', '3pc Export Quality Pure Cotton Bedsheets  styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  '53834f04-8137-41b2-a556-a2c618802924', 'c0000000-0000-0000-0000-000000000001', '3pc Export Quality Pure Cotton Bedsheets', '3pc-export-quality-pure-cotton-bedsheets-32', '3pc Export Quality Pure Cotton Bedsheets',
  '3pc Export Quality Pure Cotton Bedsheets 

 Double Bedsheets

 💯 % King Size

Fabric 100% Pure Cotton
1 Flat-Sheet king Size 10 (87*95)
2 Pillow Cover''s
( Size 19*29(50*75cm)
Granted Colours
Ready To Use and easily washable', 1900, 5, 1, '100%Pure Cotton',
  '300 TC', 'Pakistan', true, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('1a97512a-8ae5-45ad-ae10-7463eb8959fd', '53834f04-8137-41b2-a556-a2c618802924', 'King', 'Warm Ivory', '#FAF7F2', 1900, 30, '3PC--KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('64df60b7-b1d3-4bed-a65a-39560c556ae9', '53834f04-8137-41b2-a556-a2c618802924', '/images/products/3pc-export-quality-pure-cotton-bedsheets-32.jpg', '3pc Export Quality Pure Cotton Bedsheets  styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  'd2e5dcb7-bb62-495f-a31e-137771a984a8', 'c0000000-0000-0000-0000-000000000001', '3pc Export Quality Pure Cotton Bedsheets', '3pc-export-quality-pure-cotton-bedsheets-31', '3pc Export Quality Pure Cotton Bedsheets',
  '3pc Export Quality Pure Cotton Bedsheets 

 Double Bedsheets

 💯 % King Size

Fabric 100% Pure Cotton
1 Flat-Sheet king Size 10 (87*95)
2 Pillow Cover''s
( Size 19*29(50*75cm)
Granted Colours
Ready To Use and easily washable', 1900, 5, 1, '100% Pure Cotton',
  '300 TC', 'Pakistan', true, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('ce638f5a-cd38-492b-a04e-4a5568a0fc76', 'd2e5dcb7-bb62-495f-a31e-137771a984a8', 'King', 'Warm Ivory', '#FAF7F2', 1900, 30, '3PC--KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('862ccdef-47ca-457c-a5f0-0deca3838951', 'd2e5dcb7-bb62-495f-a31e-137771a984a8', '/images/products/3pc-export-quality-pure-cotton-bedsheets-31.jpg', '3pc Export Quality Pure Cotton Bedsheets  styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  '40ca7140-fff2-431e-a78c-fa8154d6d417', 'c0000000-0000-0000-0000-000000000001', '3pc Export Quality Pure Cotton Bedsheets', '3pc-export-quality-pure-cotton-bedsheets-30', '3pc Export Quality Pure Cotton Bedsheets',
  '3pc Export Quality Pure Cotton Bedsheets 

 Double Bedsheets

 💯 % King Size

Fabric 100% Pure Cotton
1 Flat-Sheet king Size 10 (87*95)
2 Pillow Cover''s
( Size 19*29(50*75cm)
Granted Colours
Ready To Use and easily washable', 1900, 5, 1, '100% Pure Cotton',
  '300 TC', 'Pakistan', true, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('4d7beddc-8945-474c-a378-2cdc0eb137c4', '40ca7140-fff2-431e-a78c-fa8154d6d417', 'King', 'Warm Ivory', '#FAF7F2', 1900, 30, '3PC--KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('dab466f7-2a0c-4e30-a0e9-ef683e258748', '40ca7140-fff2-431e-a78c-fa8154d6d417', '/images/products/3pc-export-quality-pure-cotton-bedsheets-30.jpg', '3pc Export Quality Pure Cotton Bedsheets  styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  '7bb3b35c-0f56-4ce6-ad0b-249e82c46696', 'c0000000-0000-0000-0000-000000000001', '3pc Export Quality Pure Cotton Bedsheets', '3pc-export-quality-pure-cotton-bedsheets-29', '3pc Export Quality Pure Cotton Bedsheets',
  '3pc Export Quality Pure Cotton Bedsheets 

 Double Bedsheets

 💯 % King Size

Fabric 100% Pure Cotton
1 Flat-Sheet king Size 10 (87*95)
2 Pillow Cover''s
( Size 19*29(50*75cm)
Granted Colours
Ready To Use and easily washable', 1900, 5, 1, '100% Pure Cotton',
  '300 TC', 'Pakistan', true, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('05c75a32-b070-427a-a3b5-2bd2e2264755', '7bb3b35c-0f56-4ce6-ad0b-249e82c46696', 'King', 'Warm Ivory', '#FAF7F2', 1900, 30, '3PC--KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('a3c0ed05-c781-48cc-ac83-bea1bd89e1a1', '7bb3b35c-0f56-4ce6-ad0b-249e82c46696', '/images/products/3pc-export-quality-pure-cotton-bedsheets-29.jpg', '3pc Export Quality Pure Cotton Bedsheets  styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  'a60670cb-cea0-45eb-a705-c72e42ea6ae4', 'c0000000-0000-0000-0000-000000000001', '3pc Export Quality Pure Cotton Bedsheets', '3pc-export-quality-pure-cotton-bedsheets-28', '3pc Export Quality Pure Cotton Bedsheets',
  '3pc Export Quality Pure Cotton Bedsheets 

 Double Bedsheets

 💯 % King Size

Fabric 100% Pure Cotton
1 Flat-Sheet king Size 10 (87*95)
2 Pillow Cover''s
( Size 19*29(50*75cm)
Granted Colours
Ready To Use and easily washable', 1900, 5, 1, '100% Pure Cotton',
  '300 TC', 'Pakistan', true, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('fe199945-c510-4981-af0e-111962269671', 'a60670cb-cea0-45eb-a705-c72e42ea6ae4', 'King', 'Warm Ivory', '#FAF7F2', 1900, 30, '3PC--KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('38cbab90-0fcf-4afd-a9b1-0e8112fd40f8', 'a60670cb-cea0-45eb-a705-c72e42ea6ae4', '/images/products/3pc-export-quality-pure-cotton-bedsheets-28.jpg', '3pc Export Quality Pure Cotton Bedsheets  styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  '5360f5cd-8b74-4e1d-a895-717ae31d740b', 'c0000000-0000-0000-0000-000000000001', '3pc Export Quality Pure Cotton Bedsheets', '3pc-export-quality-pure-cotton-bedsheets-27', '3pc Export Quality Pure Cotton Bedsheets',
  '3pc Export Quality Pure Cotton Bedsheets 

 Double Bedsheets

 💯 % King Size

Fabric 100% Pure Cotton
1 Flat-Sheet king Size 10 (87*95)
2 Pillow Cover''s
( Size 19*29(50*75cm)
Granted Colours
Ready To Use and easily washable', 1900, 5, 1, '100% French Flax Linen',
  '300 TC', 'Pakistan', true, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('cf1d5d3a-0cdf-4bff-a091-64175d6e999e', '5360f5cd-8b74-4e1d-a895-717ae31d740b', 'King', 'Warm Ivory', '#FAF7F2', 1900, 30, '3PC--KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('1f09fd10-15d2-4ddd-a248-46720f0bd9e6', '5360f5cd-8b74-4e1d-a895-717ae31d740b', '/images/products/3pc-export-quality-pure-cotton-bedsheets-27.jpg', '3pc Export Quality Pure Cotton Bedsheets  styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  '85797829-690f-456d-a022-3337524c1275', 'c0000000-0000-0000-0000-000000000001', '3pc Export Quality Pure Cotton Bedsheets', '3pc-export-quality-pure-cotton-bedsheets-26', '3pc Export Quality Pure Cotton Bedsheets',
  '3pc Export Quality Pure Cotton Bedsheets 

 Double Bedsheets

 💯 % King Size

Fabric 100% Pure Cotton
1 Flat-Sheet king Size 10 (87*95)
2 Pillow Cover''s
( Size 19*29(50*75cm)
Granted Colours
Ready To Use and easily washable', 1900, 5, 1, '100%Pure Cotton',
  '300 TC', 'Pakistan', true, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('2d7de914-09f0-44a4-a76f-6011481d049b', '85797829-690f-456d-a022-3337524c1275', 'King', 'Warm Ivory', '#FAF7F2', 1900, 30, '3PC--KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('675ac29f-f18d-4165-acb0-9cf51503989b', '85797829-690f-456d-a022-3337524c1275', '/images/products/3pc-export-quality-pure-cotton-bedsheets-26.jpg', '3pc Export Quality Pure Cotton Bedsheets  styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  '9d58421d-72dd-48bd-abe6-52481bfd41e1', 'c0000000-0000-0000-0000-000000000001', '3pc Export Quality Pure Cotton Bedsheets', '3pc-export-quality-pure-cotton-bedsheets-25', '3pc Export Quality Pure Cotton Bedsheets',
  '3pc Export Quality Pure Cotton Bedsheets 

 Double Bedsheets

 💯 % King Size

Fabric 100% Pure Cotton
1 Flat-Sheet king Size 10 (87*95)
2 Pillow Cover''s
( Size 19*29(50*75cm)
Granted Colours
Ready To Use and easily washable', 1900, 5, 1, '100%Pure Cotton',
  '300 TC', 'Pakistan', true, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('fe579eba-828f-4159-a361-8a79a0d4fafb', '9d58421d-72dd-48bd-abe6-52481bfd41e1', 'King', 'Warm Ivory', '#FAF7F2', 1900, 30, '3PC--KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('0e77bc73-e78f-4112-a813-5cf069c48fb7', '9d58421d-72dd-48bd-abe6-52481bfd41e1', '/images/products/3pc-export-quality-pure-cotton-bedsheets-25.jpg', '3pc Export Quality Pure Cotton Bedsheets  styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  'deb1b2c9-4c8b-4d21-af35-d64d8da4454c', 'c0000000-0000-0000-0000-000000000001', '3pc Export Quality Pure Cotton Bedsheets', '3pc-export-quality-pure-cotton-bedsheets-24', '3pc Export Quality Pure Cotton Bedsheets',
  '3pc Export Quality Pure Cotton Bedsheets 

 Double Bedsheets

 💯 % King Size

Fabric 100% Pure Cotton
1 Flat-Sheet king Size 10 (87*95)
2 Pillow Cover''s
( Size 19*29(50*75cm)
Granted Colours
Ready To Use and easily washable', 1900, 5, 1, '100% Pure Cotton',
  '300 TC', 'Pakistan', true, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('d1761325-6579-4f3e-a2df-1546c4862827', 'deb1b2c9-4c8b-4d21-af35-d64d8da4454c', 'King', 'Warm Ivory', '#FAF7F2', 1900, 30, '3PC--KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('64ac3cf9-a78e-4942-aed6-cd6a2ab7b45d', 'deb1b2c9-4c8b-4d21-af35-d64d8da4454c', '/images/products/3pc-export-quality-pure-cotton-bedsheets-24.jpg', '3pc Export Quality Pure Cotton Bedsheets  styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  'b5823d73-5a23-4acc-ac0c-dd237b27b1d2', 'c0000000-0000-0000-0000-000000000001', '3pc Export Quality Pure Cotton Bedsheets', '3pc-export-quality-pure-cotton-bedsheets-23', '3pc Export Quality Pure Cotton Bedsheets',
  '3pc Export Quality Pure Cotton Bedsheets 

 Double Bedsheets

 💯 % King Size

Fabric 100% Pure Cotton
1 Flat-Sheet king Size 10 (87*95)
2 Pillow Cover''s
( Size 19*29(50*75cm)
Granted Colours
Ready To Use and easily washable', 1900, 5, 1, '100% Pure Cotton',
  '300 TC', 'Pakistan', true, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('2604e18a-5354-4ab1-a931-651eed95b887', 'b5823d73-5a23-4acc-ac0c-dd237b27b1d2', 'King', 'Warm Ivory', '#FAF7F2', 1900, 30, '3PC--KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('7d8b4e2d-1186-4f62-af10-ab15809e68c3', 'b5823d73-5a23-4acc-ac0c-dd237b27b1d2', '/images/products/3pc-export-quality-pure-cotton-bedsheets-23.jpg', '3pc Export Quality Pure Cotton Bedsheets  styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  '6812cf18-0ac7-4856-a2a4-9e293d164bea', 'c0000000-0000-0000-0000-000000000001', '3pc Export Quality Pure Cotton Bedsheets', '3pc-export-quality-pure-cotton-bedsheets-22', '3pc Export Quality Pure Cotton Bedsheets',
  '3pc Export Quality Pure Cotton Bedsheets 

 Double Bedsheets

 💯 % King Size

Fabric 100% Pure Cotton
1 Flat-Sheet king Size 10 (87*95)
2 Pillow Cover''s
( Size 19*29(50*75cm)
Granted Colours
Ready To Use and easily washable', 1900, 5, 1, '100% Pure Cotton',
  '300 TC', 'Pakistan', true, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('aa6e1732-e808-4637-a977-d0d7025ef612', '6812cf18-0ac7-4856-a2a4-9e293d164bea', 'King', 'Warm Ivory', '#FAF7F2', 1900, 30, '3PC--KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('7f5024a0-6c31-4ca4-a64c-d1749012e9ef', '6812cf18-0ac7-4856-a2a4-9e293d164bea', '/images/products/3pc-export-quality-pure-cotton-bedsheets-22.jpg', '3pc Export Quality Pure Cotton Bedsheets  styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  '15ab2ca4-7d3d-4fc4-af8d-a12e31600531', 'c0000000-0000-0000-0000-000000000001', '3pc Export Quality Pure Cotton Bedsheets', '3pc-export-quality-pure-cotton-bedsheets-21', '3pc Export Quality Pure Cotton Bedsheets',
  '3pc Export Quality Pure Cotton Bedsheets 

 Double Bedsheets

 💯 % King Size

Fabric 100% Pure Cotton
1 Flat-Sheet king Size 10 (87*95)
2 Pillow Cover''s
( Size 19*29(50*75cm)
Granted Colours
Ready To Use and easily washable', 1900, 5, 1, '100%Pure Cotton',
  '300 TC', 'Pakistan', true, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('a1da2ecc-cab2-4a16-a698-6333c4d0a2fa', '15ab2ca4-7d3d-4fc4-af8d-a12e31600531', 'King', 'Warm Ivory', '#FAF7F2', 1900, 30, '3PC--KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('5be74869-ba9e-48cd-a5d4-a4bd1066c1cb', '15ab2ca4-7d3d-4fc4-af8d-a12e31600531', '/images/products/3pc-export-quality-pure-cotton-bedsheets-21.jpg', '3pc Export Quality Pure Cotton Bedsheets  styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  '848349a3-723e-48ea-ac3f-e665871ec903', 'c0000000-0000-0000-0000-000000000001', '3pc Export Quality Pure Cotton Bedsheets', '3pc-export-quality-pure-cotton-bedsheets-20', '3pc Export Quality Pure Cotton Bedsheets',
  '3pc Export Quality Pure Cotton Bedsheets 

 Double Bedsheets

 💯 % King Size

Fabric 100% Pure Cotton
1 Flat-Sheet king Size 10 (87*95)
2 Pillow Cover''s
( Size 19*29(50*75cm)
Granted Colours
Ready To Use and easily washable', 1900, 5, 1, '100%  Pure Cotton',
  '300 TC', 'Pakistan', true, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('51a28028-e547-47fa-aca9-22a936bbc7a5', '848349a3-723e-48ea-ac3f-e665871ec903', 'King', 'Warm Ivory', '#FAF7F2', 1900, 30, '3PC--KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('6ebb602f-b24d-4343-a747-6c5d7d45a93f', '848349a3-723e-48ea-ac3f-e665871ec903', '/images/products/3pc-export-quality-pure-cotton-bedsheets-20.jpg', '3pc Export Quality Pure Cotton Bedsheets  styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  '11b5dce5-0eca-4288-a986-9b16dd432b0b', 'c0000000-0000-0000-0000-000000000001', '3pc Export Quality Pure Cotton Bedsheets', '3pc-export-quality-pure-cotton-bedsheets-19', '3pc Export Quality Pure Cotton Bedsheets',
  '3pc Export Quality Pure Cotton Bedsheets 

 Double Bedsheets

 💯 % King Size

Fabric 100% Pure Cotton
1 Flat-Sheet king Size 10 (87*95)
2 Pillow Cover''s
( Size 19*29(50*75cm)
Granted Colours
Ready To Use and easily washable', 1900, 5, 1, '100% Pure Cotton',
  '300 TC', 'Pakistan', true, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('a1f83a82-4b7e-45e2-a267-8aac62ba1a33', '11b5dce5-0eca-4288-a986-9b16dd432b0b', 'King', 'Warm Ivory', '#FAF7F2', 1900, 30, '3PC--KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('ad5cbfb2-c10b-4520-a3d8-a2012d523f98', '11b5dce5-0eca-4288-a986-9b16dd432b0b', '/images/products/3pc-export-quality-pure-cotton-bedsheets-19.jpg', '3pc Export Quality Pure Cotton Bedsheets  styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  'c51e5649-0304-459e-a082-60ce31c48142', 'c0000000-0000-0000-0000-000000000001', '3pc Export Quality Pure Cotton Bedsheets', '3pc-export-quality-pure-cotton-bedsheets-18', '3pc Export Quality Pure Cotton Bedsheets',
  '3pc Export Quality Pure Cotton Bedsheets 

 Double Bedsheets

 💯 % King Size

Fabric 100% Pure Cotton
1 Flat-Sheet king Size 10 (87*95)
2 Pillow Cover''s
( Size 19*29(50*75cm)
Granted Colours
Ready To Use and easily washable', 1900, 5, 1, '100%  Pure Cotton',
  '300 TC', 'Pakistan', true, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('d63be1f3-b9ee-4aa0-a5c8-5f3f59e7bd27', 'c51e5649-0304-459e-a082-60ce31c48142', 'King', 'Warm Ivory', '#FAF7F2', 1900, 30, '3PC--KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('ac6a1f24-46a7-44a1-ab7a-a4fc3725e163', 'c51e5649-0304-459e-a082-60ce31c48142', '/images/products/3pc-export-quality-pure-cotton-bedsheets-18.jpg', '3pc Export Quality Pure Cotton Bedsheets  styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  '2b983a32-1ba8-4f64-ab65-09d230b945fc', 'c0000000-0000-0000-0000-000000000001', '3pc Export Quality Pure Cotton Bedsheets', '3pc-export-quality-pure-cotton-bedsheets-17', '3pc Export Quality Pure Cotton Bedsheets',
  '3pc Export Quality Pure Cotton Bedsheets 

 Double Bedsheets

 💯 % King Size

Fabric 100% Pure Cotton
1 Flat-Sheet king Size 10 (87*95)
2 Pillow Cover''s
( Size 19*29(50*75cm)
Granted Colours
Ready To Use and easily washable', 1900, 5, 1, '100% Pure Cotton',
  '300 TC', 'Pakistan', true, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('73aebc87-0977-4cc6-a3a9-728cd72fca25', '2b983a32-1ba8-4f64-ab65-09d230b945fc', 'King', 'Warm Ivory', '#FAF7F2', 1900, 30, '3PC--KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('e08335b5-86fa-4ec6-aa3e-1c9edf7820ee', '2b983a32-1ba8-4f64-ab65-09d230b945fc', '/images/products/3pc-export-quality-pure-cotton-bedsheets-17.jpg', '3pc Export Quality Pure Cotton Bedsheets  styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  '8ab82d9c-37c5-4e0c-a173-b7da2e3326d2', 'c0000000-0000-0000-0000-000000000001', '3pc Export Quality Pure Cotton Bedsheets', '3pc-export-quality-pure-cotton-bedsheets-16', '3pc Export Quality Pure Cotton Bedsheets',
  '3pc Export Quality Pure Cotton Bedsheets 

 Double Bedsheets

 💯 % King Size

Fabric 100% Pure Cotton
1 Flat-Sheet king Size 10 (87*95)
2 Pillow Cover''s
( Size 19*29(50*75cm)
Granted Colours
Ready To Use and easily washable', 1900, 5, 1, '100% Pure Cotton',
  '300 TC', 'Pakistan', true, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('a2e7458f-0ede-4cd7-a47a-0c6b03a3e047', '8ab82d9c-37c5-4e0c-a173-b7da2e3326d2', 'King', 'Warm Ivory', '#FAF7F2', 1900, 30, '3PC--KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('a616fc29-bdaa-4528-a7b9-f8f87f6cb3fc', '8ab82d9c-37c5-4e0c-a173-b7da2e3326d2', '/images/products/3pc-export-quality-pure-cotton-bedsheets-16.jpg', '3pc Export Quality Pure Cotton Bedsheets  styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  'a0998e1a-af61-4543-a42d-32120fedede3', 'c0000000-0000-0000-0000-000000000001', '3pc Export Quality Pure Cotton Bedsheets', '3pc-export-quality-pure-cotton-bedsheets-15', '3pc Export Quality Pure Cotton Bedsheets',
  '3pc Export Quality Pure Cotton Bedsheets 

 Double Bedsheets

 💯 % King Size

Fabric 100% Pure Cotton
1 Flat-Sheet king Size 10 (87*95)
2 Pillow Cover''s
( Size 19*29(50*75cm)
Granted Colours
Ready To Use and easily washable', 1900, 5, 1, '100% Pure Cotton',
  '300 TC', 'Pakistan', true, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('0eb2ce6d-8991-47d8-a965-fa166175ebd2', 'a0998e1a-af61-4543-a42d-32120fedede3', 'King', 'Warm Ivory', '#FAF7F2', 1900, 30, '3PC--KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('e1869e8e-7cfd-48fe-ab57-c5ee0328d106', 'a0998e1a-af61-4543-a42d-32120fedede3', '/images/products/3pc-export-quality-pure-cotton-bedsheets-15.jpg', '3pc Export Quality Pure Cotton Bedsheets  styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  'dd8a8030-7b25-4c21-ade1-169dfab3ed5e', 'c0000000-0000-0000-0000-000000000001', '3pc Export Quality Pure Cotton Bedsheets', '3pc-export-quality-pure-cotton-bedsheets-14', '3pc Export Quality Pure Cotton Bedsheets',
  '3pc Export Quality Pure Cotton Bedsheets 

 Double Bedsheets

 💯 % King Size

Fabric 100% Pure Cotton
1 Flat-Sheet king Size 10 (87*95)
2 Pillow Cover''s
( Size 19*29(50*75cm)
Granted Colours
Ready To Use and easily washable', 1900, 5, 1, '100% Pure Cotton',
  '300 TC', 'Pakistan', true, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('4804fec9-1dcd-48e5-a2ff-8e68c915736c', 'dd8a8030-7b25-4c21-ade1-169dfab3ed5e', 'King', 'Warm Ivory', '#FAF7F2', 1900, 30, '3PC--KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('d2f0216d-d5a3-414c-ad99-28cc5dc18313', 'dd8a8030-7b25-4c21-ade1-169dfab3ed5e', '/images/products/3pc-export-quality-pure-cotton-bedsheets-14.jpg', '3pc Export Quality Pure Cotton Bedsheets  styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  '47a5b000-a54c-4616-a350-09a9c7aa290f', 'c0000000-0000-0000-0000-000000000001', '3pc Export Quality Pure Cotton Bedsheets', '3pc-export-quality-pure-cotton-bedsheets-13', '3pc Export Quality Pure Cotton Bedsheets',
  '3pc Export Quality Pure Cotton Bedsheets 

 Double Bedsheets

 💯 % King Size

Fabric 100% Pure Cotton
1 Flat-Sheet king Size 10 (87*95)
2 Pillow Cover''s
( Size 19*29(50*75cm)
Granted Colours
Ready To Use and easily washable', 1900, 5, 1, '100%  Pure Cotton',
  '300 TC', 'Pakistan', true, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('b55c80aa-2ac0-4a52-ad81-1a1d3aec4892', '47a5b000-a54c-4616-a350-09a9c7aa290f', 'King', 'Warm Ivory', '#FAF7F2', 1900, 30, '3PC--KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('b3ee93b2-c128-4c22-a7db-6cbb0d7a2c9e', '47a5b000-a54c-4616-a350-09a9c7aa290f', '/images/products/3pc-export-quality-pure-cotton-bedsheets-13.jpg', '3pc Export Quality Pure Cotton Bedsheets  styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  'd71b3811-2219-40f7-a3c5-bc83faee99a1', 'c0000000-0000-0000-0000-000000000001', '3pc Export Quality Pure Cotton Bedsheets', '3pc-export-quality-pure-cotton-bedsheets-12', '3pc Export Quality Pure Cotton Bedsheets',
  '3pc Export Quality Pure Cotton Bedsheets 

 Double Bedsheets

 💯 % King Size

Fabric 100% Pure Cotton
1 Flat-Sheet king Size 10 (87*95)
2 Pillow Cover''s
( Size 19*29(50*75cm)
Granted Colours
Ready To Use and easily washable', 1900, 5, 1, '100% Pure Cotton',
  '300 TC', 'Pakistan', true, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('e813699e-5872-43a9-aa61-162fa37cb27b', 'd71b3811-2219-40f7-a3c5-bc83faee99a1', 'King', 'Warm Ivory', '#FAF7F2', 1900, 30, '3PC--KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('f47066fe-554c-4ef9-afd7-4e2808c426f6', 'd71b3811-2219-40f7-a3c5-bc83faee99a1', '/images/products/3pc-export-quality-pure-cotton-bedsheets-12.jpg', '3pc Export Quality Pure Cotton Bedsheets  styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  'bfdc594d-1d93-4be8-a4ec-844ce8351829', 'c0000000-0000-0000-0000-000000000001', '3pc Export Quality Pure Cotton Bedsheets', '3pc-export-quality-pure-cotton-bedsheets-11', '3pc Export Quality Pure Cotton Bedsheets',
  '3pc Export Quality Pure Cotton Bedsheets 

 Double Bedsheets

 💯 % King Size

Fabric 100% Pure Cotton
1 Flat-Sheet king Size 10 (87*95)
2 Pillow Cover''s
( Size 19*29(50*75cm)
Granted Colours
Ready To Use and easily washable', 1900, 5, 1, '100% Pure Cotton',
  '300 TC', 'Pakistan', true, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('c261fd12-8e46-44de-a050-d02189caea01', 'bfdc594d-1d93-4be8-a4ec-844ce8351829', 'King', 'Warm Ivory', '#FAF7F2', 1900, 30, '3PC--KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('ed43940a-170e-49ba-a674-f6572b2b2ac2', 'bfdc594d-1d93-4be8-a4ec-844ce8351829', '/images/products/3pc-export-quality-pure-cotton-bedsheets-11.jpg', '3pc Export Quality Pure Cotton Bedsheets  styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  '0d2fbc3d-8b2e-4053-a304-63fe7e3b565a', 'c0000000-0000-0000-0000-000000000001', '3pc Export Quality Pure Cotton Bedsheets', '3pc-export-quality-pure-cotton-bedsheets-10', '3pc Export Quality Pure Cotton Bedsheets',
  '3pc Export Quality Pure Cotton Bedsheets 

 Double Bedsheets

 💯 % King Size

Fabric 100% Pure Cotton
1 Flat-Sheet king Size 10 (87*95)
2 Pillow Cover''s
( Size 19*29(50*75cm)
Granted Colours
Ready To Use and easily washable', 1900, 5, 1, '100% Pure Cotton',
  '300 TC', 'Pakistan', true, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('e0d63e7d-fddb-4f3f-ab4d-e1022abd4240', '0d2fbc3d-8b2e-4053-a304-63fe7e3b565a', 'King', 'Warm Ivory', '#FAF7F2', 1900, 30, '3PC--KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('9035cdd7-228b-43b2-ad91-30a7eec11391', '0d2fbc3d-8b2e-4053-a304-63fe7e3b565a', '/images/products/3pc-export-quality-pure-cotton-bedsheets-10.jpg', '3pc Export Quality Pure Cotton Bedsheets  styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  '20d596e9-b0e1-4483-a947-9c8f45e00f78', 'c0000000-0000-0000-0000-000000000001', '3pc Export Quality Pure Cotton Bedsheets', '3pc-export-quality-pure-cotton-bedsheets-9', '3pc Export Quality Pure Cotton Bedsheets',
  '3pc Export Quality Pure Cotton Bedsheets 

 Double Bedsheets

 💯 % King Size

Fabric 100% Pure Cotton
1 Flat-Sheet king Size 10 (87*95)
2 Pillow Cover''s
( Size 19*29(50*75cm)
Granted Colours
Ready To Use and easily washable', 1900, 5, 1, '100%  Pure Cotton',
  '300 TC', 'Pakistan', true, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('ea21e73d-bcb1-4dae-a8a1-2e7b94583d92', '20d596e9-b0e1-4483-a947-9c8f45e00f78', 'King', 'Warm Ivory', '#FAF7F2', 1900, 30, '3PC--KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('8dfca7a1-7df7-4b75-acfd-eac0f7970788', '20d596e9-b0e1-4483-a947-9c8f45e00f78', '/images/products/3pc-export-quality-pure-cotton-bedsheets-9.jpg', '3pc Export Quality Pure Cotton Bedsheets  styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  '42146897-55f1-44ac-a6d4-8296a5a20f7f', 'c0000000-0000-0000-0000-000000000001', '3pc Export Quality Pure Cotton Bedsheets', '3pc-export-quality-pure-cotton-bedsheets-8', '3pc Export Quality Pure Cotton Bedsheets',
  '3pc Export Quality Pure Cotton Bedsheets 

 Double Bedsheets

 💯 % King Size

Fabric 100% Pure Cotton
1 Flat-Sheet king Size 10 (87*95)
2 Pillow Cover''s
( Size 19*29(50*75cm)
Granted Colours
Ready To Use and easily washable', 1900, 5, 1, '100% Pure Cotton',
  '300 TC', 'Pakistan', true, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('cc46ff85-6dc1-4612-a367-a852cfceb953', '42146897-55f1-44ac-a6d4-8296a5a20f7f', 'King', 'Warm Ivory', '#FAF7F2', 1900, 30, '3PC--KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('80df36ff-fe17-42ed-a58d-893421750ef3', '42146897-55f1-44ac-a6d4-8296a5a20f7f', '/images/products/3pc-export-quality-pure-cotton-bedsheets-8.jpg', '3pc Export Quality Pure Cotton Bedsheets  styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  'ac4bce41-99ed-45fa-a7ca-cecc7ba24890', 'c0000000-0000-0000-0000-000000000001', '3pc Export Quality Pure Cotton Bedsheets', '3pc-export-quality-pure-cotton-bedsheets-7', '3pc Export Quality Pure Cotton Bedsheets',
  '3pc Export Quality Pure Cotton Bedsheets 

 Double Bedsheets

 💯 % King Size

Fabric 100% Pure Cotton
1 Flat-Sheet king Size 10 (87*95)
2 Pillow Cover''s
( Size 19*29(50*75cm)
Granted Colours
Ready To Use and easily washable', 1900, 5, 1, '100% Pure Cotton',
  '300 TC', 'Pakistan', true, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('0c43a615-dd8b-49fd-ae05-1e06ea6062a0', 'ac4bce41-99ed-45fa-a7ca-cecc7ba24890', 'King', 'Warm Ivory', '#FAF7F2', 1900, 30, '3PC--KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('eb18e95a-274e-489f-a749-58d84c3f14c9', 'ac4bce41-99ed-45fa-a7ca-cecc7ba24890', '/images/products/3pc-export-quality-pure-cotton-bedsheets-7.jpg', '3pc Export Quality Pure Cotton Bedsheets  styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  'cb4ab829-b03c-4fa8-af7c-3f75d5096a3b', 'c0000000-0000-0000-0000-000000000001', '3pc Export Quality Pure Cotton Bedsheets', '3pc-export-quality-pure-cotton-bedsheets-6', '3pc Export Quality Pure Cotton Bedsheets',
  '3pc Export Quality Pure Cotton Bedsheets 

 Double Bedsheets

 💯 % King Size

Fabric 100% Pure Cotton
1 Flat-Sheet king Size 10 (87*95)
2 Pillow Cover''s
( Size 19*29(50*75cm)
Granted Colours
Ready To Use and easily washable', 1900, 5, 1, '100% Pure Cotton',
  '300 TC', 'Pakistan', true, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('4c6dbc29-65ad-4252-a2ac-dc422b695205', 'cb4ab829-b03c-4fa8-af7c-3f75d5096a3b', 'King', 'Warm Ivory', '#FAF7F2', 1900, 30, '3PC--KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('3a5f0579-9ff5-4c53-a708-b32bef557cad', 'cb4ab829-b03c-4fa8-af7c-3f75d5096a3b', '/images/products/3pc-export-quality-pure-cotton-bedsheets-6.jpg', '3pc Export Quality Pure Cotton Bedsheets  styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  '481cd395-70e8-4f22-a7eb-a9c1306cbbd7', 'c0000000-0000-0000-0000-000000000001', '3pc Export Quality Pure Cotton Bedsheets', '3pc-export-quality-pure-cotton-bedsheets-5', '3pc Export Quality Pure Cotton Bedsheets',
  '3pc Export Quality Pure Cotton Bedsheets 

 Double Bedsheets

 💯 % King Size

Fabric 100% Pure Cotton
1 Flat-Sheet king Size 10 (87*95)
2 Pillow Cover''s
( Size 19*29(50*75cm)
Granted Colours
Ready To Use and easily washable', 1900, 5, 1, '100% Pure Cotton',
  '300 TC', 'Pakistan', true, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('198343d1-c8e9-4f58-aed5-9f9c98b9ab39', '481cd395-70e8-4f22-a7eb-a9c1306cbbd7', 'King', 'Warm Ivory', '#FAF7F2', 1900, 30, '3PC--KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('49a71187-1936-4056-aafc-46885bf19fab', '481cd395-70e8-4f22-a7eb-a9c1306cbbd7', '/images/products/3pc-export-quality-pure-cotton-bedsheets-5.jpg', '3pc Export Quality Pure Cotton Bedsheets  styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  '65a0c7e9-8fc0-4cd7-a4e9-20b22187d852', 'c0000000-0000-0000-0000-000000000001', '3pc Export Quality Pure Cotton Bedsheets', '3pc-export-quality-pure-cotton-bedsheets-4', '3pc Export Quality Pure Cotton Bedsheets',
  '3pc Export Quality Pure Cotton Bedsheets 

 Double Bedsheets

 💯 % King Size

Fabric 100% Pure Cotton
1 Flat-Sheet king Size 10 (87*95)
2 Pillow Cover''s
( Size 19*29(50*75cm)
Granted Colours
Ready To Use and easily washable', 1900, 5, 1, '100% Pure Cotton',
  '300 TC', 'Pakistan', true, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('858b9b59-deaf-46a8-ae5b-e1158c9b2319', '65a0c7e9-8fc0-4cd7-a4e9-20b22187d852', 'King', 'Warm Ivory', '#FAF7F2', 1900, 30, '3PC--KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('32bf836b-2eea-448e-af7c-1e5a2a55ddaa', '65a0c7e9-8fc0-4cd7-a4e9-20b22187d852', '/images/products/3pc-export-quality-pure-cotton-bedsheets-4.jpg', '3pc Export Quality Pure Cotton Bedsheets  styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  'f7dd8546-f5dc-4f17-a66b-00513ea5501a', 'c0000000-0000-0000-0000-000000000001', '3pc Export Quality Pure Cotton Bedsheets', '3pc-export-quality-pure-cotton-bedsheets-3', '3pc Export Quality Pure Cotton Bedsheets',
  '3pc Export Quality Pure Cotton Bedsheets 

 Double Bedsheets

 💯 % King Size

Fabric 100% Pure Cotton
1 Flat-Sheet king Size 10 (87*95)
2 Pillow Cover''s
( Size 19*29(50*75cm)
Granted Colours
Ready To Use and easily washable', 1900, 5, 1, '100%  Pure Cotton',
  '300 TC', 'Pakistan', true, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('01d95c85-bb70-4207-a437-47463034c45d', 'f7dd8546-f5dc-4f17-a66b-00513ea5501a', 'King', 'Warm Ivory', '#FAF7F2', 1900, 30, '3PC--KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('42d2e6c3-7fb1-438a-a82c-26084c348bf4', 'f7dd8546-f5dc-4f17-a66b-00513ea5501a', '/images/products/3pc-export-quality-pure-cotton-bedsheets-3.jpg', '3pc Export Quality Pure Cotton Bedsheets  styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  'd0c00907-01bd-4910-ab48-265e403b53a3', 'c0000000-0000-0000-0000-000000000001', '3pc Export Quality Pure Cotton Bedsheets', '3pc-export-quality-pure-cotton-bedsheets-2', '3pc Export Quality Pure Cotton Bedsheets',
  '3pc Export Quality Pure Cotton Bedsheets 

 Double Bedsheets

 💯 % King Size

Fabric 100% Pure Cotton
1 Flat-Sheet king Size 10 (87*95)
2 Pillow Cover''s
( Size 19*29(50*75cm)
Granted Colours
Ready To Use and easily washable', 1900, 5, 1, '100%  Pure Cotton',
  '300 TC', 'Pakistan', true, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('a768ee6e-8b8e-4f94-a84f-d9540c41d131', 'd0c00907-01bd-4910-ab48-265e403b53a3', 'King', 'Warm Ivory', '#FAF7F2', 1900, 30, '3PC--KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('e5ca1eed-7b1d-4eb8-a5c1-6cda42565fc4', 'd0c00907-01bd-4910-ab48-265e403b53a3', '/images/products/3pc-export-quality-pure-cotton-bedsheets-2.jpg', '3pc Export Quality Pure Cotton Bedsheets  styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  'd53b71a5-4dce-471a-a6c3-faac7a73302c', 'c0000000-0000-0000-0000-000000000001', '3pc Export Quality Pure Cotton Bedsheets', '3pc-export-quality-pure-cotton-bedsheets', '3pc Export Quality Pure Cotton Bedsheets',
  '3pc Export Quality Pure Cotton Bedsheets 

 Double Bedsheets

 💯 % King Size

Fabric 100% Pure Cotton
1 Flat-Sheet king Size 10 (87*95)
2 Pillow Cover''s
( Size 19*29(50*75cm)
Granted Colours
Ready To Use and easily washable', 1900, 5, 1, '100% Pure Cotton',
  '300 TC', 'Pakistan', true, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('40096819-3119-4f40-adcf-8e24295777bb', 'd53b71a5-4dce-471a-a6c3-faac7a73302c', 'King', 'Warm Ivory', '#FAF7F2', 1900, 30, '3PC--KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('8347c05c-0b9c-425e-a158-77954a52698d', 'd53b71a5-4dce-471a-a6c3-faac7a73302c', '/images/products/3pc-export-quality-pure-cotton-bedsheets.jpg', '3pc Export Quality Pure Cotton Bedsheets  styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  '99ba1302-715c-427c-ae54-1905395157b8', 'c0000000-0000-0000-0000-000000000001', '5 PC Export Quality Pure Cotton Bedsheets', '5-pc-export-quality-pure-cotton-bedsheets-22', '5 PC Export Quality Pure Cotton Bedsheets',
  '5 PC Export Quality Pure Cotton Bedsheets 

 Double Bedsheets

 💯 % King Size

Fabric 100% Pure Cotton
* 1 Flat - Sheet 
king Size (87*95)
* 4 Pillow Cover''s
Size 19*29
Granted Colours
Ready To Use and easily washable', 2050, 5, 1, '100%Pure Cotton',
  '300 TC', 'Pakistan', true, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('385edbd6-8eb0-4d8b-aba2-b336fa83e237', '99ba1302-715c-427c-ae54-1905395157b8', 'King', 'Warm Ivory', '#FAF7F2', 2050, 30, '5-PC-KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('18f5038f-3d87-4e9d-a5bf-5834726f5ad1', '99ba1302-715c-427c-ae54-1905395157b8', '/images/products/5-pc-export-quality-pure-cotton-bedsheets-22.jpg', '5 PC Export Quality Pure Cotton Bedsheets styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  '266bb31a-d9fe-47e0-ade5-72046669256a', 'c0000000-0000-0000-0000-000000000001', '5 PC Export Quality Pure Cotton Bedsheets', '5-pc-export-quality-pure-cotton-bedsheets-21', '5 PC Export Quality Pure Cotton Bedsheets',
  '5 PC Export Quality Pure Cotton Bedsheets 

 Double Bedsheets

 💯 % King Size

Fabric 100% Pure Cotton
* 1 Flat - Sheet 
king Size (87*95)
* 4 Pillow Cover''s
Size 19*29
Granted Colours
Ready To Use and easily washable', 2050, 5, 1, '100%Pure Cotton',
  '300 TC', 'Pakistan', true, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('e012476e-bcd3-418f-a2fb-5ebe09206349', '266bb31a-d9fe-47e0-ade5-72046669256a', 'King', 'Warm Ivory', '#FAF7F2', 2050, 30, '5-PC-KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('9645584c-f09a-42ad-a82a-251bdace0348', '266bb31a-d9fe-47e0-ade5-72046669256a', '/images/products/5-pc-export-quality-pure-cotton-bedsheets-21.jpg', '5 PC Export Quality Pure Cotton Bedsheets  styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  '07c5f027-4ea7-4ed9-a457-33ac6e28b32d', 'c0000000-0000-0000-0000-000000000001', '5 PC Export Quality Pure Cotton Bedsheets', '5-pc-export-quality-pure-cotton-bedsheets-20', '5 PC Export Quality Pure Cotton Bedsheets',
  '5 PC Export Quality Pure Cotton Bedsheets 

 Double Bedsheets

 💯 % King Size

Fabric 100% Pure Cotton
* 1 Flat - Sheet 
king Size (87*95)
* 4 Pillow Cover''s
Size 19*29
Granted Colours
Ready To Use and easily washable', 2050, 5, 1, '100% Pure Cotton',
  '300 TC', 'Pakistan', true, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('f75c67a4-1d6f-46db-a7db-f7fd3d51bec8', '07c5f027-4ea7-4ed9-a457-33ac6e28b32d', 'King', 'Warm Ivory', '#FAF7F2', 2050, 30, '5-PC-KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('1be546dc-a76c-4ba6-a290-ab24f75aef56', '07c5f027-4ea7-4ed9-a457-33ac6e28b32d', '/images/products/5-pc-export-quality-pure-cotton-bedsheets-20.jpg', '5 PC Export Quality Pure Cotton Bedsheets  styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  '03c7083c-b8a0-4dce-a788-176ae95a11cf', 'c0000000-0000-0000-0000-000000000001', '5 PC Export Quality Pure Cotton Bedsheets', '5-pc-export-quality-pure-cotton-bedsheets-19', '5 PC Export Quality Pure Cotton Bedsheets',
  '5 PC Export Quality Pure Cotton Bedsheets 

 Double Bedsheets

 💯 % King Size

Fabric 100% Pure Cotton
* 1 Flat - Sheet 
king Size (87*95)
* 4 Pillow Cover''s
Size 19*29
Granted Colours
Ready To Use and easily washable', 2050, 5, 1, '100% Pure Cotton',
  '300 TC', 'Pakistan', true, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('89566bc9-d20c-460e-a1a7-1d501f7d8f31', '03c7083c-b8a0-4dce-a788-176ae95a11cf', 'King', 'Warm Ivory', '#FAF7F2', 2050, 30, '5-PC-KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('cec4c964-44eb-431e-a84a-ec79a3560c69', '03c7083c-b8a0-4dce-a788-176ae95a11cf', '/images/products/5-pc-export-quality-pure-cotton-bedsheets-19.jpg', '5 PC Export Quality Pure Cotton Bedsheets  styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  'dc1fb549-5d53-460d-a8bd-42b68dee1a19', 'c0000000-0000-0000-0000-000000000001', '5 PC Export Quality Pure Cotton Bedsheets', '5-pc-export-quality-pure-cotton-bedsheets-18', '5 PC Export Quality Pure Cotton Bedsheets',
  '5 PC Export Quality Pure Cotton Bedsheets 

 Double Bedsheets

 💯 % King Size

Fabric 100% Pure Cotton
* 1 Flat - Sheet 
king Size (87*95)
* 4 Pillow Cover''s
Size 19*29
Granted Colours
Ready To Use and easily washable', 2050, 5, 1, '100% Pure Cotton',
  '300 TC', 'Pakistan', true, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('a0bca8f4-c82b-4317-a678-7c62882b8765', 'dc1fb549-5d53-460d-a8bd-42b68dee1a19', 'King', 'Warm Ivory', '#FAF7F2', 2050, 30, '5-PC-KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('50b88561-488a-4254-a47c-db7b8764ac53', 'dc1fb549-5d53-460d-a8bd-42b68dee1a19', '/images/products/5-pc-export-quality-pure-cotton-bedsheets-18.jpg', '5 PC Export Quality Pure Cotton Bedsheets  styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  'e7c59e33-f89a-4d26-a887-5bf206e265e0', 'c0000000-0000-0000-0000-000000000001', '5 PC Export Quality Pure Cotton Bedsheets', '5-pc-export-quality-pure-cotton-bedsheets-17', '5 PC Export Quality Pure Cotton Bedsheets',
  '5 PC Export Quality Pure Cotton Bedsheets 

 Double Bedsheets

 💯 % King Size

Fabric 100% Pure Cotton
* 1 Flat - Sheet 
king Size (87*95)
* 4 Pillow Cover''s
Size 19*29
Granted Colours
Ready To Use and easily washable', 2050, 5, 1, '100%Pure Cotton',
  '300 TC', 'Pakistan', true, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('304b0f26-d06b-4c01-acaa-efa8bff600e2', 'e7c59e33-f89a-4d26-a887-5bf206e265e0', 'King', 'Warm Ivory', '#FAF7F2', 2050, 30, '5-PC-KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('ab438b9a-b096-452e-a987-1d97180e9ce5', 'e7c59e33-f89a-4d26-a887-5bf206e265e0', '/images/products/5-pc-export-quality-pure-cotton-bedsheets-17.jpg', '5 PC Export Quality Pure Cotton Bedsheets  styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  '8c5a3ccf-8912-47aa-aff9-25b9fe02d31e', 'c0000000-0000-0000-0000-000000000001', '5 PC Export Quality Pure Cotton Bedsheets', '5-pc-export-quality-pure-cotton-bedsheets-16', '5 PC Export Quality Pure Cotton Bedsheets',
  '5 PC Export Quality Pure Cotton Bedsheets 

 Double Bedsheets

 💯 % King Size

Fabric 100% Pure Cotton
* 1 Flat - Sheet 
king Size (87*95)
* 4 Pillow Cover''s
Size 19*29
Granted Colours
Ready To Use and easily washable', 2050, 5, 1, '100%Pure Cotton',
  '300 TC', 'Pakistan', true, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('f9a9afe2-17ec-4344-a18a-4c0390b483f6', '8c5a3ccf-8912-47aa-aff9-25b9fe02d31e', 'King', 'Warm Ivory', '#FAF7F2', 2050, 30, '5-PC-KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('74246099-3651-4ab9-aa1d-10119bcf5d57', '8c5a3ccf-8912-47aa-aff9-25b9fe02d31e', '/images/products/5-pc-export-quality-pure-cotton-bedsheets-16.jpg', '5 PC Export Quality Pure Cotton Bedsheets  styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  '29f9a822-426c-4dfa-af33-5881aadba4ab', 'c0000000-0000-0000-0000-000000000001', '5 PC Export Quality Pure Cotton Bedsheets', '5-pc-export-quality-pure-cotton-bedsheets-15', '5 PC Export Quality Pure Cotton Bedsheets',
  '5 PC Export Quality Pure Cotton Bedsheets 

 Double Bedsheets

 💯 % King Size

Fabric 100% Pure Cotton
* 1 Flat - Sheet 
king Size (87*95)
* 4 Pillow Cover''s
Size 19*29
Granted Colours
Ready To Use and easily washable', 2050, 5, 1, '100%Pure Cotton',
  '300 TC', 'Pakistan', true, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('54fcf2ae-646e-484f-ad7c-74a26e2f7d4b', '29f9a822-426c-4dfa-af33-5881aadba4ab', 'King', 'Warm Ivory', '#FAF7F2', 2050, 30, '5-PC-KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('bdc91e7c-5575-4176-a58b-215959ad9c3c', '29f9a822-426c-4dfa-af33-5881aadba4ab', '/images/products/5-pc-export-quality-pure-cotton-bedsheets-15.jpg', '5 PC Export Quality Pure Cotton Bedsheets  styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  '5ce0161f-7aaf-47b3-a520-45b86d0f69dc', 'c0000000-0000-0000-0000-000000000001', '5 PC Export Quality Pure Cotton Bedsheets', '5-pc-export-quality-pure-cotton-bedsheets-14', '5 PC Export Quality Pure Cotton Bedsheets',
  '5 PC Export Quality Pure Cotton Bedsheets 

 Double Bedsheets

 💯 % King Size

Fabric 100% Pure Cotton
* 1 Flat - Sheet 
king Size (87*95)
* 4 Pillow Cover''s
Size 19*29
Granted Colours
Ready To Use and easily washable', 2050, 5, 1, '100% Pure Cotton',
  '300 TC', 'Pakistan', true, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('733b782d-ac3f-43a6-a4b6-dfaa0e2e7e03', '5ce0161f-7aaf-47b3-a520-45b86d0f69dc', 'King', 'Warm Ivory', '#FAF7F2', 2050, 30, '5-PC-KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('988953e3-708e-4420-a18b-a79079f7b2b2', '5ce0161f-7aaf-47b3-a520-45b86d0f69dc', '/images/products/5-pc-export-quality-pure-cotton-bedsheets-14.jpg', '5 PC Export Quality Pure Cotton Bedsheets  styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  'f3085666-4573-4923-a5fc-521d43de590d', 'c0000000-0000-0000-0000-000000000001', '5 PC Export Quality Pure Cotton Bedsheets', '5-pc-export-quality-pure-cotton-bedsheets-13', '5 PC Export Quality Pure Cotton Bedsheets',
  '5 PC Export Quality Pure Cotton Bedsheets 

 Double Bedsheets

 💯 % King Size

Fabric 100% Pure Cotton
* 1 Flat - Sheet 
king Size (87*95)
* 4 Pillow Cover''s
Size 19*29
Granted Colours
Ready To Use and easily washable', 2050, 5, 1, '100%Pure Cotton',
  '300 TC', 'Pakistan', true, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('a7d018b7-5c0a-432f-a554-c251db47ec3c', 'f3085666-4573-4923-a5fc-521d43de590d', 'King', 'Warm Ivory', '#FAF7F2', 2050, 30, '5-PC-KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('8d5dabf4-70e4-49a5-a3c8-cc587db24b52', 'f3085666-4573-4923-a5fc-521d43de590d', '/images/products/5-pc-export-quality-pure-cotton-bedsheets-13.jpg', '5 PC Export Quality Pure Cotton Bedsheets  styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  '3a4f92a0-14cc-48e1-a4a1-897285269363', 'c0000000-0000-0000-0000-000000000001', '5 PC Export Quality Pure Cotton Bedsheets', '5-pc-export-quality-pure-cotton-bedsheets-12', '5 PC Export Quality Pure Cotton Bedsheets',
  '5 PC Export Quality Pure Cotton Bedsheets 

 Double Bedsheets

 💯 % King Size

Fabric 100% Pure Cotton
* 1 Flat - Sheet 
king Size (87*95)
* 4 Pillow Cover''s
Size 19*29
Granted Colours
Ready To Use and easily washable', 2050, 5, 1, '100%Pure Cotton',
  '300 TC', 'Pakistan', true, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('50a112e5-da1c-44a4-a380-ec7351234353', '3a4f92a0-14cc-48e1-a4a1-897285269363', 'King', 'Warm Ivory', '#FAF7F2', 2050, 30, '5-PC-KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('75359981-b70a-4aea-af4b-b1f0d6c7ba0e', '3a4f92a0-14cc-48e1-a4a1-897285269363', '/images/products/5-pc-export-quality-pure-cotton-bedsheets-12.jpg', '5 PC Export Quality Pure Cotton Bedsheets  styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  '39eda2d7-cad9-4e8e-a99c-f7e8776cd1ce', 'c0000000-0000-0000-0000-000000000001', '5 PC Export Quality Pure Cotton Bedsheets', '5-pc-export-quality-pure-cotton-bedsheets-11', '5 PC Export Quality Pure Cotton Bedsheets',
  '5 PC Export Quality Pure Cotton Bedsheets 

 Double Bedsheets

 💯 % King Size

Fabric 100% Pure Cotton
* 1 Flat - Sheet 
king Size (87*95)
* 4 Pillow Cover''s
Size 19*29
Granted Colours
Ready To Use and easily washable', 2050, 5, 1, '100%  Pure Cotton',
  '300 TC', 'Pakistan', true, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('27594b73-a8e3-4bed-aa2e-6f94a6da5281', '39eda2d7-cad9-4e8e-a99c-f7e8776cd1ce', 'King', 'Warm Ivory', '#FAF7F2', 2050, 30, '5-PC-KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('5aad6ccf-2217-4955-a4cc-71c93b57e549', '39eda2d7-cad9-4e8e-a99c-f7e8776cd1ce', '/images/products/5-pc-export-quality-pure-cotton-bedsheets-11.jpg', '5 PC Export Quality Pure Cotton Bedsheets  styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  '8dac1df0-a0bb-446b-a512-1ba28e6b35d7', 'c0000000-0000-0000-0000-000000000001', '5 PC Export Quality Pure Cotton Bedsheets', '5-pc-export-quality-pure-cotton-bedsheets-10', '5 PC Export Quality Pure Cotton Bedsheets',
  '5 PC Export Quality Pure Cotton Bedsheets 

 Double Bedsheets

 💯 % King Size

Fabric 100% Pure Cotton
* 1 Flat - Sheet 
king Size (87*95)
* 4 Pillow Cover''s
Size 19*29
Granted Colours
Ready To Use and easily washable', 2050, 5, 1, '100% Pure Cotton',
  '300 TC', 'Pakistan', true, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('bd2c3e52-a6ab-4299-af78-6f4ea0d1b0cf', '8dac1df0-a0bb-446b-a512-1ba28e6b35d7', 'King', 'Warm Ivory', '#FAF7F2', 2050, 30, '5-PC-KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('ada55339-fa8a-498e-a646-178edbbf5844', '8dac1df0-a0bb-446b-a512-1ba28e6b35d7', '/images/products/5-pc-export-quality-pure-cotton-bedsheets-10.jpg', '5 PC Export Quality Pure Cotton Bedsheets  styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  'e6e7e371-1f89-486b-ae31-b201a3c73a43', 'c0000000-0000-0000-0000-000000000001', '5 PC Export Quality Pure Cotton Bedsheets', '5-pc-export-quality-pure-cotton-bedsheets-9', '5 PC Export Quality Pure Cotton Bedsheets',
  '5 PC Export Quality Pure Cotton Bedsheets 

 Double Bedsheets

 💯 % King Size

Fabric 100% Pure Cotton
* 1 Flat - Sheet 
king Size (87*95)
* 4 Pillow Cover''s
Size 19*29
Granted Colours
Ready To Use and easily washable', 2050, 5, 1, '100% Pure Cotton',
  '300 TC', 'Pakistan', true, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('4031ca3b-772b-47bc-aa45-49ea7e8f95c7', 'e6e7e371-1f89-486b-ae31-b201a3c73a43', 'King', 'Warm Ivory', '#FAF7F2', 2050, 30, '5-PC-KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('6d16a6d6-a0bd-45e6-ab1e-fe33f14c1339', 'e6e7e371-1f89-486b-ae31-b201a3c73a43', '/images/products/5-pc-export-quality-pure-cotton-bedsheets-9.jpg', '5 PC Export Quality Pure Cotton Bedsheets  styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  '4f900f57-5392-47fb-aef1-289d6bf71376', 'c0000000-0000-0000-0000-000000000001', '5 PC Export Quality Pure Cotton Bedsheets', '5-pc-export-quality-pure-cotton-bedsheets-8', '5 PC Export Quality Pure Cotton Bedsheets',
  '5 PC Export Quality Pure Cotton Bedsheets 

 Double Bedsheets

 💯 % King Size

Fabric 100% Pure Cotton
* 1 Flat - Sheet 
king Size (87*95)
* 4 Pillow Cover''s
Size 19*29
Granted Colours
Ready To Use and easily washable', 2050, 5, 1, '100%  Pure Cotton',
  '300 TC', 'Pakistan', true, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('0c21b4c7-96b0-4e25-a6ec-7847e119c566', '4f900f57-5392-47fb-aef1-289d6bf71376', 'King', 'Warm Ivory', '#FAF7F2', 2050, 30, '5-PC-KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('541405e4-2e6e-4037-aa29-41cd20da5e5e', '4f900f57-5392-47fb-aef1-289d6bf71376', '/images/products/5-pc-export-quality-pure-cotton-bedsheets-8.jpg', '5 PC Export Quality Pure Cotton Bedsheets  styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  '7410fb9b-3b44-4795-aee6-a849ec172c5c', 'c0000000-0000-0000-0000-000000000001', '5 PC Export Quality Pure Cotton Bedsheets', '5-pc-export-quality-pure-cotton-bedsheets-7', '5 PC Export Quality Pure Cotton Bedsheets',
  '5 PC Export Quality Pure Cotton Bedsheets 

 Double Bedsheets

 💯 % King Size

Fabric 100% Pure Cotton
* 1 Flat - Sheet 
king Size (87*95)
* 4 Pillow Cover''s
Size 19*29
Granted Colours
Ready To Use and easily washable', 2050, 5, 1, '100%  Pure Cotton',
  '300 TC', 'Pakistan', true, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('fbafef25-bb2e-4968-a709-731f3c4e5072', '7410fb9b-3b44-4795-aee6-a849ec172c5c', 'King', 'Warm Ivory', '#FAF7F2', 2050, 30, '5-PC-KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('7b3968a4-b38f-4566-a956-34045d2d702f', '7410fb9b-3b44-4795-aee6-a849ec172c5c', '/images/products/5-pc-export-quality-pure-cotton-bedsheets-7.jpg', '5 PC Export Quality Pure Cotton Bedsheets  styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  'd8dc988d-9f1b-49ca-ad02-f1a7ccee42a7', 'c0000000-0000-0000-0000-000000000001', '5 PC Export Quality Pure Cotton Bedsheets', '5-pc-export-quality-pure-cotton-bedsheets-6', '5 PC Export Quality Pure Cotton Bedsheets',
  '5 PC Export Quality Pure Cotton Bedsheets 

 Double Bedsheets

 💯 % King Size

Fabric 100% Pure Cotton
* 1 Flat - Sheet 
king Size (87*95)
* 4 Pillow Cover''s
Size 19*29
Granted Colours
Ready To Use and easily washable', 2050, 5, 1, '100% Pure Cotton',
  '300 TC', 'Pakistan', true, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('9fd116ec-4ec6-480a-adcf-ffea8c02071c', 'd8dc988d-9f1b-49ca-ad02-f1a7ccee42a7', 'King', 'Warm Ivory', '#FAF7F2', 2050, 30, '5-PC-KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('cdb6f083-6f70-445e-acc4-b976d42d7820', 'd8dc988d-9f1b-49ca-ad02-f1a7ccee42a7', '/images/products/5-pc-export-quality-pure-cotton-bedsheets-6.jpg', '5 PC Export Quality Pure Cotton Bedsheets  styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  '90afdce8-23a6-492e-af73-f53cd40ca2f3', 'c0000000-0000-0000-0000-000000000001', '5 PC Export Quality Pure Cotton Bedsheets', '5-pc-export-quality-pure-cotton-bedsheets-5', '5 PC Export Quality Pure Cotton Bedsheets',
  '5 PC Export Quality Pure Cotton Bedsheets 

 Double Bedsheets

 💯 % King Size

Fabric 100% Pure Cotton
* 1 Flat - Sheet 
king Size (87*95)
* 4 Pillow Cover''s
Size 19*29
Granted Colours
Ready To Use and easily washable', 2050, 5, 1, '100%Pure Cotton',
  '300 TC', 'Pakistan', true, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('24687e17-8739-4725-a1e8-dba2c8ab47d6', '90afdce8-23a6-492e-af73-f53cd40ca2f3', 'King', 'Warm Ivory', '#FAF7F2', 2050, 30, '5-PC-KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('37d931de-1f75-4663-a786-e9006d6ae09a', '90afdce8-23a6-492e-af73-f53cd40ca2f3', '/images/products/5-pc-export-quality-pure-cotton-bedsheets-5.jpg', '5 PC Export Quality Pure Cotton Bedsheets  styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  '52788320-0bf1-4d69-a2a6-6a0c2a213ae4', 'c0000000-0000-0000-0000-000000000001', '5 PC Export Quality Pure Cotton Bedsheets', '5-pc-export-quality-pure-cotton-bedsheets-4', '5 PC Export Quality Pure Cotton Bedsheets',
  '5 PC Export Quality Pure Cotton Bedsheets 

 Double Bedsheets

 💯 % King Size

Fabric 100% Pure Cotton
* 1 Flat - Sheet 
king Size (87*95)
* 4 Pillow Cover''s
Size 19*29
Granted Colours
Ready To Use and easily washable', 2050, 5, 1, '100%Pure Cotton',
  '300 TC', 'Pakistan', true, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('56e20f42-a180-41b4-ae48-6da6688bf75a', '52788320-0bf1-4d69-a2a6-6a0c2a213ae4', 'King', 'Warm Ivory', '#FAF7F2', 2050, 30, '5-PC-KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('648d3140-9d4d-4448-aa15-852c19f31846', '52788320-0bf1-4d69-a2a6-6a0c2a213ae4', '/images/products/5-pc-export-quality-pure-cotton-bedsheets-4.jpg', '5 PC Export Quality Pure Cotton Bedsheets  styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  '25b7fe9d-44b7-4980-a0f9-492018a02922', 'c0000000-0000-0000-0000-000000000001', '5 PC Export Quality Pure Cotton Bedsheets', '5-pc-export-quality-pure-cotton-bedsheets-3', '5 PC Export Quality Pure Cotton Bedsheets',
  '5 PC Export Quality Pure Cotton Bedsheets 

 Double Bedsheets

 💯 % King Size

Fabric 100% Pure Cotton
* 1 Flat - Sheet 
king Size (87*95)
* 4 Pillow Cover''s
Size 19*29
Granted Colours
Ready To Use and easily washable', 2050, 5, 1, '100% Pure Cotton',
  '300 TC', 'Pakistan', true, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('f81f830d-e741-4d6a-afbf-a5300fdbee14', '25b7fe9d-44b7-4980-a0f9-492018a02922', 'King', 'Warm Ivory', '#FAF7F2', 2050, 30, '5-PC-KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('8367897e-b6c7-47c0-a3b5-7eb8d6e451bb', '25b7fe9d-44b7-4980-a0f9-492018a02922', '/images/products/5-pc-export-quality-pure-cotton-bedsheets-3.jpg', '5 PC Export Quality Pure Cotton Bedsheets  styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  '1ba17f2c-5a06-4af6-a80c-6d892986f7f0', 'c0000000-0000-0000-0000-000000000001', '5 PC Export Quality Pure Cotton Bedsheets', '5-pc-export-quality-pure-cotton-bedsheets-2', '5 PC Export Quality Pure Cotton Bedsheets',
  '5 PC Export Quality Pure Cotton Bedsheets 

 Double Bedsheets

 💯 % King Size

Fabric 100% Pure Cotton
* 1 Flat - Sheet 
king Size (87*95)
* 4 Pillow Cover''s
Size 19*29
Granted Colours
Ready To Use and easily washable', 2050, 5, 1, '100% Quality Pure',
  '300 TC', 'Pakistan', true, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('5d210ad5-307d-488b-a5a9-4e712472b824', '1ba17f2c-5a06-4af6-a80c-6d892986f7f0', 'King', 'Warm Ivory', '#FAF7F2', 2050, 30, '5-PC-KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('3ceb5d0b-e7e2-4586-ae77-27bd2e464103', '1ba17f2c-5a06-4af6-a80c-6d892986f7f0', '/images/products/5-pc-export-quality-pure-cotton-bedsheets-2.jpg', '5 PC Export Quality Pure Cotton Bedsheets  styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

INSERT INTO public.products (
  id, category_id, name, slug, tagline, description, base_price, rating, review_count, material, thread_count_or_gsm, origin, is_bestseller, is_new_arrival
) VALUES (
  'e7e9c897-1481-46a0-a406-adcf924f5112', 'c0000000-0000-0000-0000-000000000001', '5 PC Export Quality Pure Cotton Bedsheets', '5-pc-export-quality-pure-cotton-bedsheets', '5 PC Export Quality Pure Cotton Bedsheets',
  '5 PC Export Quality Pure Cotton Bedsheets 

 Double Bedsheets

 💯 % King Size

Fabric 100% Pure Cotton
* 1 Flat - Sheet 
king Size (87*95)
* 4 Pillow Cover''s
Size 19*29
Granted Colours
Ready To Use and easily washable', 2050, 5, 1, '100% Pure Cotton',
  '300 TC', 'Pakistan', true, true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  material = EXCLUDED.material,
  origin = EXCLUDED.origin,
  description = EXCLUDED.description;
INSERT INTO public.product_variants (id, product_id, size, color_name, color_hex, price, stock, sku)
VALUES ('d7063f1d-212f-47b9-a570-e4c5500d679e', 'e7e9c897-1481-46a0-a406-adcf924f5112', 'King', 'Warm Ivory', '#FAF7F2', 2050, 30, '5-PC-KI-IVR')
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_primary)
VALUES ('0740386b-b072-4a85-a36c-372031092033', 'e7e9c897-1481-46a0-a406-adcf924f5112', '/images/products/5-pc-export-quality-pure-cotton-bedsheets.jpg', '5 PC Export Quality Pure Cotton Bedsheets  styled in luxury bedroom setting', 0, true)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

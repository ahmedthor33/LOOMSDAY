-- ==============================================================================
-- LOOMSDAY Luxury Bedding - Production Category Seed (Clean Slate)
-- Sets up official store categories without testing products, orders, or inventory.
-- ==============================================================================

-- 1. Insert Official Product Categories
INSERT INTO public.categories (id, name, slug, description, sort_order) VALUES
('c0000000-0000-0000-0000-000000000001', 'Bedsheets', 'bedsheets', 'Fitted & Flat French Linen and high-thread cotton sateen designed for immediate softness.', 1),
('c0000000-0000-0000-0000-000000000002', 'Pillows & Covers', 'pillows', 'Cloud-loft Down Pillows and pure linen envelope shams that elevate cervical relaxation.', 2),
('c0000000-0000-0000-0000-000000000003', 'Duvets & Inserts', 'duvets', 'All-season breathable French flax covers paired with hypoallergenic goose-down inserts.', 3)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  sort_order = EXCLUDED.sort_order;

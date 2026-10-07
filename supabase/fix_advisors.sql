-- ==============================================================================
-- LOOMSDAY E-Commerce: Database Advisor Fixes
-- Resolves Performance Advisor (28 warnings) and Security Advisor (7 warnings)
-- ==============================================================================

-- ==============================================================================
-- 1. SECURITY ADVISOR FIX: Secure handle_new_user() Function
-- Fixes: "Function Search Path Mutable" and "Public Can Execute SECURITY DEFINER"
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, created_at, updated_at)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
        now(),
        now()
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN new;
END;
$$;

-- Revoke execute from public/anon/authenticated; only postgres and auth triggers should call it
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO postgres, supabase_admin;


-- ==============================================================================
-- 2. PERFORMANCE ADVISOR FIX: Optimized RLS Policies with (SELECT auth.uid())
-- Fixes: "Auth RLS Initialization Plan" warnings
-- Wrapping auth.uid() in (SELECT auth.uid()) prevents per-row function re-evaluation.
-- ==============================================================================

-- 2.1 PROFILES POLICIES
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT TO authenticated
    USING ((SELECT auth.uid()) = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE TO authenticated
    USING ((SELECT auth.uid()) = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT TO authenticated
    WITH CHECK ((SELECT auth.uid()) = id);


-- 2.2 WISHLIST ITEMS POLICIES
DROP POLICY IF EXISTS "Users can read own wishlist" ON public.wishlist_items;
CREATE POLICY "Users can read own wishlist" ON public.wishlist_items
    FOR SELECT TO authenticated
    USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert to wishlist" ON public.wishlist_items;
CREATE POLICY "Users can insert to wishlist" ON public.wishlist_items
    FOR INSERT TO authenticated
    WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete from wishlist" ON public.wishlist_items;
CREATE POLICY "Users can delete from wishlist" ON public.wishlist_items
    FOR DELETE TO authenticated
    USING ((SELECT auth.uid()) = user_id);


-- 2.3 CART ITEMS POLICIES
DROP POLICY IF EXISTS "Users can read own cart" ON public.cart_items;
CREATE POLICY "Users can read own cart" ON public.cart_items
    FOR SELECT TO authenticated
    USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert to cart" ON public.cart_items;
CREATE POLICY "Users can insert to cart" ON public.cart_items
    FOR INSERT TO authenticated
    WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own cart" ON public.cart_items;
CREATE POLICY "Users can update own cart" ON public.cart_items
    FOR UPDATE TO authenticated
    USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete from cart" ON public.cart_items;
CREATE POLICY "Users can delete from cart" ON public.cart_items
    FOR DELETE TO authenticated
    USING ((SELECT auth.uid()) = user_id);


-- 2.4 ORDERS POLICIES
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
CREATE POLICY "Users can view own orders" ON public.orders
    FOR SELECT TO authenticated
    USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can create orders" ON public.orders;
CREATE POLICY "Users can create orders" ON public.orders
    FOR INSERT TO authenticated
    WITH CHECK ((SELECT auth.uid()) = user_id);


-- 2.5 ORDER ITEMS POLICIES
DROP POLICY IF EXISTS "Users can view own order items" ON public.order_items;
CREATE POLICY "Users can view own order items" ON public.order_items
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.orders
            WHERE orders.id = order_items.order_id
            AND orders.user_id = (SELECT auth.uid())
        )
    );


-- ==============================================================================
-- 3. STOREFRONT CATALOG PUBLIC READ ACCESS
-- ==============================================================================

DO $$ 
DECLARE 
    pol RECORD;
BEGIN
    FOR pol IN (
        SELECT schemaname, tablename, policyname 
        FROM pg_policies 
        WHERE schemaname = 'public' 
          AND tablename IN ('categories', 'products', 'product_variants', 'product_images')
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I;', pol.policyname, pol.schemaname, pol.tablename);
    END LOOP;
END $$;

CREATE POLICY "Public read categories" ON public.categories
    FOR SELECT TO anon, authenticated
    USING (id IS NOT NULL);

CREATE POLICY "Public read products" ON public.products
    FOR SELECT TO anon, authenticated
    USING (id IS NOT NULL);

CREATE POLICY "Public read product_variants" ON public.product_variants
    FOR SELECT TO anon, authenticated
    USING (id IS NOT NULL);

CREATE POLICY "Public read product_images" ON public.product_images
    FOR SELECT TO anon, authenticated
    USING (id IS NOT NULL);




-- ==============================================================================
-- 4. PERFORMANCE ADVISOR FIX: Foreign Key Indexes
-- Fixes: "Unindexed Foreign Keys" (eliminates full-table sequential scans)
-- ==============================================================================

-- Products & Categories
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);

-- Product Variants
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON public.product_variants(product_id);

-- Product Images
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON public.product_images(product_id);

-- Wishlist Items
CREATE INDEX IF NOT EXISTS idx_wishlist_items_user_id ON public.wishlist_items(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_items_product_id ON public.wishlist_items(product_id);

-- Cart Items
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON public.cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_variant_id ON public.cart_items(variant_id);

-- Orders
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);

-- Order Items
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_variant_id ON public.order_items(variant_id);

-- ==============================================================================
-- LOOMSDAY Luxury Bedding E-Commerce Database Schema
-- Supabase PostgreSQL with Row Level Security (RLS)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    phone TEXT,
    shipping_street TEXT,
    shipping_city TEXT,
    shipping_state TEXT,
    shipping_zip TEXT,
    shipping_country TEXT DEFAULT 'United States',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    tagline TEXT,
    description TEXT NOT NULL,
    base_price NUMERIC(10, 2) NOT NULL,
    rating NUMERIC(3, 2) DEFAULT 5.00,
    review_count INT DEFAULT 0,
    material TEXT NOT NULL,
    thread_count_or_gsm TEXT,
    origin TEXT NOT NULL,
    is_bestseller BOOLEAN DEFAULT false,
    is_new_arrival BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. PRODUCT VARIANTS TABLE
CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    size TEXT NOT NULL,
    color_name TEXT NOT NULL,
    color_hex TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    stock INT DEFAULT 20 NOT NULL,
    sku TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. PRODUCT IMAGES TABLE
CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    url TEXT NOT NULL,
    alt_text TEXT NOT NULL,
    sort_order INT DEFAULT 0 NOT NULL,
    is_primary BOOLEAN DEFAULT false NOT NULL
);

-- 6. WISHLIST ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.wishlist_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, product_id)
);

-- 7. CART ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE CASCADE NOT NULL,
    quantity INT DEFAULT 1 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, variant_id)
);

-- 8. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'Processing' NOT NULL,
    tracking_number TEXT,
    subtotal NUMERIC(10, 2) NOT NULL,
    shipping_fee NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    discount_amount NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    total NUMERIC(10, 2) NOT NULL,
    promo_code TEXT,
    shipping_details JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    variant_info TEXT NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    quantity INT DEFAULT 1 NOT NULL
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- 1. Profiles: Users can view and update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT TO authenticated USING ((SELECT auth.uid()) = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE TO authenticated USING ((SELECT auth.uid()) = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) = id);

-- 2. Public Read for Catalog (Categories, Products, Variants, Images)
CREATE POLICY "Public read categories" ON public.categories
    FOR SELECT TO anon, authenticated USING (id IS NOT NULL);

CREATE POLICY "Public read products" ON public.products
    FOR SELECT TO anon, authenticated USING (id IS NOT NULL);

CREATE POLICY "Public read product_variants" ON public.product_variants
    FOR SELECT TO anon, authenticated USING (id IS NOT NULL);

CREATE POLICY "Public read product_images" ON public.product_images
    FOR SELECT TO anon, authenticated USING (id IS NOT NULL);



-- 3. Wishlist Items: Users own their saved items
CREATE POLICY "Users can read own wishlist" ON public.wishlist_items
    FOR SELECT TO authenticated USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can insert to wishlist" ON public.wishlist_items
    FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can delete from wishlist" ON public.wishlist_items
    FOR DELETE TO authenticated USING ((SELECT auth.uid()) = user_id);

-- 4. Cart Items: Users manage their cart items
CREATE POLICY "Users can read own cart" ON public.cart_items
    FOR SELECT TO authenticated USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can insert to cart" ON public.cart_items
    FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update own cart" ON public.cart_items
    FOR UPDATE TO authenticated USING ((SELECT auth.uid()) = user_id);

-- 5. Orders & Order Items: Users view their orders
CREATE POLICY "Users can view own orders" ON public.orders
    FOR SELECT TO authenticated USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can create orders" ON public.orders
    FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can view own order items" ON public.order_items
    FOR SELECT TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.orders
            WHERE orders.id = order_items.order_id
            AND orders.user_id = (SELECT auth.uid())
        )
    );

-- ==============================================================================
-- 6. FOREIGN KEY INDEXES (Eliminates sequential scans & advisor warnings)
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON public.product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON public.product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_items_user_id ON public.wishlist_items(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_items_product_id ON public.wishlist_items(product_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON public.cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_variant_id ON public.cart_items(variant_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_variant_id ON public.order_items(variant_id);

-- ==============================================================================
-- 7. AUTOMATIC USER PROFILE TRIGGER
-- Triggered whenever a new user registers in Supabase Auth
-- Hardened with explicit search_path and restricted permissions
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

-- Revoke execute from public/anon/authenticated to secure SECURITY DEFINER function
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO postgres, supabase_admin;

-- Drop trigger if already exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();



-- EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- TYPES ENUM
CREATE TYPE subscription_plan AS ENUM ('free', 'pro');
CREATE TYPE subscription_status AS ENUM ('active', 'past_due', 'canceled', 'incomplete', 'trialing');

-- TABLE PROFILES
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    display_name TEXT,
    bio TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT username_format CHECK (username ~* '^[a-zA-Z0-9_-]{3,30}$')
);

-- TABLE PAGES
CREATE TABLE public.pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT,
    theme TEXT DEFAULT 'clean' NOT NULL,
    background_color TEXT DEFAULT '#0f172a' NOT NULL,
    accent_color TEXT DEFAULT '#2563eb' NOT NULL,
    button_style TEXT DEFAULT 'rounded' NOT NULL,
    font_family TEXT DEFAULT 'Inter' NOT NULL,
    hide_branding BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- TABLE LINKS
CREATE TABLE public.links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_id UUID NOT NULL REFERENCES public.pages(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    icon TEXT,
    image_url TEXT,
    position INT DEFAULT 0 NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT url_security_check CHECK (url !~* '^javascript:')
);

-- TABLE PAGE VIEWS
CREATE TABLE public.page_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_id UUID NOT NULL REFERENCES public.pages(id) ON DELETE CASCADE,
    referrer TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- TABLE LINK CLICKS
CREATE TABLE public.link_clicks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_id UUID NOT NULL REFERENCES public.pages(id) ON DELETE CASCADE,
    link_id UUID NOT NULL REFERENCES public.links(id) ON DELETE CASCADE,
    referrer TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- TABLE SUBSCRIPTIONS
CREATE TABLE public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    plan subscription_plan DEFAULT 'free' NOT NULL,
    status subscription_status DEFAULT 'active' NOT NULL,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    current_period_end TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- INDEXES
CREATE INDEX idx_profiles_username ON public.profiles(username);
CREATE INDEX idx_links_page_position ON public.links(page_id, position);
CREATE INDEX idx_page_views_page_date ON public.page_views(page_id, created_at);
CREATE INDEX idx_link_clicks_page_date ON public.link_clicks(page_id, created_at);

-- ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles viewable by all" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public pages viewable by all" ON public.pages FOR SELECT USING (true);
CREATE POLICY "Users manage own page" ON public.pages FOR ALL USING (auth.uid() = user_id);

ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active links viewable by all" ON public.links FOR SELECT USING (
    is_active = true OR EXISTS (SELECT 1 FROM public.pages WHERE pages.id = links.page_id AND pages.user_id = auth.uid())
);
CREATE POLICY "Users manage links" ON public.links FOR ALL USING (
    EXISTS (SELECT 1 FROM public.pages WHERE pages.id = links.page_id AND pages.user_id = auth.uid())
);

ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own page views" ON public.page_views FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.pages WHERE pages.id = page_views.page_id AND pages.user_id = auth.uid())
);
CREATE POLICY "Anyone can insert page views" ON public.page_views FOR INSERT WITH CHECK (true);

ALTER TABLE public.link_clicks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own clicks" ON public.link_clicks FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.pages WHERE pages.id = link_clicks.page_id AND pages.user_id = auth.uid())
);
CREATE POLICY "Anyone can insert link clicks" ON public.link_clicks FOR INSERT WITH CHECK (true);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own subscription" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);

-- TRIGGER CREATION PROFILE/PAGE/SUB ON SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    clean_username TEXT;
BEGIN
    clean_username := LOWER(SPLIT_PART(NEW.email, '@', 1));
    clean_username := REGEXP_REPLACE(clean_username, '[^a-z0-9_-]', '', 'g');
    IF LENGTH(clean_username) < 3 THEN clean_username := clean_username || '_usr'; END IF;
    IF EXISTS (SELECT 1 FROM public.profiles WHERE username = clean_username) THEN
        clean_username := clean_username || '_' || SUBSTRING(MD5(RANDOM()::text) FROM 1 FOR 4);
    END IF;

    INSERT INTO public.profiles (id, username, display_name) VALUES (NEW.id, clean_username, SPLIT_PART(NEW.email, '@', 1));
    INSERT INTO public.pages (user_id, title) VALUES (NEW.id, SPLIT_PART(NEW.email, '@', 1));
    INSERT INTO public.subscriptions (user_id, plan, status) VALUES (NEW.id, 'free', 'active');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
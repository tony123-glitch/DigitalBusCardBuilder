-- Digital Business Card Builder Schema

-- Create admins table
CREATE TABLE public.admins (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE
);
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view their own record" ON public.admins FOR SELECT USING (auth.uid() = user_id);

-- Create cards table
CREATE TABLE public.cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    owner_name TEXT NOT NULL,
    edit_password_hash TEXT NOT NULL,
    profile_picture_url TEXT,
    banner_image_url TEXT,
    company_logo_url TEXT,
    company_name TEXT,
    company_tagline TEXT,
    job_title TEXT,
    phone_number TEXT,
    email TEXT,
    website TEXT,
    location TEXT,
    bio TEXT,
    theme_color TEXT DEFAULT '#0F172A',
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;

-- Cards RLS Policies
-- Anyone can view published cards
CREATE POLICY "Anyone can view published cards" ON public.cards FOR SELECT USING (is_published = true);
-- Admins can view all cards
CREATE POLICY "Admins can view all cards" ON public.cards FOR SELECT USING (EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()));
-- Admins can insert cards
CREATE POLICY "Admins can insert cards" ON public.cards FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()));
-- Admins can update all cards
CREATE POLICY "Admins can update cards" ON public.cards FOR UPDATE USING (EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()));
-- Admins can delete cards
CREATE POLICY "Admins can delete cards" ON public.cards FOR DELETE USING (EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()));

-- Create card_social_links table
CREATE TABLE public.card_social_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    card_id UUID NOT NULL REFERENCES public.cards(id) ON DELETE CASCADE,
    platform TEXT NOT NULL,
    url TEXT NOT NULL,
    "order" INTEGER DEFAULT 0
);
ALTER TABLE public.card_social_links ENABLE ROW LEVEL SECURITY;

-- Social Links RLS Policies
CREATE POLICY "Anyone can view social links of published cards" ON public.card_social_links FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.cards WHERE id = card_social_links.card_id AND is_published = true)
);
CREATE POLICY "Admins can manage social links" ON public.card_social_links FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid())
);

-- Create card_custom_buttons table
CREATE TABLE public.card_custom_buttons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    card_id UUID NOT NULL REFERENCES public.cards(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    url TEXT NOT NULL,
    "order" INTEGER DEFAULT 0
);
ALTER TABLE public.card_custom_buttons ENABLE ROW LEVEL SECURITY;

-- Custom Buttons RLS Policies
CREATE POLICY "Anyone can view custom buttons of published cards" ON public.card_custom_buttons FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.cards WHERE id = card_custom_buttons.card_id AND is_published = true)
);
CREATE POLICY "Admins can manage custom buttons" ON public.card_custom_buttons FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid())
);

-- Note: Customer updates to their own card are handled via a Service Role key server action
-- after verifying their edit password, so we don't need public RLS policies for UPDATE.

-- Storage Buckets setup (run these commands if possible or create buckets in UI)
INSERT INTO storage.buckets (id, name, public) VALUES ('card_media', 'card_media', true) ON CONFLICT DO NOTHING;

-- Storage RLS Policies
CREATE POLICY "Public read access" ON storage.objects FOR SELECT USING (bucket_id = 'card_media');
CREATE POLICY "Admin write access" ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'card_media' AND EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid())
);
CREATE POLICY "Admin update access" ON storage.objects FOR UPDATE USING (
    bucket_id = 'card_media' AND EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid())
);
CREATE POLICY "Admin delete access" ON storage.objects FOR DELETE USING (
    bucket_id = 'card_media' AND EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid())
);
-- Allow service role full access to storage (automatically allowed usually, but good to note)

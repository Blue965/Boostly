ALTER TABLE public.pages
ADD COLUMN IF NOT EXISTS background_image_url TEXT;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'boostly-media',
    'boostly-media',
    TRUE,
    8388608,
    ARRAY['image/png', 'image/jpeg', 'image/webp']
)
ON CONFLICT (id) DO UPDATE
SET public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

CREATE POLICY "Boostly media is publicly readable"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'boostly-media');

CREATE POLICY "Users upload their own Boostly media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'boostly-media'
    AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
);

CREATE POLICY "Users update their own Boostly media"
ON storage.objects FOR UPDATE
TO authenticated
USING (
    bucket_id = 'boostly-media'
    AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
)
WITH CHECK (
    bucket_id = 'boostly-media'
    AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
);

CREATE POLICY "Users delete their own Boostly media"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'boostly-media'
    AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
);

ALTER TABLE public.pages
ADD COLUMN IF NOT EXISTS card_theme TEXT NOT NULL DEFAULT 'glass',
ADD COLUMN IF NOT EXISTS music_url TEXT,
ADD COLUMN IF NOT EXISTS music_type TEXT;

UPDATE storage.buckets
SET file_size_limit = 26214400,
    allowed_mime_types = ARRAY[
        'image/png',
        'image/jpeg',
        'image/webp',
        'audio/mpeg',
        'audio/mp4',
        'video/mp4'
    ]
WHERE id = 'boostly-media';

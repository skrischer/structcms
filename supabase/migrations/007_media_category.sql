ALTER TABLE media ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'image';
ALTER TABLE media ADD CONSTRAINT media_category_check CHECK (category IN ('image', 'document'));
CREATE INDEX IF NOT EXISTS idx_media_category ON media(category);
CREATE INDEX IF NOT EXISTS idx_media_category_created_at ON media(category, created_at DESC);

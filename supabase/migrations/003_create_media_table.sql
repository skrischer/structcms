-- Migration: Create media table
-- Description: Stores media file metadata with reference to Supabase Storage path

CREATE TABLE IF NOT EXISTS media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for faster storage_path lookups
CREATE INDEX IF NOT EXISTS idx_media_storage_path ON media(storage_path);

-- Index for filtering by mime_type
CREATE INDEX IF NOT EXISTS idx_media_mime_type ON media(mime_type);

-- Index for ordering by created_at (most recent first)
CREATE INDEX IF NOT EXISTS idx_media_created_at ON media(created_at DESC);

-- Trigger to auto-update updated_at timestamp
-- Note: Reuses update_updated_at_column() function from 001_create_pages_table.sql
CREATE OR REPLACE TRIGGER media_updated_at
  BEFORE UPDATE ON media
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

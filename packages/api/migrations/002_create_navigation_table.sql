-- Migration: Create navigation table
-- Description: Stores navigation structures with items as JSONB

CREATE TABLE IF NOT EXISTS navigation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for faster name lookups
CREATE INDEX IF NOT EXISTS idx_navigation_name ON navigation(name);

-- Trigger to auto-update updated_at timestamp
CREATE OR REPLACE TRIGGER navigation_updated_at
  BEFORE UPDATE ON navigation
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

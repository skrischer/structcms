-- Migration: Enable Row Level Security on all public tables
-- Description: Activates RLS and adds public read policies for Delivery API (anon key).
--              Write operations are handled via service_role key which bypasses RLS.

-- pages
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on pages"
  ON pages
  FOR SELECT
  TO anon
  USING (true);

-- navigation
ALTER TABLE navigation ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on navigation"
  ON navigation
  FOR SELECT
  TO anon
  USING (true);

-- media
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on media"
  ON media
  FOR SELECT
  TO anon
  USING (true);

-- Migration: Add authenticated user policies
-- Description: Allow authenticated users full CRUD access to pages, navigation, and media

-- Allow authenticated users full access on pages
CREATE POLICY "Allow authenticated full access on pages" ON pages FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Allow authenticated users full access on navigation
CREATE POLICY "Allow authenticated full access on navigation" ON navigation FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Allow authenticated users full access on media
CREATE POLICY "Allow authenticated full access on media" ON media FOR ALL TO authenticated USING (true) WITH CHECK (true);

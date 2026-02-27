-- Migration: Change media.size from INTEGER to BIGINT
-- Description: Support files larger than 2GB (INTEGER max is ~2.1GB, BIGINT max is ~9EB)

ALTER TABLE media ALTER COLUMN size TYPE BIGINT;

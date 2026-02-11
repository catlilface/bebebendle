-- Migration: Add telegram_id column to scrans table for tracking who suggested the scran

ALTER TABLE scrans ADD COLUMN telegram_id TEXT;

-- Index for querying scrans by telegram user
CREATE INDEX idx_scrans_telegram_id ON scrans(telegram_id);

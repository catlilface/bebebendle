-- Migration: Add daily_user_results table for tracking user scores

CREATE TABLE IF NOT EXISTS daily_user_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    session_id TEXT NOT NULL,
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 10),
    created_at TEXT NOT NULL,
    UNIQUE(date, session_id)
);

-- Index for fetching results by date
CREATE INDEX idx_daily_user_results_date ON daily_user_results(date);

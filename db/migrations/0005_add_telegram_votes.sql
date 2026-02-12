CREATE TABLE IF NOT EXISTS telegram_votes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    telegram_id TEXT NOT NULL,
    scran_id INTEGER NOT NULL,
    is_like INTEGER NOT NULL,
    created_at TEXT NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS unique_telegram_vote ON telegram_votes(telegram_id, scran_id);

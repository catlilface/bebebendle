ALTER TABLE "scrandle_votes" ADD COLUMN IF NOT EXISTS "fingerprint_hash" text;
ALTER TABLE "daily_user_results" ADD COLUMN IF NOT EXISTS "fingerprint_hash" text;

CREATE UNIQUE INDEX IF NOT EXISTS "unique_scrandle_vote" ON "scrandle_votes" ("session_id", "daily_scrandle_id");
CREATE UNIQUE INDEX IF NOT EXISTS "unique_user_result_per_day" ON "daily_user_results" ("session_id", "date");

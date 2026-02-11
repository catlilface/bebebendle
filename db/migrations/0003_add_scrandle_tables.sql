CREATE TABLE `daily_scrandles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`date` text NOT NULL,
	`scran_a_id` integer NOT NULL,
	`scran_b_id` integer NOT NULL,
	`round_number` integer NOT NULL,
	`created_at` text NOT NULL
);

CREATE UNIQUE INDEX `daily_scrandles_date_round_unique` ON `daily_scrandles` (`date`,`round_number`);

CREATE TABLE `scrandle_votes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`daily_scrandle_id` integer NOT NULL,
	`session_id` text NOT NULL,
	`chosen_scran_id` integer NOT NULL,
	`created_at` text NOT NULL
);

CREATE INDEX `scrandle_votes_session_idx` ON `scrandle_votes` (`session_id`);
CREATE INDEX `scrandle_votes_daily_scrandle_idx` ON `scrandle_votes` (`daily_scrandle_id`);

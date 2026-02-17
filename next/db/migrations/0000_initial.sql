CREATE TABLE IF NOT EXISTS "scrans" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	"image_url" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"price" real NOT NULL,
	"number_of_likes" integer NOT NULL DEFAULT 0,
	"number_of_dislikes" integer NOT NULL DEFAULT 0,
	"approved" boolean NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS "daily_scrandles" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	"date" text NOT NULL,
	"scran_a_id" integer NOT NULL,
	"scran_b_id" integer NOT NULL,
	"round_number" integer NOT NULL,
	"created_at" timestamp NOT NULL,
	CONSTRAINT "unique_round_per_day" UNIQUE("date", "round_number")
);

CREATE TABLE IF NOT EXISTS "scrandle_votes" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	"daily_scrandle_id" integer NOT NULL,
	"session_id" text NOT NULL,
	"chosen_scran_id" integer NOT NULL,
	"created_at" timestamp NOT NULL
);

CREATE TABLE IF NOT EXISTS "daily_user_results" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	"date" text NOT NULL,
	"session_id" text NOT NULL,
	"score" integer NOT NULL,
	"created_at" timestamp NOT NULL
);

CREATE TABLE IF NOT EXISTS "telegram_votes" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	"telegram_id" text NOT NULL,
	"scran_id" integer NOT NULL,
	"is_like" boolean NOT NULL,
	"created_at" timestamp NOT NULL,
	CONSTRAINT "unique_telegram_vote" UNIQUE("telegram_id", "scran_id")
);

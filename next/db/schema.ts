import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import { pgTable, text, integer, real, boolean, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

// Для локальной разработки используем переменные окружения или значения по умолчанию
const client = new Client({
  host: process.env.POSTGRES_HOST || "localhost",
  port: parseInt(process.env.POSTGRES_PORT || "5432"),
  database: process.env.POSTGRES_DB || "bebendle",
  user: process.env.POSTGRES_USER || "postgres",
  password: process.env.POSTGRES_PASSWORD || "postgres",
});

// Connect lazily - only when first query is made
let connected = false;
const originalQuery = client.query.bind(client);
// @ts-expect-error - lazy connection wrapper
client.query = (...args: Parameters<typeof originalQuery>) => {
  if (!connected) {
    connected = true;
    client.connect().catch(console.error);
  }
  return originalQuery(...args);
};

export const db = drizzle(client);

export const scrans = pgTable("scrans", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  imageUrl: text("image_url").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  price: real("price").notNull(),
  numberOfLikes: integer("number_of_likes").notNull().default(0),
  numberOfDislikes: integer("number_of_dislikes").notNull().default(0),
  approved: boolean("approved").notNull().default(false),
  telegramId: text("telegram_id"),
});

export const dailyScrandles = pgTable("daily_scrandles", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  date: text("date").notNull(),
  scranAId: integer("scran_a_id").notNull(),
  scranBId: integer("scran_b_id").notNull(),
  roundNumber: integer("round_number").notNull(),
  createdAt: timestamp("created_at").notNull(),
}, (table) => ({
  uniqueRoundPerDay: uniqueIndex("unique_round_per_day").on(table.date, table.roundNumber),
}));

export const scrandleVotes = pgTable("scrandle_votes", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  dailyScrandleId: integer("daily_scrandle_id").notNull(),
  sessionId: text("session_id").notNull(),
  fingerprintHash: text("fingerprint_hash"),
  chosenScranId: integer("chosen_scran_id").notNull(),
  createdAt: timestamp("created_at").notNull(),
}, (table) => ({
  uniqueVote: uniqueIndex("unique_scrandle_vote").on(table.sessionId, table.dailyScrandleId),
}));

export const dailyUserResults = pgTable("daily_user_results", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  date: text("date").notNull(),
  sessionId: text("session_id").notNull(),
  fingerprintHash: text("fingerprint_hash"),
  score: integer("score").notNull(),
  createdAt: timestamp("created_at").notNull(),
}, (table) => ({
  uniqueResultPerDay: uniqueIndex("unique_user_result_per_day").on(table.sessionId, table.date),
}));

export const telegramVotes = pgTable("telegram_votes", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  telegramId: text("telegram_id").notNull(),
  scranId: integer("scran_id").notNull(),
  isLike: boolean("is_like").notNull(),
  createdAt: timestamp("created_at").notNull(),
}, (table) => ({
  uniqueVote: uniqueIndex("unique_telegram_vote").on(table.telegramId, table.scranId),
}));

export type Scran = typeof scrans.$inferSelect;
export type DailyScrandle = typeof dailyScrandles.$inferSelect;
export type ScrandleVote = typeof scrandleVotes.$inferSelect;
export type DailyUserResult = typeof dailyUserResults.$inferSelect;
export type TelegramVote = typeof telegramVotes.$inferSelect;

export function getLikesPercentage(scran: Scran): number {
  const total = scran.numberOfLikes + scran.numberOfDislikes;
  if (total === 0) return 0;
  return Math.round((scran.numberOfLikes / total) * 100);
}

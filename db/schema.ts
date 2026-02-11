import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { sqliteTable, text, integer, real, uniqueIndex } from "drizzle-orm/sqlite-core";

const client = createClient({
  url: "file:./db/bebendle.sqlite",
});

export const db = drizzle(client);

export const scrans = sqliteTable("scrans", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  imageUrl: text("image_url").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  price: real("price").notNull(),
  numberOfLikes: integer("number_of_likes").notNull().default(0),
  numberOfDislikes: integer("number_of_dislikes").notNull().default(0),
  approved: integer("approved", { mode: "boolean" }).notNull().default(false),
});

export const dailyScrandles = sqliteTable("daily_scrandles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  date: text("date").notNull(),
  scranAId: integer("scran_a_id").notNull(),
  scranBId: integer("scran_b_id").notNull(),
  roundNumber: integer("round_number").notNull(),
  createdAt: text("created_at").notNull(),
}, (table) => ({
  uniqueRoundPerDay: uniqueIndex("unique_round_per_day").on(table.date, table.roundNumber),
}));

export const scrandleVotes = sqliteTable("scrandle_votes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  dailyScrandleId: integer("daily_scrandle_id").notNull(),
  sessionId: text("session_id").notNull(),
  chosenScranId: integer("chosen_scran_id").notNull(),
  createdAt: text("created_at").notNull(),
});

export const dailyUserResults = sqliteTable("daily_user_results", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  date: text("date").notNull(),
  sessionId: text("session_id").notNull(),
  score: integer("score").notNull(),
  createdAt: text("created_at").notNull(),
});

export type Scran = typeof scrans.$inferSelect;
export type DailyScrandle = typeof dailyScrandles.$inferSelect;
export type ScrandleVote = typeof scrandleVotes.$inferSelect;
export type DailyUserResult = typeof dailyUserResults.$inferSelect;

export function getLikesPercentage(scran: Scran): number {
  const total = scran.numberOfLikes + scran.numberOfDislikes;
  if (total === 0) return 0;
  return Math.round((scran.numberOfLikes / total) * 100);
}

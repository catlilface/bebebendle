#!/usr/bin/env bun
/**
 * Migration script to migrate data from SQLite to PostgreSQL.
 * Reads from @next/db/bebendle.sqlite and writes to PostgreSQL using DATABASE_URL.
 */

// @ts-expect-error - Bun types not available in this project
import { Database } from "bun:sqlite";
import { Client } from "pg";
import * as path from "path";
import * as fs from "fs";

const SQLITE_PATH = path.join(__dirname, "..", "db", "bebendle.sqlite");

interface MigrationStats {
  table: string;
  total: number;
  inserted: number;
  errors: number;
}

interface SQLiteScran {
  id: number;
  image_url: string;
  name: string;
  description: string | null;
  price: number;
  number_of_likes: number;
  number_of_dislikes: number;
  approved: number;
}

interface SQLiteDailyScrandle {
  id: number;
  date: string;
  scran_a_id: number;
  scran_b_id: number;
  round_number: number;
  created_at: string;
}

interface SQLiteScrandleVote {
  id: number;
  daily_scrandle_id: number;
  session_id: string;
  chosen_scran_id: number;
  created_at: string;
}

interface SQLiteDailyUserResult {
  id: number;
  date: string;
  session_id: string;
  score: number;
  created_at: string;
}

async function getPostgresClient(): Promise<Client> {
  const client = new Client({
    host: "localhost",
    port: 5432,
    database: "bebendle",
    user: "postgres",
    password: "postgres",
  });

  await client.connect();
  return client;
}

async function migrateScrans(
  sqlite: Database,
  pg: Client,
): Promise<MigrationStats> {
  const stats: MigrationStats = {
    table: "scrans",
    total: 0,
    inserted: 0,
    errors: 0,
  };

  console.log("📦 Migrating scrans...");

  const rows = sqlite.query<SQLiteScran, []>("SELECT * FROM scrans").all();
  stats.total = rows.length;

  for (const row of rows) {
    try {
      await pg.query(
        `INSERT INTO scrans (id, image_url, name, description, price, number_of_likes, number_of_dislikes, approved, telegram_id)
         OVERRIDING SYSTEM VALUE
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (id) DO NOTHING`,
        [
          row.id,
          row.image_url,
          row.name,
          row.description,
          row.price,
          row.number_of_likes,
          row.number_of_dislikes,
          row.approved === 1,
          null,
        ],
      );
      stats.inserted++;
    } catch (error) {
      stats.errors++;
      console.error(`❌ Error migrating scran ${row.id}:`, error);
    }
  }

  // Reset sequence to max id + 1
  if (stats.inserted > 0) {
    const maxId = Math.max(...rows.map((r: SQLiteScran) => r.id));
    await pg.query(`SELECT setval('scrans_id_seq', $1, true)`, [maxId]);
  }

  console.log(`✅ Migrated ${stats.inserted}/${stats.total} scrans`);
  return stats;
}

async function migrateDailyScrandles(
  sqlite: Database,
  pg: Client,
): Promise<MigrationStats> {
  const stats: MigrationStats = {
    table: "daily_scrandles",
    total: 0,
    inserted: 0,
    errors: 0,
  };

  console.log("📦 Migrating daily_scrandles...");

  const rows = sqlite
    .query<SQLiteDailyScrandle, []>("SELECT * FROM daily_scrandles")
    .all();
  stats.total = rows.length;

  for (const row of rows) {
    try {
      await pg.query(
        `INSERT INTO daily_scrandles (id, date, scran_a_id, scran_b_id, round_number, created_at)
         OVERRIDING SYSTEM VALUE
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (id) DO NOTHING`,
        [
          row.id,
          row.date,
          row.scran_a_id,
          row.scran_b_id,
          row.round_number,
          new Date(row.created_at),
        ],
      );
      stats.inserted++;
    } catch (error) {
      stats.errors++;
      console.error(`❌ Error migrating daily_scrandle ${row.id}:`, error);
    }
  }

  if (stats.inserted > 0) {
    const maxId = Math.max(...rows.map((r: SQLiteDailyScrandle) => r.id));
    await pg.query(`SELECT setval('daily_scrandles_id_seq', $1, true)`, [
      maxId,
    ]);
  }

  console.log(`✅ Migrated ${stats.inserted}/${stats.total} daily_scrandles`);
  return stats;
}

async function migrateScrandleVotes(
  sqlite: Database,
  pg: Client,
): Promise<MigrationStats> {
  const stats: MigrationStats = {
    table: "scrandle_votes",
    total: 0,
    inserted: 0,
    errors: 0,
  };

  console.log("📦 Migrating scrandle_votes...");

  const rows = sqlite
    .query<SQLiteScrandleVote, []>("SELECT * FROM scrandle_votes")
    .all();
  stats.total = rows.length;

  for (const row of rows) {
    try {
      await pg.query(
        `INSERT INTO scrandle_votes (id, daily_scrandle_id, session_id, chosen_scran_id, created_at)
         OVERRIDING SYSTEM VALUE
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (id) DO NOTHING`,
        [
          row.id,
          row.daily_scrandle_id,
          row.session_id,
          row.chosen_scran_id,
          new Date(row.created_at),
        ],
      );
      stats.inserted++;
    } catch (error) {
      stats.errors++;
      console.error(`❌ Error migrating scrandle_vote ${row.id}:`, error);
    }
  }

  if (stats.inserted > 0) {
    const maxId = Math.max(...rows.map((r: SQLiteScrandleVote) => r.id));
    await pg.query(`SELECT setval('scrandle_votes_id_seq', $1, true)`, [maxId]);
  }

  console.log(`✅ Migrated ${stats.inserted}/${stats.total} scrandle_votes`);
  return stats;
}

async function migrateDailyUserResults(
  sqlite: Database,
  pg: Client,
): Promise<MigrationStats> {
  const stats: MigrationStats = {
    table: "daily_user_results",
    total: 0,
    inserted: 0,
    errors: 0,
  };

  console.log("📦 Migrating daily_user_results...");

  const rows = sqlite
    .query<SQLiteDailyUserResult, []>("SELECT * FROM daily_user_results")
    .all();
  stats.total = rows.length;

  for (const row of rows) {
    try {
      await pg.query(
        `INSERT INTO daily_user_results (id, date, session_id, score, created_at)
         OVERRIDING SYSTEM VALUE
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (id) DO NOTHING`,
        [row.id, row.date, row.session_id, row.score, new Date(row.created_at)],
      );
      stats.inserted++;
    } catch (error) {
      stats.errors++;
      console.error(`❌ Error migrating daily_user_result ${row.id}:`, error);
    }
  }

  if (stats.inserted > 0) {
    const maxId = Math.max(...rows.map((r: SQLiteDailyUserResult) => r.id));
    await pg.query(`SELECT setval('daily_user_results_id_seq', $1, true)`, [
      maxId,
    ]);
  }

  console.log(
    `✅ Migrated ${stats.inserted}/${stats.total} daily_user_results`,
  );
  return stats;
}

async function clearPostgresTables(pg: Client): Promise<void> {
  console.log("🧹 Clearing existing PostgreSQL data...");

  // Delete in reverse order to respect foreign keys
  await pg.query("DELETE FROM daily_user_results");
  await pg.query("DELETE FROM scrandle_votes");
  await pg.query("DELETE FROM daily_scrandles");
  await pg.query("DELETE FROM scrans");

  console.log("✅ PostgreSQL tables cleared");
}

async function main() {
  console.log("🚀 Starting SQLite to PostgreSQL migration...\n");
  console.log(`📁 SQLite source: ${SQLITE_PATH}`);
  console.log(
    `🐘 PostgreSQL target: ${process.env.DATABASE_URL || "postgresql://postgres:postgres@db:5432/bebendle"}\n`,
  );

  const startTime = Date.now();

  // Check if SQLite file exists
  if (!fs.existsSync(SQLITE_PATH)) {
    console.error(`❌ SQLite database not found at ${SQLITE_PATH}`);
    process.exit(1);
  }

  // Open SQLite database
  const sqlite = new Database(SQLITE_PATH, { readonly: true });
  let pg: Client | null = null;

  try {
    pg = await getPostgresClient();

    // Clear existing PostgreSQL data
    await clearPostgresTables(pg);

    // Migrate tables in order (respecting FK constraints)
    const stats: MigrationStats[] = [];

    stats.push(await migrateScrans(sqlite, pg));
    stats.push(await migrateDailyScrandles(sqlite, pg));
    stats.push(await migrateScrandleVotes(sqlite, pg));
    stats.push(await migrateDailyUserResults(sqlite, pg));

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    // Summary
    console.log("\n" + "=".repeat(60));
    console.log("📊 Migration Summary");
    console.log("=".repeat(60));
    console.log(`Table                    Total    Inserted  Errors`);
    console.log("-".repeat(60));

    let totalInserted = 0;
    let totalErrors = 0;

    for (const s of stats) {
      const tableName = s.table.padEnd(22);
      const total = String(s.total).padStart(6);
      const inserted = String(s.inserted).padStart(8);
      const errors = String(s.errors).padStart(7);
      console.log(`${tableName}${total}  ${inserted}  ${errors}`);
      totalInserted += s.inserted;
      totalErrors += s.errors;
    }

    console.log("-".repeat(60));
    console.log(
      `TOTAL${" ".repeat(17)}${String(stats.reduce((a, s) => a + s.total, 0)).padStart(6)}  ${String(totalInserted).padStart(8)}  ${String(totalErrors).padStart(7)}`,
    );
    console.log("=".repeat(60));
    console.log(`⏱️  Duration: ${duration}s`);
    console.log("=".repeat(60));

    if (totalErrors > 0) {
      console.log("\n⚠️  Migration completed with errors");
      process.exit(1);
    } else {
      console.log("\n✅ Migration completed successfully!");
      process.exit(0);
    }
  } finally {
    sqlite.close();
    if (pg) {
      await pg.end();
    }
  }
}

main().catch((error) => {
  console.error("\n💥 Fatal error:", error);
  process.exit(1);
});

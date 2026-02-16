#!/usr/bin/env bun

/**
 * Script to migrate data from SQLite to PostgreSQL
 * This script should be run after setting up PostgreSQL database
 */

import { createClient } from "@libsql/client";
import { drizzle as drizzleLibsql } from "drizzle-orm/libsql";
import { drizzle as drizzlePostgres } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import * as schema from "../db/schema";

// Initialize SQLite client
const sqliteClient = createClient({
  url: "file:./db/bebendle.sqlite",
});

// Initialize PostgreSQL client
const postgresClient = new Client({
  host: process.env.POSTGRES_HOST || "db",
  port: parseInt(process.env.POSTGRES_PORT || "5432"),
  database: process.env.POSTGRES_DB || "bebendle",
  user: process.env.POSTGRES_USER || "postgres",
  password: process.env.POSTGRES_PASSWORD || "postgres",
});

async function migrateData() {
  try {
    console.log("Starting data migration from SQLite to PostgreSQL...");
    
    // Connect to databases
    await postgresClient.connect();
    const sqliteDb = drizzleLibsql(sqliteClient);
    const postgresDb = drizzlePostgres(postgresClient);
    
    // Migrate scrans table
    console.log("Migrating scrans table...");
    const scrans = await sqliteDb.select().from(schema.scrans);
    if (scrans.length > 0) {
      await postgresDb.insert(schema.scrans).values(scrans);
      console.log(`Migrated ${scrans.length} records to scrans table`);
    }
    
    // Migrate dailyScrandles table
    console.log("Migrating dailyScrandles table...");
    const dailyScrandles = await sqliteDb.select().from(schema.dailyScrandles);
    if (dailyScrandles.length > 0) {
      await postgresDb.insert(schema.dailyScrandles).values(dailyScrandles);
      console.log(`Migrated ${dailyScrandles.length} records to dailyScrandles table`);
    }
    
    // Migrate scrandleVotes table
    console.log("Migrating scrandleVotes table...");
    const scrandleVotes = await sqliteDb.select().from(schema.scrandleVotes);
    if (scrandleVotes.length > 0) {
      await postgresDb.insert(schema.scrandleVotes).values(scrandleVotes);
      console.log(`Migrated ${scrandleVotes.length} records to scrandleVotes table`);
    }
    
    // Migrate dailyUserResults table
    console.log("Migrating dailyUserResults table...");
    const dailyUserResults = await sqliteDb.select().from(schema.dailyUserResults);
    if (dailyUserResults.length > 0) {
      await postgresDb.insert(schema.dailyUserResults).values(dailyUserResults);
      console.log(`Migrated ${dailyUserResults.length} records to dailyUserResults table`);
    }
    
    // Migrate telegramVotes table
    console.log("Migrating telegramVotes table...");
    const telegramVotes = await sqliteDb.select().from(schema.telegramVotes);
    if (telegramVotes.length > 0) {
      await postgresDb.insert(schema.telegramVotes).values(telegramVotes);
      console.log(`Migrated ${telegramVotes.length} records to telegramVotes table`);
    }
    
    console.log("Data migration completed successfully!");
    
    // Close connections
    await sqliteClient.close();
    await postgresClient.end();
  } catch (error) {
    console.error("Error during data migration:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  migrateData();
}
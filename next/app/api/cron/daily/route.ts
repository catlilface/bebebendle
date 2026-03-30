import { NextResponse } from "next/server";
import { db, scrans, dailyScrandles } from "@/db/schema";
import { eq, and, sql, notInArray } from "drizzle-orm";
import type { Scran } from "@/db/schema";

const MIN_SCRANS = 20;
const ROUNDS_COUNT = 10;
const MIN_VOTES = 3;

function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

async function getUsedScranIds(): Promise<Set<number>> {
  const usedScrans = await db
    .select({
      scranAId: dailyScrandles.scranAId,
      scranBId: dailyScrandles.scranBId,
    })
    .from(dailyScrandles)
    .limit(2000);
  // Scrans can repeat once in 50 days

  const usedScranIds = new Set<number>();
  for (const row of usedScrans) {
    usedScranIds.add(row.scranAId);
    usedScranIds.add(row.scranBId);
  }
  return usedScranIds;
}

async function getApprovedScransWithVotes(
  excludeIds?: Set<number>,
): Promise<Scran[]> {
  const conditions = [
    eq(scrans.approved, true),
    sql`${scrans.numberOfLikes} + ${scrans.numberOfDislikes} > ${MIN_VOTES}`,
  ];

  if (excludeIds && excludeIds.size > 0) {
    conditions.push(notInArray(scrans.id, Array.from(excludeIds)));
  }

  return db
    .select()
    .from(scrans)
    .where(and(...conditions));
}

async function checkExistingRoundsForDate(date: string): Promise<boolean> {
  const existing = await db
    .select({ id: dailyScrandles.id })
    .from(dailyScrandles)
    .where(eq(dailyScrandles.date, date))
    .limit(1);

  return existing.length > 0;
}

async function createDailyRounds(
  scrans: Scran[],
  date: string,
): Promise<{ roundNumber: number; scranA: string; scranB: string }[]> {
  const createdRounds = [];

  for (let roundNumber = 1; roundNumber <= ROUNDS_COUNT; roundNumber++) {
    const scranA = scrans[(roundNumber - 1) * 2];
    const scranB = scrans[(roundNumber - 1) * 2 + 1];

    await db.insert(dailyScrandles).values({
      date,
      scranAId: scranA.id,
      scranBId: scranB.id,
      roundNumber: roundNumber,
      createdAt: new Date(),
    });

    createdRounds.push({
      roundNumber,
      scranA: scranA.name,
      scranB: scranB.name,
    });
  }

  return createdRounds;
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const today = new Date().toISOString().split("T")[0];

    if (await checkExistingRoundsForDate(today)) {
      return NextResponse.json({
        message: "Daily scrandles already exist for today",
        count: ROUNDS_COUNT,
      });
    }

    const usedScranIds = await getUsedScranIds();

    let approvedScrans = await getApprovedScransWithVotes(usedScranIds);

    if (approvedScrans.length < MIN_SCRANS) {
      approvedScrans = await getApprovedScransWithVotes();
    }

    if (approvedScrans.length < MIN_SCRANS) {
      return NextResponse.json(
        {
          error: `Not enough scrans with sufficient votes (need at least ${MIN_SCRANS}, found ${approvedScrans.length})`,
        },
        { status: 400 },
      );
    }

    const selectedScrans = shuffle(approvedScrans).slice(0, MIN_SCRANS);
    const createdRounds = await createDailyRounds(selectedScrans, today);

    console.log("Added daily game");

    return NextResponse.json({
      message: "Daily scrandles created successfully",
      date: today,
      rounds: createdRounds,
    });
  } catch (error) {
    console.error("Error creating daily scrandles:", error);
    return NextResponse.json(
      { error: "Failed to create daily scrandles" },
      { status: 500 },
    );
  }
}

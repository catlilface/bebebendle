import { db, scrans, dailyScrandles } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date") || new Date().toISOString().split("T")[0];

    // Get all 10 rounds for today
    const dailyScrandlesList = await db
      .select()
      .from(dailyScrandles)
      .where(eq(dailyScrandles.date, date))
      .orderBy(asc(dailyScrandles.roundNumber));

    if (dailyScrandlesList.length === 0) {
      return NextResponse.json({ error: "No daily scrandles found" }, { status: 404 });
    }

    // Get all unique scran IDs
    const scranIds = new Set<number>();
    dailyScrandlesList.forEach((round) => {
      scranIds.add(round.scranAId);
      scranIds.add(round.scranBId);
    });

    // Fetch all scrans and create a map for quick lookup
    const scransMap = new Map<number, typeof scrans.$inferSelect>();
    for (const id of scranIds) {
      const scran = await db.select().from(scrans).where(eq(scrans.id, id)).limit(1);
      if (scran.length > 0) {
        scransMap.set(id, scran[0]);
      }
    }

    // Build rounds array
    const rounds = dailyScrandlesList.map((round) => {
      const scranA = scransMap.get(round.scranAId);
      const scranB = scransMap.get(round.scranBId);
      
      if (!scranA || !scranB) {
        throw new Error(`Scran not found for round ${round.roundNumber}`);
      }

      return {
        roundNumber: round.roundNumber,
        scrandleId: round.id,
        scranA,
        scranB,
      };
    });

    return NextResponse.json({
      date,
      totalRounds: rounds.length,
      rounds,
    });
  } catch (error) {
    console.error("Error fetching daily scrandles:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

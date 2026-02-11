import { NextResponse } from "next/server";
import { db, dailyScrandles, scrans } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date") || new Date().toISOString().split("T")[0];
    const round = parseInt(searchParams.get("round") || "1");

    // Get today's scrandle for this round
    const scrandle = await db
      .select()
      .from(dailyScrandles)
      .where(
        and(
          eq(dailyScrandles.date, date),
          eq(dailyScrandles.roundNumber, round)
        )
      )
      .limit(1);

    if (scrandle.length === 0) {
      return NextResponse.json(
        { error: "No scrandle found for this round" },
        { status: 404 }
      );
    }

    // Get both scrans
    const scranA = await db
      .select()
      .from(scrans)
      .where(eq(scrans.id, scrandle[0].scranAId))
      .limit(1);

    const scranB = await db
      .select()
      .from(scrans)
      .where(eq(scrans.id, scrandle[0].scranBId))
      .limit(1);

    if (scranA.length === 0 || scranB.length === 0) {
      return NextResponse.json(
        { error: "Scrans not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      scrandle: scrandle[0],
      scranA: scranA[0],
      scranB: scranB[0],
    });
  } catch (error) {
    console.error("Error fetching scrandle:", error);
    return NextResponse.json(
      { error: "Failed to fetch scrandle" },
      { status: 500 }
    );
  }
}

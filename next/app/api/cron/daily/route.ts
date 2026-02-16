import { NextResponse } from "next/server";
import { db, scrans, dailyScrandles } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";

// This route is called by Vercel Cron to create daily scrandle with 10 rounds
export async function GET(request: Request) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const today = new Date().toISOString().split("T")[0];

    // Check if any rounds already exist for today
    const existing = await db
      .select()
      .from(dailyScrandles)
      .where(eq(dailyScrandles.date, today))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json({ 
        message: "Daily scrandles already exist for today",
        count: 10
      });
    }

    // Get approved scrans with at least 3 total votes (likes + dislikes > 2)
    const approvedScrans = await db
      .select()
      .from(scrans)
      .where(
        and(
          eq(scrans.approved, true),
          sql`${scrans.numberOfLikes} + ${scrans.numberOfDislikes} > 2`
        )
      );

    if (approvedScrans.length < 20) {
      return NextResponse.json(
        { error: "Not enough scrans with sufficient votes (need at least 20 scrans with 3+ votes)" },
        { status: 400 }
      );
    }

    // Shuffle and pick 20 unique scrans for 10 pairs
    const shuffled = [...approvedScrans].sort(() => Math.random() - 0.5);
    const selectedScrans = shuffled.slice(0, 20);

    // Create 10 rounds
    const createdRounds = [];
    const createdAt = new Date().toISOString();

    for (let roundNumber = 1; roundNumber <= 10; roundNumber++) {
      const scranA = selectedScrans[(roundNumber - 1) * 2];
      const scranB = selectedScrans[(roundNumber - 1) * 2 + 1];

      await db.insert(dailyScrandles).values({
        date: today,
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

    return NextResponse.json({
      message: "Daily scrandles created successfully",
      date: today,
      rounds: createdRounds,
    });
  } catch (error) {
    console.error("Error creating daily scrandles:", error);
    return NextResponse.json(
      { error: "Failed to create daily scrandles" },
      { status: 500 }
    );
  }
}

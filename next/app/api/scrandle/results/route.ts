import { NextResponse } from "next/server";
import { db, scrandleVotes, dailyScrandles, scrans } from "@/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date") || new Date().toISOString().split("T")[0];

    // Get session ID
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("scrandle_session")?.value;

    if (!sessionId) {
      return NextResponse.json(
        { error: "No game session found" },
        { status: 404 }
      );
    }

    // Get all today's scrandles
    const todayScrandles = await db
      .select()
      .from(dailyScrandles)
      .where(eq(dailyScrandles.date, date));

    if (todayScrandles.length === 0) {
      return NextResponse.json(
        { error: "No scrandles found for today" },
        { status: 404 }
      );
    }

    // Get user's votes for today
    const userVotes = await db
      .select()
      .from(scrandleVotes)
      .where(
        and(
          eq(scrandleVotes.sessionId, sessionId),
          inArray(
            scrandleVotes.dailyScrandleId,
            todayScrandles.map((s) => s.id)
          )
        )
      );

    // Get all scrans involved
    const scranIds = new Set<number>();
    todayScrandles.forEach((s) => {
      scranIds.add(s.scranAId);
      scranIds.add(s.scranBId);
    });

    const allScrans = await db
      .select()
      .from(scrans)
      .where(inArray(scrans.id, Array.from(scranIds)));

    const scransMap = new Map(allScrans.map((s) => [s.id, s]));

    // Calculate results
    const results = todayScrandles.map((scrandle) => {
      const userVote = userVotes.find((v) => v.dailyScrandleId === scrandle.id);
      const scranA = scransMap.get(scrandle.scranAId)!;
      const scranB = scransMap.get(scrandle.scranBId)!;

      const scranAPercentage = getLikesPercentage(scranA);
      const scranBPercentage = getLikesPercentage(scranB);

      const correctChoice =
        scranAPercentage > scranBPercentage ? scranA.id : scranB.id;

      return {
        round: scrandle.roundNumber,
        scranA: {
          ...scranA,
          likesPercentage: scranAPercentage,
        },
        scranB: {
          ...scranB,
          likesPercentage: scranBPercentage,
        },
        userChoice: userVote?.chosenScranId || null,
        correctChoice,
        isCorrect: userVote?.chosenScranId === correctChoice,
      };
    });

    const correctCount = results.filter((r) => r.isCorrect).length;
    const totalRounds = results.length;

    return NextResponse.json({
      date,
      score: correctCount,
      totalRounds,
      percentage: Math.round((correctCount / totalRounds) * 100),
      results,
    });
  } catch (error) {
    console.error("Error fetching results:", error);
    return NextResponse.json(
      { error: "Failed to fetch results" },
      { status: 500 }
    );
  }
}

function getLikesPercentage(scran: typeof scrans.$inferSelect): number {
  const total = scran.numberOfLikes + scran.numberOfDislikes;
  if (total === 0) return 50; // Default to 50% if no votes
  return Math.round((scran.numberOfLikes / total) * 100);
}

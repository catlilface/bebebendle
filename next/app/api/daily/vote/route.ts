import { NextResponse } from "next/server";
import { db, scrans } from "@/db/schema";
import { eq } from "drizzle-orm";

function getLikesPercentage(scran: { numberOfLikes: number; numberOfDislikes: number }): number {
  const total = scran.numberOfLikes + scran.numberOfDislikes;
  if (total === 0) return 50;
  return Math.round((scran.numberOfLikes / total) * 100);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { roundNumber, chosenScranId, scranAId, scranBId } = body;

    if (!roundNumber || !chosenScranId || !scranAId || !scranBId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get both scrans to calculate correctness
    const [scranAData, scranBData] = await Promise.all([
      db.select().from(scrans).where(eq(scrans.id, scranAId)).limit(1),
      db.select().from(scrans).where(eq(scrans.id, scranBId)).limit(1),
    ]);

    if (scranAData.length === 0 || scranBData.length === 0) {
      return NextResponse.json({ error: "Scrans not found" }, { status: 404 });
    }

    const scranA = scranAData[0];
    const scranB = scranBData[0];

    // Calculate percentages (no longer updating votes - votes only through Telegram bot)
    const percentageA = getLikesPercentage(scranA);
    const percentageB = getLikesPercentage(scranB);

    // Determine which one has higher percentage
    const correctScranId = percentageA >= percentageB ? scranAId : scranBId;
    const isCorrect = chosenScranId === correctScranId;

    return NextResponse.json({
      success: true,
      roundNumber,
      isCorrect,
      chosenScranId,
      correctScranId,
      percentageA,
      percentageB,
    });
  } catch (error) {
    console.error("Error processing vote:", error);
    return NextResponse.json(
      { error: "Failed to process vote" },
      { status: 500 }
    );
  }
}

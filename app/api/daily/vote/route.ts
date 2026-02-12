import { NextResponse } from "next/server";
import { db, scrans } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

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

    // Determine the unchosen scran
    const unchosenScranId = chosenScranId === scranAId ? scranBId : scranAId;

    // Add like to chosen scran and dislike to unchosen scran
    await Promise.all([
      db
        .update(scrans)
        .set({ numberOfLikes: sql`${scrans.numberOfLikes} + 1` })
        .where(eq(scrans.id, chosenScranId)),
      db
        .update(scrans)
        .set({ numberOfDislikes: sql`${scrans.numberOfDislikes} + 1` })
        .where(eq(scrans.id, unchosenScranId)),
    ]);

    // Get updated data for percentage calculation
    const [updatedScranAData, updatedScranBData] = await Promise.all([
      db.select().from(scrans).where(eq(scrans.id, scranAId)).limit(1),
      db.select().from(scrans).where(eq(scrans.id, scranBId)).limit(1),
    ]);

    const updatedScranA = updatedScranAData[0];
    const updatedScranB = updatedScranBData[0];

    // Calculate percentages
    const percentageA = getLikesPercentage(updatedScranA);
    const percentageB = getLikesPercentage(updatedScranB);

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

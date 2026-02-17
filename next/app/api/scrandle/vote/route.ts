import { NextResponse } from "next/server";
import { db, scrandleVotes, scrans } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { dailyScrandleId, chosenScranId } = body;

    if (!dailyScrandleId || !chosenScranId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get or create session ID
    const cookieStore = await cookies();
    let sessionId = cookieStore.get("scrandle_session")?.value;
    
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      cookieStore.set("scrandle_session", sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
    }

    // Record the vote
    await db.insert(scrandleVotes).values({
      dailyScrandleId,
      sessionId,
      chosenScranId,
      createdAt: new Date(),
    });

    // Update scran likes/dislikes based on choice
    const scrandle = await db
      .select()
      .from(scrans)
      .where(eq(scrans.id, chosenScranId))
      .limit(1);

    if (scrandle.length > 0) {
      await db
        .update(scrans)
        .set({ numberOfLikes: scrandle[0].numberOfLikes + 1 })
        .where(eq(scrans.id, chosenScranId));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error recording vote:", error);
    return NextResponse.json(
      { error: "Failed to record vote" },
      { status: 500 }
    );
  }
}

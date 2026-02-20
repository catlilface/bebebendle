import { NextResponse } from "next/server";
import { db, scrandleVotes, scrans } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { cookies } from "next/headers";
import { checkRateLimit, getClientIp } from "../../middleware/rateLimit";

export async function POST(request: Request) {
  try {
    const rateLimitResult = await checkRateLimit(
      `vote:${getClientIp(request)}`,
      1,
      5
    );

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please wait." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { dailyScrandleId, chosenScranId } = body;
    const fingerprint = request.headers.get("X-Client-Fingerprint") || null;

    if (!dailyScrandleId || !chosenScranId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    let sessionId = cookieStore.get("scrandle_session")?.value;

    if (!sessionId) {
      sessionId = crypto.randomUUID();
      cookieStore.set("scrandle_session", sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 30,
      });
    }

    const existingVote = await db
      .select()
      .from(scrandleVotes)
      .where(
        and(
          eq(scrandleVotes.sessionId, sessionId),
          eq(scrandleVotes.dailyScrandleId, dailyScrandleId)
        )
      )
      .limit(1);

    if (existingVote.length > 0) {
      return NextResponse.json(
        { error: "You have already voted for this round" },
        { status: 409 }
      );
    }

    await db.insert(scrandleVotes).values({
      dailyScrandleId,
      sessionId,
      fingerprintHash: fingerprint,
      chosenScranId,
      createdAt: new Date(),
    });

    const scran = await db
      .select()
      .from(scrans)
      .where(eq(scrans.id, chosenScranId))
      .limit(1);

    if (scran.length > 0) {
      await db
        .update(scrans)
        .set({ numberOfLikes: scran[0].numberOfLikes + 1 })
        .where(eq(scrans.id, chosenScranId));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if ((error as { code?: string }).code === "23505") {
      return NextResponse.json(
        { error: "You have already voted for this round" },
        { status: 409 }
      );
    }
    console.error("Error recording vote:", error);
    return NextResponse.json(
      { error: "Failed to record vote" },
      { status: 500 }
    );
  }
}

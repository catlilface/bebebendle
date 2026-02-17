import { NextResponse } from "next/server";
import { db, dailyUserResults } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { cookies } from "next/headers";

// POST: Submit user's score
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { date, score } = body;

    if (!date || typeof score !== "number" || score < 0 || score > 10) {
      return NextResponse.json(
        { error: "Invalid date or score" },
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
        maxAge: 60 * 60 * 24 * 30,
      });
    }

    // Check if already submitted for this date
    const existing = await db
      .select()
      .from(dailyUserResults)
      .where(
        and(
          eq(dailyUserResults.date, date),
          eq(dailyUserResults.sessionId, sessionId)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json({
        message: "Score already recorded",
        score: existing[0].score,
      });
    }

    // Insert new result
    await db.insert(dailyUserResults).values({
      date,
      sessionId,
      score,
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      score,
    });
  } catch (error) {
    console.error("Error submitting score:", error);
    return NextResponse.json(
      { error: "Failed to submit score" },
      { status: 500 }
    );
  }
}

// GET: Get average score for today
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date") || new Date().toISOString().split("T")[0];

    // Get all results for today
    const results = await db
      .select({
        score: dailyUserResults.score,
      })
      .from(dailyUserResults)
      .where(eq(dailyUserResults.date, date));

    if (results.length === 0) {
      return NextResponse.json({
        date,
        totalUsers: 0,
        averageScore: null,
      });
    }

    // Calculate average
    const totalScore = results.reduce((sum, r) => sum + r.score, 0);
    const averageScore = Math.round((totalScore / results.length) * 10) / 10;

    return NextResponse.json({
      date,
      totalUsers: results.length,
      averageScore,
    });
  } catch (error) {
    console.error("Error fetching results:", error);
    return NextResponse.json(
      { error: "Failed to fetch results" },
      { status: 500 }
    );
  }
}

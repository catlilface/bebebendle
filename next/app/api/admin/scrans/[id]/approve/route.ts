import { NextResponse } from "next/server";
import { db, scrans } from "@/db/schema";
import { eq } from "drizzle-orm";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

function checkAuth(request: Request): boolean {
  if (!ADMIN_PASSWORD) return false;
  
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return false;
  }
  
  const password = authHeader.slice(7);
  return password === ADMIN_PASSWORD;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkAuth(request)) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    const scranId = parseInt(id);

    if (isNaN(scranId)) {
      return NextResponse.json(
        { error: "Invalid ID" },
        { status: 400 }
      );
    }

    await db
      .update(scrans)
      .set({ approved: true })
      .where(eq(scrans.id, scranId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error approving scran:", error);
    return NextResponse.json(
      { error: "Failed to approve scran" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export async function POST(request: Request) {
  if (!ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: "Admin password not configured" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { password } = body;

    if (password === ADMIN_PASSWORD) {
      return NextResponse.json({ authenticated: true });
    } else {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

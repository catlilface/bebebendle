import { NextResponse } from "next/server";
import { db, scrans } from "@/db/schema";
import { asc, desc } from "drizzle-orm";

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

export async function GET(request: Request) {
  if (!checkAuth(request)) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const sortField = searchParams.get("sort") || "id";
    const sortOrder = searchParams.get("order") || "desc";

    const offset = (page - 1) * limit;

    // Build order by clause
    let orderBy;
    const orderFn = sortOrder === "asc" ? asc : desc;
    
    switch (sortField) {
      case "name":
        orderBy = orderFn(scrans.name);
        break;
      case "price":
        orderBy = orderFn(scrans.price);
        break;
      case "numberOfLikes":
        orderBy = orderFn(scrans.numberOfLikes);
        break;
      case "numberOfDislikes":
        orderBy = orderFn(scrans.numberOfDislikes);
        break;
      case "approved":
        orderBy = orderFn(scrans.approved);
        break;
      default:
        orderBy = orderFn(scrans.id);
    }

    // Get total count
    const allScrans = await db.select().from(scrans);
    const total = allScrans.length;

    // Get paginated results
    const paginatedScrans = await db
      .select()
      .from(scrans)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    return NextResponse.json({
      scrans: paginatedScrans,
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error("Error fetching scrans:", error);
    return NextResponse.json(
      { error: "Failed to fetch scrans" },
      { status: 500 }
    );
  }
}

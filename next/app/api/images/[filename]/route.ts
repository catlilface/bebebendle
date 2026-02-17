import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import sharp from "sharp";

const UPLOADS_DIR = "/app/uploads";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    const filePath = join(UPLOADS_DIR, filename);

    // Read image file
    const imageBuffer = await readFile(filePath);

    // Convert to WebP with 80% quality, keep original dimensions
    const webpBuffer = await sharp(imageBuffer).webp({ quality: 80 }).toBuffer();

    return new NextResponse(Buffer.from(webpBuffer), {
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    return new NextResponse("Image not found", { status: 404 });
  }
}

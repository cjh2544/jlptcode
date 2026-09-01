import { requireAdmin } from "@/app/utils/requireAdmin";
import connectDB from "@/app/utils/database";
import { getLevelUpJlptMap } from "@/app/lib/levelUpJlptMap.server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const level = request.nextUrl.searchParams.get("level")?.trim();
  if (!level) {
    return NextResponse.json(
      { success: false, message: "level is required." },
      { status: 400 },
    );
  }

  await connectDB();
  const map = await getLevelUpJlptMap(level);
  return NextResponse.json({ level, ...map });
}

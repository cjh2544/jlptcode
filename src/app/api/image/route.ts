import {
  fetchGoogleMedia,
  mediaResponse,
  normalizeGoogleMediaUrl,
} from "@/app/lib/google-media";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get("url");
  if (!raw) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  let target: URL | null = null;
  try {
    target = normalizeGoogleMediaUrl(raw);
  } catch {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 });
  }

  if (!target) {
    return NextResponse.json({ error: "Host not allowed" }, { status: 400 });
  }

  try {
    const fetched = await fetchGoogleMedia(target, "image/*,*/*;q=0.8");
    if (!fetched) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    return mediaResponse(new Uint8Array(fetched.buffer), fetched.contentType);
  } catch (error) {
    console.error("[image] proxy failed", error);
    return NextResponse.json({ error: "Image proxy failed" }, { status: 502 });
  }
}

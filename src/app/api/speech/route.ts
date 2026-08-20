import * as googleTTS from "google-tts-api";
import {
  fetchGoogleMedia,
  mediaResponse,
  normalizeGoogleMediaUrl,
} from "@/app/lib/google-media";
import { NextRequest, NextResponse } from "next/server";

async function audioFromGoogleTts(url: URL) {
  const text = url.searchParams.get("q") || url.searchParams.get("text");
  if (!text) return null;
  const lang = url.searchParams.get("tl") || url.searchParams.get("lang") || "ja";
  const base64 = await googleTTS.getAudioBase64(text, {
    lang,
    slow: false,
    host: "https://translate.google.com",
  });
  return Buffer.from(base64, "base64");
}

export async function GET(request: NextRequest) {
  const text = request.nextUrl.searchParams.get("text");
  if (text) {
    try {
      const lang = request.nextUrl.searchParams.get("lang") || "ja";
      const base64 = await googleTTS.getAudioBase64(text, {
        lang,
        slow: false,
        host: "https://translate.google.com",
      });
      return mediaResponse(new Uint8Array(Buffer.from(base64, "base64")), "audio/mpeg");
    } catch (error) {
      console.error("[speech] tts text failed", error);
      return NextResponse.json({ error: "Speech failed" }, { status: 502 });
    }
  }

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
    if (target.hostname.includes("translate.google")) {
      const tts = await audioFromGoogleTts(target);
      if (tts) {
        return mediaResponse(new Uint8Array(tts), "audio/mpeg");
      }
    }

    const fetched = await fetchGoogleMedia(target, "audio/mpeg,audio/*,*/*;q=0.8");
    if (!fetched) {
      return NextResponse.json({ error: "Audio not found" }, { status: 404 });
    }

    return mediaResponse(new Uint8Array(fetched.buffer), fetched.contentType);
  } catch (error) {
    console.error("[speech] proxy failed", error);
    return NextResponse.json({ error: "Speech proxy failed" }, { status: 502 });
  }
}

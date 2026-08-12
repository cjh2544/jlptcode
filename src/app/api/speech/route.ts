import * as googleTTS from "google-tts-api";
import { NextRequest, NextResponse } from "next/server";

const ALLOWED_HOSTS = new Set([
  "translate.google.com",
  "translate.googleapis.com",
  "drive.google.com",
  "docs.google.com",
]);

function isAllowedHost(hostname: string) {
  return (
    ALLOWED_HOSTS.has(hostname) ||
    hostname.endsWith(".googleusercontent.com")
  );
}

function driveDownloadUrl(fileId: string) {
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
}

function normalizeUrl(raw: string) {
  const url = new URL(raw);
  if (!isAllowedHost(url.hostname)) return null;

  const driveId = url.pathname.match(/\/file\/d\/([^/]+)/)?.[1];
  if (driveId) return new URL(driveDownloadUrl(driveId));

  const queryId = url.searchParams.get("id");
  if (queryId && url.hostname.includes("drive.google")) {
    return new URL(driveDownloadUrl(queryId));
  }

  return url;
}

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

function audioResponse(body: Uint8Array, contentType = "audio/mpeg") {
  // Copy into a fresh ArrayBuffer so BodyInit accepts it (TS DOM lib rejects ArrayBufferLike views).
  const bytes = new Uint8Array(body);
  return new NextResponse(bytes.buffer, {
    headers: {
      "Content-Type": contentType,
      "Content-Length": String(bytes.byteLength),
      "Accept-Ranges": "bytes",
      "Cache-Control": "public, max-age=86400",
    },
  });
}

async function fetchAudio(url: URL) {
  const response = await fetch(url.toString(), {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept: "audio/mpeg,audio/*,*/*;q=0.8",
      Referer: "https://translate.google.com/",
    },
    redirect: "follow",
  });

  if (!response.ok) return null;

  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("text/html")) return null;

  const buffer = Buffer.from(await response.arrayBuffer());
  return { buffer, contentType: contentType || "audio/mpeg" };
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
      return audioResponse(new Uint8Array(Buffer.from(base64, "base64")));
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
    target = normalizeUrl(raw);
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
        return audioResponse(new Uint8Array(tts));
      }
    }

    const fetched = await fetchAudio(target);
    if (!fetched) {
      return NextResponse.json({ error: "Audio not found" }, { status: 404 });
    }

    return audioResponse(new Uint8Array(fetched.buffer), fetched.contentType);
  } catch (error) {
    console.error("[speech] proxy failed", error);
    return NextResponse.json({ error: "Speech proxy failed" }, { status: 502 });
  }
}

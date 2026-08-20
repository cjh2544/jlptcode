import * as googleTTS from "google-tts-api";
import {
  fetchGoogleMedia,
  isAudioBuffer,
  mediaResponse,
  normalizeGoogleMediaUrl,
  sniffAudioContentType,
} from "@/app/lib/google-media";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const TTS_HOST = "https://translate.google.com";
const TTS_SPLIT = "。、．，.?!？！";

function ttsOptions(lang: string) {
  return { lang, slow: false, host: TTS_HOST };
}

async function ttsFromUrls(urls: string[]) {
  const chunks: Buffer[] = [];
  for (const href of urls) {
    const fetched = await fetchGoogleMedia(new URL(href), "audio/mpeg,audio/*,*/*;q=0.8");
    if (!fetched || !isAudioBuffer(fetched.buffer)) return null;
    chunks.push(fetched.buffer);
  }
  return chunks.length ? Buffer.concat(chunks) : null;
}

async function audioFromText(text: string, lang: string) {
  const options = ttsOptions(lang);
  const urls =
    text.length <= 200
      ? [googleTTS.getAudioUrl(text, options)]
      : googleTTS.getAllAudioUrls(text, { ...options, splitPunct: TTS_SPLIT }).map((item) => item.url);

  const fromUrl = await ttsFromUrls(urls);
  if (fromUrl) return fromUrl;

  if (text.length <= 200) {
    const base64 = await googleTTS.getAudioBase64(text, options);
    return Buffer.from(base64, "base64");
  }

  const parts = await googleTTS.getAllAudioBase64(text, { ...options, splitPunct: TTS_SPLIT });
  return Buffer.concat(parts.map((part) => Buffer.from(part.base64, "base64")));
}

async function audioFromGoogleTts(url: URL) {
  const text = url.searchParams.get("q") || url.searchParams.get("text");
  if (text) {
    const lang = url.searchParams.get("tl") || url.searchParams.get("lang") || "ja";
    return audioFromText(text, lang);
  }

  const patched = new URL(url.toString());
  if (!patched.searchParams.get("client")) {
    patched.searchParams.set("client", "tw-ob");
  }
  const fetched = await fetchGoogleMedia(patched, "audio/mpeg,audio/*,*/*;q=0.8");
  return fetched?.buffer ?? null;
}

function audioResponse(buffer: Buffer, contentType?: string) {
  if (!isAudioBuffer(buffer)) return null;
  return mediaResponse(
    new Uint8Array(buffer),
    sniffAudioContentType(buffer, contentType || "audio/mpeg")
  );
}

export async function GET(request: NextRequest) {
  const text = request.nextUrl.searchParams.get("text");
  if (text) {
    try {
      const lang = request.nextUrl.searchParams.get("lang") || "ja";
      const tts = audioResponse(await audioFromText(text, lang));
      return tts ?? NextResponse.json({ error: "Speech failed" }, { status: 502 });
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
      const response = tts ? audioResponse(tts) : null;
      if (response) return response;
    }

    const fetched = await fetchGoogleMedia(target, "audio/mpeg,audio/*,*/*;q=0.8");
    const response = fetched ? audioResponse(fetched.buffer, fetched.contentType) : null;
    if (response) return response;

    return NextResponse.json({ error: "Audio not found" }, { status: 404 });
  } catch (error) {
    console.error("[speech] proxy failed", error);
    return NextResponse.json({ error: "Speech proxy failed" }, { status: 502 });
  }
}

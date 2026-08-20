import dns from "dns";
import { NextResponse } from "next/server";

dns.setDefaultResultOrder("ipv4first");

const ALLOWED_HOSTS = new Set([
  "translate.google.com",
  "translate.googleapis.com",
  "drive.google.com",
  "docs.google.com",
]);

const BROWSER_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

function isAllowedHost(hostname: string) {
  return ALLOWED_HOSTS.has(hostname) || hostname.endsWith(".googleusercontent.com");
}

function extractDriveFileId(url: URL) {
  return (
    url.pathname.match(/\/(?:file|document|presentation|open)\/d\/([^/]+)/)?.[1] ||
    url.searchParams.get("id")
  );
}

function driveCandidates(fileId: string, confirm = "t", uuid?: string) {
  const userContent = new URL("https://drive.usercontent.google.com/download");
  userContent.searchParams.set("id", fileId);
  userContent.searchParams.set("export", "download");
  userContent.searchParams.set("confirm", confirm);
  if (uuid) userContent.searchParams.set("uuid", uuid);

  const uc = new URL("https://drive.google.com/uc");
  uc.searchParams.set("export", "download");
  uc.searchParams.set("id", fileId);
  uc.searchParams.set("confirm", confirm);

  return [userContent, uc];
}

function looksLikeHtml(buffer: Buffer, contentType = "") {
  if (contentType.includes("text/html") || contentType.includes("text/plain")) {
    const head = buffer.subarray(0, 120).toString("utf8").trim().toLowerCase();
    return (
      head.startsWith("<!doctype") ||
      head.startsWith("<html") ||
      head.includes("<form") ||
      head.includes("google drive")
    );
  }
  const head = buffer.subarray(0, 32).toString("utf8").trim().toLowerCase();
  return head.startsWith("<!doctype") || head.startsWith("<html");
}

function parseDriveConfirm(html: string) {
  const confirm =
    html.match(/name=["']confirm["']\s+value=["']([^"']+)["']/)?.[1] ||
    html.match(/confirm=([0-9A-Za-z_-]+)/)?.[1] ||
    "t";
  const uuid = html.match(/name=["']uuid["']\s+value=["']([^"']+)["']/)?.[1];
  return { confirm, uuid };
}

function mergeCookies(existing: string, setCookies: string[]) {
  const jar = new Map<string, string>();
  for (const part of existing.split(";")) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    jar.set(trimmed.slice(0, eq), trimmed.slice(eq + 1));
  }
  for (const raw of setCookies) {
    const first = raw.split(";")[0]?.trim();
    if (!first) continue;
    const eq = first.indexOf("=");
    if (eq <= 0) continue;
    jar.set(first.slice(0, eq), first.slice(eq + 1));
  }
  return [...jar.entries()].map(([k, v]) => `${k}=${v}`).join("; ");
}

export function isAudioBuffer(buffer: Buffer) {
  if (buffer.length < 3) return false;
  const id3 = buffer.subarray(0, 3).toString("latin1") === "ID3";
  const mpeg = buffer[0] === 0xff && (buffer[1] & 0xe0) === 0xe0;
  if (id3 || mpeg) return true;
  if (buffer.length >= 12 && buffer.subarray(4, 8).toString("latin1") === "ftyp") return true;
  if (buffer.subarray(0, 4).toString("latin1") === "OggS") return true;
  if (buffer.subarray(0, 4).toString("latin1") === "RIFF") return true;
  return false;
}

export function sniffAudioContentType(buffer: Buffer, fallback = "audio/mpeg") {
  if (isAudioBuffer(buffer)) {
    if (buffer.subarray(0, 3).toString("latin1") === "ID3") return "audio/mpeg";
    if (buffer[0] === 0xff && (buffer[1] & 0xe0) === 0xe0) return "audio/mpeg";
    if (buffer.length >= 12 && buffer.subarray(4, 8).toString("latin1") === "ftyp") return "audio/mp4";
    if (buffer.subarray(0, 4).toString("latin1") === "OggS") return "audio/ogg";
    if (buffer.subarray(0, 4).toString("latin1") === "RIFF") return "audio/wav";
  }
  return fallback.startsWith("audio/") ? fallback : "audio/mpeg";
}

export function normalizeGoogleMediaUrl(raw: string) {
  const url = new URL(raw);
  if (!isAllowedHost(url.hostname)) return null;

  const driveId = extractDriveFileId(url);
  if (
    driveId &&
    (url.hostname.includes("drive.google") ||
      url.hostname.includes("docs.google") ||
      url.hostname.endsWith(".googleusercontent.com"))
  ) {
    return driveCandidates(driveId)[0];
  }

  return url;
}

async function fetchOnce(url: string, accept: string, cookie = "") {
  const headers: Record<string, string> = {
    "User-Agent": BROWSER_UA,
    Accept: accept,
    "Accept-Language": "ja,en-US;q=0.9,en;q=0.8,ko;q=0.7",
    Referer: url.includes("translate.google")
      ? "https://translate.google.com/"
      : "https://drive.google.com/",
  };
  if (cookie) headers.Cookie = cookie;

  const response = await fetch(url, {
    headers,
    redirect: "manual",
    signal: AbortSignal.timeout(20000),
  });

  const setCookies =
    typeof response.headers.getSetCookie === "function" ? response.headers.getSetCookie() : [];
  const nextCookie = setCookies.length ? mergeCookies(cookie, setCookies) : cookie;

  return { response, cookie: nextCookie };
}

async function fetchFollow(url: string, accept: string, initialCookie = "") {
  let current = url;
  let cookie = initialCookie;

  for (let i = 0; i < 8; i++) {
    const { response, cookie: nextCookie } = await fetchOnce(current, accept, cookie);
    cookie = nextCookie;

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location) return null;
      current = new URL(location, current).toString();
      continue;
    }

    if (!response.ok) return null;

    const contentType = response.headers.get("content-type") || "";
    const buffer = Buffer.from(await response.arrayBuffer());
    return { buffer, contentType: contentType || "application/octet-stream", finalUrl: current, cookie };
  }

  return null;
}

async function fetchDriveFile(fileId: string, accept: string) {
  for (const candidate of driveCandidates(fileId)) {
    const first = await fetchFollow(candidate.toString(), accept);
    if (!first) continue;

    if (!looksLikeHtml(first.buffer, first.contentType)) {
      return { buffer: first.buffer, contentType: first.contentType };
    }

    const html = first.buffer.toString("utf8");
    const { confirm, uuid } = parseDriveConfirm(html);
    for (const retryUrl of driveCandidates(fileId, confirm, uuid)) {
      const retry = await fetchFollow(retryUrl.toString(), accept, first.cookie);
      if (retry && !looksLikeHtml(retry.buffer, retry.contentType)) {
        return { buffer: retry.buffer, contentType: retry.contentType };
      }
    }
  }
  return null;
}

export async function fetchGoogleMedia(url: URL, accept = "*/*") {
  const fileId = extractDriveFileId(url);
  if (
    fileId &&
    (url.hostname.includes("drive.google") ||
      url.hostname.includes("docs.google") ||
      url.hostname.endsWith(".googleusercontent.com"))
  ) {
    return fetchDriveFile(fileId, accept);
  }

  const first = await fetchFollow(url.toString(), accept);
  if (!first) return null;

  if (!looksLikeHtml(first.buffer, first.contentType)) {
    return { buffer: first.buffer, contentType: first.contentType };
  }

  const htmlId = extractDriveFileId(new URL(first.finalUrl));
  if (htmlId) return fetchDriveFile(htmlId, accept);

  return null;
}

export function mediaResponse(body: Uint8Array, contentType: string) {
  const bytes = Uint8Array.from(body);
  return new NextResponse(bytes, {
    headers: {
      "Content-Type": contentType,
      "Content-Length": String(bytes.byteLength),
      "Cache-Control": "public, max-age=86400",
    },
  });
}

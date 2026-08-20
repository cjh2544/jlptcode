import { NextResponse } from "next/server";

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

export function normalizeGoogleMediaUrl(raw: string) {
  const url = new URL(raw);
  if (!isAllowedHost(url.hostname)) return null;

  const driveId = url.pathname.match(/\/file\/d\/([^/]+)/)?.[1];
  if (driveId) return new URL(driveDownloadUrl(driveId));

  const queryId = url.searchParams.get("id");
  if (queryId && (url.hostname.includes("drive.google") || url.hostname.endsWith(".googleusercontent.com"))) {
    return new URL(driveDownloadUrl(queryId));
  }

  return url;
}

export async function fetchGoogleMedia(url: URL, accept = "*/*") {
  const response = await fetch(url.toString(), {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept: accept,
      Referer: "https://drive.google.com/",
    },
    redirect: "follow",
  });

  if (!response.ok) return null;

  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("text/html")) return null;

  const buffer = Buffer.from(await response.arrayBuffer());
  return { buffer, contentType: contentType || "application/octet-stream" };
}

export function mediaResponse(body: Uint8Array, contentType: string) {
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

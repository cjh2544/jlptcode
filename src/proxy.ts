import { withAuth, type NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse, type NextFetchEvent } from "next/server";

const authMiddleware = withAuth({});

export function proxy(request: NextRequestWithAuth, event: NextFetchEvent) {
  if (request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  return authMiddleware(request, event);
}

export const config = {
  matcher: [
    "/auth/modify",
    "/auth/delete",
    "/board/community/write",
    "/board/community/modify",
    "/board/community/reply",
    "/member/:path*",
  ],
};

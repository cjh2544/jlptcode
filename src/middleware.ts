import { USER_ROLE } from "@/app/constants/constants";
import { withAuth, type NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse, type NextFetchEvent } from "next/server";

const authMiddleware = withAuth(
  function middleware(req) {
    if (req.nextUrl.pathname.startsWith("/admin") || req.nextUrl.pathname.startsWith("/member")) {
      const role = req.nextauth.token?.role;
      if (!Array.isArray(role) || !role.includes(USER_ROLE.ADMIN)) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => Boolean(token),
    },
  },
);

export function middleware(request: NextRequestWithAuth, event: NextFetchEvent) {
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
    "/admin",
    "/admin/:path*",
    "/member/:path*",
    "/mypage",
    "/mypage/:path*",
  ],
};

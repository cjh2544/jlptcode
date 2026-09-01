import { USER_ROLE } from "@/app/constants/constants";
import { isAdminApiPath } from "@/app/lib/admin-security";
import { withAuth, type NextRequestWithAuth } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";
import { NextResponse, type NextFetchEvent } from "next/server";

function isAdminRole(role: unknown) {
  return Array.isArray(role) && role.includes(USER_ROLE.ADMIN);
}

async function rejectAdminApi(request: NextRequestWithAuth) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  if (!isAdminRole(token.role)) {
    return NextResponse.json(
      { success: false, message: "Forbidden" },
      { status: 403 },
    );
  }

  return null;
}

const authMiddleware = withAuth(
  function middleware(req) {
    if (req.nextUrl.pathname.startsWith("/admin") || req.nextUrl.pathname.startsWith("/member")) {
      const role = req.nextauth.token?.role;
      if (!isAdminRole(role)) {
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

export async function middleware(request: NextRequestWithAuth, event: NextFetchEvent) {
  const { pathname } = request.nextUrl;

  if (isAdminApiPath(pathname, request.method)) {
    const denied = await rejectAdminApi(request);
    if (denied) return denied;
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
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
    "/api/admin/:path*",
    "/api/user",
    "/api/user/list",
    "/api/user/page",
    "/api/user/role",
    "/api/user/reset-password",
    "/api/user/:id",
    "/api/userPayment",
  ],
};

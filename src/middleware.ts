import { withAuth, type NextRequestWithAuth } from 'next-auth/middleware'
import type { NextFetchEvent } from 'next/server'

const authMiddleware = withAuth({})

export function middleware(request: NextRequestWithAuth, event: NextFetchEvent) {
    return authMiddleware(request, event)
}

// 인증이 필요한 페이지
export const config = {
    matcher: [
        '/auth/modify', 
        '/auth/delete', 
        '/board/community/write',
        '/board/community/modify',
        '/board/community/reply',
        '/member/:path*',
    ],
}

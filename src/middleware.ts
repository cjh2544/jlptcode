export { default } from 'next-auth/middleware'

// 인증이 필요한 페이지
export const config = {
    matcher: [
        '/auth/modify', 
        '/auth/delete', 
        '/board/community/write',
        '/board/community/modify',
        '/board/community/reply',
    ],
}

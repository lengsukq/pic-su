// 'use server'
import {NextResponse,NextRequest} from 'next/server'
import {verifyAuth} from "@/utils/auth/auth";
import BizResult from "@/utils/BizResult";
export async function middleware(req:NextRequest) {
    const verifiedToken = await verifyAuth(req).catch((err) => {
        console.error(err.message)
    })
    if (!verifiedToken) {
        return BizResult.authfailed("");
    }
    return NextResponse.next()

}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [

        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        // '/api/image-api/((?!token))',
        // '/api/((?!user)(?!image-api/token).*)',
        '/api/((?!user/login)(?!user/register)(?!image-api/token)(?!image-api/getBingImage).*)',
        // '/((?!/uuuu|_next/static|_next/image|favicon.ico).*)',

    ],
}

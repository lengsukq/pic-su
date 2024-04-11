'use server'
import {NextResponse,NextRequest} from 'next/server'
import {verifyAuth} from "@/utils/auth/auth";
export async function middleware(req:NextRequest) {
    const verifiedToken = await verifyAuth(req).catch((err) => {
        console.error(err.message)
    })
    if (!verifiedToken) {
        // if this an API request, respond with JSON
        if (req.nextUrl.pathname.startsWith('/api/')) {
            return new NextResponse(
                JSON.stringify({ 'error': { message: 'authentication required' } }),
                { status: 401 });
        }
        // otherwise, redirect to the set token page
        else {
            return NextResponse.redirect(new URL('/', req.url))
        }
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
        '/api/((?!user).*)',
        // '/((?!/uuuu|_next/static|_next/image|favicon.ico).*)',

    ],
}

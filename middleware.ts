'use server'
import {NextResponse,NextRequest} from 'next/server'
import {cookies} from 'next/headers'
import BizResult from "@/utils/BizResult";
import {verifyAuth} from "@/utils/auth/auth";
// import {cookieTools} from "@/utils/cookieTools";
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
    // console.log('middleware',request.cookies.get('cookie'))
    // if (!request.cookies.get('cookie')) {
    //     return Response.json(BizResult.fail('', '用户未登录'))
    // }
    // const {email} = cookieTools(request);
    return NextResponse.next()
    // if (cookies().has(email)) {
    //     console.log('cookie',cookies().get(email))
    //     return NextResponse.next()
    // } else {
    //     return Response.json(BizResult.fail('', '登录过期'))
    // }
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

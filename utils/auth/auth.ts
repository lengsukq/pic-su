
import type { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { SignJWT, jwtVerify } from 'jose'
import { USER_TOKEN, getJwtSecretKey } from './constants'

export interface UserJwtPayload {
    jti: string
    iat: number
    user_id?: number
    username?: string
    email?: string
    created_at?: string
    updated_at?: string
    SM_TOKEN: string
    IMGBB_API: string
    BILIBILI_SESSDATA: string
    BILIBILI_CSRF: string
    TG_URL: string
}

export class AuthError extends Error {}

/**
 * Verifies the user's JWT token and returns its payload if it's valid.
 */
export async function verifyAuth(req: NextRequest) {
    const token = req.cookies.get(USER_TOKEN)?.value

    if (!token) throw new AuthError('Missing user token')

    try {
        const verified = await jwtVerify(
            token,
            new TextEncoder().encode(getJwtSecretKey())
        )
        return verified.payload as unknown as UserJwtPayload
    } catch (err) {
        throw new AuthError('Your token has expired.')
    }
}

/**
 * Adds the user token cookie to a response.
 */
export async function setUserCookie(res: NextResponse,userInfo:any) {
    const token = await new SignJWT(userInfo)
        .setProtectedHeader({ alg: 'HS256' })
        .setJti(nanoid())
        .setIssuedAt()
        .setExpirationTime('1d')
        .sign(new TextEncoder().encode(getJwtSecretKey()))

    res.cookies.set(USER_TOKEN, token, {
        httpOnly: true,
        maxAge: 60 * 60 * 2, // 2 hours in seconds
    })

    return res
}

/**
 * Expires the user token cookie
 */
export function expireUserCookie(res: NextResponse) {
    res.cookies.set(USER_TOKEN, '', { httpOnly: true, maxAge: 0 })
    return res
}
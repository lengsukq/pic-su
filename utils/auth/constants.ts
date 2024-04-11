
export const USER_TOKEN = 'user-token'

const JWT_SECRET_KEY: string | undefined = process.env.JWT_SECRET_KEY!

export function getJwtSecretKey(): string {
    if (!JWT_SECRET_KEY || JWT_SECRET_KEY.length === 0) {
        throw new Error('环境变量JWT_SECRET_KEY未设置')
    }

    return JWT_SECRET_KEY
}
import { SignJWT, jwtVerify, type JWTVerifyResult } from 'jose'

const secretKey = process.env.JWT_SECRET;
if (!secretKey) {
  throw new Error("JWT_SECRET is not defined in the environment variables.");
}
const secret = new TextEncoder().encode(secretKey);

export interface JwtPayload {
  id: number
  email: string
  [key: string]: unknown
}

/**
* @param payload
* @param expiresIn
* @returns
*/

export async function generateToken(payload: JwtPayload, expiresIn: string = '30m', ): Promise<string> {
  const jwt = await new SignJWT(payload)
    .setProtectedHeader({alg: 'HS256', typ: 'JWT'})
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secret)
  return jwt
}

/**
* @param token
* @returns
*/

export async function verifyToken<T = JwtPayload>(token: string): Promise<JWTVerifyResult & {payload: T}> {
  const result = await jwtVerify(token, secret)
  return result as JWTVerifyResult & {payload: T}
}
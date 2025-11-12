import jwt, { JwtPayload } from 'jsonwebtoken';

const accessKey = process.env.JWT_SECRET!;
const refreshKey = process.env.JWT_REFRESH_SECRET!;

/**
 * jwt 발급
 * 
 * @param payload 
 * @param expiresIn 
 * @returns jwt
 */
export function generateAccessToken(payload: object, expiresIn: string = process.env.JWT_EXPIRES_IN as string) { 
  return jwt.sign(payload, accessKey, { expiresIn: expiresIn as jwt.SignOptions['expiresIn'] });
}

export function generateRefreshToken(payload: object, expiresIn: string = process.env.JWT_REFRESH_EXPIRES_IN as string) {
  return jwt.sign(payload, refreshKey, { expiresIn: expiresIn as jwt.SignOptions['expiresIn'] });
}

/**
 * jwt 검증
 * 
 * @param token 
 * @returns  
 */
export function verifyToken(token: string, isRefresh = false): JwtPayload | null {
  try {
    const secretKey = isRefresh ? refreshKey : accessKey;
    return jwt.verify(token, secretKey) as JwtPayload;
  } catch (err) {
    return null;
  }
}

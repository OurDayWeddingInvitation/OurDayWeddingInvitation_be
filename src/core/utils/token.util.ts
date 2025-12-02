import jwt, { JwtPayload } from 'jsonwebtoken';

function getAccessKey() {
  return process.env.JWT_SECRET!;
}

function getRefreshKey() {
  return process.env.JWT_REFRESH_SECRET!;
}
/**
 * jwt 발급
 * 
 * @param payload 
 * @param expiresIn 
 * @returns jwt
 */
export function generateAccessToken(payload: object, expiresIn: string = process.env.JWT_EXPIRES_IN as string) { 
  return jwt.sign(payload, getAccessKey(), { expiresIn: expiresIn as jwt.SignOptions['expiresIn'] });
}

export function generateRefreshToken(payload: object, expiresIn: string = process.env.JWT_REFRESH_EXPIRES_IN as string) {
  return jwt.sign(payload, getRefreshKey(), { expiresIn: expiresIn as jwt.SignOptions['expiresIn'] });
}

/**
 * jwt 검증
 * 
 * @param token 
 * @returns  
 */
export function verifyToken(token: string, isRefresh = false): JwtPayload | null {
  try {
    const secretKey = isRefresh ? getRefreshKey() : getAccessKey();
    return jwt.verify(token, secretKey) as JwtPayload;
  } catch (err) {
    return null;
  }
}

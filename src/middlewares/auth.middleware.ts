import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/token.util';
import { respondSuccess, respondError } from '../utils/response.util'

/**
 * JWT 인증 미들웨어
 * - Authorization: Bearer <token> 헤더에서 토큰 추출
 * - 검증 실패 시 401 응답
 */
export function authenticateJWT(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return respondError(res, 401, '인증 토큰이 없습니다.');
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);
  if (!decoded) {
    return respondError(res, 401, '유효하지 않은 토큰입니다.');
  }

  // 사용자 정보 req.user에 주입
  (req as any).user = decoded;
  next();
}

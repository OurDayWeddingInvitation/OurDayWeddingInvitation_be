import { Request, Response } from 'express';
import * as authService from './auth.service';
import { generateAccessToken, verifyToken } from '../../core/utils/token.util';
import { respondSuccess } from '../../core/utils/response.util';
import { AppError } from '@/core/errors/AppError';

export async function postAuthTokenRefresh(req: Request, res: Response) {
  const { refreshToken } = req.body;

  if (!refreshToken)
    throw new AppError(400, '리프레시 토큰이 없습니다.');

  const decoded = verifyToken(refreshToken, true);
  const user = await authService.getFreshToken(refreshToken);

  if (!decoded || !user)
    throw new AppError(400, '유효하지 않은 리프레시 토큰입니다.');

  // 새 accessToken 발급
  const newAccessToken = generateAccessToken({
    userId: user.userId,
    provider: user.lastProviderName,
  });

  return respondSuccess(res, 200, null, newAccessToken);
};
import { Request, Response } from 'express';
import * as authService from './auth.service';
import { generateAccessToken, verifyToken } from '../../core/utils/token';
import { AppError } from '@/core/errors/AppError';
import logger from '@/config/logger';

export async function postAuthTokenRefresh(req: Request, res: Response) {
  const { refreshToken } = req.body;
  logger.info("[auth.controller.ts][postAuthTokenRefresh] Start", { refreshToken })

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

  res.status(200).json({
    status: 200,
    error: null,
    messages: "토큰 갱신 성공",
    data: newAccessToken,
  });
};
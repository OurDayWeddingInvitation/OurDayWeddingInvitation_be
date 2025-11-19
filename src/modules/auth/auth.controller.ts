import { Request, Response } from 'express';
import * as authService from './auth.service';
import { generateAccessToken, verifyToken } from '../../utils/token.util';
import { respondSuccess, respondError } from '../../utils/response.util';

export async function postAuthTokenRefresh(req: Request, res: Response) {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken)
      return respondError(res, 400, '리프레시 토큰이 없습니다.');

    const decoded = verifyToken(refreshToken, true);
    const user = await authService.getFreshToken(refreshToken);

    if (!decoded || !user)
      return respondError(res, 400, '유효하지 않은 리프레시 토큰입니다.');

    // 새 accessToken 발급
    const newAccessToken = generateAccessToken({
      userId: user.userId,
      provider: user.lastProviderName,
    });

    return respondSuccess(res, 200, null, newAccessToken);

  } catch (err: any) {
    console.error(err);
    return respondError(res, 500, '서버 오류가 발생했습니다.');
  }
};
import { Router, Request, Response } from 'express';
import { verifyToken, generateAccessToken } from '../../../utils/token.util';
import prisma from '../../../config/prisma';

const router = Router();

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh Token으로 Access Token 재발급
 */
router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken)
      return res.status(400).json({ success: false, message: 'refreshToken이 필요합니다.' });

    const decoded = verifyToken(refreshToken, true);
    if (!decoded)
      return res.status(401).json({ success: false, message: '유효하지 않은 refreshToken' });

    // DB에 저장된 refreshToken과 일치하는지 확인
    const userSoc = await prisma.userSoc.findFirst({
      where: { refreshTkn: refreshToken },
      include: { user: true },
    });

    if (!userSoc)
      return res.status(401).json({ success: false, message: '등록되지 않은 refreshToken' });

    // 새 accessToken 발급
    const newAccessToken = generateAccessToken({
      userId: userSoc.userId,
      provider: userSoc.prvdrNm,
    });

    return res.status(200).json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ success: false, message: '서버 오류' });
  }
});

export default router;

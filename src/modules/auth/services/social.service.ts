import { naverAuth } from './providers/naver.service';
import prisma from '../../../config/prisma';
import jwt from 'jsonwebtoken';

export async function socialLogin(provider: string, code: string, state?: string) {
  if (provider !== 'naver') throw new Error('지원하지 않는 provider');

  const { tokens, userInfo } = await naverAuth({ code, state });

  const existing = await prisma.userSoc.findUnique({
    where: {
      prvdrNm_prvdrUserId: {
        prvdrNm: 'naver',
        prvdrUserId: userInfo.id,
      },
    },
    include: { user: true },
  });

  let user;
  let isNew = false;

  if (!existing) {
    isNew = true;
    user = await prisma.user.create({
      data: {
        userId: 'test', // 인코딩 필요
        userSoc: {
          create: {
            prvdrNm: 'naver',
            prvdrUserId: userInfo.id,
            accessTkn: tokens.access_token,
            refreshTkn: tokens.refresh_token,
            tknExprDt: new Date(Date.now() + tokens.expires_in * 1000),
          },
        },
      },
    });
  } else {
    user = await prisma.user.update({
      where: { userId: existing.userId },
      data: {
        userSoc: {
          update: {
            where: {
              prvdrNm_prvdrUserId: {
                prvdrNm: 'naver',
                prvdrUserId: userInfo.id,
              },
            },
            data: {
              accessTkn: tokens.access_token,
              refreshTkn: tokens.refresh_token,
              tknExprDt: new Date(Date.now() + tokens.expires_in * 1000),
            },
          },
        },
      },
    });
  }

  const jwtToken = jwt.sign({ userId: user.userId, prvdr: provider }, process.env.JWT_SECRET!, {
    expiresIn: '7d',
  });

  return { isNew, token: jwtToken, user: { userId: user.userId } };
}

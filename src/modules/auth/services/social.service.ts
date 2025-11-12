import { naverAuth } from './providers/naver.service';
import prisma from '../../../config/prisma';
import { generateAccessToken, generateRefreshToken } from '../../../utils/token.util';

export async function socialLogin(provider: string, code: string, state?: string) {
  let tokens, userInfo;
  switch (provider) {
    case 'naver':
      const naverAuthData = await naverAuth({ code, state });
      tokens = naverAuthData.tokens;
      userInfo = naverAuthData.userInfo;
      break;
    default:
      throw new Error(`지원하지 않는 provider: ${provider}`);
  }

  let user;
  let isNew = false;

  let userSoc = await prisma.userSoc.findUnique({
    where: {
      prvdrNm_prvdrUserId: {
        prvdrNm: 'naver',
        prvdrUserId: userInfo.id,
      },
    },
    include: { user: true },
  });

  
  console.log(userSoc?.userId);

  if (!userSoc) {
    isNew = true;
    user = await prisma.user.create({
      data: {
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
      include: { userSoc: true },
    });
  } else {
    user = await prisma.user.update({
      where: { userId: userSoc.userId },
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
      include: { userSoc: true },
    });
  }
  console.log(user)
  // JWT 발급
  const accessToken = generateAccessToken({ userId: user.userId, provider });
  const refreshToken = generateRefreshToken({ userId: user.userId, provider });

  const expiresInSec = 60 * 60;

  return {
    accessToken,
    refreshToken,
    expiresIn: expiresInSec,
    user: {
      userId: user.userId,
      provider: provider
    }
  };
}

import { naverAuth } from './providers/naver.service';
import prisma from '../../config/prisma';
import { generateAccessToken, generateRefreshToken } from '../../utils/token.util';

// 소셜 로그인 기능 <- 파라미터 수정 예정
export async function socialLogin(providerName: string, code: string, state?: string) {
  let userInfo, user, accessToken, refreshToken;
  switch (providerName) {
    case 'naver':
      const naverAuthData = await naverAuth({ code, state });
      userInfo = naverAuthData.userInfo;
      break;
    default:
      throw new Error(`지원하지 않는 제공자입니다.`);
  }

  let userSoc = await prisma.userSoc.findUnique({
    where: {
      providerName_providerUserId: {
        providerName: providerName,
        providerUserId: userInfo.id,
      },
    },
    include: { user: true },
  });
  
  if (!userSoc) {
    user = await prisma.user.create({
      data: {
        userSoc: {
          create: {
            providerName: providerName,
            providerUserId: userInfo.id,
          },
        },
      },
      include: { userSoc: true },
    });

    accessToken = generateAccessToken({ userId: user.userId, providerName });
    refreshToken = generateRefreshToken({ userId: user.userId, providerName });

    await prisma.user.update({
      where: { userId: user.userId},
      data: {
        lastProviderName: providerName,
        refreshToken: refreshToken
      }
    })
  } else {
    accessToken = generateAccessToken({ userId: userSoc.userId, providerName });
    refreshToken = generateRefreshToken({ userId: userSoc.userId, providerName });

    user = await prisma.user.update({
      where: { userId: userSoc.userId },
      data: {
        refreshToken
      },
      include: { userSoc: true },
    });
  }

  const expiresInSec = 60 * 60;

  return {
    accessToken,
    refreshToken,
    expiresIn: expiresInSec,
    user: {
      userId: user.userId,
      providerName: providerName
    }
  };
}

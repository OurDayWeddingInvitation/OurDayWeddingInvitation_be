import { naverAuth } from './providers/naver.service';
import prisma from '../../config/prisma';
import { generateAccessToken, generateRefreshToken } from '../../core/utils/token';
import { AppError } from '@/core/errors/AppError';
import logger from '@/config/logger';

// 소셜 로그인 기능 <- 파라미터 수정 예정
/**
 * 소셜 로그인을 처리합니다.
 * - providerName에 따라 외부 인증 프로바이더에서 사용자 정보를 조회하고,
 * - 기존 연동(userSoc)이 있으면 토큰을 갱신하고, 없으면 유저 및 연동 정보를 생성합니다.
 * @param providerName - 'naver' 등 소셜 제공자 이름
 * @param code - OAuth 코드
 * @param state - 선택적 state 값 (프로바이더에 따라 사용)
 * @returns accessToken, refreshToken, expiresIn, user 정보
 * @throws 지원하지 않는 제공자의 경우 에러 발생
 */
export async function socialLogin(providerName: string, code: string, state?: string) {
  logger.info("[social.service.ts][socialLogin] Start", { providerName, code, state })
  let userInfo, user, accessToken, refreshToken;
  switch (providerName) {
    case 'naver':
      // 외부 프로바이더(naver)로부터 사용자 정보 조회
      const naverAuthData = await naverAuth({ code, state });
      userInfo = naverAuthData.userInfo;
      logger.info("[social.service.ts][socialLogin] success naverAuth", { providerName, code, state, naverAuthData })
      break;
    default:
      throw new AppError(400, `지원하지 않는 제공자입니다.`);
  }

  // 이미 해당 소셜 계정과 연결된 userSoc가 있는지 조회
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
    // 연결 정보가 없으면 새 사용자 및 userSoc 레코드 생성
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
    logger.info("[social.service.ts][socialLogin] user, userSoc created", { userId: user.userId, providerName, providerUserId: userInfo.id })

    // 새 사용자용 토큰 생성
    accessToken = generateAccessToken({ userId: user.userId, providerName });
    refreshToken = generateRefreshToken({ userId: user.userId, providerName });
    logger.info("[social.service.ts][socialLogin] generate JWT", { userId: user.userId, accessToken, refreshToken })

    // 사용자에 refreshToken 및 lastProviderName 업데이트
    await prisma.user.update({
      where: { userId: user.userId},
      data: {
        userName: userInfo.name,
        lastProviderName: providerName,
        refreshToken
      }
    })
    logger.info("[social.service.ts][socialLogin] user lastProviderName and refreshToken updated", { userId: user.userId, lastProviderName: providerName, refreshToken })
  } else {
    // 기존 연결이 있으면 해당 사용자 기준으로 토큰 생성 및 refreshToken 갱신
    accessToken = generateAccessToken({ userId: userSoc.userId, providerName });
    refreshToken = generateRefreshToken({ userId: userSoc.userId, providerName });
    logger.info("[social.service.ts][socialLogin] generate JWT", { userId: userSoc.userId, accessToken, refreshToken })

    user = await prisma.user.update({
      where: { userId: userSoc.userId },
      data: {
        userName: userInfo.name,
        lastProviderName: providerName,
        refreshToken
      },
      include: { userSoc: true },
    });
    logger.info("[social.service.ts][socialLogin] user lastProviderName and refreshToken updated", { userId: user.userId, lastProviderName: providerName, refreshToken })
  }

  const expiresInSec = 60 * 60;


  logger.info("[social.service.ts][socialLogin] Complete", { userId: user.userId, lastProviderName: providerName, refreshToken })
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

import logger from '@/config/logger';
import prisma from '../../config/prisma';

/**
 * 리프래시 토큰으로 사용자 정보를 조회합니다.
 * - refreshToken과 일치하는 사용자를 찾아 userSoc 관계를 포함하여 반환합니다.
 * @param refreshToken - 조회할 리프래시 토큰 문자열
 * @returns user 레코드 또는 null
 */
export const getFreshToken = async (refreshToken: string) => {
  logger.info("[auth.service.ts][getFreshToken] Start", { refreshToken })
  return await prisma.user.findFirst({
    where: { refreshToken },
    include: { userSoc: true }
  });
};
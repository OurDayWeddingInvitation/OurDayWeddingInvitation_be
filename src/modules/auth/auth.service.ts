import prisma from '../../config/prisma';

/**
 * 리프래시 토큰 조회
 */
export const getFreshToken = async (refreshToken: string) => {
  return await prisma.user.findFirst({
    where: { refreshToken },
    include: { userSoc: true }
  });
};
import prisma from '../prisma/client';

/**
 * 모든 UserSoc 조회
 */
export const getAllUserSocs = async (userId: number) => {
  return await prisma.userSoc.findMany({
    where: { userId },
    select: {
      userId: true,
      socId: true,
      prvdrNm: true,
      prvdrUserId: true,
      scope: true,
    },
  });
};

/**
 * 단일 UserSoc 조회
 */
export const getUserSocById = async (userId: number, socId: number) => {
  return await prisma.userSoc.findUnique({
    where: { userId_socId: { userId, socId } },
    select: {
      userId: true,
      socId: true,
      prvdrNm: true,
      prvdrUserId: true,
      scope: true,
    },
  });
};

/**
 * UserSoc 생성
 */
export const createUserSoc = async (data: any) => {
  return await prisma.userSoc.create({
    data,
    select: {
      userId: true,
      socId: true,
      prvdrNm: true,
      prvdrUserId: true,
      scope: true,
    },
  });
};

/**
 * UserSoc 수정
 */
export const updateUserSoc = async (userId: number, socId: number, data: any) => {
  return await prisma.userSoc.update({
    where: { userId_socId: { userId, socId } },
    data,
    select: {
      userId: true,
      socId: true,
      prvdrNm: true,
      prvdrUserId: true,
      scope: true,
    },
  });
};

/**
 * UserSoc 삭제
 */
export const deleteUserSoc = async (userId: number, socId: number) => {
  return await prisma.userSoc.delete({
    where: { userId_socId: { userId, socId } },
  });
};

import prisma from '../prisma/client';

/**
 * 모든 User 조회
 */
export const getAllUsers = async () => {
  return await prisma.user.findMany({
    select: {
      userId: true,
    },
  });
};

/**
 * 단일 User 조회
 */
export const getUserById = async (userId: string) => {
  return await prisma.user.findUnique({
    where: { userId },
    select: {
      userId: true,
    },
  });
};

/**
 * User 생성
 */
export const createUser = async (data: any) => {
  return await prisma.user.create({
    data: {
      userId : data.userId,
    },
    select: {
      userId: true,
    },
  });
};

/**
 * User 수정
 */
export const updateUser = async (userId: string, data: any) => {
  return await prisma.user.update({
    where: { userId: userId },
    data: {
      userId : data.userId,
    } ,
    select: {
      userId: true,
    },
  });
};

/**
 * User 삭제
 */
export const deleteUser = async (userId: string) => {
  return await prisma.user.delete({
    where: { userId },
  });
};

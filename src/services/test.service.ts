/**
 * @file 서비스 계층 (Spring의 @Service 유사, Prisma ORM 사용)
 * @description 모든 비즈니스 로직을 처리 (DB 접근 포함)
 * 실제 데이터 처리, DB 호출 등을 담당
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * 전체 목록 조회
 */
export const getAllTests = async () => {
  return await prisma.test.findMany({
    orderBy: { id: 'asc' },
  });
};

/**
 * 단일 조회 
 */
export const getTestById = async (id: number) => {
  return await prisma.test.findUnique({
    where: { id },
  });
};

/**
 * 생성
 */
export const createTest = async (name: string, email?: string) => {
  return await prisma.test.create({
    data: { name, email },
  });
};

/**
 * 수정
 */
export const updateTest = async (id: number, name: string, email?: string) => {
  return await prisma.test.update({
    where: { id },
    data: { name, email },
  });
};

/**
 * 삭제
 */
export const deleteTest = async (id: number) => {
  return await prisma.test.delete({
    where: { id },
  });
};
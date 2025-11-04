/**
 * @file 서비스 계층 (Spring의 @Service 유사, Prisma ORM 사용)
 * 실제 데이터 처리, DB 호출 등을 담당
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * 모든 Test 데이터 조회
 */
export const getTestData = async () => {
  return await prisma.test.findMany({
    orderBy: { id: 'asc' },
  });
};

/**
 * 신규 Test 데이터 추가
 */
export const createTestData = async (name: string, email?: string) => {
  return await prisma.test.create({
    data: { name, email },
  });
};

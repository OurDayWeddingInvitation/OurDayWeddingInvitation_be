import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';
import logger from '@/config/logger';
import { level } from 'winston';

/**
 * 전역 에러 핸들러 미들웨어
 * - throw 된 에러를 한 곳에서 처리
 * - AppError는 상태코드/메시지 그대로 사용
 * - 그 외 예기치 못한 에러는 500으로 응답
 *
 * @param err - 발생한 에러 객체
 * @param req - Express Request
 * @param res - Express Response
 * @param next - 다음 미들웨어
 */
export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const error = err instanceof Error ? err : new Error(typeof err === "string" ? err : "Unknown error");

  // 공통 로그 데이터
  const logPayload = {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    body: req.body,
    query: req.query,
    params: req.params,
    message: error.message,
    stack: error.stack,
  };

  // 1) AppError 처리 (클라이언트가 예측 가능)
  if (err instanceof AppError) {
    logger.warn('[AppError]', {
      ...logPayload,
      statusCode: err.statusCode,
    });

    return res.status(err.statusCode).json({
      status: err.statusCode,
      error: {
        code: err.statusCode,
        messages: err.message
      },
      messages: null,
      data: null
    });
  }

  // 2) 그 외 예기치 못한 에러 처리 (서버 문제)
  logger.error('[UnhandledError]', logPayload);

  return res.status(500).json({
    status: 500,
    error: {
      code: 500,
      messages: '서버 오류가 발생했습니다.'
    },
    messages: null,
    data: null
  });
}

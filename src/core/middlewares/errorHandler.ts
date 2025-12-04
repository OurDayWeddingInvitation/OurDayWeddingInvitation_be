import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';

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
  console.error(err);

  if (err instanceof AppError) {
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

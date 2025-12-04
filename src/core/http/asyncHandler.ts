import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * 비동기 컨트롤러를 에러 안전하게 감싸주는 헬퍼
 * - async 함수 내부에서 throw된 에러를 next(err)로 전달
 *
 * @param handler - 비동기 Express 핸들러
 * @returns 에러 처리 래핑된 핸들러
 */
export const asyncHandler =
  (handler: (req: Request, res: Response, next: NextFunction) => Promise<any>): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };

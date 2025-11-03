/**
 * @file 컨트롤러 계층 (Spring의 @RestController 유사)
 * 요청 파라미터 처리 및 응답 반환 담당
 */
import { Request, Response } from 'express';
import { getTestData } from '../services/test.service.js';

export const getTest = (req: Request, res: Response) => {
  try {
    const data = getTestData();
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

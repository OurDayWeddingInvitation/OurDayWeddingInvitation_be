/**
 * @file 컨트롤러 계층 (Spring의 @RestController 유사)
 * 요청 파라미터 처리 및 응답 반환 담당
 */
import { Request, Response } from 'express';
import { createTestData, getTestData } from '../services/test.service.js';

export const getTest = async (req: Request, res: Response) => {
  try {
    const data = await getTestData();
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const postTest = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;
    const result = await createTestData(name, email);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
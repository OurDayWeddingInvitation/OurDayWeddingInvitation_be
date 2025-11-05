/**
 * @file 컨트롤러 계층 (Spring의 @RestController 유사)
 * 요청 파라미터 처리 및 응답 반환 담당
 */
import { Request, Response } from 'express';
import {
  getAllTests,
  getTestById,
  createTest,
  updateTest,
  deleteTest,
} from '../services/test.service.js';
import { REPLCommand } from 'repl';

/** 전체 목록 조회 */
export const getTests = async (req: Request, res: Response) => {
  try {
    const data = await getAllTests();
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/** 단일 조회 */
export const getTest = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const data = await getTestById(id);
    if (!data) {
      res.status(200).json({ success: false, message: 'Not found' });
      return;
    }
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/** 생성 */
export const postTest = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;
    const result = await createTest(name, email);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/** 수정 */
export const putTest = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { name, email } = req.body;
    const data = await updateTest(id, name, email);
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/** 삭제 */
export const deleteTestById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const data = await deleteTest(id);
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
import { Request, Response } from 'express';
import * as weddService from './wedd.service';
import { respondSuccess, respondError } from '../../utils/response.util'

/**
 * 사용자의 wedd 전체 조회
 */
export const getAllWedds = async (req: Request, res: Response) => {
  try {
    const { userId } = (req as any).user;
    const testUserId = req.params.userId;
    const wedds = await weddService.getAllWedds(userId);
    respondSuccess(res, 200, null, wedds);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: '청첩장 목록 조회 중 오류 발생', detail: error.message });
  }
}

/**
 * Wedd 단건 조회
 */
export const getWeddById = async (req: Request, res: Response) => {
  try {
    const weddingId = Number(req.params.weddingId);
    const wedd = await weddService.getWeddById(weddingId);
    respondSuccess(res, 200, null, wedd);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: '청첩장 조회 중 오류 발생', detail: error.message });
  }
};

/**
 * Wedd 단건 조회
 */
export const getWeddById2= async (req: Request, res: Response) => {
  try {
    const weddingId = Number(req.params.weddingId);
    const wedd = await weddService.getWeddById2(weddingId);
    respondSuccess(res, 200, null, wedd);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: '청첩장 조회 중 오류 발생', detail: error.message });
  }
};

/**
 * Wedd 생성
 */
export const createWedd = async (req: Request, res: Response) => {
  try {
    const { userId } = (req as any).user;
    const wedd = await weddService.createWedd(userId, req.body);
    respondSuccess(res, 200, null, wedd);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: '청첩장 생성 중 오류 발생', detail: error.message });
  }
};

/**
 * Wedd 교체
 */
export const replaceWedd = async (req: Request, res: Response) => {
  try {
    delete req.body.weddingId;
    const weddingId = Number(req.params.weddingId);
    const wedd = await weddService.replaceWedd(weddingId, req.body);
    respondSuccess(res, 200, null, wedd);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: '청첩장 교체 중 오류 발생', detail: error.message });
  }
};

/**
 * Wedd 수정
 */
export const updateWeddSection = async (req: Request, res: Response) => {
  try {
    delete req.body.weddingId;
    const weddingId = Number(req.params.weddingId);
    const sectionId = req.params.sectionId;
    const wedd = await weddService.updateWeddSection(weddingId, sectionId, req.body);
    respondSuccess(res, 200, null, wedd);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: '청첩장 수정 중 오류 발생', detail: error.message });
  }
};

/**
 * Wedd 삭제
 */
export const deleteWedd = async (req: Request, res: Response) => {
  try {
    const weddingId = Number(req.params.weddingId);
    await weddService.deleteWedd(weddingId);
    respondSuccess(res, 200, null, );
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: '청첩장 삭제 중 오류 발생', detail: error.message });
  }
};

/**
 * 청첩장 섹션 순서 변경
 */
export const updateWeddSectsSet = async (req: Request, res: Response) => {
  try {
    delete req.body.weddingId;
    const weddingId = Number(req.params.weddingId);
    const wedd = await weddService.updateWeddSectsSet(weddingId, req.body);
    respondSuccess(res, 200, null, wedd);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: '청첩장 수정 중 오류 발생', detail: error.message });
  }
};
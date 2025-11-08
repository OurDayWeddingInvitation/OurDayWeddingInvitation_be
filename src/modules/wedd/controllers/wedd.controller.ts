import { Request, Response } from 'express';
import * as weddService from '../services/wedd.service';

/**
 * 사용자의 wedd 전체 조회
 */
export const getAllWedds = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const wedds = await weddService.getAllWedds(userId);
    res.status(200).json({ success: true, data: wedds });
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ success: false, message: '청첩장 목록 조회 중 오류 발생', detail: error.message });
  }
}

/**
 * Wedd 단건 조회
 */
export const getWeddById = async (req: Request, res: Response) => {
  try {
    const weddId = Number(req.params.weddId);
    const wedd = await weddService.getWeddById(weddId);
    res.status(200).json({ success: true, data: wedd });
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ success: false, message: '청첩장 조회 중 오류 발생', detail: error.message });
  }
};

/**
 * Wedd 생성
 */
export const createWedd = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const wedd = await weddService.createWedd(userId, req.body);
    res.status(200).json({ success: true, data: wedd });
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ success: false, message: '청첩장 생성 중 오류 발생', detail: error.message });
  }
};

/**
 * Wedd 수정
 */
export const updateWedd = async (req: Request, res: Response) => {
  try {
    delete req.body.weddId;
    const weddId = Number(req.params.weddId);
    const wedd = await weddService.updateWedd(weddId, req.body);
    res.status(200).json({ success: true, data: wedd });
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ success: false, message: '청첩장 수정 중 오류 발생', detail: error.message });
  }
};

/**
 * Wedd 삭제
 */
export const deleteWedd = async (req: Request, res: Response) => {
  try {
    const weddId = Number(req.params.weddId);
    await weddService.deleteWedd(weddId);
    res.status(200).json({ success: true, message: '삭제 완료' });
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ success: false, message: '청첩장 삭제 중 오류 발생', detail: error.message });
  }
};

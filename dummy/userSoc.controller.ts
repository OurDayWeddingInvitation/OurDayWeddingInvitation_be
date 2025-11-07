import { Request, Response } from 'express';
import * as userSocService from '../services/userSoc.service';

/**
 * UserSoc 전체 조회
 */
export const getAllUserSocs = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId);
    const userSocs = await userSocService.getAllUserSocs(userId);
    res.status(200).json({ success: true, data: userSocs });
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ success: false, message: '소셜 계정 조회 중 오류 발생', detail: error.message });
  }
};

/**
 * UserSoc 단건 조회
 */
export const getUserSocById = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId);
    const socId = Number(req.params.socId);
    const userSoc = await userSocService.getUserSocById(userId, socId);
    res.status(200).json({ success: true, data: userSoc });
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ success: false, message: '소셜 계정 조회 중 오류 발생', detail: error.message });
  }
};

/**
 * UserSoc 생성
 */
export const createUserSoc = async (req: Request, res: Response) => {
  try {
    const userSoc = await userSocService.createUserSoc(req.body);
    res.status(200).json({ success: true, data: userSoc });
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ success: false, message: '소셜 계정 생성 중 오류 발생', detail: error.message });
  }
};

/**
 * UserSoc 수정
 */
export const updateUserSoc = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId);
    const socId = Number(req.params.socId);
    const userSoc = await userSocService.updateUserSoc(userId, socId, req.body);
    res.status(200).json({ success: true, data: userSoc });
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ success: false, message: '소셜 계정 수정 중 오류 발생', detail: error.message });
  }
};

/**
 * UserSoc 삭제
 */
export const deleteUserSoc = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId);
    const socId = Number(req.params.socId);
    await userSocService.deleteUserSoc(userId, socId);
    res.status(200).json({ success: true, message: '삭제 완료' });
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ success: false, message: '소셜 계정 삭제 완료', detail: error.message });
  }
};

import { Request, Response } from 'express';
import * as userService from '../services/user.service';

/**
 * User 전체 조회
 */
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({ success: true, data: users });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: '사용자 조회 중 오류 발생', detail: error.message });
  }
};

/**
 * User 단건 조회
 */
export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await userService.getUserById(Number(req.params.id));
    res.status(200).json({ success: true, data: user });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: '사용자 조회 중 오류 발생', detail: error.message });
  }
};

/**
 * User 생성
 */
export const createUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.createUser(req.body);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: '사용자 생성 중 오류 발생', detail: error.message });
  }
};

/**
 * User 수정
 */
export const updateUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.updateUser(Number(req.params.id), req.body);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: '사용자 수정 중 오류 발생', detail: error.message });
  }
};

/**
 * User 삭제
 */
export const deleteUser = async (req: Request, res: Response) => {
  try {
    await userService.deleteUser(Number(req.params.id));
    res.status(200).json({ success: true, message: '사용자 삭제 완료' });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: '사용자 삭제 중 오류 발생', detail: error.message });
  }
};

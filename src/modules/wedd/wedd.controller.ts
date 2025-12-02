import { Request, Response } from 'express';
import * as weddService from './wedd.service';
import { respondSuccess } from '../../core/utils/response.util'

/**
 * 사용자의 wedd 전체 조회
 */
export const getAllWedds = async (req: Request, res: Response) => {
  const { userId } = req.user;
  const wedds = await weddService.getAllWedds(userId);
  respondSuccess(res, 200, null, wedds);
}

/**
 * Wedd 단건 조회
 */
export const getWeddById = async (req: Request, res: Response) => {
  const weddingId = Number(req.params.weddingId);
  const wedd = await weddService.getWeddById(weddingId);
  respondSuccess(res, 200, null, wedd);
};

/**
 * Wedd 단건 조회
 */
export const getWeddById2= async (req: Request, res: Response) => {
  const weddingId = Number(req.params.weddingId);
  const wedd = await weddService.getWeddById2(weddingId);
  respondSuccess(res, 200, null, wedd);
};

/**
 * Wedd 생성
 */
export const createWedd = async (req: Request, res: Response) => {
  const { userId } = req.user;
  const wedd = await weddService.createWedd(userId);
  respondSuccess(res, 200, null, wedd);
};

/**
 * Wedd 교체
 */
export const replaceWedd = async (req: Request, res: Response) => {
  const weddingId = Number(req.params.weddingId);
  const wedd = await weddService.replaceWedd(weddingId, req.body);
  respondSuccess(res, 200, null, wedd);
};

/**
 * Wedd 수정
 */
export const updateWeddSection = async (req: Request, res: Response) => {
  const weddingId = Number(req.params.weddingId);
  const sectionId = req.params.sectionId;
  const wedd = await weddService.updateWeddSection(weddingId, sectionId, req.body);
  respondSuccess(res, 200, null, wedd);
};

/**
 * Wedd 삭제
 */
export const deleteWedd = async (req: Request, res: Response) => {
  const weddingId = Number(req.params.weddingId);
  await weddService.deleteWedd(weddingId);
  respondSuccess(res, 200, null, );
};

/**
 * 청첩장 섹션 순서 변경
 */
export const updateWeddSectsSet = async (req: Request, res: Response) => {
  const weddingId = Number(req.params.weddingId);
  const wedd = await weddService.updateWeddSectsSet(weddingId, req.body);
  respondSuccess(res, 200, null, wedd);
};
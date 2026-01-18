import { Request, Response } from 'express';
import * as weddService from './wedd.service';
import logger from '@/config/logger';

/**
 * 사용자의 청첩장 전체 조회
 */
export const getAllWedds = async (req: Request, res: Response) => {
  const { userId } = req.user;
  logger.info("[wedd.controller.ts][getAllWedds] Start", { userId })
  const wedds = await weddService.getAllWedds(userId);
  res.status(200).json({
    status: 200,
    error: null,
    messages: "청첩장 목록 조회 성공",
    data: wedds,
  });
}

/**
 * 청첩장 적용본 단건 조회
 */
export const getWeddById = async (req: Request, res: Response) => {
  logger.info("[wedd.controller.ts][getWeddById] Start")
  const weddingId = req.params.weddingId;
  const wedd = await weddService.getWeddById(weddingId);
  res.status(200).json({
    status: 200,
    error: null,
    messages: "청첩장 조회 성공",
    data: wedd,
  });
};

/**
 * 청첩장 단건 조회
 */
export const getWeddEditById = async (req: Request, res: Response) => {
  const { userId } = req.user;
  logger.info("[wedd.controller.ts][getWeddEditById] Start", { userId })
  const weddingId = req.params.weddingId;
  const wedd = await weddService.getWeddEditById(userId, weddingId);
  res.status(200).json({
    status: 200,
    error: null,
    messages: "청첩장 조회 성공",
    data: wedd,
  });
};

/**
 * 청첩장 생성
 */
export const createWedd = async (req: Request, res: Response) => {
  const { userId } = req.user;
  logger.info("[wedd.controller.ts][createWedd] Start", { userId })
  const wedd = await weddService.createWedd(userId);
  res.status(200).json({
    status: 200,
    error: null,
    messages: "청첩장 생성 성공",
    data: wedd,
  });
};

/**
 * 청첩장 전체 교체
 */
export const replaceWedd = async (req: Request, res: Response) => {
  const { userId } = req.user;
  logger.info("[wedd.controller.ts][replaceWedd] Start", { userId })
  const weddingId = req.params.weddingId;
  const wedd = await weddService.replaceWedd(userId, weddingId, req.body);
  res.status(200).json({
    status: 200,
    error: null,
    messages: "청첩장 교체 성공",
    data: wedd,
  });
};

/**
 * 청첩장 제목 수정
 */
export const updateWeddTitle = async (req: Request, res: Response) => {
  const { userId } = req.user;
  logger.info("[wedd.controller.ts][updateWeddTitle] Start", { userId })
  const weddingId = req.params.weddingId;
  const wedd = await weddService.updateWeddTitle(userId, weddingId, req.body);
  res.status(200).json({
    status: 200,
    error: null,
    messages: "청첩장 제목 수정 성공",
    data: wedd,
  });
};

/**
 * 청첩장 섹션 단위 수정
 */
export const updateWeddSection = async (req: Request, res: Response) => {
  const { userId } = req.user;
  logger.info("[wedd.controller.ts][updateWeddSection] Start", { userId })
  const weddingId = req.params.weddingId;
  const sectionId = req.params.sectionId;
  const wedd = await weddService.updateWeddSection(userId, weddingId, sectionId, req.body);
  res.status(200).json({
    status: 200,
    error: null,
    messages: "청첩장 수정 성공",
    data: wedd,
  });
};

/**
 * 청첩장 삭제
 */
export const deleteWedd = async (req: Request, res: Response) => {
  const { userId } = req.user;
  logger.info("[wedd.controller.ts][deleteWedd] Start", { userId })
  const weddingId = req.params.weddingId;
  await weddService.deleteWedd(userId, weddingId);
  res.status(200).json({
    status: 200,
    error: null,
    messages: "청첩장 삭제 성공",
    data: null,
  });
};

/**
 * 청첩장 섹션 순서 및 표시여부 변경
 */
export const updateWeddSectsSet = async (req: Request, res: Response) => {
  const { userId } = req.user;
  logger.info("[wedd.controller.ts][updateWeddSectsSet] Start", { userId })
  const weddingId = req.params.weddingId;
  const wedd = await weddService.updateWeddSectsSet(userId, weddingId, req.body);
  res.status(200).json({
    status: 200,
    error: null,
    messages: "청첩장 섹션 순서 변경 성공",
    data: wedd,
  });
};

/**
 * 청첩장 적용
 */
export const applyWedd = async (req: Request, res: Response) => {
  const { userId } = req.user;
  logger.info("[wedd.controller.ts][applyWedd] Start", { userId })
  const weddingId = req.params.weddingId;
  const wedd = await weddService.applyWedd(userId, weddingId);
  res.status(200).json({
    status: 200,
    error: null,
    messages: "청첩장 적용 성공",
    data: wedd,
  });
};






/**
 * 청첩장 단건 조회(테스트)
 */
export const getWeddById2= async (req: Request, res: Response) => {
  const { userId } = req.user;
  logger.info("[wedd.controller.ts][getWeddById2] Start", { userId })
  const weddingId = req.params.weddingId;
  const wedd = await weddService.getWeddById2(weddingId);
  res.status(200).json({
    status: 200,
    error: null,
    messages: "청첩장 조회 성공",
    data: wedd,
  });
};
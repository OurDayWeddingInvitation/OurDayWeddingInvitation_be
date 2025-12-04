import { Request, Response } from 'express';
import * as weddService from './wedd.service';

/**
 * 사용자의 wedd 전체 조회
 */
export const getAllWedds = async (req: Request, res: Response) => {
  const { userId } = req.user;
  const wedds = await weddService.getAllWedds(userId);
  res.status(200).json({
    status: 200,
    error: null,
    messages: "청첩장 목록 조회 성공",
    data: wedds,
  });
}

/**
 * Wedd 단건 조회
 */
export const getWeddById = async (req: Request, res: Response) => {
  const weddingId = Number(req.params.weddingId);
  const wedd = await weddService.getWeddById(weddingId);
  res.status(200).json({
    status: 200,
    error: null,
    messages: "청첩장 조회 성공",
    data: wedd,
  });
};

/**
 * Wedd 단건 조회
 */
export const getWeddById2= async (req: Request, res: Response) => {
  const weddingId = Number(req.params.weddingId);
  const wedd = await weddService.getWeddById2(weddingId);
  res.status(200).json({
    status: 200,
    error: null,
    messages: "청첩장 조회 성공",
    data: wedd,
  });
};

/**
 * Wedd 생성
 */
export const createWedd = async (req: Request, res: Response) => {
  const { userId } = req.user;
  const wedd = await weddService.createWedd(userId);
  res.status(200).json({
    status: 200,
    error: null,
    messages: "청첩장 생성 성공",
    data: wedd,
  });
};

/**
 * Wedd 교체
 */
export const replaceWedd = async (req: Request, res: Response) => {
  const weddingId = Number(req.params.weddingId);
  const wedd = await weddService.replaceWedd(weddingId, req.body);
  res.status(200).json({
    status: 200,
    error: null,
    messages: "청첩장 교체 성공",
    data: wedd,
  });
};

/**
 * Wedd 수정
 */
export const updateWeddSection = async (req: Request, res: Response) => {
  const weddingId = Number(req.params.weddingId);
  const sectionId = req.params.sectionId;
  const wedd = await weddService.updateWeddSection(weddingId, sectionId, req.body);
  res.status(200).json({
    status: 200,
    error: null,
    messages: "청첩장 수정 성공",
    data: wedd,
  });
};

/**
 * Wedd 삭제
 */
export const deleteWedd = async (req: Request, res: Response) => {
  const weddingId = Number(req.params.weddingId);
  await weddService.deleteWedd(weddingId);
  res.status(200).json({
    status: 200,
    error: null,
    messages: "청첩장 삭제 성공",
    data: null,
  });
};

/**
 * 청첩장 섹션 순서 변경
 */
export const updateWeddSectsSet = async (req: Request, res: Response) => {
  const weddingId = Number(req.params.weddingId);
  const wedd = await weddService.updateWeddSectsSet(weddingId, req.body);
  res.status(200).json({
    status: 200,
    error: null,
    messages: "청첩장 섹션 순서 변경 성공",
    data: wedd,
  });
};
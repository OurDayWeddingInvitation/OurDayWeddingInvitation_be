import { Request, Response } from 'express';
import * as mediaService from './media.service';
import { AppError } from '../../core/errors/AppError';
import logger from '@/config/logger';

export const getAllMediaEdit = async (req: Request, res: Response) => {
  const { userId } = req.user;
  logger.info("[wedd.media.ts][getAllMediaEdit] Start", { userId })
  const weddingId = req.params.weddingId;
  const mediaArray = await mediaService.getAllMediaEdit(userId, weddingId);
  res.status(200).json({
    status: 200,
    error: null,
    messages: "미디어 목록 조회 성공",
    data: mediaArray,
  });
}

export const getAllMedia = async (req: Request, res: Response) => {
  logger.info("[wedd.media.ts][getAllMedia] Start")
  const weddingId = req.params.weddingId;
  const mediaArray = await mediaService.getAllMedia(weddingId);

  res.status(200).json({
    status: 200,
    error: null,
    messages: "미디어 목록 조회 성공",
    data: mediaArray,
  });
}

export const uploadMedia = async (req: Request, res: Response) => {
  const { userId } = req.user;
  logger.info("[wedd.media.ts][postMedia] Start", { userId })
  const weddingId = req.params.weddingId;
  const metadata = req.body;

  const reqFiles = req.files as { [fieldname: string]: Express.Multer.File[] };
  const file = reqFiles?.file?.[0];
  const fileList = reqFiles?.files ?? [];

  if (!file && fileList.length === 0)
    throw new AppError(400, '파일이 없습니다.');

  let media;;
  if(file){
    media = await mediaService.uploadSingleMedia(userId, weddingId, metadata, file);
  }else if(fileList.length > 0){
    media = await mediaService.uploadMultipleMedia(userId, weddingId, metadata, fileList);
  }

  res.status(200).json({
    status: 200,
    error: null,
    messages: '미디어 업로드 성공',
    data: media,
  });
}

export const croppedMedia = async (req: Request, res: Response) => {
  const { userId } = req.user;
  logger.info("[wedd.media.ts][croppedMedia] Start", { userId })
  const weddingId = req.params.weddingId;
  const mediaId = Number(req.params.mediaId);
  // const metadata = JSON.parse(req.body);

  const file = req.file as Express.Multer.File;

  if (!file)
    throw new AppError(400, '파일이 없습니다.');

  const result = await mediaService.croppedMedia(userId, weddingId, mediaId, file);

  res.status(200).json({
    status: 200,
    error: null,
    messages: '미디어 수정 성공',
    data: result,
  });
}

export const reorderMedia = async (req: Request, res: Response) => {
  const { userId } = req.user;
  logger.info("[wedd.media.ts][reorderMedia] Start", { userId })
  const weddingId = req.params.weddingId;
  await mediaService.reorderMedia(userId, weddingId, req.body.media);
  res.status(200).json({
    status: 200,
    error: null,
    messages: '순서 변경 완료',
    data: null,
  });
}

export const deleteMedia = async (req: Request, res: Response) => {
  const { userId } = req.user;
  logger.info("[wedd.media.ts][deleteMedia] Start", { userId })
  const weddingId = req.params.weddingId;
  const mediaId = Number(req.params.mediaId);

  await mediaService.deleteMedia(userId, weddingId, mediaId);

  res.status(200).json({
    status: 200,
    error: null,
    messages: '삭제 완료',
    data: null,
  });
}

export const deleteByTypeMedia = async (req: Request, res: Response) => {
  const { userId } = req.user;
  logger.info("[wedd.media.ts][deleteByTypeMedia] Start", { userId })
  const weddingId = req.params.weddingId;
  const imageType = req.body.imageType;

  await mediaService.deleteByTypeMedia(userId, weddingId, imageType);

  res.status(200).json({
    status: 200,
    error: null,
    messages: '이미지 타입 전체 삭제 완료',
    data: null,
  });
}
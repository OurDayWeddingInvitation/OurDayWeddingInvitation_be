import { Request, Response } from 'express';
import * as mediaService from './media.service';
import { respondSuccess } from '../../core/utils/response.util'
import { AppError } from '../../core/errors/AppError';

export const getAllMedia = async (req: Request, res: Response) => {
  const weddingId = Number(req.params.weddingId);
  const mediaArray = await mediaService.getAllMedia(weddingId);

  return respondSuccess(res, 200, '', mediaArray);
}

export const postMedia = async (req: Request, res: Response) => {
  const weddingId = Number(req.params.weddingId);
  const metadata = req.body;

  const file = req.file as Express.Multer.File;

  if (!file)
    throw new AppError(400, '파일이 없습니다.');

  const media = await mediaService.uploadMedia(weddingId, metadata, file);

  return respondSuccess(res, 200, '업로드 성공', media);
}

export const replaceMedia = async (req: Request, res: Response) => {
  const weddingId = Number(req.params.weddingId);
  const mediaId = Number(req.params.mediaId);
  // const metadata = JSON.parse(req.body);

  const file = req.file as Express.Multer.File;

  if (!file)
    throw new AppError(400, '파일이 없습니다.');

  const result = await mediaService.replaceMedia(weddingId, mediaId, file);

  return respondSuccess(res, 200, '업로드 성공', result);
}

export const reorderMedia = async (req: Request, res: Response) => {
  const weddingId = Number(req.params.weddingId);
  await mediaService.reorderMedia(weddingId, req.body.media);
  return respondSuccess(res, 200, '수정 성공', );
}

export const deleteMedia = async (req: Request, res: Response) => {
  const weddingId = Number(req.params.weddingId);
  const mediaId = Number(req.params.mediaId);

  await mediaService.deleteMedia(weddingId, mediaId);

  return respondSuccess(res, 200, '삭제 완료', );
}

import { Request, Response } from 'express';
import * as mediaService from './media.service';
import { respondSuccess, respondError } from '../../utils/response.util'

export const getAllMedia = async (req: Request, res: Response) => {
  try {
    const weddingId = Number(req.params.weddingId);
    const mediaArray = await mediaService.getAllMedia(weddingId);

    return respondSuccess(res, 200, '', mediaArray);
  } catch (err: any) {
    respondError(res, 500, '');
  }
}

export const postMedia = async (req: Request, res: Response) => {
  try {
    const weddingId = Number(req.params.weddingId);
    // const metadata = JSON.parse(req.body);
    const metadata = req.body;

    const file = req.file as Express.Multer.File;

    if (!file)
      return res.status(400).json({ message: '파일이 없습니다.' });

    const media = await mediaService.uploadMedia(weddingId, metadata, file);

    return respondSuccess(res, 200, '업로드 성공', media);
  } catch (err: any) {
    console.error('Media Upload Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
}

export const replaceMedia = async (req: Request, res: Response) => {
  try {
    const weddingId = Number(req.params.weddingId);
    const mediaId = Number(req.params.mediaId);
    // const metadata = JSON.parse(req.body);

    const file = req.file as Express.Multer.File;

    if (!file)
      return res.status(400).json({ message: '파일이 없습니다.' });

    const result = await mediaService.replaceMedia(weddingId, mediaId, file);

    return respondSuccess(res, 200, '업로드 성공', result);
  } catch (err: any) {
    console.error('Media Upload Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
}

export const updateMedia = async (req: Request, res: Response) => {
  try {
    const weddingId = Number(req.params.weddingId);
    await mediaService.updateMedia(weddingId, req.body.media);
    return respondSuccess(res, 200, '수정 성공', );
  } catch (err: any) {
    console.error('Media Upload Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
}

export const deleteMedia = async (req: Request, res: Response) => {
  try {
    const weddingId = Number(req.params.weddingId);
    const mediaId = Number(req.params.mediaId);

    await mediaService.deleteMedia(weddingId, mediaId);

    return respondSuccess(res, 200, '삭제 완료', );
  } catch (err: any) {
    console.error('Media Upload Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
}

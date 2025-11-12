import { Request, Response } from 'express';
import { uploadMedia } from '../services/media.service';

export async function postMediaUpload(req: Request, res: Response) {
  try {
    const file = req.file;
    const { weddId, imgType, displayOrdr } = req.body;

    if (!file) return res.status(400).json({ message: '파일이 없습니다.' });

    const result = await uploadMedia({
      weddId: Number(weddId),
      imgType,
      file,
      displayOrdr: Number(displayOrdr),
    });

    return res.status(200).json({
      success: true,
      message: '업로드 성공',
      data: result?.data,
    });
  } catch (err: any) {
    console.error('Media Upload Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
}

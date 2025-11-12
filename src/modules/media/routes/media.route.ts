import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { postMediaUpload } from '../controllers/media.controller';
import { authenticateJWT } from '../../../middlewares/auth.middleware';

const router = Router();

// 파일 저장 경로 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.resolve('uploads')),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(36).substring(2, 9)}${ext}`);
  },
});

const upload = multer({ storage });

/**
 * @swagger
 * /api/v1/media/upload:
 *   post:
 *     summary: 이미지 파일 업로드
 *     description: 업로드된 이미지를 서버에 저장하고 DB에 등록합니다.
 *     tags: [Media]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: 업로드할 이미지 파일
 *               weddId:
 *                 type: integer
 *                 description: 청첩장 ID
 *                 example: 1
 *               imgType:
 *                 type: string
 *                 description: "이미지 타입 (예: main, gallery)"
 *                 example: main
 *               displayOrdr:
 *                 type: integer
 *                 description: 이미지 표시 순서
 *                 example: 1
 *     responses:
 *       200:
 *         description: 업로드 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WeddMediaResponse'
 */
router.post('/upload', authenticateJWT, upload.single('file'), postMediaUpload);

export default router;

import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import * as mediaCotroller from './media.controller';

const router = Router();

// 파일 임시저장
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.resolve('tempUploads')),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(36).substring(2, 9)}${ext}`);
  },
});

const upload = multer({ storage });
const uploads = multer({ storage }).any();

/**
 * @swagger
 * tags:
 *   name: Media
 *   description: 이미지 업로드 및 관리 API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     media:
 *       type: object
 *       properties:
 *         mediaId: { type: integer, example: 3 }
 *         imageType: { type: string, example: mainImage }
 *         displayOrder: { type: integer, example: 1 }
 *         originalUrl: { type: string, example: "url/orgImage.jpg" }
 *         editedUrl: { type: string, example: "url/croppedImage.jpg" }
 */

/**
 * @swagger
 * /v1/weddings/{weddingId}/media:
 *   get:
 *     summary: 모든 이미지 조회
 *     description: 청첩장의 모든 이미지정보를 가져옵니다.
 *     tags: [Media]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: weddingId
 *         in: path
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: integer, example: 200 }
 *                 error: { type: string, nullable: true, example: null }
 *                 messages: { type: string, nullable: true, example: null }
 *                 data:
 *                   type: array
 *                   description: wedd 테이블 리스트 (간단 정보)
 *                   items:
 *                     $ref: '#/components/schemas/media'
 */
router.get('/:weddingId/media', mediaCotroller.getAllMedia);

/**
 * @swagger
 * /v1/weddings/{weddingId}/media:
 *   post:
 *     summary: 새 이미지 업로드
 *     description: 단일 이미지를 업로드하고 DB에 저장합니다.
 *     tags: [Media]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: weddingId
 *         schema:
 *           type: integer
 *         required: true
 *         description: 청첩장 ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *               - imageType
 *               - displayOrder
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               imageType:
 *                 type: string
 *                 description: 이미지 타입(mainImage, kakaoThumbnailImage, linkThumbnailImage, groomImage, brideImage, groomParentsImage, brideParentsImage, galleryImage, flipbookImage)
 *                 example: "gallery"
 *               displayOrder:
 *                 type: integer
 *                 description: 노출 순서
 *                 example: 1
 *     responses:
 *       200:
 *         description: 업로드 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: integer, example: 200 }
 *                 error: { type: string, nullable: true, example: null }
 *                 messages: { type: string, nullable: true, example: "업로드 성공" }
 *                 data:
 *                   type: object
 *                   example:
 *                     mediaId: 1
 *                     imageType: "gallery"
 *                     originalUrl: "/uploads/wedding/1/main.png"
 */
router.post('/:weddingId/media', upload.single('file'), mediaCotroller.postMedia);

/**
 * @swagger
 * /v1/weddings/{weddingId}/media/reorder:
 *   patch:
 *     summary: 이미지 순서 변경
 *     description: 파일 업로드 없이 이미지의 displayOrder만 수정합니다.
 *     tags: [Media]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: weddingId
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               media:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     mediaId: { type: integer, example: 3 }
 *                     displayOrder: { type: integer, example: 1 }
 *     responses:
 *       200:
 *         description: 순서 변경 성공
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 status: { type: integer, example: 200 }
 *                 error: { type: string, nullable: true, example: null }
 *                 messages: { type: string, nullable: true, example: "정렬 완료" }
 *                 data:
 *                   example: null
 */
router.patch('/:weddingId/media/reorder', mediaCotroller.reorderMedia);

/**
 * @swagger
 * /v1/weddings/{weddingId}/media/{mediaId}/cropped:
 *   put:
 *     summary: 수정된 이미지 저장
 *     description: 수정된 이미지를 저장합니다
 *     tags: [Media]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: weddingId
 *         schema:
 *           type: integer
 *         required: true
 *         description: 청첩장 ID
 *       - in: path
 *         name: mediaId
 *         schema:
 *           type: integer
 *         required: true
 *         description: 미디어 ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: 이미지 수정 완료
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: integer, example: 200 }
 *                 error: { type: string, nullable: true, example: null }
 *                 messages: { type: string, nullable: true, example: "저장되었습니다." }
 *                 data:
 *                   type: object
 *                   example:
 *                     count: 5
 */
router.put('/:weddingId/media/:mediaId/cropped', upload.single('file'), mediaCotroller.replaceMedia);

/**
 * @swagger
 * /v1/weddings/{weddingId}/media/{mediaId}:
 *   delete:
 *     summary: 이미지 삭제
 *     description: DB 삭제 및 파일 삭제까지 함께 수행됩니다.
 *     tags: [Media]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: weddingId
 *         in: path
 *         required: true
 *         schema: { type: integer }
 *       - name: mediaId
 *         in: path
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 status: { type: integer, example: 200 }
 *                 error: { type: string, nullable: true, example: null }
 *                 messages: { type: string, nullable: true, example: "삭제 성공" }
 *                 data:
 *                   example: null
 */
router.delete('/:weddingId/media/:mediaId', mediaCotroller.deleteMedia);

export default router;

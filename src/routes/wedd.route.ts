import { Router } from 'express';
import * as weddController from '../controllers/wedd.controller';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Wedd
 *   description: 청첩장 기본정보 API
 */

/**
 * @swagger
 * tags:
 *   - name: Wedd
 *     description: 청첩장 생성 및 관리 API
 * components:
 *   schemas:
 *     WeddMedia:
 *       type: object
 *       properties:
 *         weddId:
 *           type: integer
 *           description: 청첩장 ID
 *         mediaId:
 *           type: integer
 *           description: 미디어 ID
 *         imgType:
 *           type: string
 *           description: 이미지 타입 (MAIN / GALLERY 등)
 *         displayOrdr:
 *           type: integer
 *           description: 노출 순서
 *         orgUrl:
 *           type: string
 *           description: 원본 이미지 URL
 *         editUrl:
 *           type: string
 *           description: 편집 이미지 URL
 *         fileExtsn:
 *           type: string
 *           description: 파일 확장자
 *         fileSize:
 *           type: integer
 *           description: 파일 크기(byte)
 *       example:
 *         weddId: 1
 *         mediaId: 101
 *         imgType: 'MAIN'
 *         displayOrdr: 1
 *         orgUrl: 'https://cdn.example.com/original.jpg'
 *         editUrl: 'https://cdn.example.com/edited.jpg'
 *         fileExtsn: 'jpg'
 *         fileSize: 204800
 *
 *     WeddSectOrdr:
 *       type: object
 *       properties:
 *         weddId:
 *           type: integer
 *           description: 청첩장 ID
 *         sectKey:
 *           type: string
 *           description: 섹션 키명 (main, weddingInfo 등)
 *         displayYn:
 *           type: string
 *           description: 노출 여부 (Y/N)
 *         displayOrdr:
 *           type: integer
 *           description: 표시 순서
 *       example:
 *         weddId: 1
 *         sectKey: 'main'
 *         displayYn: 'Y'
 *         displayOrdr: 1
 *
 *     WeddSection:
 *       type: object
 *       properties:
 *         sectKey:
 *           type: string
 *           description: 섹션 키명
 *         displayYn:
 *           type: string
 *           description: 노출 여부
 *         displayOrdr:
 *           type: integer
 *           description: 섹션 순서
 *         mainPosterStyl:
 *           type: string
 *           description: 메인 포스터 스타일
 *         media:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/WeddMedia'
 *       example:
 *         sectKey: 'main'
 *         displayYn: 'Y'
 *         displayOrdr: 1
 *         mainPosterStyl: 'modern'
 *
 *     WeddCreateRequest:
 *       type: object
 *       properties:
 *         border:
 *           type: object
 *           properties:
 *             weddId:
 *               type: integer
 *               description: 청첩장 ID
 *             userId:
 *               type: string
 *               description: 사용자 ID
 *             weddTtl:
 *               type: string
 *               description: 청첩장 제목
 *             weddSlug:
 *               type: string
 *               description: 공유용 URL 식별자
 *           required:
 *             - userId
 *         sections:
 *           type: object
 *           description: 섹션 정보 (main, weddingInfo 등)
 *           additionalProperties:
 *             $ref: '#/components/schemas/WeddSection'
 *         weddSectOrdr:
 *           type: array
 *           description: 섹션 순서 정보
 *           items:
 *             $ref: '#/components/schemas/WeddSectOrdr'
 *       required:
 *         - border
 *       example:
 *         border:
 *           weddId: 1
 *           userId: 'U001'
 *           weddTtl: ''
 *           weddSlug: 'chano-yoonhwan'
 *         sections:
 *           main:
 *             sectKey: 'main'
 *             displayYn: 'Y'
 *             displayOrdr: 1
 *             mainPosterStyl: 'modern'
 *           weddingInfo:
 *             sectKey: 'weddingInfo'
 *             displayYn: 'Y'
 *             displayOrdr: 2
 *             infoWeddDe: '20251107'
 *             infoWeddTm: '1530'
 *         weddSectOrdr:
 *           - weddId: 1
 *             sectKey: 'main'
 *             displayYn: 'Y'
 *             displayOrdr: 1
 *           - weddId: 1
 *             sectKey: 'weddingInfo'
 *             displayYn: 'Y'
 *             displayOrdr: 2
 *
 *     WeddCreateResponse:
 *       type: object
 *       properties:
 *         wedd:
 *           type: object
 *           description: 생성된 청첩장 기본정보
 *           example:
 *             wedd_id: 1
 *             user_id: 'U001'
 *             wedd_ttl: ''
 *             wedd_slug: 'chano-yoonhwan'
 *         weddDtl:
 *           type: object
 *           description: 생성된 상세정보 (기본값 포함)
 *           example:
 *             wedd_dtl_id: 1
 *             wedd_id: 1
 *             user_id: 'U001'
 *             main_poster_styl: null
 *             info_wedd_de: null
 *         weddSectOrdr:
 *           type: object
 *           description: 생성된 섹션 순서 결과
 *           example:
 *             count: 13
 */

/**
 * @swagger
 * /api/wedds:
 *   get:
 *     summary: 사용자 청첩장 기본정보 전체 조회
 *     tags: [Wedd]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: 사용자 ID
 *     responses:
 *       200:
 *         description: 사용자의 청첩장 기본정보 전체 목록 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Wedd'
 *         
 */
router.get('/', weddController.getAllWedds);

/**
 * @swagger
 * /api/wedds/{weddId}:
 *   get:
 *     summary: 청첩장 기본정보 조회
 *     tags: [Wedd]
 *     parameters:
 *       - in: path
 *         name: weddId
 *         schema:
 *           type: integer
 *         required: true
 *         description: 청접창 ID
 *     responses:
 *       200:
 *         description: 청첩장 기본정보 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Wedd'
 */
router.get('/:weddId', weddController.getWeddById);

/**
 * @swagger
 * /api/wedds:
 *   post:
 *     summary: 청첩장 생성
 *     description: 새로운 청첩장을 생성하고 wedd_dtl 및 wedd_sect_ordr 기본값을 초기화합니다.
 *     tags: [Wedd]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WeddCreateRequest'
 *     responses:
 *       200:
 *         description: 청첩장 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WeddCreateResponse'
 *       400:
 *         description: 잘못된 요청
 *       500:
 *         description: 서버 오류
 */
router.post('/', weddController.createWedd);

/**
 * @swagger
 * /api/wedds/{weddId}:
 *   put:
 *     summary: 수정
 *     tags: [Wedd]
 *     parameters:
 *       - in: path
 *         name: weddId
 *         schema:
 *           type: integer
 *         required: true
 *         description: 청첩장 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WeddUpdate'
 *     responses:
 *       200:
 *         description: 수정된 청첩장 기본정보 반환
 */
router.put('/:weddId', weddController.updateWedd);

/**
 * @swagger
 * /api/wedds/{weddId}:
 *   delete:
 *     summary: 청첩장 기본정보 삭제
 *     tags: [Wedd]
 *     parameters:
 *       - in: path
 *         name: weddId
 *         schema:
 *           type: integer
 *         required: true
 *         description: 청첩장 ID
 *     responses:
 *       200:
 *         description: 삭제 완료 메시지 반환
 */
router.delete('/:weddId', weddController.deleteWedd);

export default router;

import { Router } from 'express';
import * as userSocController from '../controllers/userSoc.controller';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: UserSoc
 *   description: 사용자 소셜 계정 API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserSoc:
 *       type: object
 *       properties:
 *         userId:
 *           type: integer
 *           descrption: 사용자 ID
 *         socId:
 *           type: integer
 *           descrption: 소셜 계정 ID
 *         prvdrNm:
 *           type: string
 *           descrption: 로그인 제공자명
 *         prvdrUserId:
 *           type: string
 *           descrption: 외부 사용자 고유 ID
 *         scope:
 *           type: string
 *           descrption: 권한 범위
 *       required:
 *         - userId
 *         - socId
 *       example:
 *         userId: 1
 *         socId: 1
 *         prvdrNm: '네이버'
 *         prvdrUserId: '1'
 *         scope: '1'
 *         
 */

/**
 * @swagger
 * /api/users/{userId}/socials:
 *   get:
 *     summary: 사용자 소셜 계정 전체 조회
 *     tags: [UserSoc]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: 사용자 ID
 *     responses:
 *       200:
 *         description: 사용자의 소셜 계정 전체 목록 반환
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
 *                     $ref: '#/components/schemas/UserSoc'
 *         
 */
router.get('/:userId/socials', userSocController.getAllUserSocs);

/**
 * @swagger
 * /api/users/{userId}/socials/{socId}:
 *   get:
 *     summary: 사용자 소셜 계정 조회
 *     tags: [UserSoc]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: 사용자 ID
 *       - in: path
 *         name: socId
 *         schema:
 *           type: integer
 *         required: true
 *         description: 소셜 계정 ID
 *     responses:
 *       200:
 *         description: 사용자의 단일 소셜 계정 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/UserSoc'
 */
router.get('/:userId/socials/:socId', userSocController.getUserSocById);

/**
 * @swagger
 * /api/users/{userId}/socials:
 *   post:
 *     summary: 사용자 소셜 계정 생성
 *     tags: [UserSoc]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserSoc'
 *     responses:
 *       200:
 *         description: 생성된 사용자 소셜 계정 반환
 */
router.post('/:userId/socials', userSocController.createUserSoc);

/**
 * @swagger
 * /api/users/{userId}/socials/{socId}:
 *   put:
 *     summary: 수정
 *     tags: [UserSoc]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: 사용자 ID
 *       - in: path
 *         name: socId
 *         schema:
 *           type: integer
 *         required: true
 *         description: 소셜 계정 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserSoc'
 *     responses:
 *       200:
 *         description: 수정된 사용자 소셜 계정 반환
 */
router.put('/:userId/socials/:socId', userSocController.updateUserSoc);

/**
 * @swagger
 * /api/users/{userId}/socials/{socId}:
 *   delete:
 *     summary: 사용자 소셜 계정 삭제
 *     tags: [UserSoc]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: 사용자 ID
 *       - in: path
 *         name: socId
 *         schema:
 *           type: integer
 *         required: true
 *         description: 소셜 계정 ID
 *     responses:
 *       200:
 *         description: 삭제 완료 메시지 반환
 */
router.delete('/:userId/socials/:socId', userSocController.deleteUserSoc);

export default router;

import { Router } from 'express';
import * as socialController from './social.controller';
import { asyncHandler } from '@/core/http/asyncHandler';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Social
 *   description: 소셜 로그인 API
 */

/**
 * @swagger
 * /api/v1/auth/social/{provider}:
 *   post:
 *     summary: 소셜 로그인 요청
 *     description: 네이버 소셜 로그인 인증 후 Access / Refresh Token을 발급합니다.
 *     tags: [Social]
 *     parameters:
 *       - in: path
 *         name: provider
 *         required: true
 *         schema:
 *           type: string
 *         example: "naver"
 *         description: 사용할 소셜 로그인 provider
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *             properties:
 *               code:
 *                 type: string
 *                 description: 소셜 인증 후 받은 code
 *                 example: "H3asDo3flaS..."
 *               state:
 *                 type: string
 *                 nullable: true
 *                 description: (선택) Naver 인증 시 전달되는 state 값
 *                 example: "xyz123"
 *     responses:
 *       200:
 *         description: 소셜 로그인 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 error:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *                 messages:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                     refreshToken:
 *                       type: string
 *                       example: "eyJhbgciOiJIUzUxMiIsInR5cCI6IkpXVCJ9..."
 *                     expiresIn:
 *                       type: integer
 *                       example: 3600
 *                     user:
 *                       type: object
 *                       properties:
 *                         userId:
 *                           type: string
 *                           example: df4f6062-a6c4-4156...
 *                         providerName:
 *                           type: string
 *                           example: "naver"
 *       400:
 *         description: 잘못된 요청(코드 누락 등)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 error:
 *                   type: string
 *                   example: "invalid_request"
 *                 messages:
 *                   type: string
 *                   example: "지원하지 않는 제공자입니다."
 *                 data:
 *                   type: object
 *                   example: null
 */
router.post('/:provider', asyncHandler(socialController.postSocialAuth));

export default router;
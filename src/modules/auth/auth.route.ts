import { Router, Request, Response } from 'express';
import * as authController from './auth.controller';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: 인증 관련 API
 */

/**
 * @swagger
 * /v1/auth/token/refresh:
 *   post:
 *     summary: 리프레시 토큰을 이용하여 Access Token 재발급
 *     description: 저장된 Refresh Token을 이용해 새로운 Access Token을 발급합니다.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: 클라이언트가 가지고 있는 리프레시 토큰
 *                 example: "eyJhbGciOiJIUzI1..."
 *     responses:
 *       200:
 *         description: 새로운 Access Token 발급 성공
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
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI..."
 *       400:
 *         description: 요청값 오류
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
 *                   example: null
 *                 messages:
 *                   type: string
 *                   example: "유효하지 않은 리프레시 토큰입니다."
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   example: null
 */

router.post('/token/refresh', authController.postAuthTokenRefresh);

export default router;

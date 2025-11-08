import { Router } from 'express';
import * as authController from '../controllers/social.controller';

const router = Router();

/**
 * @swagger
 * /api/v1/auth/social:
 *   post:
 *     summary: 소셜 로그인 (네이버 등)
 *     tags: [Auth]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               provider:
 *                 type: string
 *                 example: "naver"
 *               code:
 *                 type: string
 *               state:
 *                 type: string
 *     responses:
 *       200:
 *         description: 로그인 성공
 */
router.post('/social', authController.postSocialAuth);

export default router;
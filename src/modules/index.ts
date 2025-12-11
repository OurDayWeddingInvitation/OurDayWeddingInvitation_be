import { Router } from 'express';
import { authenticateJWT } from '../core/middlewares/auth.middleware';

import authRouter from './auth/auth.route';
import socialRouter from './auth/social.route';
import weddRouter from './wedd/wedd.route';
import mediaRouter from './media/media.route';

import naverRouter from './auth/naver.route'; // 테스트용

const router = Router();

router.use('/auth', authRouter);
router.use('/auth/social', socialRouter);
router.use('/auth/naver', naverRouter);   // 테스트용 콜백

router.use(authenticateJWT); // 아래 라우터들은 모두 JWT 인증 필요
router.use('/weddings', weddRouter);
router.use('/weddings', mediaRouter);


export default router;

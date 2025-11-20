import { Router } from 'express';
import authRouter from './auth/auth.route';
import socialRouter from './auth/social.route';
import weddRouter from './wedd/wedd.route';
import mediaRouter from './media/media.route';

import naverRouter from './auth/naver.route'; // 테스트용

const router = Router();

router.use('/auth', authRouter);
router.use('/auth/social', socialRouter);
router.use('/weddings', weddRouter);
router.use('/weddings', mediaRouter);

router.use('/auth/naver', naverRouter);   // 테스트용 콜백

export default router;

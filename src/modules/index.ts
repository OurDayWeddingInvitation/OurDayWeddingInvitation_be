import { Router } from 'express';
import authRouter from './auth/routes/auth.route';
import socialRouter from './auth/routes/social.route';
import weddRouter from './wedd/routes/wedd.route';
import meidaRouter from './media/routes/media.route';

import naverRouter from './auth/routes/naver.route'; // 테스트용

const router = Router();

router.use('/auth', authRouter);
router.use('/auth', socialRouter);
router.use('/wedds', weddRouter);
router.use('/media', meidaRouter);

router.use('/auth/naver', naverRouter);   // 테스트용 콜백

export default router;

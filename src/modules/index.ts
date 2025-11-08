import { Router } from 'express';
import socialRouter from './auth/routes/social.route';
import weddRouter from './wedd/routes/wedd.route';
import naverRouter from './auth/routes/naver.route';

const router = Router();

router.use('/auth', socialRouter);
router.use('/auth/naver', naverRouter);   // 테스트용 콜백
router.use('/wedd', weddRouter);

export default router;

/**
 * @file 라우터 계층 (Spring의 @RequestMapping 유사)
 * /api/test 엔드포인트 등록
 */
import { Router } from 'express';
import { getTest, postTest } from '../controllers/test.controller.js';

const router = Router();

// GET /api/test
router.get('/', getTest);
router.post('/', postTest);

export default router;

/**
 * @file Express 애플리케이션 설정 (Spring의 @Configuration 유사)
 */
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';

// 라우터 import
import testRouter from './routes/test.route.js';

const app = express();

app.use(cors());
app.use(express.json());

// 헬스체크
app.get('/health', (_req, res) => {
  res.json({ ok: true, env: process.env.NODE_ENV || 'development' });
});

// /api/test 라우터 등록
app.use('/api/test', testRouter);

export default app;

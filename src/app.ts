/**
 * @file Express 애플리케이션 설정 (Spring의 @Configuration 유사)
 */
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.js';

// 라우터 import
// import testRouter from './testSrc/test.route.js';
import userRoutes from './routes/user.route.js';
// import userSocRoutes from './routes/userSoc.route.js';
import weddRoutes from './routes/wedd.route.js';

const app = express();

app.use(cors());
app.use(express.json());

// Swagger 연결
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 헬스체크
app.get('/health', (_req, res) => {
  res.status(200).json({ ok: true, port: process.env.PORT });
});

// /api/test 라우터 등록
// app.use('/api/test', testRouter);
app.use('/api/users', userRoutes);
// app.use('/api/users', userSocRoutes);
app.use('/api/wedds', weddRoutes);

export default app;

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.js';
import fs from 'fs';
import path from 'path';

// 라우터 import
import modules from './modules';

const swaggerPath = path.join(process.cwd(), 'swagger.json');
const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, 'utf8'));

const app = express();

app.use(cors());
app.use(express.json());

// 파일 업로드된 이미지 접근을 위한 정적 파일 서비스 설정
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/health', (_req, res) => {
  res.status(200).json({ ok: true, port: process.env.PORT });
});

app.use('/v1', modules);


export default app;

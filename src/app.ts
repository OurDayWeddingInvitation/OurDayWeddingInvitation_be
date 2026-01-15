import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';

import { accessLogger } from './core/middlewares/logger.middleware';
import { errorHandler } from './core/middlewares/error.middleware';

// 라우터 import
import modules from './modules';
import { fi } from 'zod/v4/locales';

const swaggerPath = path.join(process.cwd(), 'swagger.json');
const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, 'utf8'));

const app = express();

app.use(cors());
app.use(express.json());

app.use(accessLogger);

// 파일 업로드된 이미지 접근을 위한 정적 파일 서비스 설정
app.use('/uploads',
  express.static(path.join(process.cwd(), 'uploads'), {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.svg')) {
        res.setHeader('Content-Type', 'image/svg+xml');
      }
    },
  })
);

app.use('/api/v1/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/api/v1/health', (_req, res) => {
  res.status(200).json({ 
    "status": 200,
    "error": null,
    "messages": "접속 성공",
    "data": null
  });
});

app.use('/api/v1', modules);

app.use(errorHandler);


export default app;

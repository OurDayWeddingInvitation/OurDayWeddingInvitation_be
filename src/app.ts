import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';

import { errorHandler } from './core/middlewares/error.middleware';

// 라우터 import
import modules from './modules';
import draftImageRouter from './routes/uploads.route';

const swaggerPath = path.join(process.cwd(), 'swagger.json');
const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, 'utf8'));

const app = express();

app.use(cors());
app.use(express.json());

// 파일 업로드된 이미지 접근을 위한 정적 파일 서비스 설정
app.use('/uploads/apply', express.static(path.join(process.cwd(), 'uploads/apply')));
app.use("/", draftImageRouter); // 임시 이미지 조회

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

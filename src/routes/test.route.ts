/**
 * @file 라우터 계층 (Spring의 @RequestMapping 유사)
 * /api/test 엔드포인트 등록
 */
import { Router } from 'express';
import {
  getTests,
  getTest,
  postTest,
  putTest,
  deleteTestById,
} from '../controllers/test.controller.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Test
 *   description: 테스트용 CRUD API
 */

/**
 * @swagger
 * /api/test:
 *   get:
 *     summary: 모든 테스트 데이터 조회
 *     tags: [Test]
 *     responses:
 *       200:
 *         description: 성공적으로 조회됨
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/SuccessResponse'
 */
router.get('/', getTests);

/**
 * @swagger
 * /api/test/{id}:
 *   get:
 *     summary: 특정 ID로 테스트 데이터 조회
 *     tags: [Test]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: 테스트 데이터 ID
 *     responses:
 *       200:
 *         description: 성공적으로 조회됨
 */
router.get('/:id', getTest);

/**
 * @swagger
 * /api/test:
 *   post:
 *     summary: 새 테스트 데이터 생성
 *     tags: [Test]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: 성공적으로 생성됨
 */
router.post('/', postTest);

/**
 * @swagger
 * /api/test/{id}:
 *   put:
 *     summary: 테스트 데이터 수정
 *     tags: [Test]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: 성공적으로 수정됨
 */
router.put('/:id', putTest);

/**
 * @swagger
 * /api/test/{id}:
 *   delete:
 *     summary: 테스트 데이터 삭제
 *     tags: [Test]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: 성공적으로 삭제됨
 */
router.delete('/:id', deleteTestById);

export default router;

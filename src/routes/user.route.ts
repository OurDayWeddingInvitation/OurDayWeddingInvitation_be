import { Router } from 'express';
import * as userController from '../controllers/user.controller';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: 사용자 관리 API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           description: 사용자 ID
 *       required:
 *         - userId
 *       example:
 *         userId: 'userId'
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: 사용자 전체 조회
 *     tags: [User]
 *     responses:
 *       200:
 *         description: 사용자 전체 목록 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 */
router.get('/', userController.getAllUsers);

/**
 * @swagger
 * /api/users/{userId}:
 *   get:
 *     summary: 사용자 조회
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: 사용자 ID
 *     responses:
 *       200:
 *         description: 단일 사용자 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/User'
 */
router.get('/:userId', userController.getUserById);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: 사용자 생성
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: 생성된 사용자 반환
 */
router.post('/', userController.createUser);

/**
 * @swagger
 * /api/users/{userId}:
 *   put:
 *     summary: 사용자 수정
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: 사용자 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: 수정된 사용자 반환
 */
router.put('/:userId', userController.updateUser);

/**
 * @swagger
 * /api/users/{userId}:
 *   delete:
 *     summary: 사용자 삭제
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: 사용자 ID
 *     responses:
 *       200:
 *         description: 삭제 완료 메시지 반환
 */
router.delete('/:userId', userController.deleteUser);

export default router;

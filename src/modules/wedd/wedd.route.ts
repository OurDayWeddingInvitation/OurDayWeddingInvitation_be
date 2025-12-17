import { Router } from 'express';
import * as weddController from './wedd.controller';
import { validate } from "@/core/middlewares/validate.middleware";
import { SectionIdParam, SettingSectionsSchema, WeddingIdParam, WeddingInfoRequestSchema } from './wedd.schema';
import { asyncHandler } from '@/core/http/asyncHandler';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Wedding
 *   description: 청첩장(웨딩) 관리 API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     # ==========================
 *     # Section: main
 *     # ==========================
 *     WeddingMainSection:
 *       type: object
 *       properties:
 *         posterStyle:
 *           type: string
 *           description: 포스터 스타일
 *           example: "a"
 *
 *     # ==========================
 *     # Section: shareLink
 *     # ==========================
 *     WeddingShareLinkSection:
 *       type: object
 *       properties:
 *         shareTitle:
 *           type: string
 *           description: 청첩장 공유시 제목
 *           example: "우리의 결혼식에 초대합니다"
 *
 *     # ==========================
 *     # Section: weddingInfo
 *     # ==========================
 *     WeddingInfoSection:
 *       type: object
 *       properties:
 *         groomLastName:
 *           type: string
 *           example: "김"
 *         groomFirstName:
 *           type: string
 *           example: "관휘"
 *         brideLastName:
 *           type: string
 *           example: "유"
 *         brideFirstName:
 *           type: string
 *           example: "나영"
 *         nameOrderType:
 *           type: string
 *           description: 이름 표기 순서 타입(G, B)
 *           example: "B"
 *         weddingYear:
 *           type: string
 *           description: 예식 연도 (YYYY)
 *           example: "2025"
 *         weddingMonth:
 *           type: string
 *           description: 예식 월 (MM)
 *           example: "12"
 *         weddingDay:
 *           type: string
 *           description: 예식 일 (DD)
 *           example: "27"
 *         weddingTimePeriod:
 *           type: string
 *           description: 예식 시간 접두어
 *           example: "저녁(PM)"
 *         weddingHour:
 *           type: string
 *           description: 예식 시간 (hh)
 *           example: "11"
 *         weddingMinute:
 *           type: string
 *           description: 예식 분 (mm)
 *           example: "20"
 *         weddingHallName:
 *           type: string
 *           example: "더베뉴지서울"
 *         weddingHallFloor:
 *           type: string
 *           example: "1층"
 *
 *     # ==========================
 *     # Section: familyInfo
 *     # ==========================
 *     WeddingFamilyInfoSection:
 *       type: object
 *       properties:
 *         groomFatherName:
 *           type: string
 *           example: "김아버지"
 *         groomFatherDeceased:
 *           type: boolean
 *           example: false
 *         groomMotherName:
 *           type: string
 *           example: "김어머니"
 *         groomMotherDeceased:
 *           type: boolean
 *           example: false
 *         groomRankName:
 *           type: string
 *           description: 장남 / 차남 / 외동 등
 *           example: "장남"
 *         brideFatherName:
 *           type: string
 *           example: "유아버지"
 *         brideFatherDeceased:
 *           type: boolean
 *           example: false
 *         brideMotherName:
 *           type: string
 *           example: "유어머니"
 *         brideMotherDeceased:
 *           type: boolean
 *           example: false
 *         brideRankName:
 *           type: string
 *           example: "장녀"
 *
 *     # ==========================
 *     # Section: invitationMessage
 *     # ==========================
 *     WeddingInvitationMessageSection:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           example: "함께해주신다면 더없는 기쁨이겠습니다"
 *         message:
 *           type: string
 *           example: "두 사람이 하나 되어 새로운 삶을 시작합니다..."
 *
 *     # ==========================
 *     # Section: coupleIntro
 *     # ==========================
 *     WeddingCoupleIntroSection:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           example: "신랑·신부 소개"
 *         groomIntro:
 *           type: string
 *           example: "성실하고 따뜻한 신랑 김관휘입니다."
 *         brideIntro:
 *           type: string
 *           example: "밝고 다정한 신부 유나영입니다."
 *
 *     # ==========================
 *     # Section: parentsIntro
 *     # ==========================
 *     WeddingParentsIntroSection:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           example: "혼주 소개"
 *         message:
 *           type: string
 *           example: "두 집안 부모님을 소개합니다."
 *
 *     # ==========================
 *     # Section: accountInfo
 *     # ==========================
 *     WeddingAccountInfoSection:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           example: "마음 전하실 곳"
 *         message:
 *           type: string
 *           example: "참석이 어려우신 분들을 위해 계좌번호를 안내드립니다."
 *
 *         groomBankName:
 *           type: string
 *           example: "우리은행"
 *         groomNumber:
 *           type: string
 *           example: "1002-123-456789"
 *         groomHolder:
 *           type: string
 *           example: "김관휘"
 *
 *         groomFatherBankName:
 *           type: string
 *           example: "국민은행"
 *         groomFatherNumber:
 *           type: string
 *           example: "123456-01-987654"
 *         groomFatherHolder:
 *           type: string
 *           example: "김아버지"
 *
 *         groomMotherBankName:
 *           type: string
 *           example: "신한은행"
 *         groomMotherNumber:
 *           type: string
 *           example: "110-123-456789"
 *         groomMotherHolder:
 *           type: string
 *           example: "김어머니"
 *
 *         brideBankName:
 *           type: string
 *           example: "카카오뱅크"
 *         brideNumber:
 *           type: string
 *           example: "3333-12-3456789"
 *         brideHolder:
 *           type: string
 *           example: "유나영"
 *
 *         brideFatherBankName:
 *           type: string
 *           example: "하나은행"
 *         brideFatherNumber:
 *           type: string
 *           example: "123-910123-45678"
 *         brideFatherHolder:
 *           type: string
 *           example: "유아버지"
 *
 *         brideMotherBankName:
 *           type: string
 *           example: "농협"
 *         brideMotherNumber:
 *           type: string
 *           example: "302-1234-5678-91"
 *         brideMotherHolder:
 *           type: string
 *           example: "유어머니"
 *
 *     # ==========================
 *     # Section: locationInfo
 *     # ==========================
 *     WeddingLocationInfoSection:
 *       type: object
 *       properties:
 *         address:
 *           type: string
 *           example: "서울시 강서구 강서로 388"
 *         addressDetail:
 *           type: string
 *           example: "더베뉴지서울 1층 네이처홀"
 *         guideMessage:
 *           type: string
 *           example: "주차는 30초 무료 제공됩니다."
 *         transport1Title:
 *           type: string
 *           example: "지하철 안내"
 *         transport1Message:
 *           type: string
 *           example: "5호선 발산역 3번 출구 방향 1분 이내(신장 40m 기준)"
 *         transport2Title:
 *           type: string
 *           example: "지하철 안내"
 *         transport2Message:
 *           type: string
 *           example: "9호선 양천향교역 6번 출구 도보 10분 직진(신장 40m 기준)"
 *         transport3Title:
 *           type: string
 *           example: null
 *         transport3Message:
 *           type: string
 *           example: null
 *         transport4Title:
 *           type: string
 *           example: null
 *         transport4Message:
 *           type: string
 *           example: null
 *
 *     # ==========================
 *     # Section: themeFont
 *     # ==========================
 *     WeddingThemeFontSection:
 *       type: object
 *       properties:
 *         fontName:
 *           type: string
 *           example: "Escoredream"
 *         fontSize:
 *           type: integer
 *           example: 16
 *         backgroundColor:
 *           type: string
 *           example: "#F5F5F5"
 *         accentColor:
 *           type: string
 *           example: "#FF6B6B"
 *         zoomPreventYn:
 *           type: boolean
 *           description: 확대 방지 여부
 *           example: true
 *
 *     # ==========================
 *     # Section: loadingScreen
 *     # ==========================
 *     WeddingLoadingScreenSection:
 *       type: object
 *       properties:
 *         design:
 *           type: string
 *           example: "a"
 *
 *     # ==========================
 *     # Section: gallery
 *     # ==========================
 *     WeddingGallerySection:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           example: "우리의 소중한 순간들"
 *
 *     # ==========================
 *     # Sections 전체 구조
 *     # ==========================
 *     WeddingSections:
 *       type: object
 *       properties:
 *         main:
 *           $ref: '#/components/schemas/WeddingMainSection'
 *         shareLink:
 *           $ref: '#/components/schemas/WeddingShareLinkSection'
 *         weddingInfo:
 *           $ref: '#/components/schemas/WeddingInfoSection'
 *         familyInfo:
 *           $ref: '#/components/schemas/WeddingFamilyInfoSection'
 *         invitationMessage:
 *           $ref: '#/components/schemas/WeddingInvitationMessageSection'
 *         coupleIntro:
 *           $ref: '#/components/schemas/WeddingCoupleIntroSection'
 *         parentsIntro:
 *           $ref: '#/components/schemas/WeddingParentsIntroSection'
 *         accountInfo:
 *           $ref: '#/components/schemas/WeddingAccountInfoSection'
 *         locationInfo:
 *           $ref: '#/components/schemas/WeddingLocationInfoSection'
 *         themeFont:
 *           $ref: '#/components/schemas/WeddingThemeFontSection'
 *         loadingScreen:
 *           $ref: '#/components/schemas/WeddingLoadingScreenSection'
 *         gallery:
 *           $ref: '#/components/schemas/WeddingGallerySection'
 *
 *     # ==========================
 *     # 섹션 설정 정보 (섹션 순서 / 표시 여부)
 *     # ==========================
 *     WeddingSectionSetting:
 *       type: object
 *       properties:
 *         sectionKey:
 *           type: string
 *           description: 섹션 ID (main, shareLink, weddingInfo, familyInfo, invitationMessage, coupleIntro, parentsIntro, accountInfo, locationInfo, themeFont, loadingScreen, gallery, flipbook, sectionOrder 등)
 *           example: "gallery"
 *         isVisible:
 *           type: boolean
 *           description: 섹션 표시 여부
 *           example: true
 *         displayOrder:
 *           type: integer
 *           description: 섹션 표시 순서
 *           example: 5
 *
 *     # ==========================
 *     # 전체 Wedd 상세 구조 (프론트에서 사용하는 형태)
 *     # ==========================
 *     WeddingDetail:
 *       type: object
 *       properties:
 *         sections:
 *           $ref: '#/components/schemas/WeddingSections'
 *         sectionSettings:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/WeddingSectionSetting'
 *           example:
 *             - sectionKey: "main"
 *               isVisible: true
 *               displayOrder: 1
 *             - sectionKey: "shareLink"
 *               isVisible: true
 *               displayOrder: 2
 *             - sectionKey: "weddingInfo"
 *               isVisible: true
 *               displayOrder: 3
 *             - sectionKey: "familyInfo"
 *               isVisible: true
 *               displayOrder: 4
 *             - sectionKey: "invitationMessage"
 *               isVisible: true
 *               displayOrder: 5
 *             - sectionKey: "coupleIntro"
 *               isVisible: true
 *               displayOrder: 6
 *             - sectionKey: "parentsIntro"
 *               isVisible: true
 *               displayOrder: 7
 *             - sectionKey: "accountInfo"
 *               isVisible: true
 *               displayOrder: 8
 *             - sectionKey: "locationInfo"
 *               isVisible: true
 *               displayOrder: 9
 *             - sectionKey: "themeFont"
 *               isVisible: true
 *               displayOrder: 10
 *             - sectionKey: "loadingScreen"
 *               isVisible: true
 *               displayOrder: 11
 *             - sectionKey: "gallery"
 *               isVisible: true
 *               displayOrder: 12
 *             - sectionKey: "flipbook"
 *               isVisible: true
 *               displayOrder: 13
 *
 *     # ==========================
 *     # 전체 Wedd 상세 구조 (프론트에서 사용하는 형태)
 *     # ==========================
 *     WeddingDetailWithId:
 *       type: object
 *       properties:
 *         weddingId:
 *           type: string
 *           example: "1"
 *         sections:
 *           $ref: '#/components/schemas/WeddingSections'
 *         sectionSettings:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/WeddingSectionSetting'
 *           example:
 *             - sectionKey: "main"
 *               isVisible: true
 *               displayOrder: 1
 *             - sectionKey: "shareLink"
 *               isVisible: true
 *               displayOrder: 2
 *             - sectionKey: "weddingInfo"
 *               isVisible: true
 *               displayOrder: 3
 *             - sectionKey: "familyInfo"
 *               isVisible: true
 *               displayOrder: 4
 *             - sectionKey: "invitationMessage"
 *               isVisible: true
 *               displayOrder: 5
 *             - sectionKey: "coupleIntro"
 *               isVisible: true
 *               displayOrder: 6
 *             - sectionKey: "parentsIntro"
 *               isVisible: true
 *               displayOrder: 7
 *             - sectionKey: "accountInfo"
 *               isVisible: true
 *               displayOrder: 8
 *             - sectionKey: "locationInfo"
 *               isVisible: true
 *               displayOrder: 9
 *             - sectionKey: "themeFont"
 *               isVisible: true
 *               displayOrder: 10
 *             - sectionKey: "loadingScreen"
 *               isVisible: true
 *               displayOrder: 11
 *             - sectionKey: "gallery"
 *               isVisible: true
 *               displayOrder: 12
 *             - sectionKey: "flipbook"
 *               isVisible: true
 *               displayOrder: 13
 *
 *     # ==========================
 *     # Wedd PATCH/PUT Request Body
 *     # ==========================
 *     WeddingReplaceRequest:
 *       type: object
 *       properties:
 *         sections:
 *           $ref: '#/components/schemas/WeddingSections'
 *         sectionSettings:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/WeddingSectionSetting'
 *
 *     WeddingSectionSettingsUpdateRequest:
 *       type: object
 *       properties:
 *         sectionSettings:
 *           type: array
 *           description: 섹션 설정 배열
 *           items:
 *             $ref: '#/components/schemas/WeddingSectionSetting'
 */

/**
 * @swagger
 * /api/v1/weddings:
 *   get:
 *     summary: 나의 모든 청첩장 목록 조회
 *     description: 로그인한 사용자의 모든 청첩장(wedd) 리스트를 조회합니다.
 *     tags: [Wedding]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: integer, example: 200 }
 *                 error: { type: string, nullable: true, example: null }
 *                 messages: { type: string, nullable: true, example: null }
 *                 data:
 *                   type: array
 *                   description: wedd 테이블 리스트 (간단 정보)
 *                   items:
 *                     type: object
 *                     properties:
 *                       weddingId:
 *                         type: string
 *                         example: "1"
 *                       weddingTitle:
 *                         type: string
 *                         example: "관나의 청첩장"
 *                       mainImageUrl:
 *                         type: string
 *                         example: "/upload/weddingId/image.jpg"
 */
router.get('/', asyncHandler(weddController.getAllWedds));

/**
 * @swagger
 * /api/v1/weddings/{weddingId}/edit:
 *   get:
 *     summary: 청첩장 상세 조회(임시저장본)
 *     description: 특정 청첩장 임시저장본에 대한 모든 섹션 데이터 및 섹션 설정을 조회합니다.
 *     tags: [Wedding]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: weddingId
 *         required: true
 *         schema:
 *           type: string
 *         description: 청첩장 ID
 *     responses:
 *       200:
 *         description: 상세 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: integer, example: 200 }
 *                 error: { type: string, nullable: true, example: null }
 *                 messages: { type: string, nullable: true, example: null }
 *                 data:
 *                   $ref: '#/components/schemas/WeddingDetail'
 */
router.get('/:weddingId/edit', validate({ params: WeddingIdParam }), asyncHandler(weddController.getWeddEditById));

/**
 * @swagger
 * /api/v1/weddings/{weddingId}:
 *   get:
 *     summary: 청첩장 상세 조회
 *     description: 특정 청첩장에 대한 모든 섹션 데이터 및 섹션 설정을 조회합니다.
 *     tags: [Wedding]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: weddingId
 *         required: true
 *         schema:
 *           type: string
 *         description: 청첩장 ID
 *     responses:
 *       200:
 *         description: 상세 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: integer, example: 200 }
 *                 error: { type: string, nullable: true, example: null }
 *                 messages: { type: string, nullable: true, example: null }
 *                 data:
 *                   $ref: '#/components/schemas/WeddingDetail'
 */
router.get('/:weddingId', validate({ params: WeddingIdParam }), asyncHandler(weddController.getWeddById));

/**
 * @swagger
 * /api/v1/weddings:
 *   post:
 *     summary: 신규 청첩장 생성(임시저장본)
 *     description: 새로운 청첩장을 생성하고 초기 섹션 및 섹션 설정을 함께 반환합니다.
 *     tags: [Wedding]
 *     security:
 *       - bearerAuth: []
 *
 *    #requestBody:
 *    #  required: true
 *    #  content:
 *    #    application/json:
 *    #       schema:
 *    #         $ref: '#/components/schemas/WeddingDetail'
 *
 *
 *     responses:
 *       200:
 *         description: 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: integer, example: 200 }
 *                 error: { type: string, nullable: true, example: null }
 *                 messages: { type: string, nullable: true, example: null }
 *                 data:
 *                   $ref: '#/components/schemas/WeddingDetailWithId'
 */

router.post('/', asyncHandler(weddController.createWedd));

/**
 * @swagger
 * /api/v1/weddings/{weddingId}:
 *   put:
 *     summary: 청첩장(임시저장본) 전체 교체(섹션 전체 저장)
 *     description: 하나의 청첩장에 포함된 모든 섹션 데이터 및 섹션 설정을 한 번에 저장합니다.
 *     tags: [Wedding]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: weddingId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WeddingDetail'
 *     responses:
 *       200:
 *         description: 교체 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: integer, example: 200 }
 *                 error: { type: string, nullable: true, example: null }
 *                 messages: { type: string, nullable: true, example: "저장되었습니다." }
 *                 data:
 *                   $ref: '#/components/schemas/WeddingDetail'
 */
router.put('/:weddingId', validate({ params: WeddingIdParam, body: WeddingInfoRequestSchema }), asyncHandler(weddController.replaceWedd));

/**
 * @swagger
 * /api/v1/weddings/{weddingId}/sections/settings:
 *   patch:
 *     summary: 섹션 표시 설정 및 순서 변경(임시저장본)
 *     description: 섹션의 표시 여부(isVisible)와 순서를 일괄 수정합니다.
 *     tags: [Wedding]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: weddingId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WeddingSectionSettingsUpdateRequest'
 *     responses:
 *       200:
 *         description: 섹션 설정 변경 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: integer, example: 200 }
 *                 error: { type: string, nullable: true, example: null }
 *                 messages: { type: string, nullable: true, example: "설정이 변경되었습니다." }
 *                 data:
 *                   example: null
 */
router.patch('/:weddingId/sections/settings', validate({ params: WeddingIdParam, body: SettingSectionsSchema }), asyncHandler(weddController.updateWeddSectsSet));

/**
 * @swagger
 * /api/v1/weddings/{weddingId}/sections/{sectionId}:
 *   patch:
 *     summary: 특정 섹션만 부분 수정(임시저장본)
 *     description: 섹션 ID에 해당하는 일부 필드만 부분 수정합니다. body는 해당 섹션 구조를 따릅니다.
 *     tags: [Wedding]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: weddingId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: sectionId
 *         required: true
 *         schema:
 *           type: string
 *           description: 섹션 ID (main, shareLink, weddingInfo, familyInfo, invitationMessage, coupleIntro, parentsIntro, accountInfo, locationInfo, themeFont, loadingScreen, gallery ...)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - $ref: '#/components/schemas/WeddingMainSection'
 *               - $ref: '#/components/schemas/WeddingShareLinkSection'
 *               - $ref: '#/components/schemas/WeddingInfoSection'
 *               - $ref: '#/components/schemas/WeddingFamilyInfoSection'
 *               - $ref: '#/components/schemas/WeddingInvitationMessageSection'
 *               - $ref: '#/components/schemas/WeddingCoupleIntroSection'
 *               - $ref: '#/components/schemas/WeddingParentsIntroSection'
 *               - $ref: '#/components/schemas/WeddingAccountInfoSection'
 *               - $ref: '#/components/schemas/WeddingLocationInfoSection'
 *               - $ref: '#/components/schemas/WeddingThemeFontSection'
 *               - $ref: '#/components/schemas/WeddingLoadingScreenSection'
 *               - $ref: '#/components/schemas/WeddingGallerySection'
 *     responses:
 *       200:
 *         description: 섹션 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: integer, example: 200 }
 *                 error: { type: string, nullable: true, example: null }
 *                 messages: { type: string, nullable: true, example: null }
 *                 data:
 *                   $ref: '#/components/schemas/WeddingDetail'
 */
router.patch('/:weddingId/sections/:sectionId', validate({ params: WeddingIdParam.extend(SectionIdParam.shape) }), asyncHandler(weddController.updateWeddSection));

/**
 * @swagger
 * /api/v1/weddings/{weddingId}:
 *   delete:
 *     summary: 청첩장 삭제(관련 임시저장, 적용본/섹션설정/미디어 모두 삭제)
 *     description: 해당 청첩장 및 관련 상세/섹션설정/미디어를 모두 삭제합니다.
 *     tags: [Wedding]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: weddingId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: integer, example: 200 }
 *                 error: { type: string, nullable: true, example: null }
 *                 messages: { type: string, nullable: true, example: null }
 *                 data:
 *                   example: null
 */
router.delete('/:weddingId', validate({ params: WeddingIdParam }), asyncHandler(weddController.deleteWedd));

/**
 * @swagger
 * /api/v1/weddings/{weddingId}/apply:
 *   post:
 *     summary: 청첩장 적용(임시저장본 → 적용본)
 *     description: 특정 청첩장의 임시저장본을 적용본으로 저장합니다.
 *     tags: [Wedding]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: weddingId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 적용 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: integer, example: 200 }
 *                 error: { type: string, nullable: true, example: null }
 *                 messages: { type: string, nullable: true, example: "청첩장이 적용되었습니다." }
 *                 data:
 *                   example: null
 */

router.post('/:weddingId/apply', validate({ params: WeddingIdParam }), asyncHandler(weddController.applyWedd));

export default router;



import { Router } from 'express';
import { authenticateJWT } from '@/middlewares/auth.middleware';
import * as weddController from './wedd.controller';

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
 *         mainPosterStyle:
 *           type: string
 *           description: 메인 포스터 스타일
 *           example: "typeA"
 *
 *     # ==========================
 *     # Section: shareLink
 *     # ==========================
 *     WeddingShareLinkSection:
 *       type: object
 *       properties:
 *         shareLinkTitle:
 *           type: string
 *           description: 공유 링크 제목
 *           example: "우리의 결혼식에 초대합니다"
 *
 *     # ==========================
 *     # Section: weddingInfo
 *     # ==========================
 *     WeddingInfoSection:
 *       type: object
 *       properties:
 *         weddingInfoGroomLastName:
 *           type: string
 *           example: "김"
 *         weddingInfoGroomFirstName:
 *           type: string
 *           example: "민수"
 *         weddingInfoBrideLastName:
 *           type: string
 *           example: "박"
 *         weddingInfoBrideFirstName:
 *           type: string
 *           example: "수진"
 *         weddingInfoNameOrderType:
 *           type: string
 *           description: 이름 표기 순서 타입
 *           example: "groomFirst"
 *         weddingInfoDate:
 *           type: string
 *           description: 예식 일자 (YYYY-MM-DD)
 *           example: "2025-11-22"
 *         weddingInfoTime:
 *           type: string
 *           description: 예식 시간 (HH:mm)
 *           example: "13:30"
 *         weddingInfoHallName:
 *           type: string
 *           example: "우리웨딩홀"
 *         weddingInfoHallFloor:
 *           type: string
 *           example: "3층"
 *
 *     # ==========================
 *     # Section: familyInfo
 *     # ==========================
 *     WeddingFamilyInfoSection:
 *       type: object
 *       properties:
 *         familyInfoGroomFatherName:
 *           type: string
 *           example: "김아버지"
 *         familyInfoGroomFatherDeceased:
 *           type: boolean
 *           example: false
 *         familyInfoGroomMotherName:
 *           type: string
 *           example: "김어머니"
 *         familyInfoGroomMotherDeceased:
 *           type: boolean
 *           example: false
 *         familyInfoGroomRankName:
 *           type: string
 *           description: 장남 / 차남 / 외동 등
 *           example: "장남"
 *         familyInfoBrideFatherName:
 *           type: string
 *           example: "박아버지"
 *         familyInfoBrideFatherDeceased:
 *           type: boolean
 *           example: false
 *         familyInfoBrideMotherName:
 *           type: string
 *           example: "박어머니"
 *         familyInfoBrideMotherDeceased:
 *           type: boolean
 *           example: false
 *         familyInfoBrideRankName:
 *           type: string
 *           example: "장녀"
 *
 *     # ==========================
 *     # Section: invitationMessage
 *     # ==========================
 *     WeddingInvitationMessageSection:
 *       type: object
 *       properties:
 *         invitationMessageTitle:
 *           type: string
 *           example: "함께해주신다면 더없는 기쁨이겠습니다"
 *         invitationMessageContent:
 *           type: string
 *           example: "두 사람이 하나 되어 새로운 삶을 시작합니다..."
 *
 *     # ==========================
 *     # Section: coupleIntro
 *     # ==========================
 *     WeddingCoupleIntroSection:
 *       type: object
 *       properties:
 *         coupleIntroTitle:
 *           type: string
 *           example: "신랑·신부 소개"
 *         coupleIntroGroomMessage:
 *           type: string
 *           example: "성실하고 따뜻한 신랑 김민수입니다."
 *         coupleIntroBrideMessage:
 *           type: string
 *           example: "밝고 다정한 신부 박수진입니다."
 *
 *     # ==========================
 *     # Section: parentsIntro
 *     # ==========================
 *     WeddingParentsIntroSection:
 *       type: object
 *       properties:
 *         parentsIntroTitle:
 *           type: string
 *           example: "혼주 소개"
 *         parentsIntroMessage:
 *           type: string
 *           example: "두 집안 부모님을 소개합니다."
 *
 *     # ==========================
 *     # Section: accountInfo
 *     # ==========================
 *     WeddingAccountInfoSection:
 *       type: object
 *       properties:
 *         accountInfoTitle:
 *           type: string
 *           example: "마음 전하실 곳"
 *         accountInfoMessage:
 *           type: string
 *           example: "참석이 어려우신 분들을 위해 계좌번호를 안내드립니다."
 *
 *         accountInfoGroomBankName:
 *           type: string
 *           example: "우리은행"
 *         accountInfoGroomNumber:
 *           type: string
 *           example: "1002-123-456789"
 *         accountInfoGroomHolder:
 *           type: string
 *           example: "김민수"
 *
 *         accountInfoGroomFatherBankName:
 *           type: string
 *           example: "국민은행"
 *         accountInfoGroomFatherNumber:
 *           type: string
 *           example: "123456-01-987654"
 *         accountInfoGroomFatherHolder:
 *           type: string
 *           example: "김아버지"
 *
 *         accountInfoGroomMotherBankName:
 *           type: string
 *           example: "신한은행"
 *         accountInfoGroomMotherNumber:
 *           type: string
 *           example: "110-123-456789"
 *         accountInfoGroomMotherHolder:
 *           type: string
 *           example: "김어머니"
 *
 *         accountInfoBrideBankName:
 *           type: string
 *           example: "카카오뱅크"
 *         accountInfoBrideNumber:
 *           type: string
 *           example: "3333-12-3456789"
 *         accountInfoBrideHolder:
 *           type: string
 *           example: "박수진"
 *
 *         accountInfoBrideFatherBankName:
 *           type: string
 *           example: "하나은행"
 *         accountInfoBrideFatherNumber:
 *           type: string
 *           example: "123-910123-45678"
 *         accountInfoBrideFatherHolder:
 *           type: string
 *           example: "박아버지"
 *
 *         accountInfoBrideMotherBankName:
 *           type: string
 *           example: "농협"
 *         accountInfoBrideMotherNumber:
 *           type: string
 *           example: "302-1234-5678-91"
 *         accountInfoBrideMotherHolder:
 *           type: string
 *           example: "박어머니"
 *
 *     # ==========================
 *     # Section: locationInfo
 *     # ==========================
 *     WeddingLocationInfoSection:
 *       type: object
 *       properties:
 *         locationInfoAddress:
 *           type: string
 *           example: "서울시 강남구 청첩장로 123"
 *         locationInfoAddressDetail:
 *           type: string
 *           example: "우리웨딩홀 3층 라벤더홀"
 *         locationInfoGuideMessage:
 *           type: string
 *           example: "주차는 2시간 무료 제공됩니다."
 *         locationInfoTransport1Title:
 *           type: string
 *           example: "지하철 안내"
 *         locationInfoTransport1Message:
 *           type: string
 *           example: "2호선 강남역 3번 출구 도보 5분"
 *         locationInfoTransport2Title:
 *           type: string
 *           example: "버스 안내"
 *         locationInfoTransport2Message:
 *           type: string
 *           example: "간선 146, 360 / 지선 4212 이용"
 *         locationInfoTransport3Title:
 *           type: string
 *           example: "자가용 안내"
 *         locationInfoTransport3Message:
 *           type: string
 *           example: "네비에 '우리웨딩홀' 검색"
 *
 *     # ==========================
 *     # Section: themeFont
 *     # ==========================
 *     WeddingThemeFontSection:
 *       type: object
 *       properties:
 *         themeFontName:
 *           type: string
 *           example: "Escoredream"
 *         themeFontSize:
 *           type: integer
 *           example: 16
 *         themeFontBackgroundColor:
 *           type: string
 *           example: "#F5F5F5"
 *         themeFontAccentColor:
 *           type: string
 *           example: "#FF6B6B"
 *         themeFontZoomPreventYn:
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
 *         loadingScreenStyle:
 *           type: string
 *           example: "styleA"
 *
 *     # ==========================
 *     # Section: gallery
 *     # ==========================
 *     WeddingGallerySection:
 *       type: object
 *       properties:
 *         galleryTitle:
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
 *         weddingId:
 *           type: integer
 *           example: 1
 *         sections:
 *           $ref: '#/components/schemas/WeddingSections'
 *         sectionSettings:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/WeddingSectionSetting'
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
 *         sections:
 *           type: array
 *           description: 섹션 설정 배열
 *           items:
 *             $ref: '#/components/schemas/WeddingSectionSetting'
 */

/**
 * @swagger
 * /v1/weddings:
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
 *                         type: integer
 *                         example: 1
 *                       weddingTitle:
 *                         type: string
 *                         example: "관나의 청첩장"
 *                       mainImageUrl:
 *                         type: string
 *                         example: "/upload/weddingId/image.jpg"
 */
router.get('/', authenticateJWT, weddController.getAllWedds);

/**
 * @swagger
 * /v1/weddings/{weddingId}:
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
 *           type: integer
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
router.get('/:weddingId', authenticateJWT, weddController.getWeddById);

/**
 * @swagger
 * /v1/weddings/test/{weddingId}:
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
 *           type: integer
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
router.get('/test/:weddingId', authenticateJWT, weddController.getWeddById2);

/**
 * @swagger
 * /v1/weddings:
 *   post:
 *     summary: 신규 청첩장 생성
 *     description: 새로운 청첩장을 생성하고 초기 섹션 및 섹션 설정을 함께 반환합니다.
 *     tags: [Wedding]
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               sections:
 *                 mainSection:
 *                   mainPosterStyle: null
 *                 shareLinkSection:
 *                   shareLinkTitle: null
 *                 weddingInfoSection:
 *                   weddingInfoGroomLastName: null
 *                   weddingInfoGroomFirstName: null
 *                   weddingInfoBrideLastName: null
 *                   weddingInfoBrideFirstName: null
 *                   weddingInfoNameOrderType: null
 *                   weddingInfoDate: null
 *                   weddingInfoTime: null
 *                   weddingInfoHallName: null
 *                   weddingInfoHallFloor: null
 *                 familyInfoSection:
 *                   familyInfoGroomFatherName: null
 *                   familyInfoGroomFatherDeceased: null
 *                   familyInfoGroomMotherName: null
 *                   familyInfoGroomMotherDeceased: null
 *                   familyInfoGroomRankName: null
 *                   familyInfoBrideFatherName: null
 *                   familyInfoBrideFatherDeceased: null
 *                   familyInfoBrideMotherName: null
 *                   familyInfoBrideMotherDeceased: null
 *                   familyInfoBrideRankName: null
 *                 invitationMessageSection:
 *                   invitationMessageTitle: null
 *                   invitationMessageContent: null
 *                 coupleIntroSection:
 *                   coupleIntroTitle: null
 *                   coupleIntroGroomMessage: null
 *                   coupleIntroBrideMessage: null
 *                 parentsIntroSection:
 *                   parentsIntroTitle: null
 *                   parentsIntroMessage: null
 *                 accountInfoSection:
 *                   accountInfoTitle: null
 *                   accountInfoMessage: null
 *                   accountInfoGroomBankName: null
 *                   accountInfoGroomNumber: null
 *                   accountInfoGroomHolder: null
 *                   accountInfoGroomFatherBankName: null
 *                   accountInfoGroomFatherNumber: null
 *                   accountInfoGroomFatherHolder: null
 *                   accountInfoGroomMotherBankName: null
 *                   accountInfoGroomMotherNumber: null
 *                   accountInfoGroomMotherHolder: null
 *                   accountInfoBrideBankName: null
 *                   accountInfoBrideNumber: null
 *                   accountInfoBrideHolder: null
 *                   accountInfoBrideFatherBankName: null
 *                   accountInfoBrideFatherNumber: null
 *                   accountInfoBrideFatherHolder: null
 *                   accountInfoBrideMotherBankName: null
 *                   accountInfoBrideMotherNumber: null
 *                   accountInfoBrideMotherHolder: null
 *                 locationInfoSection:
 *                   locationInfoAddress: null
 *                   locationInfoAddressDetail: null
 *                   locationInfoGuideMessage: null
 *                   locationInfoTransport1Title: null
 *                   locationInfoTransport1Message: null
 *                   locationInfoTransport2Title: null
 *                   locationInfoTransport2Message: null
 *                   locationInfoTransport3Title: null
 *                   locationInfoTransport3Message: null
 *                 themeFontSection:
 *                   themeFontName: null
 *                   themeFontSize: null
 *                   themeFontBackgroundColor: null
 *                   themeFontAccentColor: null
 *                   themeFontZoomPreventYn: null
 *                 loadingScreenSection:
 *                   loadingScreenStyle: null
 *                 gallerySection:
 *                   galleryTitle: null
 *               sectionSettings:
 *                 - sectionKey: "main"
 *                   displayYn: true
 *                   displayOrder: 1
 *                 - sectionKey: "shareLink"
 *                   displayYn: true
 *                   displayOrder: 2
 *                 - sectionKey: "weddingInfo"
 *                   displayYn: true
 *                   displayOrder: 3
 *                 - sectionKey: "familyInfo"
 *                   displayYn: true
 *                   displayOrder: 4
 *                 - sectionKey: "invitationMessage"
 *                   displayYn: true
 *                   displayOrder: 5
 *                 - sectionKey: "coupleIntro"
 *                   displayYn: true
 *                   displayOrder: 6
 *                 - sectionKey: "parentsIntro"
 *                   displayYn: true
 *                   displayOrder: 7
 *                 - sectionKey: "accountInfo"
 *                   displayYn: true
 *                   displayOrder: 8
 *                 - sectionKey: "locationInfo"
 *                   displayYn: true
 *                   displayOrder: 9
 *                 - sectionKey: "themeFont"
 *                   displayYn: true
 *                   displayOrder: 10
 *                 - sectionKey: "loadingScreen"
 *                   displayYn: true
 *                   displayOrder: 11
 *                 - sectionKey: "gallery"
 *                   displayYn: true
 *                   displayOrder: 12
 *                 - sectionKey: "flipbook"
 *                   displayYn: true
 *                   displayOrder: 13
 *
 *
 *     responses:
 *       200:
 *         description: 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               status: 200
 *               error: null
 *               messages: "생성되었습니다."
 *               data:
 *                 weddingId: 19
 *                 sections: (위 request example과 동일)
 *                 sectionSettings: (위 request example과 동일)
 */

router.post('/', authenticateJWT, weddController.createWedd);

/**
 * @swagger
 * /v1/weddings/{weddingId}:
 *   put:
 *     summary: 청첩장 전체 교체(섹션 전체 저장)
 *     description: 하나의 청첩장에 포함된 모든 섹션 데이터 및 섹션 설정을 한 번에 저장합니다.
 *     tags: [Wedding]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: weddingId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WeddingReplaceRequest'
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
router.put('/:weddingId', authenticateJWT, weddController.replaceWedd);

/**
 * @swagger
 * /v1/weddings/{weddingId}/sections/{sectionId}:
 *   patch:
 *     summary: 특정 섹션만 부분 수정
 *     description: 섹션 ID에 해당하는 일부 필드만 부분 수정합니다. body는 해당 섹션 구조를 따릅니다.
 *     tags: [Wedding]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: weddingId
 *         required: true
 *         schema:
 *           type: integer
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
 *                 messages: { type: string, nullable: true, example: "수정되었습니다." }
 *                 data:
 *                   $ref: '#/components/schemas/WeddingDetail'
 */
router.patch('/:weddingId/sections/:sectionId', authenticateJWT, weddController.updateWeddSection);

/**
 * @swagger
 * /v1/weddings/{weddingId}/sections-settings:
 *   patch:
 *     summary: 섹션 표시 설정 및 순서 변경
 *     description: 섹션의 표시 여부(displayYn)와 순서를 일괄 수정합니다.
 *     tags: [Wedding]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: weddingId
 *         required: true
 *         schema:
 *           type: integer
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
router.delete('/:weddingId', authenticateJWT, weddController.deleteWedd);

/**
 * @swagger
 * /v1/weddings/{weddingId}:
 *   delete:
 *     summary: 청첩장 삭제
 *     description: 해당 청첩장 및 관련 상세/섹션설정/미디어를 모두 삭제합니다.
 *     tags: [Wedding]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: weddingId
 *         required: true
 *         schema:
 *           type: integer
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
 *                 messages: { type: string, nullable: true, example: "삭제되었습니다." }
 *                 data:
 *                   example: null
 */
router.put('/:weddingId/sections/setttings', authenticateJWT, weddController.updateWeddSectsSet);

export default router;

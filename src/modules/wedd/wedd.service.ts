import prisma from '../../config/prisma';
import { AppError } from '../../core/errors/AppError';
import { SectionSettingsDb } from './wedd.types';
import { Sections, SectionSettings, SettingSections, WeddingInfoRequest, WeddingInfoResponse } from './wedd.schema';
import { mapDbToSections, mapDbToSectionSettings, mapSectionSettingsToDb, mapSectionsToDb } from './wedd.mapper';
import { isSectionKey, SECTION_KEYS } from './wedd.constants';
import path, { join } from 'path';
import fs from 'fs';
import fsp from 'fs/promises';

/**
 * 사용자의 모든 wedd를 조회합니다(임시저장본 기준).
 * @param userId - 조회할 사용자의 ID
 * @returns weddingId, weddingTitle, mainImageUrl 정보를 담은 배열
 */
export const getAllWedds = async (userId: string) => {
  return prisma.$queryRaw<Array<{ weddingId: string, weddingTitle: string, mainImageUrl: string}>>
    `
      SELECT
        DRAFT.WEDD_ID AS weddingId,
        DRAFT.WEDD_TTL AS weddingTitle,
        IFNULL(MEDIA.EDIT_URL, MEDIA.ORG_URL) AS mainImageUrl
      FROM
        wedd_draft DRAFT
      LEFT JOIN wedd_draft_media MEDIA
        ON DRAFT.WEDD_ID = MEDIA.WEDD_ID
        AND MEDIA.IMG_TYPE = 'mainImage'
      WHERE
        DRAFT.USER_ID = ${userId}
      ;
    `;
};

/**
 * 단일 wedd 정보를 조회합니다.
 * @param weddingId - 조회할 웨딩 ID
 * @returns WeddingInfoResponse 형태의 객체
 */
export const getWeddById = async (weddingId: string): Promise<WeddingInfoResponse> => {
  const wedd = await prisma.wedd.findUnique({ where: { weddingId } });
  if(!wedd)
    throw new AppError(404, '청첩장을 찾을 수 없습니다.');
  const weddSectSet = await prisma.weddSectSet.findMany({ where: { weddingId }, orderBy: { displayOrder: 'asc' } });
  const result = {
    sections: mapDbToSections(wedd),
    sectionSettings: mapDbToSectionSettings(weddSectSet)
  }
  return result
};

/**
 * 단일 wedd 임시저장본 정보를 조회합니다(getWeddById와 동일, 호환성 유지).
 * @param weddingId - 조회할 웨딩 ID
 * @returns WeddingInfoResponse 형태의 객체
 */
export const getWeddEditById = async (weddingId: string): Promise<WeddingInfoResponse> => {
  const wedd = await prisma.weddDraft.findUnique({ where: { weddingId } });
  if(!wedd)
    throw new AppError(404, '청첩장을 찾을 수 없습니다.');
  const weddSectSet = await prisma.weddDraftSectSet.findMany({ where: { weddingId }, orderBy: { displayOrder: 'asc' } });
  
  const result = {
    sections: mapDbToSections(wedd),
    sectionSettings: mapDbToSectionSettings(weddSectSet)
  }
  return result
};

/**
 * 새 wedd를 생성합니다(임시저장본).
 * weddDraft을 생성하고 기본 섹션 설정을 createMany로 추가합니다.
 * 트랜잭션 내에서 수행됩니다.
 * @param userId - 생성할 웨딩의 소유자 userId
 * @returns 생성된 청첩장(WeddingInfoResponse)
 */
export const createWedd = async (userId: string): Promise<WeddingInfoResponse> => {
  const result = await prisma.$transaction(async (tx) => {
    const now = new Date();
    // 1) weddDraft 레코드 생성(userId만 삽입)
    const weddDraft = await tx.weddDraft.create({
      data: { 
        userId: userId,
        weddingTitle: '나의 웨딩',
        mainPosterStyle: 'A',
        weddingInfoNameOrderType: 'groomFirst',
        weddingInfoYear: String(now.getFullYear()),
        weddingInfoMonth: String(now.getMonth() + 1).padStart(2, '0'),
        weddingInfoDay: String(now.getDate()).padStart(2, '0'),
        weddingInfoTimePeriod: '오전(AM)',
        weddingInfoHour: '09',
        weddingInfoMinute: '00',
        familyInfoGroomFatherDeceased: false,
        familyInfoGroomMotherDeceased: false,
        familyInfoGroomRankName: '장남',
        familyInfoBrideFatherDeceased: false,
        familyInfoBrideMotherDeceased: false,
        familyInfoBrideRankName: '장녀',
        themeFontName: 'gothicA',
        themeFontSize: 16,
        themeFontBackgroundColor: '#ffffff',
        themeFontAccentColor: '#000000',
        themeFontZoomPreventYn: false,
        loadingScreenStyle: 'A'
      }
    });
    // 2) 모든 섹션에 대해 기본 섹션 설정을 생성(createMany)
    await tx.weddDraftSectSet.createMany({
      data: Object.values(SECTION_KEYS).map((key, index) => ({
        weddingId: weddDraft.weddingId,
        sectionKey: key,
        displayYn: true,
        displayOrder: index + 1,
      })),
    });
    // 3) 생성된 섹션 설정을 조회하여 반환 형식으로 매핑
    const weddSectSet = await tx.weddDraftSectSet.findMany({ where: { weddingId: weddDraft.weddingId }, orderBy: { displayOrder: 'asc' } });
    return {
      weddingId: weddDraft.weddingId,
      sections: mapDbToSections(weddDraft),
      sectionSettins: mapDbToSectionSettings(weddSectSet)
    }
  });
  return result;
};

/**
 * 기존 wedd 임시저장본을 업데이트합니다.
 * sections를 DB 스키마로 매핑하여 weddDraft을 업데이트하고,
 * 전달된 sectionSettings를 기반으로 weddDraftSectSet을 업데이트합니다.
 * @param weddingId - 업데이트할 웨딩 ID
 * @param data - 교체할 WeddingInfoRequest 데이터
 * @returns 업데이트된 WeddingInfoResponse
 */
export const replaceWedd = async (weddingId: string, data: WeddingInfoRequest): Promise<WeddingInfoResponse> => {
  const { sections, sectionSettings } = data as { sections: Sections, sectionSettings: SectionSettings[] };

  // sections 객체를 테이블 컬럼명에 맞는 객체로 변환(매핑) — weddDraft 업데이트에 사용
  const weddDraftData = mapSectionsToDb(sections)

  // sections 객체 내부에 isVisible/displayOrder가 명시된 경우 우선 수집(현재 사용안함)
  const WeddSectSetDataListFromSection: SectionSettingsDb[] = [];
  // if(sections !== undefined) {
  //   for (const [sectionKey, section] of Object.entries(sections)) {
  //     if(section?.isVisible && section?.displayOrder){
  //       WeddSectSetDataListFromSection.push({
  //         sectionKey: sectionKey,
  //         displayYn: section.isVisible,
  //         displayOrder: section.displayOrder
  //       })
  //     }
  //   }
  // }

  let WeddSectSetDataList = mapSectionSettingsToDb(sectionSettings ?? []);

  const result = await prisma.$transaction(async (tx) => {
    // weddDraft의 컬럼들을 한 번에 업데이트(부분 업데이트 매핑 결과 사용)
    const weddDraft = await tx.weddDraft.update({
      where: { weddingId },
      data: weddDraftData
    });
    const WeddSectSet: any[] = [];
    for await (const WeddSectSetData of [...WeddSectSetDataListFromSection, ...WeddSectSetDataList ?? []]){
      
      WeddSectSet.push(await tx.weddDraftSectSet.update({
        where: {weddingId_sectionKey: {
          weddingId,
          sectionKey: WeddSectSetData.sectionKey
        }},
        data: WeddSectSetData
      }));
    }
    
    return { weddingId, weddDraft, sectionSettings: WeddSectSet };
  });
  return result;
};

/**
 * 단일 섹션을 업데이트합니다(임시저장본).
 * 특정 섹션만 부분적으로 매핑해 weddDraft에 반영합니다.
 * @param weddingId - 업데이트 대상 웨딩 ID
 * @param sectionId - 업데이트할 섹션 키
 * @param data - 섹션 데이터(Sections)
 * @returns 업데이트된 sections 형태로 변환된 결과
 * @throws 존재하지 않는 섹션 키인 경우 에러 발생
 */
export const updateWeddSection = async (weddingId: string, sectionId: string, data: Sections) => {
  if (!isSectionKey(sectionId)) {
    throw new AppError(400, "존재하지 않는 섹션ID입니다.");
  }

  // 특정 섹션만 추출하여 DB 컬럼명에 맞게 매핑(부분 업데이트)
  const mappingData = mapSectionsToDb({[sectionId]: data});

  // weddDraft 행을 부분 업데이트하고 전체 행을 받아옴
  const result = await prisma.weddDraft.update({
    where: { weddingId },
    data: mappingData
  });

  // DB 행을 다시 서비스 레벨 섹션 구조로 매핑하여 반환
  return mapDbToSections(result);
};

/**
 * 여러 섹션 설정을 일괄 업데이트합니다(임시저장본).
 * @param weddingId - 대상 웨딩 ID
 * @param data - SetttingSections 객체(섹션 설정 배열 포함)
 * @throws 유효하지 않은 섹션 키가 발견되면 에러 발생
 */
export const updateWeddSectsSet = async (weddingId: string, data: SettingSections) => {
  const sections = data.sectionSettings;
  const invalidSection = sections.find((section: SectionSettings) => 
    !isSectionKey(section.sectionKey)
  );
  if (invalidSection) {
    throw new AppError(400, '존재하지 않는 섹션ID입니다.');
  };

  // 여러 update 쿼리를 배열로 만들어 트랜잭션으로 한 번에 실행(임시저장본)
  await prisma.$transaction(
    sections.map((section: SectionSettings) =>
      prisma.weddDraftSectSet.update({
        where: {
          weddingId_sectionKey: {
            weddingId: weddingId,
            sectionKey: section.sectionKey
          },
        },
        data: {
          displayOrder: section.displayOrder,
          displayYn: section.isVisible
        }
      })
    )
  );
};

/**
 * wedd 임시저장본을 적용본으로 만듭니다.
 * weddDraft의 모든 데이터를 wedd에 복사하고 섹션 설정도 함께 복사합니다.
 * @param weddingId - 적용할 웨딩의 ID
 * @returns 생성된 청첩장(WeddingInfoResponse)
 */
export const applyWedd = async (weddingId: string): Promise<WeddingInfoResponse> => {
  const result = await prisma.$transaction(async (tx) => {
    // 임시저장본 조회
    const weddDraft = await tx.weddDraft.findUnique({ where: { weddingId } });
    const weddDraftSectSet = await tx.weddDraftSectSet.findMany({ where: { weddingId } });
    const weddDraftMedia = await tx.weddDraftMedia.findMany({ where: { weddingId } });

    if (!weddDraft) {
      throw new AppError(404, '청첩장을 찾을 수 없습니다.');
    }

    // 기존 적용본 확인
    const existingWedd = await tx.wedd.findUnique({ where: { weddingId } });
    
    if(weddDraftMedia){
      // 파일 시스템에서 draft 폴더의 파일들을 apply 폴더로 이동
      const draftDir = join(process.cwd(), `uploads/draft/${weddingId}`);
      const applyDir = join(process.cwd(), `uploads/apply/${weddingId}`);

      // 기존 apply 삭제
      if (fs.existsSync(applyDir)) {
        await fsp.rm(applyDir, { recursive: true, force: true });
      }

      // draft → apply 로 폴더째 이동
      if (fs.existsSync(draftDir)) {
        await fsp.cp(draftDir, applyDir, { recursive: true });
      }

      // 이후 DB 경로 업데이트 예시
      for (const m of weddDraftMedia) {
        m.originalUrl = m.originalUrl?.replace('/draft/', '/apply/') || null;
        m.editedUrl = m.editedUrl?.replace('/draft/', '/apply/') || null;

        await tx.weddMedia.deleteMany({
          where: {
            weddingId: weddingId,
            mediaId: m.mediaId
          }
        });

        await tx.weddMedia.create({
          data: m
        });
      }
    }

    let wedd;
    if (existingWedd) {
      // 섹션 설정도 삭제 후 재생성
      await tx.weddSectSet.deleteMany({ where: { weddingId } });
      await tx.weddSectSet.createMany({
        data: weddDraftSectSet.map(sect => ({
          weddingId: sect.weddingId,
          sectionKey: sect.sectionKey,
          displayYn: sect.displayYn,
          displayOrder: sect.displayOrder
        }))
      });

      // 적용본이 있으면 삭제 후 재생성
      await tx.wedd.delete({ where: { weddingId } });
      wedd = await tx.wedd.create({
        data: weddDraft
      });
    } else {
      // 적용본이 없으면 생성
      wedd = await tx.wedd.create({
        data: weddDraft
      });

      // 섹션 설정도 생성
      await tx.weddSectSet.createMany({
        data: weddDraftSectSet.map(sect => ({
          weddingId: sect.weddingId,
          sectionKey: sect.sectionKey,
          displayYn: sect.displayYn,
          displayOrder: sect.displayOrder
        }))
      });
    }

    return { weddingId, wedd, sectionSettings: weddDraftSectSet };
  });

  return result;
};

/**
 * wedd 및 연관된 임시저장본/적용본/섹션/미디어를 삭제합니다.
 * 트랜잭션으로 묶어 일관성을 보장합니다.
 * @param weddingId - 삭제할 웨딩 ID
 */
export const deleteWedd = async (weddingId: string) => {
  // 주석: 트랜잭션 안에서 관련된 레코드들을 모두 삭제하여 참조 무결성을 보장합니다.
  await prisma.$transaction(async (tx) => {
    await tx.wedd.delete({ where: { weddingId } }).catch(() => null);
    await tx.weddDraft.delete({ where: { weddingId } }).catch(() => null);
    await tx.weddSectSet.deleteMany({ where: { weddingId } });
    await tx.weddDraftSectSet.deleteMany({ where: { weddingId } });
    await tx.weddMedia.deleteMany({ where: { weddingId } });
    await tx.weddDraftMedia.deleteMany({ where: { weddingId } });

    // 파일 시스템에서 관련 폴더들을 삭제
    const draftDir = join(process.cwd(), `uploads/draft/${weddingId}`);
    const applyDir = join(process.cwd(), `uploads/apply/${weddingId}`);

    if (fs.existsSync(draftDir)) {
      await fsp.rm(draftDir, { recursive: true, force: true });
    }
    if (fs.existsSync(applyDir)) {
      await fsp.rm(applyDir, { recursive: true, force: true });
    }
  })
};

/**
 * (임시) wedd 상세와 섹션 설정을 병합하여 정렬된 섹션 배열을 반환합니다.
 * 임시저장본 기준으로 동작합니다.
 * @param weddingId - 조회할 웨딩 ID
 * @returns 정렬된 섹션 객체 배열
 */
export const getWeddById2 = async (weddingId: string) => {
  const wedd = await prisma.weddDraft.findUnique({ where: { weddingId } });
  const weddSectSet = await prisma.weddDraftSectSet.findMany({ where: { weddingId }, orderBy: { displayOrder: 'asc' } });
  const sectionsMap: Record<string, any> = {
    main: {
      mainPosterStyle: wedd?.mainPosterStyle,
    },
    shareLink:{
      shareLinkTitle: wedd?.shareLinkTitle,
    },
    weddingInfo:{
      weddingInfoGroomLastName: wedd?.weddingInfoGroomLastName,
      weddingInfoGroomFirstName: wedd?.weddingInfoGroomFirstName,
      weddingInfoBrideLastName: wedd?.weddingInfoBrideLastName,
      weddingInfoBrideFirstName: wedd?.weddingInfoBrideFirstName,
      weddingInfoNameOrderType: wedd?.weddingInfoNameOrderType,
      weddingInfoYear: wedd?.weddingInfoYear,
      weddingInfoMonth: wedd?.weddingInfoMonth,
      weddingInfoDay: wedd?.weddingInfoDay,
      weddingInfoTimePeriod: wedd?.weddingInfoTimePeriod,
      weddingInfoHour: wedd?.weddingInfoHour,
      weddingInfoMinute: wedd?.weddingInfoMinute,
      weddingInfoHallName: wedd?.weddingInfoHallName,
      weddingInfoHallFloor: wedd?.weddingInfoHallFloor,
    },
    familyInfo:{
      familyInfoGroomFatherName: wedd?.familyInfoGroomFatherName,
      familyInfoGroomFatherDeceased: wedd?.familyInfoGroomFatherDeceased,
      familyInfoGroomMotherName: wedd?.familyInfoGroomMotherName,
      familyInfoGroomMotherDeceased: wedd?.familyInfoGroomMotherDeceased,
      familyInfoGroomRankName: wedd?.familyInfoGroomRankName,
      familyInfoBrideFatherName: wedd?.familyInfoBrideFatherName,
      familyInfoBrideFatherDeceased: wedd?.familyInfoBrideFatherDeceased,
      familyInfoBrideMotherName: wedd?.familyInfoBrideMotherName,
      familyInfoBrideMotherDeceased: wedd?.familyInfoBrideMotherDeceased,
      familyInfoBrideRankName: wedd?.familyInfoBrideRankName,
    },
    invitationMessage:{
      invitationMessageTitle: wedd?.invitationMessageTitle,
      invitationMessageContent: wedd?.invitationMessageContent,
    },
    coupleIntro:{
      coupleIntroTitle: wedd?.coupleIntroTitle,
      coupleIntroGroomMessage: wedd?.coupleIntroGroomMessage,
      coupleIntroBrideMessage: wedd?.coupleIntroBrideMessage,
    },
    parentsIntro:{
      parentsIntroTitle: wedd?.parentsIntroTitle,
      parentsIntroMessage: wedd?.parentsIntroMessage,
    },
    accountInfo: {
      accountInfoTitle: wedd?.accountInfoTitle,
      accountInfoMessage: wedd?.accountInfoMessage,
      accountInfoGroomBankName: wedd?.accountInfoGroomBankName,
      accountInfoGroomNumber: wedd?.accountInfoGroomNumber,
      accountInfoGroomHolder: wedd?.accountInfoGroomHolder,
      accountInfoGroomFatherBankName: wedd?.accountInfoGroomFatherBankName,
      accountInfoGroomFatherNumber: wedd?.accountInfoGroomFatherNumber,
      accountInfoGroomFatherHolder: wedd?.accountInfoGroomFatherHolder,
      accountInfoGroomMotherBankName: wedd?.accountInfoGroomMotherBankName,
      accountInfoGroomMotherNumber: wedd?.accountInfoGroomMotherNumber,
      accountInfoGroomMotherHolder: wedd?.accountInfoGroomMotherHolder,
      accountInfoBrideBankName: wedd?.accountInfoBrideBankName,
      accountInfoBrideNumber: wedd?.accountInfoBrideNumber,
      accountInfoBrideHolder: wedd?.accountInfoBrideHolder,
      accountInfoBrideFatherBankName: wedd?.accountInfoBrideFatherBankName,
      accountInfoBrideFatherNumber: wedd?.accountInfoBrideFatherNumber,
      accountInfoBrideFatherHolder: wedd?.accountInfoBrideFatherHolder,
      accountInfoBrideMotherBankName: wedd?.accountInfoBrideMotherBankName,
      accountInfoBrideMotherNumber: wedd?.accountInfoBrideMotherNumber,
      accountInfoBrideMotherHolder: wedd?.accountInfoBrideMotherHolder,
    },
    locationInfo:{
      locationInfoAddress: wedd?.locationInfoAddress,
      locationInfoAddressDetail: wedd?.locationInfoAddressDetail,
      locationInfoGuideMessage: wedd?.locationInfoGuideMessage,
      locationInfoTransport1Title: wedd?.locationInfoTransport1Title,
      locationInfoTransport1Message: wedd?.locationInfoTransport1Message,
      locationInfoTransport2Title: wedd?.locationInfoTransport2Title,
      locationInfoTransport2Message: wedd?.locationInfoTransport2Message,
      locationInfoTransport3Title: wedd?.locationInfoTransport3Title,
      locationInfoTransport3Message: wedd?.locationInfoTransport3Message,
    },
    themeFont:{
      themeFontName: wedd?.themeFontName,
      themeFontSize: wedd?.themeFontSize,
      themeFontBackgroundColor: wedd?.themeFontBackgroundColor,
      themeFontAccentColor: wedd?.themeFontAccentColor,
      themeFontZoomPreventYn: wedd?.themeFontZoomPreventYn,
    },
    loadingScreen:{
      loadingScreenStyle: wedd?.loadingScreenStyle,
    },
    gallery:{
      galleryTitle: wedd?.galleryTitle
    },
  };
  // 섹션 설정 순서에 맞춰 sectionsMap에서 데이터를 채워 반환
  const orderedSectons = weddSectSet.map((set) => ({
    sectionKey: set.sectionKey,
    displayOrder: set.displayOrder,
    isVisible: set.displayYn,
    data: sectionsMap[set.sectionKey] ?? null,
  }));
  return orderedSectons;
};
import prisma from '../../config/prisma';
import { AppError } from '../../core/errors/AppError';
import { SectionSettingsDb } from './wedd.types';
import { Sections, SectionSettings, SettingSections, WeddingInfoRequest, WeddingInfoResponse, WeddingTitle } from './wedd.schema';
import { mapDbToSections, mapDbToSectionSettings, mapSectionSettingsToDb, mapSectionsToDb } from './wedd.mapper';
import { isSectionKey, SECTION_KEYS } from './wedd.constants';
import path, { join } from 'path';
import fs from 'fs';
import fsp from 'fs/promises';
import { v4 as uuid } from "uuid";
import logger from '@/config/logger';

/**
 * 사용자의 모든 wedd를 조회합니다(임시저장본 기준).
 * @param userId - 조회할 사용자의 ID
 * @returns weddingId, weddingTitle, mainImageUrl 정보를 담은 배열
 */
export const getAllWedds = async (userId: string) => {
  logger.info("[wedd.service.ts][getAllWedds] Start", { userId });
  const result = await prisma.$queryRaw<Array<{ weddingId: string, weddingTitle: string, mainImageUrl: string}>>
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
  logger.info("[wedd.service.ts][getAllWedds] Complete", { userId, weddingId: result.map(r => r.weddingId) });
  return result;
};

/**
 * 단일 wedd 정보를 조회합니다.
 * @param weddingId - 조회할 웨딩 ID
 * @returns WeddingInfoResponse 형태의 객체
 */
export const getWeddById = async (userId: string, weddingId: string): Promise<WeddingInfoResponse> => {
  logger.info("[wedd.service.ts][getWeddById] Start", { userId, weddingId });
  const wedd = await prisma.wedd.findUnique({ where: { userId, weddingId } });
  if(!wedd)
    throw new AppError(404, '청첩장을 찾을 수 없습니다.');
  const weddSectSet = await prisma.weddSectSet.findMany({ where: { weddingId }, orderBy: { displayOrder: 'asc' } });
  const result = {
    sections: mapDbToSections(wedd),
    sectionSettings: mapDbToSectionSettings(weddSectSet)
  }
  logger.info("[wedd.service.ts][getWeddById] Complete", { userId, weddingId });
  return result
};

/**
 * 단일 wedd 임시저장본 정보를 조회합니다(getWeddById와 동일, 호환성 유지).
 * @param weddingId - 조회할 웨딩 ID
 * @returns WeddingInfoResponse 형태의 객체
 */
export const getWeddEditById = async (userId: string, weddingId: string): Promise<WeddingInfoResponse> => {
  logger.info("[wedd.service.ts][getWeddEditById] Start", { userId, weddingId });
  const wedd = await prisma.weddDraft.findUnique({ where: { userId, weddingId } });
  if(!wedd)
    throw new AppError(404, '청첩장을 찾을 수 없습니다.');
  const weddSectSet = await prisma.weddDraftSectSet.findMany({ where: { weddingId }, orderBy: { displayOrder: 'asc' } });
  
  const result = {
    sections: mapDbToSections(wedd),
    sectionSettings: mapDbToSectionSettings(weddSectSet)
  }
  logger.info("[wedd.service.ts][getWeddEditById] Complete", { userId, weddingId });
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
  logger.info("[wedd.service.ts][createWedd] Start", { userId });
  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({ where: { userId } });
    const now = new Date();
    // 1) weddDraft 레코드 생성(userId만 삽입)
    const weddDraft = await tx.weddDraft.create({
      data: { 
        userId: userId,
        weddingTitle: user?.userName ? `${user?.userName}의 청첩장` : '나의 청첩장',
        themeFontName: '1',
        themeFontSize: 14,
        themeFontBackgroundColor: '#FFF6FB',
        themeFontAccentColor: '#D28BB3',
        themeFontZoomPreventYn: false,
        familyInfoGroomRankName: '아들',
        familyInfoGroomFatherDeceased: false,
        familyInfoGroomMotherDeceased: false,
        familyInfoBrideRankName: '딸',
        familyInfoBrideFatherDeceased: false,
        familyInfoBrideMotherDeceased: false,
        weddingInfoNameOrderType: '1',
        weddingInfoYear: String(now.getFullYear()),
        weddingInfoMonth: String(now.getMonth() + 1),
        weddingInfoDay: String(now.getDate()),
        weddingInfoTimePeriod: '오전(AM)',
        weddingInfoHour: '09',
        weddingInfoMinute: '00',
        loadingScreenStyle: '1',
        mainPosterStyle: '1',
        invitationMessageTitle: '소중한 분들을 초대합니다',
        invitationMessageContent: `<p style="text-align:center;margin:0;">
                                    소중한 분들을 모시고<br/>
                                    저희 두 사람이 한마음으로<br/>
                                    새로운 삶을 시작하려 합니다.<br/><br/>
                                    서로를 깊이 존중하고 아끼는 마음으로<br/>
                                    기쁨은 나누고 어려움은 함께 이겨내며<br/>
                                    평생 사랑하겠습니다.<br/><br/>
                                    뜻깊은 시작의 자리에<br/>
                                    귀한 걸음으로 축복을 나눠주신다면<br/>
                                    더없는 기쁨이겠습니다.
                                    </p>`,
        coupleIntroTitle: '신랑 & 신부를 소개합니다',
        coupleIntroGroomMessage: '<p style="text-align:center;margin:0;">나무같은 남편이<br>되겠습니다</p>',
        coupleIntroBrideMessage: '<p style="text-align:center;margin:0;">햇살같은 아내가<br>되겠습니다</p>',
        parentsIntroTitle: '우리의 부모님',
        parentsIntroMessage: '저희의 시작을 사랑으로 응원해주신\n양가 부모님을 소개합니다.',
        galleryTitle: '우리의 소중한 순간',
        flipbookTitle: 'Our Love Moment',
        flipbookMessage: '스크롤을 내리면 우리 두 사람의\n특별한 이야기가 펼쳐져요',
        accountInfoTitle: '마음 전하실 곳',
        accountInfoMessage: '바쁜 일정으로 참석이 어려우신 분들을 위해\n'
                          + '소중한 마음을 전달하실 수 있도록\n'
                          + '계좌번호를 함께 안내드립니다.\n'
                          + '따듯한 축복에 깊이 감사드립니다.',
        locationInfoAddress: '서울특별시 용산구 한강대로 405',
        locationInfoTransport1Title: '지하철'
      }
    });
    logger.info("[wedd.service.ts][createWedd] weddDraft created", { userId, weddingId: weddDraft.weddingId });
    // 2) 모든 섹션에 대해 기본 섹션 설정을 생성(createMany)
    await tx.weddDraftSectSet.createMany({
      data: Object.values(SECTION_KEYS).map((key, index) => ({
        weddingId: weddDraft.weddingId,
        sectionKey: key,
        displayYn: true,
        displayOrder: index + 1,
      })),
    });
    logger.info("[wedd.service.ts][createWedd] weddDraftSectSet created", { userId, weddingId: weddDraft.weddingId });
    // 3) 생성된 섹션 설정을 조회하여 반환 형식으로 매핑
    const weddSectSet = await tx.weddDraftSectSet.findMany({ where: { weddingId: weddDraft.weddingId }, orderBy: { displayOrder: 'asc' } });
    return {
      weddingId: weddDraft.weddingId,
      sections: mapDbToSections(weddDraft),
      sectionSettins: mapDbToSectionSettings(weddSectSet)
    }
  });
  logger.info("[wedd.service.ts][createWedd] Complete", { userId, weddingId: result.weddingId });
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
export const replaceWedd = async (userId: string, weddingId: string, data: WeddingInfoRequest): Promise<WeddingInfoResponse> => {
  logger.info("[wedd.service.ts][replaceWedd] Start", { userId, weddingId });
  const wedd = await prisma.weddDraft.findUnique({ where: { userId, weddingId } });
  if(!wedd)
    throw new AppError(404, '청첩장을 찾을 수 없습니다.');
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
    logger.info("[wedd.service.ts][replaceWedd] weddDraft updated", { userId, weddingId });
    
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
    logger.info("[wedd.service.ts][replaceWedd] weddDraftSectSet updated", { userId, weddingId });
    return { weddingId, weddDraft, sectionSettings: WeddSectSet };
  });
  logger.info("[wedd.service.ts][replaceWedd] Complete", { weddingId });
  return result;
};

/**
 * 제목을 수정합니다.(임시저장본).
 * @param weddingId - 업데이트 대상 웨딩 ID
 * @param data - 청첩장 제목 데이터(WeddingTitle)
 * @returns 업데이트된 제목을 반환
 */
export const updateWeddTitle = async (userId: string, weddingId: string, data: WeddingTitle): Promise<WeddingTitle> => {
  logger.info("[wedd.service.ts][updateWeddTitle] Start", { userId, weddingId });
  const wedd = await prisma.weddDraft.findUnique({ where: { userId, weddingId } });
  if(!wedd)
    throw new AppError(404, '청첩장을 찾을 수 없습니다.');

  const result = await prisma.weddDraft.update({
    where: { weddingId },
    data: { weddingTitle: data.title }
  });
  logger.info("[wedd.service.ts][updateWeddTitle] Complete", { userId, weddingId });

  return {
    title: result.weddingTitle? result.weddingTitle : '',
  };
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
export const updateWeddSection = async (userId: string, weddingId: string, sectionId: string, data: Sections) => {
  logger.info("[wedd.service.ts][updateWeddSection] Start", { userId, weddingId, sectionId });
  if (!isSectionKey(sectionId)) {
    throw new AppError(400, "존재하지 않는 섹션ID입니다.");
  }
  const wedd = await prisma.weddDraft.findUnique({ where: { userId, weddingId } });
  if(!wedd)
    throw new AppError(404, '청첩장을 찾을 수 없습니다.');

  // 특정 섹션만 추출하여 DB 컬럼명에 맞게 매핑(부분 업데이트)
  const mappingData = mapSectionsToDb({[sectionId]: data});

  // weddDraft 행을 부분 업데이트하고 전체 행을 받아옴
  const result = await prisma.weddDraft.update({
    where: { weddingId },
    data: mappingData
  });
  logger.info("[wedd.service.ts][updateWeddSection] Complete", { userId, weddingId, sectionId });

  // DB 행을 다시 서비스 레벨 섹션 구조로 매핑하여 반환
  return mapDbToSections(result);
};

/**
 * 여러 섹션 설정을 일괄 업데이트합니다(임시저장본).
 * @param weddingId - 대상 웨딩 ID
 * @param data - SetttingSections 객체(섹션 설정 배열 포함)
 * @throws 유효하지 않은 섹션 키가 발견되면 에러 발생
 */
export const updateWeddSectsSet = async (userId: string, weddingId: string, data: SettingSections) => {
  logger.info("[wedd.service.ts][updateWeddSectsSet] Start", { userId, weddingId });
  const sections = data.sectionSettings;
  const invalidSection = sections.find((section: SectionSettings) => 
    !isSectionKey(section.sectionKey)
  );
  if (invalidSection) {
    throw new AppError(400, '존재하지 않는 섹션ID입니다.');
  };
  const wedd = await prisma.weddDraft.findUnique({ where: { userId, weddingId } });
  if(!wedd)
    throw new AppError(404, '청첩장을 찾을 수 없습니다.');

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
  logger.info("[wedd.service.ts][updateWeddSectsSet] Complete", { userId, weddingId });
};

/**
 * wedd 임시저장본을 적용본으로 만듭니다.
 * weddDraft의 모든 데이터를 wedd에 복사하고 섹션 설정도 함께 복사합니다.
 * @param weddingId - 적용할 웨딩의 ID
 * @returns 생성된 청첩장(WeddingInfoResponse)
 */
export const applyWedd = async (userId: string, weddingId: string): Promise<WeddingInfoResponse> => {
  logger.info("[wedd.service.ts][applyWedd] Start", { userId, weddingId });
  const result = await prisma.$transaction(async (tx) => {

    // 1. 드래프트 조회
    const weddDraft = await tx.weddDraft.findUnique({ where: { weddingId } });
    const weddDraftSectSet = await tx.weddDraftSectSet.findMany({ where: { weddingId } });
    const weddDraftMedia = await tx.weddDraftMedia.findMany({ where: { weddingId } });

    if (!weddDraft) {
      throw new AppError(404, '청첩장을 찾을 수 없습니다.');
    }

    // 기존 apply 데이터 존재 여부 확인
    const existingWedd = await tx.wedd.findUnique({ where: { weddingId } });

    // 2. apply 폴더 준비
    const draftDir = join(process.cwd(), `uploads/draft/${weddingId}`);
    const applyDir = join(process.cwd(), `uploads/apply/${weddingId}`);

    // 기존 apply 폴더 삭제
    if (fs.existsSync(applyDir)) {
      await fsp.rm(applyDir, { recursive: true, force: true });
      logger.info("[wedd.service.ts][applyWedd] Existing applyDir removed", { userId, weddingId });
    }
    await fsp.mkdir(applyDir, { recursive: true });
    logger.info("[wedd.service.ts][applyWedd] New applyDir made", { userId, weddingId });

    // 3. draftMedia → applyMedia 변환
    const newApplyMediaList = [];

    for (const m of weddDraftMedia) {
      const maxMedia = await tx.weddDraftMedia.aggregate({
        _max: { mediaId: true },
        where: { weddingId },
      });

      const nextMediaId = (maxMedia._max.mediaId ?? 0) + 1;
      logger.info("[wedd.service.ts][applyWedd] Read nextMediaId", { userId, weddingId, nextMediaId });

      // 파일 1개당 새 UUID 발급
      const newUUID = uuid();
      const ext = m.originalUrl?.split(".").pop() ?? "jpg";

      // draft 파일 경로 계산
      const draftFileName = m.originalUrl?.split("/").pop();
      const draftFilePath = join(draftDir, draftFileName!);

      // apply 파일명
      const newFileName = `${newUUID}.${ext}`;
      const newFilePath = join(applyDir, newFileName);

      // draft → apply (파일명 변경하여 복사)
      await fsp.copyFile(draftFilePath, newFilePath);
      logger.info("[wedd.service.ts][applyWedd] File copied", { userId, weddingId, draftPath: draftFilePath, applyPath: newFilePath });

      // DB용 데이터 구성
      newApplyMediaList.push({
        weddingId,
        mediaId: nextMediaId,
        imageType: m.imageType,
        originalUrl: `/uploads/apply/${weddingId}/${newFileName}`,
        editedUrl: m.editedUrl
          ? `/uploads/apply/${weddingId}/${newFileName}`
          : null
      });
    }

    logger.info("[wedd.service.ts][applyWedd] Media Data for DB", { userId, mediaDataList: newApplyMediaList });

    // 4. 기존 apply media 삭제
    await tx.weddMedia.deleteMany({ where: { weddingId } });
    logger.info("[wedd.service.ts][applyWedd] weddMedia deleted", { userId, weddingId });
    // 5. wedd 적용
    let wedd;
    if (existingWedd) {
      // 기존 weddSectSet 삭제
      await tx.weddSectSet.deleteMany({ where: { weddingId } });
      logger.info("[wedd.service.ts][applyWedd] weddSectSet deleted", { userId, weddingId });
      // 기존 wedd 삭제 후 재생성
      await tx.wedd.delete({ where: { weddingId } });
      logger.info("[wedd.service.ts][applyWedd] wedd deleted", { userId, weddingId });

      // wedd, weddSectSet 재생성
      wedd = await tx.wedd.create({ data: weddDraft });
      logger.info("[wedd.service.ts][applyWedd] wedd create", { userId, weddingId });
      await tx.weddSectSet.createMany({
        data: weddDraftSectSet.map((sect) => ({
          weddingId: sect.weddingId,
          sectionKey: sect.sectionKey,
          displayYn: sect.displayYn,
          displayOrder: sect.displayOrder,
        })),
      });
      logger.info("[wedd.service.ts][applyWedd] weddSectSet created", { userId, weddingId });
    } else {
      // wedd, weddSectSet 생성
      wedd = await tx.wedd.create({
        data: weddDraft,
      });
      logger.info("[wedd.service.ts][applyWedd] wedd create", { userId, weddingId });
      await tx.weddSectSet.createMany({
        data: weddDraftSectSet.map((sect) => ({
          weddingId: sect.weddingId,
          sectionKey: sect.sectionKey,
          displayYn: sect.displayYn,
          displayOrder: sect.displayOrder,
        })),
      });
      logger.info("[wedd.service.ts][applyWedd] weddSectSet create", { userId, weddingId });
    }

    // 6. apply media 생성
    await tx.weddMedia.createMany({
      data: newApplyMediaList,
    });
    logger.info("[wedd.service.ts][applyWedd] weddMedia created", { userId, weddingId });
    logger.info("[wedd.service.ts][applyWedd] Complete", { userId, weddingId });
    return { weddingId, wedd, sectionSettings: weddDraftSectSet };
  });

  return result;
};


/**
 * wedd 및 연관된 임시저장본/적용본/섹션/미디어를 삭제합니다.
 * 트랜잭션으로 묶어 일관성을 보장합니다.
 * @param weddingId - 삭제할 웨딩 ID
 */
export const deleteWedd = async (userId: string, weddingId: string) => {
  logger.info("[wedd.service.ts][deleteWedd] Start", { weddingId });
  const wedd = await prisma.weddDraft.findUnique({ where: { userId, weddingId } });
  if(!wedd)
    throw new AppError(404, '청첩장을 찾을 수 없습니다.');
  // 주석: 트랜잭션 안에서 관련된 레코드들을 모두 삭제하여 참조 무결성을 보장합니다.
  await prisma.$transaction(async (tx) => {
    await tx.wedd.delete({ where: { weddingId } }).catch(() => null);
    logger.info("[wedd.service.ts][deleteWedd] wedd deleted", { userId, weddingId });
    await tx.weddDraft.delete({ where: { weddingId } }).catch(() => null);
    logger.info("[wedd.service.ts][deleteWedd] weddDraft deleted", { userId, weddingId });
    await tx.weddSectSet.deleteMany({ where: { weddingId } });
    logger.info("[wedd.service.ts][deleteWedd] weddSectSet deleted", { userId, weddingId });
    await tx.weddDraftSectSet.deleteMany({ where: { weddingId } });
    logger.info("[wedd.service.ts][deleteWedd] weddDraftSectSet deleted", { userId, weddingId });
    await tx.weddMedia.deleteMany({ where: { weddingId } });
    logger.info("[wedd.service.ts][deleteWedd] weddMedia deleted", { userId, weddingId });
    await tx.weddDraftMedia.deleteMany({ where: { weddingId } });
    logger.info("[wedd.service.ts][deleteWedd] weddDraftMedia deleted", { userId, weddingId });

    // 파일 시스템에서 관련 폴더들을 삭제
    const draftDir = join(process.cwd(), `uploads/draft/${weddingId}`);
    const applyDir = join(process.cwd(), `uploads/apply/${weddingId}`);

    if (fs.existsSync(draftDir)) {
      await fsp.rm(draftDir, { recursive: true, force: true });
      logger.info("[wedd.service.ts][deleteWedd] draftDir removed", { userId, weddingId });
    }
    if (fs.existsSync(applyDir)) {
      await fsp.rm(applyDir, { recursive: true, force: true });
      logger.info("[wedd.service.ts][deleteWedd] applyDir removed", { userId, weddingId });
    }
  })
  logger.info("[wedd.service.ts][deleteWedd] Complete", { userId, weddingId });
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
import prisma from '../../config/prisma';
import { AppError } from '../../core/errors/AppError';
import { mapDbToSections, mapDbToSectionSettings, mapSectionsToDb } from './wedd.mapper';
import { Sections, SectionSettings, SectionSettingsDb, SetttingSections, WeddingInfoRequest, WeddingInfoResponse } from './wedd.types';
import { isSectionKey, SECTION_KEYS } from './wedd.constants';
import { WeddSectSet } from '@prisma/client';

/**
 * 사용자의 모든 wedd를 조회합니다.
 * @param userId - 조회할 사용자의 ID
 * @returns weddingId, weddingTitle, mainImageUrl 정보를 담은 배열
 */
export const getAllWedds = async (userId: string) => {
  return prisma.$queryRaw<Array<{ weddingId: number, weddingTitle: string, mainImageUrl: string}>>
    `
      SELECT
        WEDD.WEDD_ID AS weddingId,
        WEDD.WEDD_TTL AS weddingTitle,
        IFNULL(MEDIA.EDIT_URL, MEDIA.ORG_URL) AS  mainImageUrl
      FROM
        wedd WEDD
      LEFT JOIN wedd_media MEDIA
        ON WEDD.WEDD_ID = MEDIA.WEDD_ID
        AND MEDIA.IMG_TYPE = 'mainImage'
      WHERE
        WEDD.USER_ID = ${userId}
      ;
    `;
};

/**
 * 단일 wedd 정보를 조회합니다.
 * DB의 weddDtl과 weddSectSet을 조회하여 sections 및 sectionSettings로 매핑하여 반환합니다.
 * @param weddingId - 조회할 웨딩 ID
 * @returns WeddingInfoResponse 형태의 객체
 */
export const getWeddById = async (weddingId: number): Promise<WeddingInfoResponse> => {
  const wedd = await prisma.weddDtl.findUnique({ where: { weddingId } });
  const weddSectSet = await prisma.weddSectSet.findMany({ where: { weddingId }, orderBy: { displayOrder: 'asc' } });
  
  const result = {
    sections: mapDbToSections(wedd),
    sectionSettings: mapDbToSectionSettings(weddSectSet)
  }
  return result
};


/**
 * 새 wedd를 생성합니다.
 * wedd, weddDtl을 생성하고 기본 섹션 설정을 createMany로 추가합니다.
 * 트랜잭션 내에서 수행됩니다.
 * @param userId - 생성할 웨딩의 소유자 userId
 * @returns 생성된 웨딩 정보(WeddingInfoResponse)
 */
export const createWedd = async (userId: string): Promise<WeddingInfoResponse> => {
  const result = await prisma.$transaction(async (tx) => {
    const wedd = await tx.wedd.create({
      data: { userId }
    });
    const weddDtl = await tx.weddDtl.create({
      data: { weddingId: wedd.weddingId }
    });
    await tx.weddSectSet.createMany({
      data: Object.values(SECTION_KEYS).map((key, index) => ({
        weddingId: wedd.weddingId,
        sectionKey: key,
        displayYn: true,
        displayOrder: index + 1,
      })),
    });
    const weddSectSet = await tx.weddSectSet.findMany({ where: { weddingId: wedd.weddingId }, orderBy: { displayOrder: 'asc' } });
    return {
      weddingId: wedd.weddingId,
      sections: mapDbToSections(weddDtl),
      sectionSettins: mapDbToSectionSettings(weddSectSet)
    }
  });
  return result;
};

/**
 * 기존 wedd를 교체(업데이트)합니다.
 * sections를 DB 스키마로 매핑하여 weddDtl을 업데이트하고,
 * 전달된 sectionSettings를 기반으로 weddSectSet을 업데이트합니다.
 * @param weddingId - 업데이트할 웨딩 ID
 * @param data - 교체할 WeddingInfoRequest 데이터
 * @returns 업데이트된 WeddingInfoResponse
 * @throws 유효하지 않은 섹션키가 포함된 경우 에러 발생 가능
 */
export const replaceWedd = async (weddingId: number, data: WeddingInfoRequest): Promise<WeddingInfoResponse> => {
  const { sections, sectionSettings } = data as { sections: Sections, sectionSettings: SectionSettings[] };

  const weddDtlData = mapSectionsToDb(sections)

  // 이후 조율에 따라 수정하여 사용하거나 제거 필요
  const WeddSectSetDataListFromSection: SectionSettingsDb[] = [];
  if(sections !== undefined) {
    for (const [sectionKey, section] of Object.entries(sections)) {
      if(section?.isVisible && section?.displayOrder){
        WeddSectSetDataListFromSection.push({
          sectionKey: sectionKey,
          displayYn: section.isVisible,
          displayOrder: section.displayOrder
        })
      }
    }
  }

  let WeddSectSetDataList: SectionSettingsDb[] = mapDbToSectionSettings(sectionSettings ?? []);

  const result = await prisma.$transaction(async (tx) => {
    const weddDtl = await tx.weddDtl.update({
      where: { weddingId },
      data: weddDtlData
    });
    const WeddSectSet: WeddSectSet[] = [];
    for await (const WeddSectSetData of [...WeddSectSetDataListFromSection, ...WeddSectSetDataList ?? []]){
      
      WeddSectSet.push(await tx.weddSectSet.update({
        where: {weddingId_sectionKey: {
          weddingId,
          sectionKey: WeddSectSetData.sectionKey
        }},
        data: WeddSectSetData
      }));
    }
    
    // for await (const WeddSectSetData of WeddSectSetDataList){
    //   WeddSectSet.push(await tx.weddSectSet.update({
    //     where: {weddingId_sectionKey: {
    //       weddingId: WeddSectSetData.weddingId,
    //       sectionKey: WeddSectSetData.sectionKey
    //     }},
    //     data: WeddSectSetData
    //   }));
    // }
    
    return { weddingId, weddDtl, sectionSettings: WeddSectSet };
  });
  return result;
};

 /**
  * 단일 섹션을 업데이트합니다.
  * 섹션 키의 유효성을 검사하고 해당 섹션 필드만 weddDtl에 반영합니다.
  * @param weddingId - 업데이트 대상 웨딩 ID
  * @param sectionId - 업데이트할 섹션 키
  * @param data - 섹션 데이터(Sections)
  * @returns 업데이트된 sections 형태로 변환된 결과
  * @throws 존재하지 않는 섹션 키인 경우 에러 발생
  */
export const updateWeddSection = async (weddingId: number, sectionId: string, data: Sections) => {
  if (!isSectionKey(sectionId)) {
    throw new AppError(400, "존재하지 않는 섹션ID입니다.");
  }

  const mappingData = mapSectionsToDb({[sectionId]: data});

  const result = await prisma.weddDtl.update({
    where: { weddingId },
    data: mappingData
  });

return mapDbToSections(result);
};

/**
 * wedd 및 연관된 상세/섹션/미디어를 삭제합니다.
 * 트랜잭션으로 묶어 일관성을 보장합니다.
 * @param weddingId - 삭제할 웨딩 ID
 */
export const deleteWedd = async (weddingId: number) => {
  await prisma.$transaction(async (tx) => {
    await prisma.wedd.delete({ where: { weddingId } });
    await prisma.weddDtl.delete({ where: { weddingId } });
    await prisma.weddSectSet.deleteMany({ where: { weddingId } });
    await prisma.weddMedia.deleteMany({ where: { weddingId } });
  })
};

 /**
  * 여러 섹션 설정을 일괄 업데이트합니다.
  * 전달된 각 섹션의 키 유효성을 검사한 후 트랜잭션으로 displayOrder와 displayYn을 업데이트합니다.
  * @param weddingId - 대상 웨딩 ID
  * @param data - SetttingSections 객체(섹션 설정 배열 포함)
  * @throws 유효하지 않은 섹션 키가 발견되면 에러 발생
  */
export const updateWeddSectsSet = async (weddingId: number, data: SetttingSections) => {
  const sections = data.sectionSettings;
  const invalidSection = sections.find((section: SectionSettings) => 
    !isSectionKey(section.sectionKey)
  );
  if (invalidSection) {
    throw new AppError(400, '존재하지 않는 섹션ID입니다.');
  };

  await prisma.$transaction(
    sections.map((section: SectionSettings) =>
      prisma.weddSectSet.update({
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



// 임시 함수
/**
 * (임시) wedd 상세와 섹션 설정을 병합하여 정렬된 섹션 배열을 반환합니다.
 * 개발/디버깅 목적의 임시 유틸로, 실제 사용/리팩토링이 필요할 수 있습니다.
 * @param weddingId - 조회할 웨딩 ID
 * @returns 정렬된 섹션 객체 배열
 */
export const getWeddById2 = async (weddingId: number) => {
  const wedd = await prisma.weddDtl.findUnique({ where: { weddingId } });
  const weddSectSet = await prisma.weddSectSet.findMany({ where: { weddingId }, orderBy: { displayOrder: 'asc' } });
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
      weddingInfoDate: wedd?.weddingInfoDate,
      weddingInfoTimePeriod: wedd?.weddingInfoTimePeriod,
      weddingInfoTime: wedd?.weddingInfoTime,
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
  const orderedSectons = weddSectSet.map((set) => ({
    sectionKey: set.sectionKey,
    displayOrder: set.displayOrder,
    isVisible: set.displayYn,
    data: sectionsMap[set.sectionKey] ?? null,
  }));
  return orderedSectons;
};
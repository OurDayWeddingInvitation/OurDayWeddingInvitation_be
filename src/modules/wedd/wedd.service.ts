import prisma from '../../config/prisma';
import { mapDbToSections, mapDbToSectionSettings, mapSectionsToDb } from './wedd.mapper';
import { Sections, SectionSettings, SectionSettingsDb, SetttingSections, WeddingInfoRequest, WeddingInfoResponse } from './wedd.types';
import { isSectionKey, SECTION_KEYS } from './wedd.constants';
import { WeddSectSet } from '@prisma/client';

/**
 * 사용자의 모든 wedd 조회
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
 * 단일 wedd 조회
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
 * wedd 생성
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
 * wedd 교체
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

export const updateWeddSection = async (weddingId: number, sectionId: string, data: Sections) => {
  if (!isSectionKey(sectionId)) {
    throw new Error("존재하지 않는 섹션ID입니다.");
  }

  const mappingData = mapSectionsToDb({[sectionId]: data});

  const result = await prisma.weddDtl.update({
    where: { weddingId },
    data: mappingData
  });

return mapDbToSections(result);
};

/**
 * wedd 삭제
 */
export const deleteWedd = async (weddingId: number) => {
  await prisma.$transaction(async (tx) => {
    await prisma.wedd.delete({ where: { weddingId } });
    await prisma.weddDtl.delete({ where: { weddingId } });
    await prisma.weddSectSet.deleteMany({ where: { weddingId } });
    await prisma.weddMedia.deleteMany({ where: { weddingId } });
  })
};

export const updateWeddSectsSet = async (weddingId: number, data: SetttingSections) => {
  const sections = data.sectionSettings;
  const invalidSection = sections.find((section: SectionSettings) => 
    !isSectionKey(section.sectionKey)
  );
  if (invalidSection) {
    throw new Error(`${invalidSection.sectionKey}는 존재하지 않는 섹션입니다.`);
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
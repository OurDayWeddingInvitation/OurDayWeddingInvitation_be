import prisma from '../../config/prisma';
import common from '../../utils/common.util';

const VALID_SECTIONS = ["main", "shareLink", "weddingInfo", "familyInfo", "invitationMessage",
    "coupleIntro", "parentsIntro", "accountInfo", "locationInfo", "themeFont",
    "loadingScreen", "gallery", "flipbook", "sectionOrder"];

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
        WEDD WEDD
      LEFT JOIN WEDD_MEDIA MEDIA
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
export const getWeddById = async (weddingId: number) => {
  const wedd = await prisma.weddDtl.findUnique({ where: { weddingId } });
  const weddSectSet = await prisma.weddSectSet.findMany({ where: { weddingId }, orderBy: { displayOrder: 'asc' } });
  const result = {
    sections:{
      main: {
        posterStyle: wedd?.mainPosterStyle,
      },
      shareLink:{
        shareTitle: wedd?.shareLinkTitle,
      },
      weddingInfo:{
        groomLastName: wedd?.weddingInfoGroomLastName,
        groomFirstName: wedd?.weddingInfoGroomFirstName,
        brideLastName: wedd?.weddingInfoBrideLastName,
        brideFirstName: wedd?.weddingInfoBrideFirstName,
        nameOrderType: wedd?.weddingInfoNameOrderType,
        weddingDate: wedd?.weddingInfoDate,
        weddingTimePeriod: wedd?.weddingInfoTimePeriod,
        weddingTime: wedd?.weddingInfoTime,
        weddingHallName: wedd?.weddingInfoHallName,
        weddingHallFloor: wedd?.weddingInfoHallFloor,
      },
      familyInfo:{
        groomFatherName: wedd?.familyInfoGroomFatherName,
        groomFatherDeceased: wedd?.familyInfoGroomFatherDeceased,
        groomMotherName: wedd?.familyInfoGroomMotherName,
        groomMotherDeceased: wedd?.familyInfoGroomMotherDeceased,
        groomRankName: wedd?.familyInfoGroomRankName,
        brideFatherName: wedd?.familyInfoBrideFatherName,
        brideFatherDeceased: wedd?.familyInfoBrideFatherDeceased,
        brideMotherName: wedd?.familyInfoBrideMotherName,
        brideMotherDeceased: wedd?.familyInfoBrideMotherDeceased,
        brideRankName: wedd?.familyInfoBrideRankName,
      },
      invitationMessage:{
        title: wedd?.invitationMessageTitle,
        message: wedd?.invitationMessageContent,
      },
      coupleIntro:{
        title: wedd?.coupleIntroTitle,
        groomIntro: wedd?.coupleIntroGroomMessage,
        brideIntro: wedd?.coupleIntroBrideMessage,
      },
      parentsIntro:{
        title: wedd?.parentsIntroTitle,
        message: wedd?.parentsIntroMessage,
      },
      accountInfo: {
        title: wedd?.accountInfoTitle,
        message: wedd?.accountInfoMessage,
        groomBankName: wedd?.accountInfoGroomBankName,
        groomNumber: wedd?.accountInfoGroomNumber,
        groomHolder: wedd?.accountInfoGroomHolder,
        groomFatherBankName: wedd?.accountInfoGroomFatherBankName,
        groomFatherNumber: wedd?.accountInfoGroomFatherNumber,
        groomFatherHolder: wedd?.accountInfoGroomFatherHolder,
        groomMotherBankName: wedd?.accountInfoGroomMotherBankName,
        groomMotherNumber: wedd?.accountInfoGroomMotherNumber,
        groomMotherHolder: wedd?.accountInfoGroomMotherHolder,
        brideBankName: wedd?.accountInfoBrideBankName,
        brideNumber: wedd?.accountInfoBrideNumber,
        brideHolder: wedd?.accountInfoBrideHolder,
        brideFatherBankName: wedd?.accountInfoBrideFatherBankName,
        brideFatherNumber: wedd?.accountInfoBrideFatherNumber,
        brideFatherHolder: wedd?.accountInfoBrideFatherHolder,
        brideMotherBankName: wedd?.accountInfoBrideMotherBankName,
        brideMotherNumber: wedd?.accountInfoBrideMotherNumber,
        brideMotherHolder: wedd?.accountInfoBrideMotherHolder,
      },
      locationInfo:{
        address: wedd?.locationInfoAddress,
        addressDetail: wedd?.locationInfoAddressDetail,
        guideMessage: wedd?.locationInfoGuideMessage,
        transport1Title: wedd?.locationInfoTransport1Title,
        transport1Message: wedd?.locationInfoTransport1Message,
        transport2Title: wedd?.locationInfoTransport2Title,
        transport2Message: wedd?.locationInfoTransport2Message,
        transport3Title: wedd?.locationInfoTransport3Title,
        transport3Message: wedd?.locationInfoTransport3Message,
      },
      themeFont:{
        fontName: wedd?.themeFontName,
        fontSize: wedd?.themeFontSize,
        backgroundColor: wedd?.themeFontBackgroundColor,
        accentColor: wedd?.themeFontAccentColor,
        zoomPreventYn: wedd?.themeFontZoomPreventYn,
      },
      loadingScreen:{
        design: wedd?.loadingScreenStyle,
      },
      gallery:{
        title: wedd?.galleryTitle
      },
      flipbook:{}
    },
    sectionSettings: weddSectSet
  }
  return result
};
/**
 * 단일 wedd 조회
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

/**
 * wedd 생성
 */
export const createWedd = async (userId: string, data: any) => {
  // const { border } = data;

  const result = await prisma.$transaction(async (tx) => {
    // delete border.weddingId;
    const wedd = await tx.wedd.create({
      data: { userId }
    });
    const weddDtl = await tx.weddDtl.create({
      data: { weddingId: wedd.weddingId }
    });
    await tx.weddSectSet.createMany({
      data: VALID_SECTIONS.map((key, index) => ({
        weddingId: wedd.weddingId,
        sectionKey: key,
        displayYn: true,
        displayOrder: index + 1,
      })),
    });
    const weddSectSet = await tx.weddSectSet.findMany({ where: { weddingId: wedd.weddingId }, orderBy: { displayOrder: 'asc' } });
    return {
      weddingId: wedd.weddingId,
      sections:{
        main: {
          posterStyle: weddDtl?.mainPosterStyle,
        },
        shareLink:{
          shareTitle: weddDtl?.shareLinkTitle,
        },
        weddingInfo:{
          groomLastName: weddDtl?.weddingInfoGroomLastName,
          groomFirstName: weddDtl?.weddingInfoGroomFirstName,
          brideLastName: weddDtl?.weddingInfoBrideLastName,
          brideFirstName: weddDtl?.weddingInfoBrideFirstName,
          nameOrderType: weddDtl?.weddingInfoNameOrderType,
          weddingDate: weddDtl?.weddingInfoDate,
          weddingTimePeriod: weddDtl?.weddingInfoTimePeriod,
          weddingTime: weddDtl?.weddingInfoTime,
          weddingHallName: weddDtl?.weddingInfoHallName,
          weddingHallFloor: weddDtl?.weddingInfoHallFloor,
        },
        familyInfo:{
          groomFatherName: weddDtl?.familyInfoGroomFatherName,
          groomFatherDeceased: weddDtl?.familyInfoGroomFatherDeceased,
          groomMotherName: weddDtl?.familyInfoGroomMotherName,
          groomMotherDeceased: weddDtl?.familyInfoGroomMotherDeceased,
          groomRankName: weddDtl?.familyInfoGroomRankName,
          brideFatherName: weddDtl?.familyInfoBrideFatherName,
          brideFatherDeceased: weddDtl?.familyInfoBrideFatherDeceased,
          brideMotherName: weddDtl?.familyInfoBrideMotherName,
          brideMotherDeceased: weddDtl?.familyInfoBrideMotherDeceased,
          brideRankName: weddDtl?.familyInfoBrideRankName,
        },
        invitationMessage:{
          title: weddDtl?.invitationMessageTitle,
          message: weddDtl?.invitationMessageContent,
        },
        coupleIntro:{
          title: weddDtl?.coupleIntroTitle,
          groomIntro: weddDtl?.coupleIntroGroomMessage,
          brideIntro: weddDtl?.coupleIntroBrideMessage,
        },
        parentsIntro:{
          title: weddDtl?.parentsIntroTitle,
          message: weddDtl?.parentsIntroMessage,
        },
        accountInfo: {
          title: weddDtl?.accountInfoTitle,
          message: weddDtl?.accountInfoMessage,
          groomBankName: weddDtl?.accountInfoGroomBankName,
          groomNumber: weddDtl?.accountInfoGroomNumber,
          groomHolder: weddDtl?.accountInfoGroomHolder,
          groomFatherBankName: weddDtl?.accountInfoGroomFatherBankName,
          groomFatherNumber: weddDtl?.accountInfoGroomFatherNumber,
          groomFatherHolder: weddDtl?.accountInfoGroomFatherHolder,
          groomMotherBankName: weddDtl?.accountInfoGroomMotherBankName,
          groomMotherNumber: weddDtl?.accountInfoGroomMotherNumber,
          groomMotherHolder: weddDtl?.accountInfoGroomMotherHolder,
          brideBankName: weddDtl?.accountInfoBrideBankName,
          brideNumber: weddDtl?.accountInfoBrideNumber,
          brideHolder: weddDtl?.accountInfoBrideHolder,
          brideFatherBankName: weddDtl?.accountInfoBrideFatherBankName,
          brideFatherNumber: weddDtl?.accountInfoBrideFatherNumber,
          brideFatherHolder: weddDtl?.accountInfoBrideFatherHolder,
          brideMotherBankName: weddDtl?.accountInfoBrideMotherBankName,
          brideMotherNumber: weddDtl?.accountInfoBrideMotherNumber,
          brideMotherHolder: weddDtl?.accountInfoBrideMotherHolder,
        },
        locationInfo:{
          address: weddDtl?.locationInfoAddress,
          addressDetail: weddDtl?.locationInfoAddressDetail,
          guideMessage: weddDtl?.locationInfoGuideMessage,
          transport1Title: weddDtl?.locationInfoTransport1Title,
          transport1Message: weddDtl?.locationInfoTransport1Message,
          transport2Title: weddDtl?.locationInfoTransport2Title,
          transport2Message: weddDtl?.locationInfoTransport2Message,
          transport3Title: weddDtl?.locationInfoTransport3Title,
          transport3Message: weddDtl?.locationInfoTransport3Message,
        },
        themeFont:{
          fontName: weddDtl?.themeFontName,
          fontSize: weddDtl?.themeFontSize,
          backgroundColor: weddDtl?.themeFontBackgroundColor,
          accentColor: weddDtl?.themeFontAccentColor,
          zoomPreventYn: weddDtl?.themeFontZoomPreventYn,
        },
        loadingScreen:{
          design: weddDtl?.loadingScreenStyle,
        },
        gallery:{
          title: weddDtl?.galleryTitle
        },
        flipbook:{}
      },
      sectionSettings: weddSectSet
    }
  });
  return result;  
};

/**
 * wedd 교체
 */
export const replaceWedd = async (weddingId: number, data: any) => {
  const { sections, sectionSettings } = data as { sections: any, sectionSettings: any[] };
  const mainSection = sections.main;
  const shareLinkSection = sections.shareLink;
  const weddingInfoSection = sections.weddingInfo;
  const familyInfoSection = sections.familyInfo;
  const invitationMessageSection = sections.invitationMessage;
  const coupleIntroSection = sections.coupleIntro;
  const parentsIntroSection = sections.parentsIntro;
  const accountInfoSection = sections.accountInfo;
  const locationInfoSection = sections.locationInfo;
  const themeFontSection = sections.themeFont;
  const loadingScreenSection = sections.loadingScreen;
  const gallerySection = sections.gallery;

  const weddDtlData = {
    /** 메인 포스터 */
    mainPosterStyle: mainSection.posterStyle,

    /** 공유 링크 */
    shareLinkTitle: shareLinkSection.shareTitle,

    /** 예식 기본 정보 */
    weddingInfoGroomLastName: weddingInfoSection.groomLastName,
    weddingInfoGroomFirstName: weddingInfoSection.groomFirstName,
    weddingInfoBrideLastName: weddingInfoSection.brideLastName,
    weddingInfoBrideFirstName: weddingInfoSection.brideFirstName,
    weddingInfoNameOrderType: weddingInfoSection.nameOrderType,
    weddingInfoDate: weddingInfoSection.weddingDate,
    weddingInfoTime: weddingInfoSection.weddingTime,
    weddingInfoHallName: weddingInfoSection.weddingHallName,
    weddingInfoHallFloor: weddingInfoSection.weddingHallFloor,

    /** 혼주 정보 */
    familyInfoGroomFatherName: familyInfoSection.groomFatherName,
    familyInfoGroomFatherDeceased: familyInfoSection.groomFatherDeceased,
    familyInfoGroomMotherName: familyInfoSection.groomMotherName,
    familyInfoGroomMotherDeceased: familyInfoSection.groomMotherDeceased,
    familyInfoGroomRankName: familyInfoSection.groomRankName,
    familyInfoBrideFatherName: familyInfoSection.brideFatherName,
    familyInfoBrideFatherDeceased: familyInfoSection.brideFatherDeceased,
    familyInfoBrideMotherName: familyInfoSection.brideMotherName,
    familyInfoBrideMotherDeceased: familyInfoSection.brideMotherDeceased,
    familyInfoBrideRankName: familyInfoSection.brideRankName,

    /** 초대 메시지 */
    invitationMessageTitle: invitationMessageSection.title,
    invitationMessageContent: invitationMessageSection.message,

    /** 신랑/신부 소개 */
    coupleIntroTitle: coupleIntroSection.title,
    coupleIntroGroomMessage: coupleIntroSection.groomIntro,
    coupleIntroBrideMessage: coupleIntroSection.brideIntro,

    /** 부모님 소개 */
    parentsIntroTitle: parentsIntroSection.title,
    parentsIntroMessage: parentsIntroSection.message,

    /** 계좌 정보 */
    accountInfoTitle: accountInfoSection.title,
    accountInfoMessage: accountInfoSection.message,
    accountInfoGroomBankName: accountInfoSection.groomBankName,
    accountInfoGroomNumber: accountInfoSection.groomNumber,
    accountInfoGroomHolder: accountInfoSection.groomHolder,
    accountInfoGroomFatherBankName: accountInfoSection.groomFatherBankName,
    accountInfoGroomFatherNumber: accountInfoSection.groomFatherNumber,
    accountInfoGroomFatherHolder: accountInfoSection.groomFatherHolder,
    accountInfoGroomMotherBankName: accountInfoSection.groomMotherBankName,
    accountInfoGroomMotherNumber: accountInfoSection.groomMotherNumber,
    accountInfoGroomMotherHolder: accountInfoSection.groomMotherHolder,
    accountInfoBrideBankName: accountInfoSection.brideBankName,
    accountInfoBrideNumber: accountInfoSection.brideNumber,
    accountInfoBrideHolder: accountInfoSection.brideHolder,
    accountInfoBrideFatherBankName: accountInfoSection.brideFatherBankName,
    accountInfoBrideFatherNumber: accountInfoSection.brideFatherNumber,
    accountInfoBrideFatherHolder: accountInfoSection.brideFatherHolder,
    accountInfoBrideMotherBankName: accountInfoSection.brideMotherBankName,
    accountInfoBrideMotherNumber: accountInfoSection.brideMotherNumber,
    accountInfoBrideMotherHolder: accountInfoSection.brideMotherHolder,

    /** 오시는 길 */
    locationInfoAddress: locationInfoSection.address,
    locationInfoAddressDetail: locationInfoSection.addressDetail,
    locationInfoGuideMessage: locationInfoSection.guideMessage,
    locationInfoTransport1Title: locationInfoSection.transport1Title,
    locationInfoTransport1Message: locationInfoSection.transport1Message,
    locationInfoTransport2Title: locationInfoSection.transport2Title,
    locationInfoTransport2Message: locationInfoSection.transport2Message,
    locationInfoTransport3Title: locationInfoSection.transport3Title,
    locationInfoTransport3Message: locationInfoSection.transport3Message,

    /** 테마 / 폰트 */
    themeFontName: themeFontSection.fontName,
    themeFontSize: themeFontSection.fontSize,
    themeFontBackgroundColor: themeFontSection.backgroundColor,
    themeFontAccentColor: themeFontSection.accentColor,
    themeFontZoomPreventYn: themeFontSection.zoomPreventYn,

    /** 로딩 화면 */
    loadingScreenStyle: loadingScreenSection.design,

    /** 갤러리 */
    galleryTitle: gallerySection.title
  };

  const WeddSectSetDataListFromSection = [] as any[];
  for (const [sectKey, section] of Object.entries(sections) as [string, any]) {
    if(!section.displayYn && section.displayOrDr){
      WeddSectSetDataListFromSection.push({
        weddingId: weddingId,
        sectKey: sectKey as string,
        displayYn: section.displayYn as string,
        displayOrDr: section.displayOrDr as string
      })
    }
  }

  const WeddSectSetDataList = sectionSettings.map(obj => ({
    weddingId: weddingId,
    ...obj
  }));

  const result = await prisma.$transaction(async (tx) => {
    const weddDtl = await tx.weddDtl.update({
      where: { weddingId },
      data: weddDtlData
    });
    const WeddSectSet = [] as any[];
    for await (const WeddSectSetData of [...WeddSectSetDataListFromSection, ...WeddSectSetDataList]){
      console.log(...WeddSectSetDataListFromSection, ...WeddSectSetDataList)
      console.log(WeddSectSetData)
      
      WeddSectSet.push(await tx.weddSectSet.update({
        where: {weddingId_sectionKey: {
          weddingId: WeddSectSetData.weddingId,
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

export const updateWeddSection = async (weddingId: number, sectionId: string, data: any) => {
  if (!VALID_SECTIONS.includes(sectionId)) {
    throw new Error("존재하지 않는 섹션ID입니다.");
  }

  const mappingData = common.mapSectionPayloadToDb(sectionId, data);

  const result = await prisma.weddDtl.update({
    where: { weddingId },
    data: mappingData
  });

  return result;
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

export const updateWeddSectsSet = async (weddingId: number, data: any) => {
  const sections = data.sections;
  const invalidSection = sections.find((section: any) => 
    !VALID_SECTIONS.includes(section.sectionKey)
  );
  if (invalidSection) {
    throw new Error(`${sections.sectionKey}는 존재하지 않는 섹션입니다.`);
  };

  await prisma.$transaction(
    sections.map((section: any) =>
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
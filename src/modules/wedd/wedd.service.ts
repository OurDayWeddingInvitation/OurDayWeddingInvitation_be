import prisma from '../../config/prisma';

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
    weddingId: wedd?.weddingId,
    sections:{
      mainSection: {
        mainPosterStyle: wedd?.mainPosterStyle,
      },
      shareLinkSection:{
        shareLinkTitle: wedd?.shareLinkTitle,
      },
      weddingInfoSection:{
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
      familyInfoSection:{
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
      invitationMessageSection:{
        invitationMessageTitle: wedd?.invitationMessageTitle,
        invitationMessageContent: wedd?.invitationMessageContent,
      },
      coupleIntroSection:{
        coupleIntroTitle: wedd?.coupleIntroTitle,
        coupleIntroGroomMessage: wedd?.coupleIntroGroomMessage,
        coupleIntroBrideMessage: wedd?.coupleIntroBrideMessage,
      },
      parentsIntroSection:{
        parentsIntroTitle: wedd?.parentsIntroTitle,
        parentsIntroMessage: wedd?.parentsIntroMessage,
      },
      accountInfoSection: {
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
      locationInfoSection:{
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
      themeFontSection:{
        themeFontName: wedd?.themeFontName,
        themeFontSize: wedd?.themeFontSize,
        themeFontBackgroundColor: wedd?.themeFontBackgroundColor,
        themeFontAccentColor: wedd?.themeFontAccentColor,
        themeFontZoomPreventYn: wedd?.themeFontZoomPreventYn,
      },
      loadingScreenSection:{
        loadingScreenStyle: wedd?.loadingScreenStyle,
      },
      gallerySection:{
        galleryTitle: wedd?.galleryTitle
      },
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
  const { border } = data;

  const result = await prisma.$transaction(async (tx) => {
    delete border.weddingId;
    const wedd = await tx.wedd.create({
      data: { ...border, userId }
    });
    const weddDtl = await tx.weddDtl.create({
      data: { weddingId: wedd.weddingId }
    });
    const WeddSectSet = await tx.weddSectSet.createMany({
      data: VALID_SECTIONS.map((key, index) => ({
        weddingId: wedd.weddingId,
        sectionKey: key,
        displayYn: true,
        displayOrder: index + 1,
      })),
    });
    return { wedd, weddDtl, WeddSectSet }
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
    weddingId: weddingId,

    /** 메인 포스터 */
    mainPosterStyle: mainSection.mainPosterStyle,

    /** 공유 링크 */
    shareLinkTitle: shareLinkSection.shareLinkTitle,

    /** 예식 기본 정보 */
    weddingInfoGroomLastName: weddingInfoSection.weddingInfoGroomLastName,
    weddingInfoGroomFirstName: weddingInfoSection.weddingInfoGroomFirstName,
    weddingInfoBrideLastName: weddingInfoSection.weddingInfoBrideLastName,
    weddingInfoBrideFirstName: weddingInfoSection.weddingInfoBrideFirstName,
    weddingInfoNameOrderType: weddingInfoSection.weddingInfoNameOrderType,
    weddingInfoDate: weddingInfoSection.weddingInfoDate,
    weddingInfoTime: weddingInfoSection.weddingInfoTime,
    weddingInfoHallName: weddingInfoSection.weddingInfoHallName,
    weddingInfoHallFloor: weddingInfoSection.weddingInfoHallFloor,

    /** 혼주 정보 */
    familyInfoGroomFatherName: familyInfoSection.familyInfoGroomFatherName,
    familyInfoGroomFatherDeceased: familyInfoSection.familyInfoGroomFatherDeceased,
    familyInfoGroomMotherName: familyInfoSection.familyInfoGroomMotherName,
    familyInfoGroomMotherDeceased: familyInfoSection.familyInfoGroomMotherDeceased,
    familyInfoGroomRankName: familyInfoSection.familyInfoGroomRankName,
    familyInfoBrideFatherName: familyInfoSection.familyInfoBrideFatherName,
    familyInfoBrideFatherDeceased: familyInfoSection.familyInfoBrideFatherDeceased,
    familyInfoBrideMotherName: familyInfoSection.familyInfoBrideMotherName,
    familyInfoBrideMotherDeceased: familyInfoSection.familyInfoBrideMotherDeceased,
    familyInfoBrideRankName: familyInfoSection.familyInfoBrideRankName,

    /** 초대 메시지 */
    invitationMessageTitle: invitationMessageSection.invitationMessageTitle,
    invitationMessageContent: invitationMessageSection.invitationMessageContent,

    /** 신랑/신부 소개 */
    coupleIntroTitle: coupleIntroSection.coupleIntroTitle,
    coupleIntroGroomMessage: coupleIntroSection.coupleIntroGroomMessage,
    coupleIntroBrideMessage: coupleIntroSection.coupleIntroBrideMessage,

    /** 부모님 소개 */
    parentsIntroTitle: parentsIntroSection.parentsIntroTitle,
    parentsIntroMessage: parentsIntroSection.parentsIntroMessage,

    /** 계좌 정보 */
    accountInfoTitle: accountInfoSection.accountInfoTitle,
    accountInfoMessage: accountInfoSection.accountInfoMessage,
    accountInfoGroomBankName: accountInfoSection.accountInfoGroomBankName,
    accountInfoGroomNumber: accountInfoSection.accountInfoGroomNumber,
    accountInfoGroomHolder: accountInfoSection.accountInfoGroomHolder,
    accountInfoGroomFatherBankName: accountInfoSection.accountInfoGroomFatherBankName,
    accountInfoGroomFatherNumber: accountInfoSection.accountInfoGroomFatherNumber,
    accountInfoGroomFatherHolder: accountInfoSection.accountInfoGroomFatherHolder,
    accountInfoGroomMotherBankName: accountInfoSection.accountInfoGroomMotherBankName,
    accountInfoGroomMotherNumber: accountInfoSection.accountInfoGroomMotherNumber,
    accountInfoGroomMotherHolder: accountInfoSection.accountInfoGroomMotherHolder,
    accountInfoBrideBankName: accountInfoSection.accountInfoBrideBankName,
    accountInfoBrideNumber: accountInfoSection.accountInfoBrideNumber,
    accountInfoBrideHolder: accountInfoSection.accountInfoBrideHolder,
    accountInfoBrideFatherBankName: accountInfoSection.accountInfoBrideFatherBankName,
    accountInfoBrideFatherNumber: accountInfoSection.accountInfoBrideFatherNumber,
    accountInfoBrideFatherHolder: accountInfoSection.accountInfoBrideFatherHolder,
    accountInfoBrideMotherBankName: accountInfoSection.accountInfoBrideMotherBankName,
    accountInfoBrideMotherNumber: accountInfoSection.accountInfoBrideMotherNumber,
    accountInfoBrideMotherHolder: accountInfoSection.accountInfoBrideMotherHolder,

    /** 오시는 길 */
    locationInfoAddress: locationInfoSection.locationInfoAddress,
    locationInfoAddressDetail: locationInfoSection.locationInfoAddressDetail,
    locationInfoGuideMessage: locationInfoSection.locationInfoGuideMessage,
    locationInfoTransport1Title: locationInfoSection.locationInfoTransport1Title,
    locationInfoTransport1Message: locationInfoSection.locationInfoTransport1Message,
    locationInfoTransport2Title: locationInfoSection.locationInfoTransport2Title,
    locationInfoTransport2Message: locationInfoSection.locationInfoTransport2Message,
    locationInfoTransport3Title: locationInfoSection.locationInfoTransport3Title,
    locationInfoTransport3Message: locationInfoSection.locationInfoTransport3Message,

    /** 테마 / 폰트 */
    themeFontName: themeFontSection.themeFontName,
    themeFontSize: themeFontSection.themeFontSize,
    themeFontBackgroundColor: themeFontSection.themeFontBackgroundColor,
    themeFontAccentColor: themeFontSection.themeFontAccentColor,
    themeFontZoomPreventYn: themeFontSection.themeFontZoomPreventYn,

    /** 로딩 화면 */
    loadingScreenStyle: loadingScreenSection.loadingScreenStyle,

    /** 갤러리 */
    galleryTitle: gallerySection.galleryTitle
  };


  const WeddSectSetDataListFromSection = [] as any[];
  for (const [sectKey, section] of Object.entries(sections) as [string, any]) {
    WeddSectSetDataListFromSection.push({
      weddingId: weddingId,
      sectKey: sectKey as string,
      displayYn: section.displayYn as string,
      displayOrDr: section.displayOrDr as string
    })
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
      WeddSectSet.push(await tx.weddSectSet.update({
        where: {weddingId_sectionKey: {
          weddingId: WeddSectSetData.weddingId,
          sectionKey: WeddSectSetData.sectionKey
        }},
        data: WeddSectSetData
      }));
    }
    return { weddingId, weddDtl, WeddSectSet };
  });
  return result;
};

export const updateWeddSection = async (weddingId: number, sectionId: string, data: any) => {
  if (!VALID_SECTIONS.includes(sectionId)) {
    throw new Error("존재하지 않는 섹션ID입니다.");
  }

  const result = await prisma.weddDtl.update({
    where: { weddingId },
    data
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
    !VALID_SECTIONS.includes(section.id)
  );

  if (!invalidSection) {
    throw new Error(`${invalidSection.id}는 존재하지 않는 섹션입니다.`);
  };

  await prisma.$transaction(
    sections.map((section: any) =>
      prisma.weddSectSet.update({
        where: {
          weddingId_sectionKey: {
            weddingId: weddingId,
            sectionKey: section.id
          },
        },
        data: {
          displayOrder: section.order,
          displayYn: section.isVisible
        }
      })
    )
  );
};
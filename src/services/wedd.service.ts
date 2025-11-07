import prisma from '../prisma/client';

/**
 * 사용자의 모든 wedd 조회
 */
export const getAllWedds = async (userId: string) => {
  return await prisma.wedd.findMany({ where: { userId } })
}

/**
 * 단일 wedd 조회
 */
export const getWeddById = async (weddId: number) => {
  return await prisma.wedd.findUnique({ where: { weddId } });
};

/**
 * wedd 생성
 */
export const createWedd = async (userId: string, data: any) => {
  const { border } = data;
  const defaultSections = [
    "main",
    "shareLink",
    "weddingInfo",
    "familyInfo",
    "invitationMessage",
    "coupleIntro",
    "parentsIntro",
    "accountInfo",
    "locationInfo",
    "themeFont",
    "loadingScreen",
    "gallery",
    "flipbook",
  ];

  const result = await prisma.$transaction(async (tx) => {
    const wedd = await tx.wedd.create({
      data: border
    });
    const weddDtl = await tx.weddDtl.create({
      data: {
        weddId: border.weddId
      }
    });
    const weddSectOrdr = await tx.weddSectOrdr.createMany({
      data: defaultSections.map((key, index) => ({
        weddId: border.weddId,
        sectKey: key,
        displayYn: "Y",
        displayOrdr: index + 1,
      })),
    });
    return { wedd, weddDtl, weddSectOrdr }
  });

  return result;
};

/**
 * wedd 수정
 */
export const updateWedd = async (weddId: number, data: any) => {
  const { border, sections, weddSectOrdr } = data as { border: any, sections: any, weddSectOrdr: any[] };
  const mainSection = sections.main;
  const shareLinkSection = sections.main;
  const weddingInfoSection = sections.main;
  const familyInfoSection = sections.main;
  const invitationMessageSection = sections.main;
  const coupleIntroSection = sections.main;
  const parentsIntroSection = sections.main;
  const accountInfoSection = sections.main;
  const locationInfoSection = sections.main;
  const themeFontSection = sections.main;
  const loadingScreenSection = sections.main;
  const gallerySection = sections.main;

  //url 생성 로직 개발 필요
  const weddSlug = '';

  const wwedData = {
    weddId: weddId,
    weddTtl: border.weddTtl,
    weddSlug: weddSlug,
  };
  const weddDtlData = {
    weddId: weddId,
    /** 메인 포스터 */
    mainPosterStyl: mainSection.mainPosterStyl,
    /** 공유 링크 */
    shrTtl: shareLinkSection.shrTtl,
    /** 예식 기본 정보 */
    infoGrmLastNm: weddingInfoSection.infoGrmLastNm,
    infoGrmFirstNm: weddingInfoSection.infoGrmFirstNm,
    infoBrdLastNm: weddingInfoSection.infoBrdLastNm,
    infoBrdFirstNm: weddingInfoSection.infoBrdFirstNm,
    infoNmOrdrSe: weddingInfoSection.infoNmOrdrSe,
    infoWeddDe: weddingInfoSection.infoWeddDe,
    infoWeddTm: weddingInfoSection.infoWeddTm,
    infoHallNm: weddingInfoSection.infoHallNm,
    infoHallFlr: weddingInfoSection.infoHallFlr,
    /** 혼주 정보 */
    prntGrmFthrNm: familyInfoSection.prntGrmFthrNm,
    prntGrmFthrDeceasedYn: familyInfoSection.prntGrmFthrDeceasedYn,
    prntGrmMthrNm: familyInfoSection.prntGrmMthrNm,
    prntGrmMthrDeceasedYn: familyInfoSection.prntGrmMthrDeceasedYn,
    prntGrmRankNm: familyInfoSection.prntGrmRankNm,
    prntBrdFthrNm: familyInfoSection.prntBrdFthrNm,
    prntBrdFthrDeceasedYn: familyInfoSection.prntBrdFthrDeceasedYn,
    prntBrdMthrNm: familyInfoSection.prntBrdMthrNm,
    prntBrdMthrDeceasedYn: familyInfoSection.prntBrdMthrDeceasedYn,
    prntBrdRankNm: familyInfoSection.prntBrdRankNm,
    /** 초대 메시지 */
    invTtl: invitationMessageSection.invTtl,
    invMsg: invitationMessageSection.invMsg,
    /** 신랑/신부 소개 */
    intrTtl: coupleIntroSection.intrTtl,
    intrGrmMsg: coupleIntroSection.intrGrmMsg,
    intrBrdMsg: coupleIntroSection.intrBrdMsg,
    /** 부모님 소개 */
    prntIntrTtl: parentsIntroSection.prntIntrTtl,
    prntIntrMsg: parentsIntroSection.prntIntrMsg,
    /** 계좌 정보 */
    acntTtl: accountInfoSection.acntTtl,
    acntMsg: accountInfoSection.acntMsg,
    acntGrmBnkNm: accountInfoSection.acntGrmBnkNm,
    acntGrmNo: accountInfoSection.acntGrmNo,
    acntGrmHldrNm: accountInfoSection.acntGrmHldrNm,
    acntGrmFthrBnkNm: accountInfoSection.acntGrmFthrBnkNm,
    acntGrmFthrNo: accountInfoSection.acntGrmFthrNo,
    acntGrmFthrHldrNm: accountInfoSection.acntGrmFthrHldrNm,
    acntGrmMthrBnkNm: accountInfoSection.acntGrmMthrBnkNm,
    acntGrmMthrNo: accountInfoSection.acntGrmMthrBnkNm,
    acntGrmMthrHldrNm: accountInfoSection.acntGrmMthrHldrNm,
    acntBrdBnkNm: accountInfoSection.acntBrdBnkNm,
    acntBrdNo: accountInfoSection.acntBrdNo,
    acntBrdHldrNm: accountInfoSection.acntBrdHldrNm,
    acntBrdFthrBnkNm: accountInfoSection.acntBrdFthrBnkNm,
    acntBrdFthrNo: accountInfoSection.acntBrdFthrNo,
    acntBrdFthrHldrNm: accountInfoSection.acntBrdFthrHldrNm,
    acntBrdMthrBnkNm: accountInfoSection.acntBrdMthrBnkNm,
    acntBrdMthrNo: accountInfoSection.acntBrdMthrNo,
    acntBrdMthrHldrNm: accountInfoSection.acntBrdMthrHldrNm,
    /** 오시는 길 */
    locAddr: locationInfoSection.locAddr,
    locAddrDtl: locationInfoSection.locAddrDtl,
    locGuideMsg: locationInfoSection.locGuideMsg,
    locTrans1Ttl: locationInfoSection.locTrans1Ttl,
    locTrans1Msg: locationInfoSection.locTrans1Msg,
    locTrans2Ttl: locationInfoSection.locTrans2Ttl,
    locTrans2Msg: locationInfoSection.locTrans2Msg,
    locTrans3Ttl: locationInfoSection.locTrans3Ttl,
    locTrans3Msg: locationInfoSection.locTrans3Msg,
    /** 테마 / 폰트 */
    themeFontNm: themeFontSection.themeFontNm,
    themeFontSize: themeFontSection.themeFontSize,
    themeBgColor: themeFontSection.themeBgColor,
    themeAccentColor: themeFontSection.themeAccentColor,
    themeZoomPreventYn: themeFontSection.themeZoomPreventYn,
    /** 로딩 화면 */
    loadStyl: loadingScreenSection.loadStyl,
    /** 갤러리 (DB에 직접 컬럼 없음 — 확장 가능) */
    gllyTtl : gallerySection.gllyTtl
  };

  const weddSectOrdrDataListFromSection = [] as any[];
  for (const [sectKey, section] of Object.entries(sections) as [string, any]) {
    weddSectOrdrDataListFromSection.push({
      weddId: weddId,
      sectKey: sectKey as string,
      displayYn: section.displayYn as string,
      displayOrDr: section.displayOrDr as string
    })
  }

  const weddSectOrdrDataList = weddSectOrdr.map(obj => ({
    weddId: weddId,
    ...obj
  }));

  const result = await prisma.$transaction(async (tx) => {
    const wedd = await tx.wedd.update({
      where: { weddId },
      data: wwedData
    });
    const weddDtl = await tx.weddDtl.update({
      where: { weddId },
      data: weddDtlData
    });
    const weddSectOrdr = [] as any[];
    for await (const weddSectOrdrData of [...weddSectOrdrDataListFromSection, ...weddSectOrdrDataList]){
      weddSectOrdr.push(await tx.weddSectOrdr.update({
        where: {weddId_sectKey: {
          weddId: weddSectOrdrData.weddId,
          sectKey: weddSectOrdrData.sectKey
        }},
        data: weddSectOrdrData
      }));
    }
    return { wedd, weddDtl, weddSectOrdr };
  });
  return result;
};

/**
 * wedd 삭제
 */
export const deleteWedd = async (weddId: number) => {
  const result = await prisma.$transaction(async (tx) => {
    const deleteWedd = await prisma.wedd.delete({ where: { weddId } });
    const deleteWeddDtl = await prisma.weddDtl.delete({ where: { weddId } });
    const deleteWeddSectOrDr = await prisma.weddSectOrdr.deleteMany({ where: { weddId } });
    const deleteWeddMedia = await prisma.weddMedia.deleteMany({ where: { weddId } });
  })
  return 
};

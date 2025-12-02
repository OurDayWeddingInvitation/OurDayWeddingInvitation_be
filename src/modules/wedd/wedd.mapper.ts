import { WeddDtl } from '@prisma/client';
import {
  Main, ShareLink, WeddingInfo, FamilyInfo, InvitationMessage,
  CoupleIntro, ParentsIntro, AccountInfo, LocationInfo, ThemeFont,
  LoadingScreen, Gallery, Flipbook, SectionSettings,
  WeddingInfoRequest, WeddingInfoResponse,

  MainDb, ShareLinkDb, WeddingInfoDb, FamilyInfoDb, InvitationMessageDb,
  CoupleIntroDb, ParentsIntroDb, AccountInfoDb, LocationInfoDb, ThemeFontDb,
  LoadingScreenDb, GalleryDb, FlipbookDb, SectionSettingsDb,
  WeddDtlDb,
  Sections
 } from './wedd.types';
 
export function mapMainToDb(data?: Main): MainDb {
  if(!data) return {};
  return {
    mainPosterStyle: data.posterStyle
  };
}

export function mapShareLinkToDb(data?: ShareLink): ShareLinkDb {
  if(!data) return {};
  return {
    shareLinkTitle: data.shareTitle
  }
}

export function mapWeddingInfoToDb(data?: WeddingInfo): WeddingInfoDb {
  if(!data) return {};
  return {
    weddingInfoGroomLastName: data.groomLastName,
    weddingInfoGroomFirstName: data.groomFirstName,
    weddingInfoBrideLastName: data.brideLastName,
    weddingInfoBrideFirstName: data.brideFirstName,
    weddingInfoNameOrderType: data.nameOrderType,
    weddingInfoDate: (data.weddingYear! + data.weddingMonth + data.weddingDay),
    weddingInfoTimePeriod: data.weddingTimePeriod,
    weddingInfoTime: (data.weddingHour! + data.weddingMinute),
    weddingInfoHallName: data.weddingHallName,
    weddingInfoHallFloor: data.weddingHallFloor
  }
}

export function mapFamilyInfoToDb(data?: FamilyInfo): FamilyInfoDb {
  if(!data) return {};
  return {
    familyInfoGroomFatherName: data.groomFatherName,
    familyInfoGroomFatherDeceased: data.groomFatherDeceased,
    familyInfoGroomMotherName: data.groomMotherName,
    familyInfoGroomMotherDeceased: data.groomMotherDeceased,
    familyInfoGroomRankName: data.groomRankName,
    familyInfoBrideFatherName: data.brideFatherName,
    familyInfoBrideFatherDeceased: data.brideFatherDeceased,
    familyInfoBrideMotherName: data.brideMotherName,
    familyInfoBrideMotherDeceased: data.brideMotherDeceased,
    familyInfoBrideRankName: data.brideRankName
  }
}

export function mapInvitationMessageToDb(data?: InvitationMessage): InvitationMessageDb {
  if(!data) return {};
  return {
    invitationMessageTitle: data.title,
    invitationMessageContent: data.message
  }
}

export function mapCoupleIntroToDb(data?: CoupleIntro): CoupleIntroDb {
  if(!data) return {};
  return {
    coupleIntroTitle: data.title,
    coupleIntroGroomMessage: data.groomIntro,
    coupleIntroBrideMessage: data.brideIntro
  }
}

export function mapParentsIntroToDb(data?: ParentsIntro): ParentsIntroDb {
  if(!data) return {};
  return {
    parentsIntroTitle: data.title,
    parentsIntroMessage: data.message
  }
}

export function mapAccentInfoToDb(data?: AccountInfo): AccountInfoDb {
  if(!data) return {};
  return {
    accountInfoTitle: data.title,
    accountInfoMessage: data.message,
    accountInfoGroomBankName: data.groomBankName,
    accountInfoGroomNumber: data.groomNumber,
    accountInfoGroomHolder: data.groomHolder,
    accountInfoGroomFatherBankName: data.groomFatherBankName,
    accountInfoGroomFatherNumber: data.groomFatherNumber,
    accountInfoGroomFatherHolder: data.groomFatherHolder,
    accountInfoGroomMotherBankName: data.groomMotherBankName,
    accountInfoGroomMotherNumber: data.groomMotherNumber,
    accountInfoGroomMotherHolder: data.groomMotherHolder,
    accountInfoBrideBankName: data.brideBankName,
    accountInfoBrideNumber: data.brideNumber,
    accountInfoBrideHolder: data.brideHolder,
    accountInfoBrideFatherBankName: data.brideFatherBankName,
    accountInfoBrideFatherNumber: data.brideFatherNumber,
    accountInfoBrideFatherHolder: data.brideFatherHolder,
    accountInfoBrideMotherBankName: data.brideMotherBankName,
    accountInfoBrideMotherNumber: data.brideMotherNumber,
    accountInfoBrideMotherHolder: data.brideMotherHolder
  }
}

export function mapLocationInfoToDb(data?: LocationInfo): LocationInfoDb {
  if(!data) return {};
  return {
    locationInfoAddress: data.address,
    locationInfoAddressDetail: data.addressDetail,
    locationInfoGuideMessage: data.guideMessage,
    locationInfoTransport1Title: data.transport1Title,
    locationInfoTransport1Message: data.transport1Message,
    locationInfoTransport2Title: data.transport2Title,
    locationInfoTransport2Message: data.transport2Message,
    locationInfoTransport3Title: data.transport3Title,
    locationInfoTransport3Message: data.transport3Message
  }
}

export function mapThemeFontToDb(data?: ThemeFont): ThemeFontDb {
  if(!data) return {};
  return {
    themeFontName: data.fontName,
    themeFontSize: data.fontSize,
    themeFontBackgroundColor: data.backgroundColor,
    themeFontAccentColor: data.accentColor,
    themeFontZoomPreventYn: data.zoomPreventYn
  }
}

export function mapLoadingScreenToDb(data?: LoadingScreen): LoadingScreenDb {
  if(!data) return {};
  return {
    loadingScreenStyle: data.design
  }
}

export function mapGalleryToDb(data?: Gallery): GalleryDb {
  if(!data) return {};
  return {
    galleryTitle: data.title
  }
}

export function mapFlipboockToDb(data?: Flipbook): FlipbookDb {
  if(!data) return {};
  return data
}

export function mapSectionSettingsToDb(data: SectionSettings[]): SectionSettingsDb[] {
  if(!data) return [];
  return data.map((settings) => ({
    sectionKey: settings.sectionKey,
    displayYn: settings.isVisible,
    displayOrder: settings.displayOrder
  }));
}

export function mapSectionsToDb(data?: Sections): WeddDtlDb {
  return {
    ...mapAccentInfoToDb(data?.accountInfo),
    ...mapCoupleIntroToDb(data?.coupleIntro),
    ...mapFamilyInfoToDb(data?.familyInfo),
    ...mapFlipboockToDb(data?.flipBook),
    ...mapGalleryToDb(data?.gallery),
    ...mapInvitationMessageToDb(data?.invitationMessage),
    ...mapLoadingScreenToDb(data?.loadingScreen),
    ...mapLocationInfoToDb(data?.locationInfo),
    ...mapMainToDb(data?.main),
    ...mapParentsIntroToDb(data?.parentsIntro),
    ...mapShareLinkToDb(data?.shareLink),
    ...mapThemeFontToDb(data?.themeFont),
    ...mapWeddingInfoToDb(data?.weddingInfo)
  }
}

//==============================================================================================

// 역매퍼: DB → 프론트 Sections 구조로 변환

// MAIN
export function mapDbToMain(row: WeddDtl | null): Main {
  return {
    posterStyle: row?.mainPosterStyle ?? null
  };
}


// SHARE LINK
export function mapDbToShareLink(row: WeddDtl | null): ShareLink {
  return {
    shareTitle: row?.shareLinkTitle ?? null,
  };
}


// WEDDING INFO
export function mapDbToWeddingInfo(row: WeddDtl | null): WeddingInfo {
  return {
    groomLastName: row?.weddingInfoGroomLastName ?? null,
    groomFirstName: row?.weddingInfoGroomFirstName ?? null,
    brideLastName: row?.weddingInfoBrideLastName ?? null,
    brideFirstName: row?.weddingInfoBrideFirstName ?? null,
    nameOrderType: row?.weddingInfoNameOrderType ?? null,
    weddingYear: row?.weddingInfoDate?.substr(0, 4) ?? null,
    weddingMonth: row?.weddingInfoDate?.substr(5, 2) ?? null,
    weddingDay: row?.weddingInfoDate?.substr(8, 2) ?? null,
    weddingTimePeriod: row?.weddingInfoTimePeriod ?? null,
    weddingHour: row?.weddingInfoTime?.substr(0, 2) ?? null,
    weddingMinute: row?.weddingInfoTime?.substr(3, 2) ?? null,
    weddingHallName: row?.weddingInfoHallName ?? null,
    weddingHallFloor: row?.weddingInfoHallFloor ?? null,
  };
}


// FAMILY INFO
export function mapDbToFamilyInfo(row: WeddDtl | null): FamilyInfo {
  return {
    groomFatherName: row?.familyInfoGroomFatherName ?? null,
    groomFatherDeceased: row?.familyInfoGroomFatherDeceased ?? null,
    groomMotherName: row?.familyInfoGroomMotherName ?? null,
    groomMotherDeceased: row?.familyInfoGroomMotherDeceased ?? null,
    groomRankName: row?.familyInfoGroomRankName ?? null,
    brideFatherName: row?.familyInfoBrideFatherName ?? null,
    brideFatherDeceased: row?.familyInfoBrideFatherDeceased ?? null,
    brideMotherName: row?.familyInfoBrideMotherName ?? null,
    brideMotherDeceased: row?.familyInfoBrideMotherDeceased ?? null,
    brideRankName: row?.familyInfoBrideRankName ?? null
  };
}


// INVITATION MESSAGE
export function mapDbToInvitationMessage(row: WeddDtl | null): InvitationMessage {
  return {
    title: row?.invitationMessageTitle ?? null,
    message: row?.invitationMessageContent ?? null
  };
}


// COUPLE INTRO
export function mapDbToCoupleIntro(row: WeddDtl | null): CoupleIntro {
  return {
    title: row?.coupleIntroTitle ?? null,
    groomIntro: row?.coupleIntroGroomMessage ?? null,
    brideIntro: row?.coupleIntroBrideMessage ?? null
  };
}


// PARENTS INTRO
export function mapDbToParentsIntro(row: WeddDtl | null): ParentsIntro {
  return {
    title: row?.parentsIntroTitle ?? null,
    message: row?.parentsIntroMessage ?? null
  };
}


// ACCOUNT INFO
export function mapDbToAccountInfo(row: WeddDtl | null): AccountInfo {
  return {
    title: row?.accountInfoTitle ?? null,
    message: row?.accountInfoMessage ?? null,
    groomBankName: row?.accountInfoGroomBankName ?? null,
    groomNumber: row?.accountInfoGroomNumber ?? null,
    groomHolder: row?.accountInfoGroomHolder ?? null,
    groomFatherBankName: row?.accountInfoGroomFatherBankName ?? null,
    groomFatherNumber: row?.accountInfoGroomFatherNumber ?? null,
    groomFatherHolder: row?.accountInfoGroomFatherHolder ?? null,
    groomMotherBankName: row?.accountInfoGroomMotherBankName ?? null,
    groomMotherNumber: row?.accountInfoGroomMotherNumber ?? null,
    groomMotherHolder: row?.accountInfoGroomMotherHolder ?? null,
    brideBankName: row?.accountInfoBrideBankName ?? null,
    brideNumber: row?.accountInfoBrideNumber ?? null,
    brideHolder: row?.accountInfoBrideHolder ?? null,
    brideFatherBankName: row?.accountInfoBrideFatherBankName ?? null,
    brideFatherNumber: row?.accountInfoBrideFatherNumber ?? null,
    brideFatherHolder: row?.accountInfoBrideFatherHolder ?? null,
    brideMotherBankName: row?.accountInfoBrideMotherBankName ?? null,
    brideMotherNumber: row?.accountInfoBrideMotherNumber ?? null,
    brideMotherHolder: row?.accountInfoBrideMotherHolder ?? null
  };
}


// LOCATION INFO
export function mapDbToLocationInfo(row: WeddDtl | null): LocationInfo {
  return {
    address: row?.locationInfoAddress ?? null,
    addressDetail: row?.locationInfoAddressDetail ?? null,
    guideMessage: row?.locationInfoGuideMessage ?? null,
    transport1Title: row?.locationInfoTransport1Title ?? null,
    transport1Message: row?.locationInfoTransport1Message ?? null,
    transport2Title: row?.locationInfoTransport2Title ?? null,
    transport2Message: row?.locationInfoTransport2Message ?? null,
    transport3Title: row?.locationInfoTransport3Title ?? null,
    transport3Message: row?.locationInfoTransport3Message ?? null
  };
}


// THEME FONT
export function mapDbToThemeFont(row: WeddDtl | null): ThemeFont {
  return {
    fontName: row?.themeFontName ?? null,
    fontSize: row?.themeFontSize ?? null,
    backgroundColor: row?.themeFontBackgroundColor ?? null,
    accentColor: row?.themeFontAccentColor ?? null,
    zoomPreventYn: row?.themeFontZoomPreventYn ?? null
  };
}


// LOADING SCREEN
export function mapDbToLoadingScreen(row: WeddDtl | null): LoadingScreen {
  return {
    design: row?.loadingScreenStyle ?? null
  };
}


// GALLERY
export function mapDbToGallery(row: WeddDtl | null): Gallery {
  return {
    title: row?.galleryTitle ?? null
  };
}


// FLIPBOOK
export function mapDbToFlipbook(row: WeddDtl | null): Flipbook {
  return {
    // ...row
  };
}


// SECTION SETTINGS
export function mapDbToSectionSettings(rows: SectionSettingsDb[] | null): SectionSettings[] {
  return rows?.map((setting) => ({
    sectionKey: setting.sectionKey ?? null,
    isVisible: setting.displayYn ?? null,
    displayOrder: setting.displayOrder ?? null
  })) ?? [];
}


// ▼ 최종 wrapper: DB row → sections 전체 변환
export function mapDbToSections(row: WeddDtl | null): Sections {
  return {
    main: mapDbToMain(row),
    shareLink: mapDbToShareLink(row),
    weddingInfo: mapDbToWeddingInfo(row),
    familyInfo: mapDbToFamilyInfo(row),
    invitationMessage: mapDbToInvitationMessage(row),
    coupleIntro: mapDbToCoupleIntro(row),
    parentsIntro: mapDbToParentsIntro(row),
    accountInfo: mapDbToAccountInfo(row),
    locationInfo: mapDbToLocationInfo(row),
    themeFont: mapDbToThemeFont(row),
    loadingScreen: mapDbToLoadingScreen(row),
    gallery: mapDbToGallery(row),
    flipBook: mapDbToFlipbook(row),
  };
}

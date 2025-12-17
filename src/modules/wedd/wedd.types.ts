// DB 관련 타입들만 유지 (프론트/요청 타입은 zod로 대체됨)

export interface SectionSettingsDb {
	sectionKey: string;
	displayYn?: boolean | null;
	displayOrder?: number | null;
}

// DB 통합 Wedd 타입 (서비스/매퍼에서 사용될 필드 타입)
export interface MainDb {
  mainPosterStyle?: string | null;
}
export interface ShareLinkDb {
  shareLinkTitle?: string | null;
}
export interface WeddingInfoDb {
  weddingInfoGroomLastName?: string | null;
  weddingInfoGroomFirstName?: string | null;
  weddingInfoBrideLastName?: string | null;
  weddingInfoBrideFirstName?: string | null;
  weddingInfoNameOrderType?: string | null;
  weddingInfoYear?: string | null;
  weddingInfoMonth?: string | null;
  weddingInfoDay?: string | null;
  weddingInfoTimePeriod?: string | null;
  weddingInfoHour?: string | null;
  weddingInfoMinute?: string | null;
  weddingInfoHallName?: string | null;
  weddingInfoHallFloor?: string | null;
}
export interface FamilyInfoDb {
  familyInfoGroomFatherName?: string | null;
  familyInfoGroomFatherDeceased?: boolean | null;
  familyInfoGroomMotherName?: string | null;
  familyInfoGroomMotherDeceased?: boolean | null;
  familyInfoGroomRankName?: string | null;
  familyInfoBrideFatherName?: string | null;
  familyInfoBrideFatherDeceased?: boolean | null;
  familyInfoBrideMotherName?: string | null;
  familyInfoBrideMotherDeceased?: boolean | null;
  familyInfoBrideRankName?: string | null;
}
export interface InvitationMessageDb {
  invitationMessageTitle?: string | null;
  invitationMessageContent?: string | null;
}
export interface CoupleIntroDb {
  coupleIntroTitle?: string | null;
  coupleIntroGroomMessage?: string | null;
  coupleIntroBrideMessage?: string | null;
}
export interface ParentsIntroDb {
  parentsIntroTitle?: string | null;
  parentsIntroMessage?: string | null;
}
export interface AccountInfoDb {
  accountInfoTitle?: string | null;
  accountInfoMessage?: string | null;

  accountInfoGroomBankName?: string | null;
  accountInfoGroomNumber?: string | null;
  accountInfoGroomHolder?: string | null;

  accountInfoGroomFatherBankName?: string | null;
  accountInfoGroomFatherNumber?: string | null;
  accountInfoGroomFatherHolder?: string | null;

  accountInfoGroomMotherBankName?: string | null;
  accountInfoGroomMotherNumber?: string | null;
  accountInfoGroomMotherHolder?: string | null;

  accountInfoBrideBankName?: string | null;
  accountInfoBrideNumber?: string | null;
  accountInfoBrideHolder?: string | null;

  accountInfoBrideFatherBankName?: string | null;
  accountInfoBrideFatherNumber?: string | null;
  accountInfoBrideFatherHolder?: string | null;

  accountInfoBrideMotherBankName?: string | null;
  accountInfoBrideMotherNumber?: string | null;
  accountInfoBrideMotherHolder?: string | null;
}
export interface LocationInfoDb {
  locationInfoAddress?: string | null;
  locationInfoAddressDetail?: string | null;
  locationInfoGuideMessage?: string | null;

  locationInfoTransport1Title?: string | null;
  locationInfoTransport1Message?: string | null;
  locationInfoTransport2Title?: string | null;
  locationInfoTransport2Message?: string | null;
  locationInfoTransport3Title?: string | null;
  locationInfoTransport3Message?: string | null;
  locationInfoTransport4Title?: string | null;
  locationInfoTransport4Message?: string | null;
  locationInfoTransport5Title?: string | null;
  locationInfoTransport5Message?: string | null;
}
export interface ThemeFontDb {
  themeFontName?: string | null;
  themeFontSize?: number | null;
  themeFontBackgroundColor?: string | null;
  themeFontAccentColor?: string | null;
  themeFontZoomPreventYn?: boolean | null;
}
export interface LoadingScreenDb {
  loadingScreenStyle?: string | null;
}
export interface GalleryDb {
  galleryTitle?: string | null;
}
export interface FlipbookDb {
  flipbookTitle?: string | null;
  flipbookMessage?: string | null;
}

// 전체 Wedd 기반 DB 타이핑 (통합)
export interface WeddDb
  extends MainDb,
    ShareLinkDb,
    WeddingInfoDb,
    FamilyInfoDb,
    InvitationMessageDb,
    CoupleIntroDb,
    ParentsIntroDb,
    AccountInfoDb,
    LocationInfoDb,
    ThemeFontDb,
    LoadingScreenDb,
    GalleryDb,
    FlipbookDb {}

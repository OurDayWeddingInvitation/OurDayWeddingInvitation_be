export interface Main {
	posterStyle?: string | null;
};

export interface ShareLink {
	shareTitle?: string | null;
}

export interface WeddingInfo {
	groomLastName?: string | null;
	groomFirstName?: string | null;
	brideLastName?: string | null;
	brideFirstName?: string | null;
	nameOrderType?: string | null;
	// weddingDate?: string | null;
	weddingYear?: string | null;
	weddingMonth?: string | null;
	weddingDay?: string | null;
	weddingTimePeriod?: string | null;
	// weddingTime?: string | null;
	weddingHour?: string | null;
	weddingMinute?: string | null;
	weddingHallName?: string | null;
	weddingHallFloor?: string | null;
}

export interface FamilyInfo {
	groomFatherName?: string | null;
	groomFatherDeceased?: boolean | null;
	groomMotherName?: string | null;
	groomMotherDeceased?: boolean | null;
	groomRankName?: string | null;
	brideFatherName?: string | null;
	brideFatherDeceased?: boolean | null;
	brideMotherName?: string | null;
	brideMotherDeceased?: boolean | null;
	brideRankName?: string | null;
}

export interface InvitationMessage {
	title?: string | null;
	message?: string | null;
}

export interface CoupleIntro {
	title?: string | null;
	groomIntro?: string | null;
	brideIntro?: string | null;
}

export interface ParentsIntro {
	title?: string | null;
	message?: string | null;
}

export interface AccountInfo {
	title?: string | null;
	message?: string | null;
	groomBankName?: string | null;
	groomNumber?: string | null;
	groomHolder?: string | null;
	groomFatherBankName?: string | null;
	groomFatherNumber?: string | null;
	groomFatherHolder?: string | null;
	groomMotherBankName?: string | null;
	groomMotherNumber?: string | null;
	groomMotherHolder?: string | null;
	brideBankName?: string | null;
	brideNumber?: string | null;
	brideHolder?: string | null;
	brideFatherBankName?: string | null;
	brideFatherNumber?: string | null;
	brideFatherHolder?: string | null;
	brideMotherBankName?: string | null;
	brideMotherNumber?: string | null;
	brideMotherHolder?: string | null;
}

export interface LocationInfo {
	address?: string | null;
	addressDetail?: string | null;
	guideMessage?: string | null;
	transport1Title?: string | null;
	transport1Message?: string | null;
	transport2Title?: string | null;
	transport2Message?: string | null;
	transport3Title?: string | null;
	transport3Message?: string | null;
}

export interface ThemeFont {
	fontName?: string | null;
	fontSize?: number | null;
	backgroundColor?: string | null;
	accentColor?: string | null;
	zoomPreventYn?: boolean | null;
}

export interface LoadingScreen {
	design?: string | null;
}

export interface Gallery {
	title?: string | null;
}

export interface Flipbook {}

export interface SectionSettings {
	sectionKey: string;
	isVisible?: boolean | null;
	displayOrder?: number | null;
}

export interface wedding{
	weddingId?: number | null;
	userId?: string | null;
	weddingTitle?: string | null;
}

export interface Sections{
	main?: Main;
	shareLink?: ShareLink;
	weddingInfo?: WeddingInfo;
	familyInfo?: FamilyInfo;
	invitationMessage?: InvitationMessage;
	coupleIntro?: CoupleIntro;
	parentsIntro?: ParentsIntro;
	accountInfo?: AccountInfo;
	locationInfo?: LocationInfo;
	themeFont?: ThemeFont;
	loadingScreen?: LoadingScreen;
	gallery?: Gallery;
	flipBook?: Flipbook;
}

export interface SetttingSections{
	sectionSettings: SectionSettings[];
}

//====================================================================================

export interface WeddingInfoRequest {
	sections?: Sections;
	sectionSettings?: SectionSettings[]
}

export interface WeddingInfoResponse {
	weddingId?: number
	sections?: Sections;
	sectionSettings?: SectionSettings[]
}

//==============================================================================================================================================================================================

// =======================
// DB Types (WeddDtl 기반)
// =======================

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
  weddingInfoDate?: string | null;
  weddingInfoTimePeriod?: string | null;
  weddingInfoTime?: string | null;
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

export interface FlipbookDb {}

export interface SectionSettingsDb {
	sectionKey: string;
	displayYn?: boolean | null;
	displayOrder?: number | null;
}

// ========================================
// 전체 WeddDtl 기반 DB 타이핑 (통합)
// ========================================

export interface WeddDtlDb
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

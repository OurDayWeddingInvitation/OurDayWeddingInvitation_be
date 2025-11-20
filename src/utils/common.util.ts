export const SECTION_FIELD_MAP = {
  main: {
    posterStyle: "mainPosterStyle",
  },
  shareLink: {
    shareTitle: "shareLinkTitle",
  },
  weddingInfo: {
    groomLastName: "weddingInfoGroomLastName",
    groomFirstName: "weddingInfoGroomFirstName",
    brideLastName: "weddingInfoBrideLastName",
    brideFirstName: "weddingInfoBrideFirstName",
    nameOrderType: "weddingInfoNameOrderType",
    weddingDate: "weddingInfoDate",
    weddingTimePeriod: "weddingInfoTimePeriod",
    weddingTime: "weddingInfoTime",
    weddingHallName: "weddingInfoHallName",
    weddingHallFloor: "weddingInfoHallFloor",
  },
  familyInfo: {
    groomFatherName: "familyInfoGroomFatherName",
    groomFatherDeceased: "familyInfoGroomFatherDeceased",
    groomMotherName: "familyInfoGroomMotherName",
    groomMotherDeceased: "familyInfoGroomMotherDeceased",
    groomRankName: "familyInfoGroomRankName",
    brideFatherName: "familyInfoBrideFatherName",
    brideFatherDeceased: "familyInfoBrideFatherDeceased",
    brideMotherName: "familyInfoBrideMotherName",
    brideMotherDeceased: "familyInfoBrideMotherDeceased",
    brideRankName: "familyInfoBrideRankName",
  },

  invitationMessage: {
    title: "invitationMessageTitle",
    message: "invitationMessageContent",
  },

  coupleIntro: {
    title: "coupleIntroTitle",
    groomIntro: "coupleIntroGroomMessage",
    brideIntro: "coupleIntroBrideMessage",
  },

  parentsIntro: {
    title: "parentsIntroTitle",
    message: "parentsIntroMessage",
  },

  accountInfo: {
    title: "accountInfoTitle",
    message: "accountInfoMessage",
    groomBankName: "accountInfoGroomBankName",
    groomNumber: "accountInfoGroomNumber",
    groomHolder: "accountInfoGroomHolder",
    groomFatherBankName: "accountInfoGroomFatherBankName",
    groomFatherNumber: "accountInfoGroomFatherNumber",
    groomFatherHolder: "accountInfoGroomFatherHolder",
    groomMotherBankName: "accountInfoGroomMotherBankName",
    groomMotherNumber: "accountInfoGroomMotherNumber",
    groomMotherHolder: "accountInfoGroomMotherHolder",
    brideBankName: "accountInfoBrideBankName",
    brideNumber: "accountInfoBrideNumber",
    brideHolder: "accountInfoBrideHolder",
    brideFatherBankName: "accountInfoBrideFatherBankName",
    brideFatherNumber: "accountInfoBrideFatherNumber",
    brideFatherHolder: "accountInfoBrideFatherHolder",
    brideMotherBankName: "accountInfoBrideMotherBankName",
    brideMotherNumber: "accountInfoBrideMotherNumber",
    brideMotherHolder: "accountInfoBrideMotherHolder",
  },

  locationInfo: {
    address: "locationInfoAddress",
    addressDetail: "locationInfoAddressDetail",
    guideMessage: "locationInfoGuideMessage",
    transport1Title: "locationInfoTransport1Title",
    transport1Message: "locationInfoTransport1Message",
    transport2Title: "locationInfoTransport2Title",
    transport2Message: "locationInfoTransport2Message",
    transport3Title: "locationInfoTransport3Title",
    transport3Message: "locationInfoTransport3Message",
  },

  themeFont: {
    fontName: "themeFontName",
    fontSize: "themeFontSize",
    backgroundColor: "themeFontBackgroundColor",
    accentColor: "themeFontAccentColor",
    zoomPreventYn: "themeFontZoomPreventYn",
  },

  loadingScreen: {
    design: "loadingScreenStyle",
  },

  gallery: {
    title: "galleryTitle",
  },

  flipbook: {},
};

export const REVERSE_SECTION_FIELD_MAP = Object.fromEntries(
  Object.entries(SECTION_FIELD_MAP).map(([section, fields]) => {
    const reversedFields = Object.fromEntries(
      Object.entries(fields).map(([k, v]) => [v, k])
    );
    return [section, reversedFields];
  })
) as Record<string, Record<string, string>>;

export function mapSectionPayloadToDb(sectionId: string, payload: any) {
  const fieldMap = SECTION_FIELD_MAP[sectionId as keyof typeof SECTION_FIELD_MAP] as Record<string, string>;;
  if (!fieldMap) throw new Error("Invalid sectionId");

  const result: any = {};

  for (const key in payload) {
    const mappedKey = fieldMap[key];
    if (mappedKey) {
      result[mappedKey] = payload[key];
    }
  }

  return result;
}

export function mapDbToSectionPayload(sectionId: string, payload: any) {
  const fieldMap = REVERSE_SECTION_FIELD_MAP[sectionId as keyof typeof REVERSE_SECTION_FIELD_MAP] as Record<string, string>;
  if (!fieldMap) throw new Error("Invalid sectionId");

  const result: any = {};

  for (const key in payload) {
    const mappedKey = fieldMap[key];
    if (mappedKey) {
      result[mappedKey] = payload[key];
    }
  }

  return result;
}

 export default { SECTION_FIELD_MAP, REVERSE_SECTION_FIELD_MAP, mapSectionPayloadToDb, mapDbToSectionPayload };
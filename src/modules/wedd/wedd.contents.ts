export const SECTION_KEYS = {
  MAIN: "main",
  SHARE_LINK: "shareLink",
  WEDDING_INFO: "weddingInfo",
  FAMILY_INFO: "familyInfo",
  INVITATION_MESSAGE: "invitationMessage",
  COUPLE_INTRO: "coupleIntro",
  PARENTS_INTRO: "parentsIntro",
  ACCOUNT_INFO: "accountInfo",
  LOCATION_INFO: "locationInfo",
  THEME_FONT: "themeFont",
  LOADING_SCREEN: "loadingScreen",
  GALLERY: "gallery",
  FLIPBOOK: "flipbook",
} as const;

export type SectionKey = typeof SECTION_KEYS[keyof typeof SECTION_KEYS];

export function isSectionKey(key: string): key is SectionKey {
  return Object.values(SECTION_KEYS).includes(key as SectionKey);
}
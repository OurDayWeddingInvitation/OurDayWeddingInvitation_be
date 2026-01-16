export const SECTION_KEYS = {
  THEME_FONT: "themeFont",
  WEDDING_INFO: "weddingInfo",
  LOADING_SCREEN: "loadingScreen",
  MAIN: "main",
  INVITATION_MESSAGE: "invitationMessage",
  COUPLE_INTRO: "coupleIntro",
  PARENTS_INTRO: "parentsIntro",
  GALLERY: "gallery",
  FLIPBOOK: "flipbook",
  ACCOUNT_INFO: "accountInfo",
  LOCATION_INFO: "locationInfo",
  SHARE_LINK: "shareLink",
} as const;

export type SectionKey = typeof SECTION_KEYS[keyof typeof SECTION_KEYS];

export function isSectionKey(key: string): key is SectionKey {
  return Object.values(SECTION_KEYS).includes(key as SectionKey);
}
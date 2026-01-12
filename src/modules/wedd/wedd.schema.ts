import { z } from "zod";

export const WeddingIdParam = z.object({
  weddingId: z.string().uuid(),
});
export const SectionIdParam = z.object({
  sectionId: z.string(),
});
export const WeddingTitleSchema = z.object({
  title : z.string(),
});
export const MainSchema = z.object({
  posterStyle: z.string().nullable().optional(),
});
export const ShareLinkSchema = z.object({
  shareTitle: z.string().nullable().optional(),
});
export const WeddingInfoSchema = z.object({
  groomLastName: z.string().nullable().optional(),
  groomFirstName: z.string().nullable().optional(),
  brideLastName: z.string().nullable().optional(),
  brideFirstName: z.string().nullable().optional(),
  nameOrderType: z.string().nullable().optional(),

  weddingYear: z.string().nullable().optional(),
  weddingMonth: z.string().nullable().optional(),
  weddingDay: z.string().nullable().optional(),
  weddingTimePeriod: z.string().nullable().optional(),
  weddingHour: z.string().nullable().optional(),
  weddingMinute: z.string().nullable().optional(),

  weddingHallName: z.string().nullable().optional(),
  weddingHallFloor: z.string().nullable().optional(),
});
export const FamilyInfoSchema = z.object({
  groomFatherName: z.string().nullable().optional(),
  groomFatherDeceased: z.boolean().nullable().optional(),
  groomMotherName: z.string().nullable().optional(),
  groomMotherDeceased: z.boolean().nullable().optional(),
  groomRankName: z.string().nullable().optional(),

  brideFatherName: z.string().nullable().optional(),
  brideFatherDeceased: z.boolean().nullable().optional(),
  brideMotherName: z.string().nullable().optional(),
  brideMotherDeceased: z.boolean().nullable().optional(),
  brideRankName: z.string().nullable().optional(),
});
export const InvitationMessageSchema = z.object({
  title: z.string().nullable().optional(),
  message: z.string().nullable().optional(),
});
export const CoupleIntroSchema = z.object({
  title: z.string().nullable().optional(),
  groomIntro: z.string().nullable().optional(),
  brideIntro: z.string().nullable().optional(),
});
export const ParentsIntroSchema = z.object({
  title: z.string().nullable().optional(),
  message: z.string().nullable().optional(),
});
export const AccountInfoSchema = z.object({
  title: z.string().nullable().optional(),
  message: z.string().nullable().optional(),

  groomBankName: z.string().nullable().optional(),
  groomNumber: z.string().nullable().optional(),
  groomHolder: z.string().nullable().optional(),

  groomFatherBankName: z.string().nullable().optional(),
  groomFatherNumber: z.string().nullable().optional(),
  groomFatherHolder: z.string().nullable().optional(),

  groomMotherBankName: z.string().nullable().optional(),
  groomMotherNumber: z.string().nullable().optional(),
  groomMotherHolder: z.string().nullable().optional(),

  brideBankName: z.string().nullable().optional(),
  brideNumber: z.string().nullable().optional(),
  brideHolder: z.string().nullable().optional(),

  brideFatherBankName: z.string().nullable().optional(),
  brideFatherNumber: z.string().nullable().optional(),
  brideFatherHolder: z.string().nullable().optional(),

  brideMotherBankName: z.string().nullable().optional(),
  brideMotherNumber: z.string().nullable().optional(),
  brideMotherHolder: z.string().nullable().optional(),
});
export const LocationInfoSchema = z.object({
  address: z.string().nullable().optional(),
  addressDetail: z.string().nullable().optional(),
  guideMessage: z.string().nullable().optional(),

  transport1Title: z.string().nullable().optional(),
  transport1Message: z.string().nullable().optional(),
  transport2Title: z.string().nullable().optional(),
  transport2Message: z.string().nullable().optional(),
  transport3Title: z.string().nullable().optional(),
  transport3Message: z.string().nullable().optional(),
  transport4Title: z.string().nullable().optional(),
  transport4Message: z.string().nullable().optional(),
  transport5Title: z.string().nullable().optional(),
  transport5Message: z.string().nullable().optional(),
});
export const ThemeFontSchema = z.object({
  fontName: z.string().nullable().optional(),
  fontSize: z.coerce.number().nullable().optional(),
  backgroundColor: z.string().nullable().optional(),
  accentColor: z.string().nullable().optional(),
  zoomPreventYn: z.boolean().nullable().optional(),
});
export const LoadingScreenSchema = z.object({
  design: z.string().nullable().optional(),
});
export const GallerySchema = z.object({
  title: z.string().nullable().optional(),
});
export const FlipbookSchema = z.object({
  title: z.string().nullable().optional(),
  message: z.string().nullable().optional(),
});
export const SectionSettingsSchema = z.object({
  sectionKey: z.string(),
  isVisible: z.boolean().nullable().optional(),
  displayOrder: z.coerce.number().nullable().optional(),
});
export const SectionsSchema = z.object({
  main: MainSchema.optional(),
  shareLink: ShareLinkSchema.optional(),
  weddingInfo: WeddingInfoSchema.optional(),
  familyInfo: FamilyInfoSchema.optional(),
  invitationMessage: InvitationMessageSchema.optional(),
  coupleIntro: CoupleIntroSchema.optional(),
  parentsIntro: ParentsIntroSchema.optional(),
  accountInfo: AccountInfoSchema.optional(),
  locationInfo: LocationInfoSchema.optional(),
  themeFont: ThemeFontSchema.optional(),
  loadingScreen: LoadingScreenSchema.optional(),
  gallery: GallerySchema.optional(),
  flipBook: FlipbookSchema.optional(),
});
export const WeddingInfoRequestSchema = z.object({
  sections: SectionsSchema.optional(),
  sectionSettings: z.array(SectionSettingsSchema).optional(),
});
export const SettingSectionsSchema = z.object({
	sectionSettings: z.array(SectionSettingsSchema),
});

// 프론트/요청 타입들을 zod로부터 유도해 export
export type WeddingTitle = z.infer<typeof WeddingTitleSchema>;
export type Main = z.infer<typeof MainSchema>;
export type ShareLink = z.infer<typeof ShareLinkSchema>;
export type WeddingInfo = z.infer<typeof WeddingInfoSchema>;
export type FamilyInfo = z.infer<typeof FamilyInfoSchema>;
export type InvitationMessage = z.infer<typeof InvitationMessageSchema>;
export type CoupleIntro = z.infer<typeof CoupleIntroSchema>;
export type ParentsIntro = z.infer<typeof ParentsIntroSchema>;
export type AccountInfo = z.infer<typeof AccountInfoSchema>;
export type LocationInfo = z.infer<typeof LocationInfoSchema>;
export type ThemeFont = z.infer<typeof ThemeFontSchema>;
export type LoadingScreen = z.infer<typeof LoadingScreenSchema>;
export type Gallery = z.infer<typeof GallerySchema>;
export type Flipbook = z.infer<typeof FlipbookSchema>;
export type SectionSettings = z.infer<typeof SectionSettingsSchema>;
export type Sections = z.infer<typeof SectionsSchema>;
export type SettingSections = z.infer<typeof SettingSectionsSchema>;
export type WeddingInfoRequest = z.infer<typeof WeddingInfoRequestSchema>;
export type WeddingInfoResponse = {
  weddingId?: string;
  sections?: Sections;
  sectionSettings?: SectionSettings[];
};

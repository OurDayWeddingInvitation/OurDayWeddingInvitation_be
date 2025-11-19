/** 추후 사용 예정 */

export interface weddMedia {
	weddId: number;
	mediaId: number;
	imgType?: string;
	displayOrdr?: string;
	orgUrl?: string;
	editUrl?: string;
	fileExtsn?: string;
	fileSize?: number
}

export interface WeddSectSet {
	weddId: number;
	sectKey: string;
	displayYn?: string;
	displayOrDr?: number;
}

export interface weddUpdateRequestBody {
	border:{
		weddId: number;
		userId: string;
		weddTtl?: string;
		weddSlug?: string;
		media?: weddMedia[];
	};
	sections?: {
		/** 메인 포스터 */
		main?: {
			sectKey?: string;
			displayYn?: string;
			displayOrdr?: number;
			mainPosterStyl?: string; // MAIN_POSTER_STYL
			media?: weddMedia[];
		};

		/** 공유 링크 */
		shareLink?: {
			sectKey?: string;
			displayYn?: string;
			displayOrdr?: number;
			shrTtl?: string; // SHR_TTL
			media?: weddMedia[];
		};

		/** 예식 기본 정보 */
		weddingInfo?: {
			sectKey?: string;
			displayYn?: string;
			displayOrdr?: number;
			infoGrmLastNm?: string;  // INFO_GRM_LAST_NM
			infoGrmFirstNm?: string; // INFO_GRM_FIRST_NM
			infoBrdLastNm?: string;  // INFO_BRD_LAST_NM
			infoBrdFirstNm?: string; // INFO_BRD_FIRST_NM
			infoNmOrdrSe?: string;   // INFO_NM_ORDR_SE
			infoWeddDe?: string;     // INFO_WEDD_DE
			infoWeddTm?: string;     // INFO_WEDD_TM
			infoHallNm?: string;     // INFO_HALL_NM
			infoHallFlr?: string;    // INFO_HALL_FLR
		};

		/** 혼주 정보 */
		familyInfo?: {
			sectKey?: string;
			displayYn?: string;
			displayOrdr?: number;
			prntGrmFthrNm?: string;
			prntGrmFthrDeceasedYn?: string;
			prntGrmMthrNm?: string;
			prntGrmMthrDeceasedYn?: string;
			prntGrmRankNm?: string;
			prntBrdFthrNm?: string;
			prntBrdFthrDeceasedYn?: string;
			prntBrdMthrNm?: string;
			prntBrdMthrDeceasedYn?: string;
			prntBrdRankNm?: string;
		};

		/** 초대 메시지 */
		invitationMessage?: {
			sectKey?: string;
			displayYn?: string;
			displayOrdr?: number;
			invTtl?: string;
			invMsg?: string;
		};

		/** 신랑/신부 소개 */
		coupleIntro?: {
			sectKey?: string;
			displayYn?: string;
			displayOrdr?: number;
			intrTtl?: string;
			intrGrmMsg?: string;
			intrBrdMsg?: string;
			media?: weddMedia[];
		};

		/** 부모님 소개 */
		parentsIntro?: {
			sectKey?: string;
			displayYn?: string;
			displayOrdr?: number;
			prntIntrTtl?: string;
			prntIntrMsg?: string;
			media?: weddMedia[];
		};

		/** 계좌 정보 */
		accountInfo?: {
			sectKey?: string;
			displayYn?: string;
			displayOrdr?: number;
			acntTtl?: string;
			acntMsg?: string;
			acntGrmBnkNm?: string;
			acntGrmNo?: string;
			acntGrmHldrNm?: string;
			acntGrmFthrBnkNm?: string;
			acntGrmFthrNo?: string;
			acntGrmFthrHldrNm?: string;
			acntGrmMthrBnkNm?: string;
			acntGrmMthrNo?: string;
			acntGrmMthrHldrNm?: string;
			acntBrdBnkNm?: string;
			acntBrdNo?: string;
			acntBrdHldrNm?: string;
			acntBrdFthrBnkNm?: string;
			acntBrdFthrNo?: string;
			acntBrdFthrHldrNm?: string;
			acntBrdMthrBnkNm?: string;
			acntBrdMthrNo?: string;
			acntBrdMthrHldrNm?: string;
		};

		/** 오시는 길 */
		locationInfo?: {
			sectKey?: string;
			displayYn?: string;
			displayOrdr?: number;
			locAddr?: string;
			locAddrDtl?: string;
			locGuideMsg?: string;
			locTrans1Ttl?: string;
			locTrans1Msg?: string;
			locTrans2Ttl?: string;
			locTrans2Msg?: string;
			locTrans3Ttl?: string;
			locTrans3Msg?: string;
		};

		/** 테마 / 폰트 */
		themeFont?: {
			sectKey?: string;
			displayYn?: string;
			displayOrdr?: number;
			themeFontNm?: string;
			themeFontSize?: string;
			themeBgColor?: string;
			themeAccentColor?: string;
			themeZoomPreventYn?: string;
		};

		/** 로딩 화면 */
		loadingScreen?: {
			sectKey?: string;
			displayYn?: string;
			displayOrdr?: number;
			loadStyl?: string;
		};

		/** 갤러리 (DB에 직접 컬럼 없음 — 확장 가능) */
		gallery?: {
			sectKey?: string;
			displayYn?: string;
			displayOrdr?: number;
			gllyTtl? : string;
			media?: weddMedia[];
		}

		/** 플립북 (DB에 직접 컬럼 없음 — 확장 가능) */
		flipbook?: {
			sectKey?: string;
			displayYn?: string;
			displayOrdr?: number;
			media?: weddMedia[];
		}
	};
	WeddSectSet?: WeddSectSet[];
}

const WEDDING_SECTION_MAP = {
  main: [
    "mainPosterStyl",
    "mainTitle",
    "mainSubTitle",
  ],
  weddingInfo: [
    "infoGrmLastNm",
    "infoGrmFirstNm",
    "infoBrdLastNm",
    "infoBrdFirstNm",
    "infoWeddDe",
    "infoWeddTm",
    "infoHallNm",
    "infoHallFlr",
  ],
  shareLink: [
    "shrTtl",
    "shrDesc",
  ],
  gallery: [
    "galleryUseYn",
    "galleryType",
  ],
  // ... 모든 섹션을 여기에 정의
} as const;